from __future__ import annotations

import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "frontend" / "src" / "data"
TIER_COUNTS = {
    "24": 24,
    "48": 48,
    "72": 72,
    "96": 96,
    "120": 120,
    "144": 144,
    "168": 168,
    "221": 221,
}
VENDOR_COLUMNS = {
    "B": "xiaowujia",
    "C": "manman",
    "D": "panpan",
    "E": "mixiaowo",
    "F": "huangdoudou",
    "G": "coco",
}
CODE_PATTERN = re.compile(r"^[A-Z]+[0-9]+$")
HEX_PATTERN = re.compile(r"^#[0-9A-Fa-f]{6}$")
XML_NS = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def main() -> int:
    errors: list[str] = []
    workbook_path = find_workbook()
    spec_dir = find_tier_spec_dir()
    mard_colors = load_json(DATA_DIR / "mard-colors.json")
    coco_colors = load_json(DATA_DIR / "coco-special-colors.json")
    tier_codes = load_json(DATA_DIR / "mard-tier-codes.json")

    mard_by_code = {color["code"]: color for color in mard_colors}
    xlsx_colors, xlsx_vendor_codes = read_xlsx_palette(workbook_path)

    # 关键校验：运行时 JSON 必须覆盖 xlsx 的 MARD 色号，Q5 是人工确认补充修正。
    allowed_json_only = {"Q5"}
    json_codes = set(mard_by_code)
    xlsx_codes = set(xlsx_colors)
    errors.extend(check_no_duplicates("mard-colors.json", [color["code"] for color in mard_colors]))
    errors.extend(check_no_duplicates("coco-special-colors.json", [color["code"] for color in coco_colors]))
    errors.extend(check_expected_difference("xlsx -> JSON missing", xlsx_codes - json_codes, set()))
    errors.extend(check_expected_difference("JSON extra codes", json_codes - xlsx_codes, allowed_json_only))

    for code, xlsx_hex in xlsx_colors.items():
      if code not in mard_by_code:
          continue
      json_hex = mard_by_code[code]["hex"].upper()
      if code not in {"Q1", "Q5"} and json_hex != xlsx_hex.upper():
          errors.append(f"{code} hex mismatch: xlsx={xlsx_hex} json={json_hex}")

    for code, color in mard_by_code.items():
        expected_rgb = hex_to_rgb(color["hex"])
        if color.get("rgb") != expected_rgb:
            errors.append(f"{code} rgb mismatch: expected {expected_rgb}, got {color.get('rgb')}")
        if color.get("source") != "xlsx-mard":
            errors.append(f"{code} source should be xlsx-mard")

    for code, vendor_codes in xlsx_vendor_codes.items():
        if code not in mard_by_code:
            continue
        json_vendor_codes = mard_by_code[code].get("vendorCodes", {})
        for vendor, vendor_code in vendor_codes.items():
            if json_vendor_codes.get(vendor) != vendor_code:
                errors.append(f"{code} vendor {vendor} mismatch: xlsx={vendor_code} json={json_vendor_codes.get(vendor)}")

    for tier, expected_count in TIER_COUNTS.items():
        codes = tier_codes.get(tier)
        if not isinstance(codes, list):
            errors.append(f"tier {tier} is missing")
            continue
        errors.extend(check_no_duplicates(f"tier {tier}", codes))
        if len(codes) != expected_count:
            errors.append(f"tier {tier} count mismatch: expected {expected_count}, got {len(codes)}")
        missing = sorted(set(codes) - json_codes)
        if missing:
            errors.append(f"tier {tier} references missing color codes: {', '.join(missing)}")

    for tier in ("24", "48"):
        spec_codes = read_codes_file(spec_dir / f"{tier}色色号.txt")
        if tier_codes.get(tier) != spec_codes:
            errors.append(f"tier {tier} JSON does not match MARD色号规格/{tier}色色号.txt")

    if errors:
        print("Palette validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        "Palette validation passed: "
        f"{len(mard_colors)} MARD colors, {len(coco_colors)} COCO colors, "
        f"{len(tier_codes)} tiers, source workbook found"
    )
    return 0


def find_workbook() -> Path:
    matches = sorted(ROOT.glob("*.xlsx"))
    for path in matches:
        if "色卡" in path.name:
            return path
    if matches:
        return matches[0]
    raise FileNotFoundError("Cannot find palette .xlsx in project root")


def find_tier_spec_dir() -> Path:
    for path in ROOT.iterdir():
        if path.is_dir() and path.name.startswith("MARD"):
            return path
    raise FileNotFoundError("Cannot find MARD tier spec directory")


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def read_codes_file(path: Path) -> list[str]:
    with path.open("r", encoding="utf-8") as file:
        return [line.strip() for line in file if line.strip()]


def read_xlsx_palette(path: Path) -> tuple[dict[str, str], dict[str, dict[str, str]]]:
    with zipfile.ZipFile(path) as archive:
        shared_strings = read_shared_strings(archive)
        sheet1 = read_sheet_rows(archive, "xl/worksheets/sheet1.xml", shared_strings)
        sheet2 = read_sheet_rows(archive, "xl/worksheets/sheet2.xml", shared_strings)

    colors: dict[str, str] = {}
    for row in sheet1[2:]:
        for column in range(1, 29, 2):
            code = row.get(column, "")
            hex_value = row.get(column + 1, "")
            if CODE_PATTERN.match(code) and HEX_PATTERN.match(hex_value):
                colors[code] = hex_value.upper()

    vendor_codes: dict[str, dict[str, str]] = {}
    for row in sheet2[1:]:
        code = row.get(1, "")
        if not CODE_PATTERN.match(code):
            continue
        vendor_codes[code] = {"mard": code}
        for column_letter, vendor in VENDOR_COLUMNS.items():
            column_index = column_letters_to_index(column_letter)
            value = row.get(column_index, "")
            if value:
                vendor_codes[code][vendor] = value
    return colors, vendor_codes


def read_shared_strings(archive: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in archive.namelist():
        return []
    root = ElementTree.fromstring(archive.read("xl/sharedStrings.xml"))
    strings: list[str] = []
    for item in root.findall("a:si", XML_NS):
        strings.append("".join(text.text or "" for text in item.findall(".//a:t", XML_NS)))
    return strings


def read_sheet_rows(archive: zipfile.ZipFile, sheet_path: str, shared_strings: list[str]) -> list[dict[int, str]]:
    root = ElementTree.fromstring(archive.read(sheet_path))
    rows: list[dict[int, str]] = []
    for row in root.findall(".//a:row", XML_NS):
        values: dict[int, str] = {}
        for cell in row.findall("a:c", XML_NS):
            ref = cell.attrib.get("r", "")
            column = column_letters_to_index(re.sub(r"[0-9]", "", ref))
            values[column] = read_cell_value(cell, shared_strings)
        rows.append(values)
    return rows


def read_cell_value(cell: ElementTree.Element, shared_strings: list[str]) -> str:
    value_node = cell.find("a:v", XML_NS)
    if value_node is None or value_node.text is None:
        return ""
    value = value_node.text
    if cell.attrib.get("t") == "s":
        return shared_strings[int(value)]
    return value


def column_letters_to_index(letters: str) -> int:
    index = 0
    for char in letters:
        index = index * 26 + ord(char.upper()) - ord("A") + 1
    return index


def hex_to_rgb(hex_value: str) -> list[int]:
    value = hex_value.lstrip("#")
    return [int(value[index : index + 2], 16) for index in (0, 2, 4)]


def check_no_duplicates(label: str, values: list[str]) -> list[str]:
    seen: set[str] = set()
    duplicates: set[str] = set()
    for value in values:
        if value in seen:
            duplicates.add(value)
        seen.add(value)
    return [f"{label} has duplicate values: {', '.join(sorted(duplicates))}"] if duplicates else []


def check_expected_difference(label: str, actual: set[str], expected: set[str]) -> list[str]:
    if actual == expected:
        return []
    return [f"{label}: expected {sorted(expected)}, got {sorted(actual)}"]


if __name__ == "__main__":
    sys.exit(main())
