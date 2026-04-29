export type BeadVendorId = 'mard' | 'xiaowujia' | 'manman' | 'panpan' | 'mixiaowo' | 'huangdoudou' | 'coco'
export type BeadPaletteTier = 24 | 48 | 72 | 96 | 120 | 144 | 168 | 221 | 'all'
export type MardTier = BeadPaletteTier
export type BeadColorSource = 'xlsx-mard' | 'coco-special'
export type BeadColor = {
  code: string
  name: string
  hex: string
  rgb: [number, number, number]
  family: string
  source: BeadColorSource
  vendorCodes: Partial<Record<BeadVendorId, string>>
}
export type MardColor = BeadColor
export const BEAD_VENDOR_OPTIONS: Array<{ id: BeadVendorId; label: string }> = [
  { id: 'mard', label: 'MARD' },
  { id: 'xiaowujia', label: '小舞家' },
  { id: 'manman', label: '漫漫' },
  { id: 'panpan', label: '盼盼' },
  { id: 'mixiaowo', label: '咪小窝' },
  { id: 'huangdoudou', label: '黄豆豆' },
  { id: 'coco', label: 'COCO' }
]

export const MARD_TIER_OPTIONS: BeadPaletteTier[] = [24, 48, 72, 96, 120, 144, 168, 221, 'all']

export const MARD_COLORS: BeadColor[] = [
  {
    "code": "A1",
    "name": "MARD A1",
    "hex": "#FAF4C8",
    "rgb": [
      250,
      244,
      200
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A1",
      "coco": "E2"
    }
  },
  {
    "code": "A2",
    "name": "MARD A2",
    "hex": "#FFFFD5",
    "rgb": [
      255,
      255,
      213
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A2",
      "coco": "E1"
    }
  },
  {
    "code": "A3",
    "name": "MARD A3",
    "hex": "#FEFF8B",
    "rgb": [
      254,
      255,
      139
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A3",
      "coco": "E5"
    }
  },
  {
    "code": "A4",
    "name": "MARD A4",
    "hex": "#FBED56",
    "rgb": [
      251,
      237,
      86
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A4",
      "coco": "E7"
    }
  },
  {
    "code": "A5",
    "name": "MARD A5",
    "hex": "#F4D738",
    "rgb": [
      244,
      215,
      56
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A5",
      "coco": "D3"
    }
  },
  {
    "code": "A6",
    "name": "MARD A6",
    "hex": "#FEAC4C",
    "rgb": [
      254,
      172,
      76
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A6",
      "coco": "D5"
    }
  },
  {
    "code": "A7",
    "name": "MARD A7",
    "hex": "#FE8B4C",
    "rgb": [
      254,
      139,
      76
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A7",
      "coco": "D8"
    }
  },
  {
    "code": "A8",
    "name": "MARD A8",
    "hex": "#FFDA45",
    "rgb": [
      255,
      218,
      69
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A8",
      "coco": "E8"
    }
  },
  {
    "code": "A9",
    "name": "MARD A9",
    "hex": "#FF995B",
    "rgb": [
      255,
      153,
      91
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A9",
      "coco": "D6"
    }
  },
  {
    "code": "A10",
    "name": "MARD A10",
    "hex": "#F77C31",
    "rgb": [
      247,
      124,
      49
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A10",
      "coco": "D7"
    }
  },
  {
    "code": "A11",
    "name": "MARD A11",
    "hex": "#FFDD99",
    "rgb": [
      255,
      221,
      153
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A11",
      "coco": "D1"
    }
  },
  {
    "code": "A12",
    "name": "MARD A12",
    "hex": "#FE9F72",
    "rgb": [
      254,
      159,
      114
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A12",
      "coco": "K9"
    }
  },
  {
    "code": "A13",
    "name": "MARD A13",
    "hex": "#FFC365",
    "rgb": [
      255,
      195,
      101
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A13",
      "coco": "D4"
    }
  },
  {
    "code": "A14",
    "name": "MARD A14",
    "hex": "#FD543D",
    "rgb": [
      253,
      84,
      61
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A14",
      "coco": "C5"
    }
  },
  {
    "code": "A15",
    "name": "MARD A15",
    "hex": "#FFF365",
    "rgb": [
      255,
      243,
      101
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A15",
      "coco": "E4"
    }
  },
  {
    "code": "A16",
    "name": "MARD A16",
    "hex": "#FFFF9F",
    "rgb": [
      255,
      255,
      159
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A16",
      "coco": "E3"
    }
  },
  {
    "code": "A17",
    "name": "MARD A17",
    "hex": "#FFE36E",
    "rgb": [
      255,
      227,
      110
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A17",
      "coco": "E6"
    }
  },
  {
    "code": "A18",
    "name": "MARD A18",
    "hex": "#FEBE7D",
    "rgb": [
      254,
      190,
      125
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A18",
      "coco": "D2"
    }
  },
  {
    "code": "A19",
    "name": "MARD A19",
    "hex": "#FD7C72",
    "rgb": [
      253,
      124,
      114
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A19",
      "coco": "K10"
    }
  },
  {
    "code": "A20",
    "name": "MARD A20",
    "hex": "#FFD568",
    "rgb": [
      255,
      213,
      104
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A20",
      "coco": "E9"
    }
  },
  {
    "code": "A21",
    "name": "MARD A21",
    "hex": "#FFE395",
    "rgb": [
      255,
      227,
      149
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A21",
      "coco": "E10"
    }
  },
  {
    "code": "A22",
    "name": "MARD A22",
    "hex": "#F4F57D",
    "rgb": [
      244,
      245,
      125
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A22",
      "coco": "E11"
    }
  },
  {
    "code": "A23",
    "name": "MARD A23",
    "hex": "#E6C9B7",
    "rgb": [
      230,
      201,
      183
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A23",
      "coco": "E12"
    }
  },
  {
    "code": "A24",
    "name": "MARD A24",
    "hex": "#F7F8A2",
    "rgb": [
      247,
      248,
      162
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A24",
      "coco": "E13"
    }
  },
  {
    "code": "A25",
    "name": "MARD A25",
    "hex": "#FFD67D",
    "rgb": [
      255,
      214,
      125
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A25",
      "coco": "E14"
    }
  },
  {
    "code": "A26",
    "name": "MARD A26",
    "hex": "#FFC830",
    "rgb": [
      255,
      200,
      48
    ],
    "family": "黄色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "A26",
      "coco": "E15"
    }
  },
  {
    "code": "B1",
    "name": "MARD B1",
    "hex": "#E6EE31",
    "rgb": [
      230,
      238,
      49
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B1",
      "coco": "F5"
    }
  },
  {
    "code": "B2",
    "name": "MARD B2",
    "hex": "#63F347",
    "rgb": [
      99,
      243,
      71
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B2",
      "coco": "F8"
    }
  },
  {
    "code": "B3",
    "name": "MARD B3",
    "hex": "#9EF780",
    "rgb": [
      158,
      247,
      128
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B3",
      "coco": "F4"
    }
  },
  {
    "code": "B4",
    "name": "MARD B4",
    "hex": "#5DE035",
    "rgb": [
      93,
      224,
      53
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B4",
      "coco": "F9"
    }
  },
  {
    "code": "B5",
    "name": "MARD B5",
    "hex": "#35E352",
    "rgb": [
      53,
      227,
      82
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B5",
      "coco": "F10"
    }
  },
  {
    "code": "B6",
    "name": "MARD B6",
    "hex": "#65E2A6",
    "rgb": [
      101,
      226,
      166
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B6",
      "coco": "G4"
    }
  },
  {
    "code": "B7",
    "name": "MARD B7",
    "hex": "#3DAF80",
    "rgb": [
      61,
      175,
      128
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B7",
      "coco": "G5"
    }
  },
  {
    "code": "B8",
    "name": "MARD B8",
    "hex": "#1C9C4F",
    "rgb": [
      28,
      156,
      79
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B8",
      "coco": "F11"
    }
  },
  {
    "code": "B9",
    "name": "MARD B9",
    "hex": "#27523A",
    "rgb": [
      39,
      82,
      58
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B9",
      "coco": "F16"
    }
  },
  {
    "code": "B10",
    "name": "MARD B10",
    "hex": "#95D3C2",
    "rgb": [
      149,
      211,
      194
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B10",
      "coco": "G3"
    }
  },
  {
    "code": "B11",
    "name": "MARD B11",
    "hex": "#5D722A",
    "rgb": [
      93,
      114,
      42
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B11",
      "coco": "F14"
    }
  },
  {
    "code": "B12",
    "name": "MARD B12",
    "hex": "#166F41",
    "rgb": [
      22,
      111,
      65
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B12",
      "coco": "F12"
    }
  },
  {
    "code": "B13",
    "name": "MARD B13",
    "hex": "#CAEB7B",
    "rgb": [
      202,
      235,
      123
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B13",
      "coco": "F2"
    }
  },
  {
    "code": "B14",
    "name": "MARD B14",
    "hex": "#ADE946",
    "rgb": [
      173,
      233,
      70
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B14",
      "coco": "F6"
    }
  },
  {
    "code": "B15",
    "name": "MARD B15",
    "hex": "#2E5132",
    "rgb": [
      46,
      81,
      50
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B15",
      "coco": "F15"
    }
  },
  {
    "code": "B16",
    "name": "MARD B16",
    "hex": "#C5ED9C",
    "rgb": [
      197,
      237,
      156
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B16",
      "coco": "F3"
    }
  },
  {
    "code": "B17",
    "name": "MARD B17",
    "hex": "#9BB13A",
    "rgb": [
      155,
      177,
      58
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B17",
      "coco": "F13"
    }
  },
  {
    "code": "B18",
    "name": "MARD B18",
    "hex": "#E6EE49",
    "rgb": [
      230,
      238,
      73
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B18",
      "coco": "F7"
    }
  },
  {
    "code": "B19",
    "name": "MARD B19",
    "hex": "#24B88C",
    "rgb": [
      36,
      184,
      140
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B19",
      "coco": "G6"
    }
  },
  {
    "code": "B20",
    "name": "MARD B20",
    "hex": "#C2F0CC",
    "rgb": [
      194,
      240,
      204
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B20",
      "coco": "G2"
    }
  },
  {
    "code": "B21",
    "name": "MARD B21",
    "hex": "#156A6B",
    "rgb": [
      21,
      106,
      107
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B21",
      "coco": "G7"
    }
  },
  {
    "code": "B22",
    "name": "MARD B22",
    "hex": "#0B3C43",
    "rgb": [
      11,
      60,
      67
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B22",
      "coco": "G8"
    }
  },
  {
    "code": "B23",
    "name": "MARD B23",
    "hex": "#303A21",
    "rgb": [
      48,
      58,
      33
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B23",
      "coco": "F17"
    }
  },
  {
    "code": "B24",
    "name": "MARD B24",
    "hex": "#EEFCA5",
    "rgb": [
      238,
      252,
      165
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B24",
      "coco": "F1"
    }
  },
  {
    "code": "B25",
    "name": "MARD B25",
    "hex": "#4E846D",
    "rgb": [
      78,
      132,
      109
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B25",
      "coco": "F18"
    }
  },
  {
    "code": "B26",
    "name": "MARD B26",
    "hex": "#8D7A35",
    "rgb": [
      141,
      122,
      53
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B26",
      "coco": "F19"
    }
  },
  {
    "code": "B27",
    "name": "MARD B27",
    "hex": "#CCE1AF",
    "rgb": [
      204,
      225,
      175
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B27",
      "coco": "F20"
    }
  },
  {
    "code": "B28",
    "name": "MARD B28",
    "hex": "#9EE5B9",
    "rgb": [
      158,
      229,
      185
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B28",
      "coco": "F21"
    }
  },
  {
    "code": "B29",
    "name": "MARD B29",
    "hex": "#C5E254",
    "rgb": [
      197,
      226,
      84
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B29",
      "coco": "F22"
    }
  },
  {
    "code": "B30",
    "name": "MARD B30",
    "hex": "#E2FCB1",
    "rgb": [
      226,
      252,
      177
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B30",
      "coco": "F23"
    }
  },
  {
    "code": "B31",
    "name": "MARD B31",
    "hex": "#B0E792",
    "rgb": [
      176,
      231,
      146
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B31",
      "coco": "F24"
    }
  },
  {
    "code": "B32",
    "name": "MARD B32",
    "hex": "#9CAB5A",
    "rgb": [
      156,
      171,
      90
    ],
    "family": "绿色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "B32",
      "coco": "F25"
    }
  },
  {
    "code": "C1",
    "name": "MARD C1",
    "hex": "#E8FFE7",
    "rgb": [
      232,
      255,
      231
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C1",
      "coco": "G1"
    }
  },
  {
    "code": "C2",
    "name": "MARD C2",
    "hex": "#A9F9FC",
    "rgb": [
      169,
      249,
      252
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C2",
      "coco": "H3"
    }
  },
  {
    "code": "C3",
    "name": "MARD C3",
    "hex": "#A0E2FB",
    "rgb": [
      160,
      226,
      251
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C3",
      "coco": "H4"
    }
  },
  {
    "code": "C4",
    "name": "MARD C4",
    "hex": "#41CCFF",
    "rgb": [
      65,
      204,
      255
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C4",
      "coco": "H5"
    }
  },
  {
    "code": "C5",
    "name": "MARD C5",
    "hex": "#01ACEB",
    "rgb": [
      1,
      172,
      235
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C5",
      "coco": "H7"
    }
  },
  {
    "code": "C6",
    "name": "MARD C6",
    "hex": "#50AAF0",
    "rgb": [
      80,
      170,
      240
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C6",
      "coco": "H8"
    }
  },
  {
    "code": "C7",
    "name": "MARD C7",
    "hex": "#3677D2",
    "rgb": [
      54,
      119,
      210
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C7",
      "coco": "H13"
    }
  },
  {
    "code": "C8",
    "name": "MARD C8",
    "hex": "#0F54C0",
    "rgb": [
      15,
      84,
      192
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C8",
      "coco": "H14"
    }
  },
  {
    "code": "C9",
    "name": "MARD C9",
    "hex": "#324BCA",
    "rgb": [
      50,
      75,
      202
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C9",
      "coco": "H16"
    }
  },
  {
    "code": "C10",
    "name": "MARD C10",
    "hex": "#3EBCE2",
    "rgb": [
      62,
      188,
      226
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C10",
      "coco": "H9"
    }
  },
  {
    "code": "C11",
    "name": "MARD C11",
    "hex": "#28DDDE",
    "rgb": [
      40,
      221,
      222
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C11",
      "coco": "H10"
    }
  },
  {
    "code": "C12",
    "name": "MARD C12",
    "hex": "#1C334D",
    "rgb": [
      28,
      51,
      77
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C12",
      "coco": "H23"
    }
  },
  {
    "code": "C13",
    "name": "MARD C13",
    "hex": "#CDE8FF",
    "rgb": [
      205,
      232,
      255
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C13",
      "coco": "H1"
    }
  },
  {
    "code": "C14",
    "name": "MARD C14",
    "hex": "#D5FDFF",
    "rgb": [
      213,
      253,
      255
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C14",
      "coco": "H2"
    }
  },
  {
    "code": "C15",
    "name": "MARD C15",
    "hex": "#22C4C6",
    "rgb": [
      34,
      196,
      198
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C15",
      "coco": "H11"
    }
  },
  {
    "code": "C16",
    "name": "MARD C16",
    "hex": "#1557A8",
    "rgb": [
      21,
      87,
      168
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C16",
      "coco": "H18"
    }
  },
  {
    "code": "C17",
    "name": "MARD C17",
    "hex": "#04D1F6",
    "rgb": [
      4,
      209,
      246
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C17",
      "coco": "H19"
    }
  },
  {
    "code": "C18",
    "name": "MARD C18",
    "hex": "#1D3344",
    "rgb": [
      29,
      51,
      68
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C18",
      "coco": "H24"
    }
  },
  {
    "code": "C19",
    "name": "MARD C19",
    "hex": "#1887A2",
    "rgb": [
      24,
      135,
      162
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C19",
      "coco": "H12"
    }
  },
  {
    "code": "C20",
    "name": "MARD C20",
    "hex": "#176DAF",
    "rgb": [
      23,
      109,
      175
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C20",
      "coco": "H17"
    }
  },
  {
    "code": "C21",
    "name": "MARD C21",
    "hex": "#BEDDFF",
    "rgb": [
      190,
      221,
      255
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C21",
      "coco": "H6"
    }
  },
  {
    "code": "C22",
    "name": "MARD C22",
    "hex": "#67B4BE",
    "rgb": [
      103,
      180,
      190
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C22",
      "coco": "H25"
    }
  },
  {
    "code": "C23",
    "name": "MARD C23",
    "hex": "#C8E2FF",
    "rgb": [
      200,
      226,
      255
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C23",
      "coco": "H26"
    }
  },
  {
    "code": "C24",
    "name": "MARD C24",
    "hex": "#7CC4FF",
    "rgb": [
      124,
      196,
      255
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C24",
      "coco": "H27"
    }
  },
  {
    "code": "C25",
    "name": "MARD C25",
    "hex": "#A9E5E5",
    "rgb": [
      169,
      229,
      229
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C25",
      "coco": "H28"
    }
  },
  {
    "code": "C26",
    "name": "MARD C26",
    "hex": "#3CAED8",
    "rgb": [
      60,
      174,
      216
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C26",
      "coco": "H29"
    }
  },
  {
    "code": "C27",
    "name": "MARD C27",
    "hex": "#D3DFFA",
    "rgb": [
      211,
      223,
      250
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C27",
      "coco": "H30"
    }
  },
  {
    "code": "C28",
    "name": "MARD C28",
    "hex": "#BBCFED",
    "rgb": [
      187,
      207,
      237
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C28",
      "coco": "H31"
    }
  },
  {
    "code": "C29",
    "name": "MARD C29",
    "hex": "#34488E",
    "rgb": [
      52,
      72,
      142
    ],
    "family": "蓝色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "C29",
      "coco": "H32"
    }
  },
  {
    "code": "D1",
    "name": "MARD D1",
    "hex": "#AEB4F2",
    "rgb": [
      174,
      180,
      242
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D1",
      "coco": "J7"
    }
  },
  {
    "code": "D2",
    "name": "MARD D2",
    "hex": "#858EDD",
    "rgb": [
      133,
      142,
      221
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D2",
      "coco": "J8"
    }
  },
  {
    "code": "D3",
    "name": "MARD D3",
    "hex": "#2F54AF",
    "rgb": [
      47,
      84,
      175
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D3",
      "coco": "H15"
    }
  },
  {
    "code": "D4",
    "name": "MARD D4",
    "hex": "#182A84",
    "rgb": [
      24,
      42,
      132
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D4",
      "coco": "H20"
    }
  },
  {
    "code": "D5",
    "name": "MARD D5",
    "hex": "#B843C5",
    "rgb": [
      184,
      67,
      197
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D5",
      "coco": "J12"
    }
  },
  {
    "code": "D6",
    "name": "MARD D6",
    "hex": "#AC7BDE",
    "rgb": [
      172,
      123,
      222
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D6",
      "coco": "J11"
    }
  },
  {
    "code": "D7",
    "name": "MARD D7",
    "hex": "#8854B3",
    "rgb": [
      136,
      84,
      179
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D7",
      "coco": "J15"
    }
  },
  {
    "code": "D8",
    "name": "MARD D8",
    "hex": "#E2D3FF",
    "rgb": [
      226,
      211,
      255
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D8",
      "coco": "J3"
    }
  },
  {
    "code": "D9",
    "name": "MARD D9",
    "hex": "#D5B9F8",
    "rgb": [
      213,
      185,
      248
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D9",
      "coco": "J4"
    }
  },
  {
    "code": "D10",
    "name": "MARD D10",
    "hex": "#361B51",
    "rgb": [
      54,
      27,
      81
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D10",
      "coco": "J19"
    }
  },
  {
    "code": "D11",
    "name": "MARD D11",
    "hex": "#B9BAE1",
    "rgb": [
      185,
      186,
      225
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D11",
      "coco": "J6"
    }
  },
  {
    "code": "D12",
    "name": "MARD D12",
    "hex": "#DE9AD4",
    "rgb": [
      222,
      154,
      212
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D12",
      "coco": "J10"
    }
  },
  {
    "code": "D13",
    "name": "MARD D13",
    "hex": "#B90095",
    "rgb": [
      185,
      0,
      149
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D13",
      "coco": "J14"
    }
  },
  {
    "code": "D14",
    "name": "MARD D14",
    "hex": "#8B279B",
    "rgb": [
      139,
      39,
      155
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D14",
      "coco": "J16"
    }
  },
  {
    "code": "D15",
    "name": "MARD D15",
    "hex": "#2F1F90",
    "rgb": [
      47,
      31,
      144
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D15",
      "coco": "H22"
    }
  },
  {
    "code": "D16",
    "name": "MARD D16",
    "hex": "#E3E1EE",
    "rgb": [
      227,
      225,
      238
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D16",
      "coco": "J1"
    }
  },
  {
    "code": "D17",
    "name": "MARD D17",
    "hex": "#C4D4F6",
    "rgb": [
      196,
      212,
      246
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D17",
      "coco": "J5"
    }
  },
  {
    "code": "D18",
    "name": "MARD D18",
    "hex": "#A45EC7",
    "rgb": [
      164,
      94,
      199
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D18",
      "coco": "J13"
    }
  },
  {
    "code": "D19",
    "name": "MARD D19",
    "hex": "#D8C3D7",
    "rgb": [
      216,
      195,
      215
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D19",
      "coco": "J9"
    }
  },
  {
    "code": "D20",
    "name": "MARD D20",
    "hex": "#9C32B2",
    "rgb": [
      156,
      50,
      178
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D20",
      "coco": "J17"
    }
  },
  {
    "code": "D21",
    "name": "MARD D21",
    "hex": "#9A009B",
    "rgb": [
      154,
      0,
      155
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D21",
      "coco": "J18"
    }
  },
  {
    "code": "D22",
    "name": "MARD D22",
    "hex": "#333A95",
    "rgb": [
      51,
      58,
      149
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D22",
      "coco": "H21"
    }
  },
  {
    "code": "D23",
    "name": "MARD D23",
    "hex": "#EBDAFC",
    "rgb": [
      235,
      218,
      252
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D23",
      "coco": "J2"
    }
  },
  {
    "code": "D24",
    "name": "MARD D24",
    "hex": "#7786E5",
    "rgb": [
      119,
      134,
      229
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D24",
      "coco": "J20"
    }
  },
  {
    "code": "D25",
    "name": "MARD D25",
    "hex": "#494FC7",
    "rgb": [
      73,
      79,
      199
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D25",
      "coco": "J21"
    }
  },
  {
    "code": "D26",
    "name": "MARD D26",
    "hex": "#DFC2F8",
    "rgb": [
      223,
      194,
      248
    ],
    "family": "紫色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "D26",
      "coco": "J22"
    }
  },
  {
    "code": "E1",
    "name": "MARD E1",
    "hex": "#FDD3CC",
    "rgb": [
      253,
      211,
      204
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E1",
      "coco": "K3"
    }
  },
  {
    "code": "E2",
    "name": "MARD E2",
    "hex": "#FEC0DF",
    "rgb": [
      254,
      192,
      223
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E2",
      "coco": "K15"
    }
  },
  {
    "code": "E3",
    "name": "MARD E3",
    "hex": "#FFB7E7",
    "rgb": [
      255,
      183,
      231
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E3",
      "coco": "K17"
    }
  },
  {
    "code": "E4",
    "name": "MARD E4",
    "hex": "#E8649E",
    "rgb": [
      232,
      100,
      158
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E4",
      "coco": "K21"
    }
  },
  {
    "code": "E5",
    "name": "MARD E5",
    "hex": "#F551A2",
    "rgb": [
      245,
      81,
      162
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E5",
      "coco": "K19"
    }
  },
  {
    "code": "E6",
    "name": "MARD E6",
    "hex": "#F13D74",
    "rgb": [
      241,
      61,
      116
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E6",
      "coco": "K22"
    }
  },
  {
    "code": "E7",
    "name": "MARD E7",
    "hex": "#C63478",
    "rgb": [
      198,
      52,
      120
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E7",
      "coco": "K25"
    }
  },
  {
    "code": "E8",
    "name": "MARD E8",
    "hex": "#FFDBE9",
    "rgb": [
      255,
      219,
      233
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E8",
      "coco": "K12"
    }
  },
  {
    "code": "E9",
    "name": "MARD E9",
    "hex": "#E970CC",
    "rgb": [
      233,
      112,
      204
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E9",
      "coco": "K18"
    }
  },
  {
    "code": "E10",
    "name": "MARD E10",
    "hex": "#D33793",
    "rgb": [
      211,
      55,
      147
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E10",
      "coco": "K23"
    }
  },
  {
    "code": "E11",
    "name": "MARD E11",
    "hex": "#FCDDD2",
    "rgb": [
      252,
      221,
      210
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E11",
      "coco": "K2"
    }
  },
  {
    "code": "E12",
    "name": "MARD E12",
    "hex": "#F78FC3",
    "rgb": [
      247,
      143,
      195
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E12",
      "coco": "K16"
    }
  },
  {
    "code": "E13",
    "name": "MARD E13",
    "hex": "#B5006D",
    "rgb": [
      181,
      0,
      109
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E13",
      "coco": "K24"
    }
  },
  {
    "code": "E14",
    "name": "MARD E14",
    "hex": "#FFD1BA",
    "rgb": [
      255,
      209,
      186
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E14",
      "coco": "K5"
    }
  },
  {
    "code": "E15",
    "name": "MARD E15",
    "hex": "#F8C7C9",
    "rgb": [
      248,
      199,
      201
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E15",
      "coco": "K4"
    }
  },
  {
    "code": "E16",
    "name": "MARD E16",
    "hex": "#FFF3EB",
    "rgb": [
      255,
      243,
      235
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E16",
      "coco": "K1"
    }
  },
  {
    "code": "E17",
    "name": "MARD E17",
    "hex": "#FFE2EA",
    "rgb": [
      255,
      226,
      234
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E17",
      "coco": "K11"
    }
  },
  {
    "code": "E18",
    "name": "MARD E18",
    "hex": "#FFC7DB",
    "rgb": [
      255,
      199,
      219
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E18",
      "coco": "K13"
    }
  },
  {
    "code": "E19",
    "name": "MARD E19",
    "hex": "#FEBAD5",
    "rgb": [
      254,
      186,
      213
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E19",
      "coco": "K14"
    }
  },
  {
    "code": "E20",
    "name": "MARD E20",
    "hex": "#D8C7D1",
    "rgb": [
      216,
      199,
      209
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E20",
      "coco": "K26"
    }
  },
  {
    "code": "E21",
    "name": "MARD E21",
    "hex": "#BD9DA1",
    "rgb": [
      189,
      157,
      161
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E21",
      "coco": "K27"
    }
  },
  {
    "code": "E22",
    "name": "MARD E22",
    "hex": "#B785A1",
    "rgb": [
      183,
      133,
      161
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E22",
      "coco": "K28"
    }
  },
  {
    "code": "E23",
    "name": "MARD E23",
    "hex": "#937A8D",
    "rgb": [
      147,
      122,
      141
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E23",
      "coco": "K29"
    }
  },
  {
    "code": "E24",
    "name": "MARD E24",
    "hex": "#E1BCE8",
    "rgb": [
      225,
      188,
      232
    ],
    "family": "粉色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "E24",
      "coco": "K30"
    }
  },
  {
    "code": "F1",
    "name": "MARD F1",
    "hex": "#FD957B",
    "rgb": [
      253,
      149,
      123
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F1",
      "coco": "K8"
    }
  },
  {
    "code": "F2",
    "name": "MARD F2",
    "hex": "#FC3D46",
    "rgb": [
      252,
      61,
      70
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F2",
      "coco": "C2"
    }
  },
  {
    "code": "F3",
    "name": "MARD F3",
    "hex": "#F74941",
    "rgb": [
      247,
      73,
      65
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F3",
      "coco": "C3"
    }
  },
  {
    "code": "F4",
    "name": "MARD F4",
    "hex": "#FC283C",
    "rgb": [
      252,
      40,
      60
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F4",
      "coco": "C6"
    }
  },
  {
    "code": "F5",
    "name": "MARD F5",
    "hex": "#E7002F",
    "rgb": [
      231,
      0,
      47
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F5",
      "coco": "C7"
    }
  },
  {
    "code": "F6",
    "name": "MARD F6",
    "hex": "#943630",
    "rgb": [
      148,
      54,
      48
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F6",
      "coco": "Z21"
    }
  },
  {
    "code": "F7",
    "name": "MARD F7",
    "hex": "#971937",
    "rgb": [
      151,
      25,
      55
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F7",
      "coco": "C10"
    }
  },
  {
    "code": "F8",
    "name": "MARD F8",
    "hex": "#BC0028",
    "rgb": [
      188,
      0,
      40
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F8",
      "coco": "C9"
    }
  },
  {
    "code": "F9",
    "name": "MARD F9",
    "hex": "#E2677A",
    "rgb": [
      226,
      103,
      122
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F9",
      "coco": "K20"
    }
  },
  {
    "code": "F10",
    "name": "MARD F10",
    "hex": "#8A4526",
    "rgb": [
      138,
      69,
      38
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F10",
      "coco": "Z20"
    }
  },
  {
    "code": "F11",
    "name": "MARD F11",
    "hex": "#5A2121",
    "rgb": [
      90,
      33,
      33
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F11",
      "coco": "Z23"
    }
  },
  {
    "code": "F12",
    "name": "MARD F12",
    "hex": "#FD4E6A",
    "rgb": [
      253,
      78,
      106
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F12",
      "coco": "C1"
    }
  },
  {
    "code": "F13",
    "name": "MARD F13",
    "hex": "#F35744",
    "rgb": [
      243,
      87,
      68
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F13",
      "coco": "C4"
    }
  },
  {
    "code": "F14",
    "name": "MARD F14",
    "hex": "#FFA9AD",
    "rgb": [
      255,
      169,
      173
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F14",
      "coco": "K7"
    }
  },
  {
    "code": "F15",
    "name": "MARD F15",
    "hex": "#D30022",
    "rgb": [
      211,
      0,
      34
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F15",
      "coco": "C8"
    }
  },
  {
    "code": "F16",
    "name": "MARD F16",
    "hex": "#FEC2A6",
    "rgb": [
      254,
      194,
      166
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F16",
      "coco": "K6"
    }
  },
  {
    "code": "F17",
    "name": "MARD F17",
    "hex": "#E69C79",
    "rgb": [
      230,
      156,
      121
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F17",
      "coco": "K31"
    }
  },
  {
    "code": "F18",
    "name": "MARD F18",
    "hex": "#D37C46",
    "rgb": [
      211,
      124,
      70
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F18",
      "coco": "K32"
    }
  },
  {
    "code": "F19",
    "name": "MARD F19",
    "hex": "#C1444A",
    "rgb": [
      193,
      68,
      74
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F19",
      "coco": "K33"
    }
  },
  {
    "code": "F20",
    "name": "MARD F20",
    "hex": "#CD9391",
    "rgb": [
      205,
      147,
      145
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F20",
      "coco": "K34"
    }
  },
  {
    "code": "F21",
    "name": "MARD F21",
    "hex": "#F7B4C6",
    "rgb": [
      247,
      180,
      198
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F21",
      "coco": "K35"
    }
  },
  {
    "code": "F22",
    "name": "MARD F22",
    "hex": "#FDC0D0",
    "rgb": [
      253,
      192,
      208
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F22",
      "coco": "K36"
    }
  },
  {
    "code": "F23",
    "name": "MARD F23",
    "hex": "#F67E66",
    "rgb": [
      246,
      126,
      102
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F23",
      "coco": "K37"
    }
  },
  {
    "code": "F24",
    "name": "MARD F24",
    "hex": "#E698AA",
    "rgb": [
      230,
      152,
      170
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F24",
      "coco": "K38"
    }
  },
  {
    "code": "F25",
    "name": "MARD F25",
    "hex": "#E54B4F",
    "rgb": [
      229,
      75,
      79
    ],
    "family": "红色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "F25",
      "coco": "K39"
    }
  },
  {
    "code": "G1",
    "name": "MARD G1",
    "hex": "#FFE2CE",
    "rgb": [
      255,
      226,
      206
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G1",
      "coco": "Z2"
    }
  },
  {
    "code": "G2",
    "name": "MARD G2",
    "hex": "#FFC4AA",
    "rgb": [
      255,
      196,
      170
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G2",
      "coco": "Z5"
    }
  },
  {
    "code": "G3",
    "name": "MARD G3",
    "hex": "#F4C3A5",
    "rgb": [
      244,
      195,
      165
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G3",
      "coco": "Z6"
    }
  },
  {
    "code": "G4",
    "name": "MARD G4",
    "hex": "#E1B383",
    "rgb": [
      225,
      179,
      131
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G4",
      "coco": "Z8"
    }
  },
  {
    "code": "G5",
    "name": "MARD G5",
    "hex": "#EDB045",
    "rgb": [
      237,
      176,
      69
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G5",
      "coco": "Z10"
    }
  },
  {
    "code": "G6",
    "name": "MARD G6",
    "hex": "#E99C17",
    "rgb": [
      233,
      156,
      23
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G6",
      "coco": "Z11"
    }
  },
  {
    "code": "G7",
    "name": "MARD G7",
    "hex": "#9D5B3E",
    "rgb": [
      157,
      91,
      62
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G7",
      "coco": "Z18"
    }
  },
  {
    "code": "G8",
    "name": "MARD G8",
    "hex": "#753B32",
    "rgb": [
      117,
      59,
      50
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G8",
      "coco": "Z22"
    }
  },
  {
    "code": "G9",
    "name": "MARD G9",
    "hex": "#E6B483",
    "rgb": [
      230,
      180,
      131
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G9",
      "coco": "Z9"
    }
  },
  {
    "code": "G10",
    "name": "MARD G10",
    "hex": "#D98C39",
    "rgb": [
      217,
      140,
      57
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G10",
      "coco": "Z15"
    }
  },
  {
    "code": "G11",
    "name": "MARD G11",
    "hex": "#E0C593",
    "rgb": [
      224,
      197,
      147
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G11",
      "coco": "Z7"
    }
  },
  {
    "code": "G12",
    "name": "MARD G12",
    "hex": "#FFC890",
    "rgb": [
      255,
      200,
      144
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G12",
      "coco": "Z13"
    }
  },
  {
    "code": "G13",
    "name": "MARD G13",
    "hex": "#B7714A",
    "rgb": [
      183,
      113,
      74
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G13",
      "coco": "Z14"
    }
  },
  {
    "code": "G14",
    "name": "MARD G14",
    "hex": "#8D614C",
    "rgb": [
      141,
      97,
      76
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G14",
      "coco": "Z17"
    }
  },
  {
    "code": "G15",
    "name": "MARD G15",
    "hex": "#FCF9E0",
    "rgb": [
      252,
      249,
      224
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G15",
      "coco": "Z3"
    }
  },
  {
    "code": "G16",
    "name": "MARD G16",
    "hex": "#F2D9BA",
    "rgb": [
      242,
      217,
      186
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G16",
      "coco": "Z4"
    }
  },
  {
    "code": "G17",
    "name": "MARD G17",
    "hex": "#7B524B",
    "rgb": [
      123,
      82,
      75
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G17",
      "coco": "Z16"
    }
  },
  {
    "code": "G18",
    "name": "MARD G18",
    "hex": "#FFE4CC",
    "rgb": [
      255,
      228,
      204
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G18",
      "coco": "Z1"
    }
  },
  {
    "code": "G19",
    "name": "MARD G19",
    "hex": "#E07935",
    "rgb": [
      224,
      121,
      53
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G19",
      "coco": "Z12"
    }
  },
  {
    "code": "G20",
    "name": "MARD G20",
    "hex": "#A94023",
    "rgb": [
      169,
      64,
      35
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G20",
      "coco": "Z19"
    }
  },
  {
    "code": "G21",
    "name": "MARD G21",
    "hex": "#B88558",
    "rgb": [
      184,
      133,
      88
    ],
    "family": "棕色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "G21",
      "coco": "Z24"
    }
  },
  {
    "code": "H1",
    "name": "MARD H1",
    "hex": "#FDFBFF",
    "rgb": [
      253,
      251,
      255
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H1",
      "coco": "A2"
    }
  },
  {
    "code": "H2",
    "name": "MARD H2",
    "hex": "#FEFFFF",
    "rgb": [
      254,
      255,
      255
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H2",
      "coco": "A1"
    }
  },
  {
    "code": "H3",
    "name": "MARD H3",
    "hex": "#B6B1BA",
    "rgb": [
      182,
      177,
      186
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H3",
      "coco": "B3"
    }
  },
  {
    "code": "H4",
    "name": "MARD H4",
    "hex": "#89858C",
    "rgb": [
      137,
      133,
      140
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H4",
      "coco": "B5"
    }
  },
  {
    "code": "H5",
    "name": "MARD H5",
    "hex": "#48464E",
    "rgb": [
      72,
      70,
      78
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H5",
      "coco": "B6"
    }
  },
  {
    "code": "H6",
    "name": "MARD H6",
    "hex": "#2F2B2F",
    "rgb": [
      47,
      43,
      47
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H6",
      "coco": "B7"
    }
  },
  {
    "code": "H7",
    "name": "MARD H7",
    "hex": "#000000",
    "rgb": [
      0,
      0,
      0
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H7",
      "coco": "B9"
    }
  },
  {
    "code": "H8",
    "name": "MARD H8",
    "hex": "#E7D6DB",
    "rgb": [
      231,
      214,
      219
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H8",
      "coco": "A9"
    }
  },
  {
    "code": "H9",
    "name": "MARD H9",
    "hex": "#EDEDED",
    "rgb": [
      237,
      237,
      237
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H9",
      "coco": "A8"
    }
  },
  {
    "code": "H10",
    "name": "MARD H10",
    "hex": "#EEE9EA",
    "rgb": [
      238,
      233,
      234
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H10",
      "coco": "A10"
    }
  },
  {
    "code": "H11",
    "name": "MARD H11",
    "hex": "#CECDD5",
    "rgb": [
      206,
      205,
      213
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H11",
      "coco": "B1"
    }
  },
  {
    "code": "H12",
    "name": "MARD H12",
    "hex": "#FFF5ED",
    "rgb": [
      255,
      245,
      237
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H12",
      "coco": "A4"
    }
  },
  {
    "code": "H13",
    "name": "MARD H13",
    "hex": "#F5ECD2",
    "rgb": [
      245,
      236,
      210
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H13",
      "coco": "A6"
    }
  },
  {
    "code": "H14",
    "name": "MARD H14",
    "hex": "#CFD7D3",
    "rgb": [
      207,
      215,
      211
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H14",
      "coco": "B2"
    }
  },
  {
    "code": "H15",
    "name": "MARD H15",
    "hex": "#98A6A8",
    "rgb": [
      152,
      166,
      168
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H15",
      "coco": "B4"
    }
  },
  {
    "code": "H16",
    "name": "MARD H16",
    "hex": "#1D1414",
    "rgb": [
      29,
      20,
      20
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H16",
      "coco": "B8"
    }
  },
  {
    "code": "H17",
    "name": "MARD H17",
    "hex": "#F1EDED",
    "rgb": [
      241,
      237,
      237
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H17",
      "coco": "A7"
    }
  },
  {
    "code": "H18",
    "name": "MARD H18",
    "hex": "#FFFDF0",
    "rgb": [
      255,
      253,
      240
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H18",
      "coco": "A3"
    }
  },
  {
    "code": "H19",
    "name": "MARD H19",
    "hex": "#F6EFE2",
    "rgb": [
      246,
      239,
      226
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H19",
      "coco": "A5"
    }
  },
  {
    "code": "H20",
    "name": "MARD H20",
    "hex": "#949FA3",
    "rgb": [
      148,
      159,
      163
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H20",
      "coco": "B10"
    }
  },
  {
    "code": "H21",
    "name": "MARD H21",
    "hex": "#FFFBE1",
    "rgb": [
      255,
      251,
      225
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H21",
      "coco": "A11"
    }
  },
  {
    "code": "H22",
    "name": "MARD H22",
    "hex": "#CACAD4",
    "rgb": [
      202,
      202,
      212
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H22",
      "coco": "A12"
    }
  },
  {
    "code": "H23",
    "name": "MARD H23",
    "hex": "#9A9D94",
    "rgb": [
      154,
      157,
      148
    ],
    "family": "黑白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "H23",
      "coco": "B11"
    }
  },
  {
    "code": "M1",
    "name": "MARD M1",
    "hex": "#BCC6B8",
    "rgb": [
      188,
      198,
      184
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M1",
      "coco": "Y1"
    }
  },
  {
    "code": "M2",
    "name": "MARD M2",
    "hex": "#8AA386",
    "rgb": [
      138,
      163,
      134
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M2",
      "coco": "Y2"
    }
  },
  {
    "code": "M3",
    "name": "MARD M3",
    "hex": "#697D80",
    "rgb": [
      105,
      125,
      128
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M3",
      "coco": "Y3"
    }
  },
  {
    "code": "M4",
    "name": "MARD M4",
    "hex": "#E3D2BC",
    "rgb": [
      227,
      210,
      188
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M4",
      "coco": "Y4"
    }
  },
  {
    "code": "M5",
    "name": "MARD M5",
    "hex": "#D0CCAA",
    "rgb": [
      208,
      204,
      170
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M5",
      "coco": "Y5"
    }
  },
  {
    "code": "M6",
    "name": "MARD M6",
    "hex": "#B0A782",
    "rgb": [
      176,
      167,
      130
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M6",
      "coco": "Y6"
    }
  },
  {
    "code": "M7",
    "name": "MARD M7",
    "hex": "#B4A497",
    "rgb": [
      180,
      164,
      151
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M7",
      "coco": "Y7"
    }
  },
  {
    "code": "M8",
    "name": "MARD M8",
    "hex": "#B38281",
    "rgb": [
      179,
      130,
      129
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M8",
      "coco": "Y8"
    }
  },
  {
    "code": "M9",
    "name": "MARD M9",
    "hex": "#A58767",
    "rgb": [
      165,
      135,
      103
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M9",
      "coco": "Y9"
    }
  },
  {
    "code": "M10",
    "name": "MARD M10",
    "hex": "#C5B2BC",
    "rgb": [
      197,
      178,
      188
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M10",
      "coco": "Y10"
    }
  },
  {
    "code": "M11",
    "name": "MARD M11",
    "hex": "#9F7594",
    "rgb": [
      159,
      117,
      148
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M11",
      "coco": "Y11"
    }
  },
  {
    "code": "M12",
    "name": "MARD M12",
    "hex": "#644749",
    "rgb": [
      100,
      71,
      73
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M12",
      "coco": "Y12"
    }
  },
  {
    "code": "M13",
    "name": "MARD M13",
    "hex": "#D19066",
    "rgb": [
      209,
      144,
      102
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M13",
      "coco": "Y13"
    }
  },
  {
    "code": "M14",
    "name": "MARD M14",
    "hex": "#C77362",
    "rgb": [
      199,
      115,
      98
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M14",
      "coco": "Y14"
    }
  },
  {
    "code": "M15",
    "name": "MARD M15",
    "hex": "#757D7B",
    "rgb": [
      117,
      125,
      123
    ],
    "family": "大地色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "M15",
      "coco": "Y15"
    }
  },
  {
    "code": "P1",
    "name": "MARD P1",
    "hex": "#FCF7F8",
    "rgb": [
      252,
      247,
      248
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P1",
      "coco": "M1"
    }
  },
  {
    "code": "P2",
    "name": "MARD P2",
    "hex": "#B0A9AC",
    "rgb": [
      176,
      169,
      172
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P2",
      "coco": "M2"
    }
  },
  {
    "code": "P3",
    "name": "MARD P3",
    "hex": "#AFDCAB",
    "rgb": [
      175,
      220,
      171
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P3",
      "coco": "M3"
    }
  },
  {
    "code": "P4",
    "name": "MARD P4",
    "hex": "#FEA49F",
    "rgb": [
      254,
      164,
      159
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P4",
      "coco": "M4"
    }
  },
  {
    "code": "P5",
    "name": "MARD P5",
    "hex": "#EE8C3E",
    "rgb": [
      238,
      140,
      62
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P5",
      "coco": "M5"
    }
  },
  {
    "code": "P6",
    "name": "MARD P6",
    "hex": "#5FD0A7",
    "rgb": [
      95,
      208,
      167
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P6",
      "coco": "M6"
    }
  },
  {
    "code": "P7",
    "name": "MARD P7",
    "hex": "#EB9270",
    "rgb": [
      235,
      146,
      112
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P7",
      "coco": "M7"
    }
  },
  {
    "code": "P8",
    "name": "MARD P8",
    "hex": "#F0D958",
    "rgb": [
      240,
      217,
      88
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P8",
      "coco": "M8"
    }
  },
  {
    "code": "P9",
    "name": "MARD P9",
    "hex": "#D9D9D9",
    "rgb": [
      217,
      217,
      217
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P9",
      "coco": "M9"
    }
  },
  {
    "code": "P10",
    "name": "MARD P10",
    "hex": "#D9C7EA",
    "rgb": [
      217,
      199,
      234
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P10",
      "coco": "M10"
    }
  },
  {
    "code": "P11",
    "name": "MARD P11",
    "hex": "#F3ECC9",
    "rgb": [
      243,
      236,
      201
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P11",
      "coco": "M11"
    }
  },
  {
    "code": "P12",
    "name": "MARD P12",
    "hex": "#E6EEF2",
    "rgb": [
      230,
      238,
      242
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P12",
      "coco": "M12"
    }
  },
  {
    "code": "P13",
    "name": "MARD P13",
    "hex": "#AACBEF",
    "rgb": [
      170,
      203,
      239
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P13",
      "coco": "M13"
    }
  },
  {
    "code": "P14",
    "name": "MARD P14",
    "hex": "#3376B0",
    "rgb": [
      51,
      118,
      176
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P14",
      "coco": "M14"
    }
  },
  {
    "code": "P15",
    "name": "MARD P15",
    "hex": "#668575",
    "rgb": [
      102,
      133,
      117
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P15",
      "coco": "M15"
    }
  },
  {
    "code": "P16",
    "name": "MARD P16",
    "hex": "#FEBF45",
    "rgb": [
      254,
      191,
      69
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P16",
      "coco": "M16"
    }
  },
  {
    "code": "P17",
    "name": "MARD P17",
    "hex": "#FEA324",
    "rgb": [
      254,
      163,
      36
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P17",
      "coco": "M17"
    }
  },
  {
    "code": "P18",
    "name": "MARD P18",
    "hex": "#FEB89F",
    "rgb": [
      254,
      184,
      159
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P18",
      "coco": "M18"
    }
  },
  {
    "code": "P19",
    "name": "MARD P19",
    "hex": "#FFE0E9",
    "rgb": [
      255,
      224,
      233
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P19",
      "coco": "M19"
    }
  },
  {
    "code": "P20",
    "name": "MARD P20",
    "hex": "#FEBECF",
    "rgb": [
      254,
      190,
      207
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P20",
      "coco": "M21"
    }
  },
  {
    "code": "P21",
    "name": "MARD P21",
    "hex": "#ECBEBF",
    "rgb": [
      236,
      190,
      191
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P21",
      "coco": "M20"
    }
  },
  {
    "code": "P22",
    "name": "MARD P22",
    "hex": "#E4A89F",
    "rgb": [
      228,
      168,
      159
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P22",
      "coco": "M22"
    }
  },
  {
    "code": "P23",
    "name": "MARD P23",
    "hex": "#A56268",
    "rgb": [
      165,
      98,
      104
    ],
    "family": "柔和色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "P23",
      "coco": "M23"
    }
  },
  {
    "code": "Q1",
    "name": "MARD Q1",
    "hex": "#F2A5E8",
    "rgb": [
      242,
      165,
      232
    ],
    "family": "特殊色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Q1",
      "coco": "W3"
    }
  },
  {
    "code": "Q2",
    "name": "MARD Q2",
    "hex": "#E9EC91",
    "rgb": [
      233,
      236,
      145
    ],
    "family": "特殊色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Q2",
      "coco": "W4"
    }
  },
  {
    "code": "Q3",
    "name": "MARD Q3",
    "hex": "#FFFF00",
    "rgb": [
      255,
      255,
      0
    ],
    "family": "特殊色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Q3",
      "coco": "W1"
    }
  },
  {
    "code": "Q4",
    "name": "MARD Q4",
    "hex": "#FFEBFA",
    "rgb": [
      255,
      235,
      250
    ],
    "family": "特殊色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Q4",
      "coco": "W2"
    }
  },
  {
    "code": "Q5",
    "name": "MARD Q5",
    "hex": "#76CEDE",
    "rgb": [
      118,
      206,
      222
    ],
    "family": "特殊色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Q5",
      "coco": "W5"
    }
  },
  {
    "code": "R1",
    "name": "MARD R1",
    "hex": "#D50D21",
    "rgb": [
      213,
      13,
      33
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R1",
      "coco": "L1"
    }
  },
  {
    "code": "R2",
    "name": "MARD R2",
    "hex": "#F92F83",
    "rgb": [
      249,
      47,
      131
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R2",
      "coco": "L2"
    }
  },
  {
    "code": "R3",
    "name": "MARD R3",
    "hex": "#FD8324",
    "rgb": [
      253,
      131,
      36
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R3",
      "coco": "L3"
    }
  },
  {
    "code": "R4",
    "name": "MARD R4",
    "hex": "#F8EC31",
    "rgb": [
      248,
      236,
      49
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R4",
      "coco": "L4"
    }
  },
  {
    "code": "R5",
    "name": "MARD R5",
    "hex": "#35C75B",
    "rgb": [
      53,
      199,
      91
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R5",
      "coco": "L5"
    }
  },
  {
    "code": "R6",
    "name": "MARD R6",
    "hex": "#23B891",
    "rgb": [
      35,
      184,
      145
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R6",
      "coco": "L6"
    }
  },
  {
    "code": "R7",
    "name": "MARD R7",
    "hex": "#19779D",
    "rgb": [
      25,
      119,
      157
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R7",
      "coco": "L7"
    }
  },
  {
    "code": "R8",
    "name": "MARD R8",
    "hex": "#1A60C3",
    "rgb": [
      26,
      96,
      195
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R8",
      "coco": "L8"
    }
  },
  {
    "code": "R9",
    "name": "MARD R9",
    "hex": "#9A56B4",
    "rgb": [
      154,
      86,
      180
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R9",
      "coco": "L9"
    }
  },
  {
    "code": "R10",
    "name": "MARD R10",
    "hex": "#FFDB4C",
    "rgb": [
      255,
      219,
      76
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R10",
      "coco": "L10"
    }
  },
  {
    "code": "R11",
    "name": "MARD R11",
    "hex": "#FFEBFA",
    "rgb": [
      255,
      235,
      250
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R11",
      "coco": "L11"
    }
  },
  {
    "code": "R12",
    "name": "MARD R12",
    "hex": "#D8D5CE",
    "rgb": [
      216,
      213,
      206
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R12",
      "coco": "L12"
    }
  },
  {
    "code": "R13",
    "name": "MARD R13",
    "hex": "#55514C",
    "rgb": [
      85,
      81,
      76
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R13",
      "coco": "L13"
    }
  },
  {
    "code": "R14",
    "name": "MARD R14",
    "hex": "#9FE4DF",
    "rgb": [
      159,
      228,
      223
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R14",
      "coco": "S1"
    }
  },
  {
    "code": "R15",
    "name": "MARD R15",
    "hex": "#77CEE9",
    "rgb": [
      119,
      206,
      233
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R15",
      "coco": "S2"
    }
  },
  {
    "code": "R16",
    "name": "MARD R16",
    "hex": "#3ECFCA",
    "rgb": [
      62,
      207,
      202
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R16",
      "coco": "S3"
    }
  },
  {
    "code": "R17",
    "name": "MARD R17",
    "hex": "#4A867A",
    "rgb": [
      74,
      134,
      122
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R17",
      "coco": "S4"
    }
  },
  {
    "code": "R18",
    "name": "MARD R18",
    "hex": "#7FCD9D",
    "rgb": [
      127,
      205,
      157
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R18",
      "coco": "S5"
    }
  },
  {
    "code": "R19",
    "name": "MARD R19",
    "hex": "#CDE55D",
    "rgb": [
      205,
      229,
      93
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R19",
      "coco": "S6"
    }
  },
  {
    "code": "R20",
    "name": "MARD R20",
    "hex": "#E8C7B4",
    "rgb": [
      232,
      199,
      180
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R20",
      "coco": "S7"
    }
  },
  {
    "code": "R21",
    "name": "MARD R21",
    "hex": "#AD6F3C",
    "rgb": [
      173,
      111,
      60
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R21",
      "coco": "S8"
    }
  },
  {
    "code": "R22",
    "name": "MARD R22",
    "hex": "#6C372F",
    "rgb": [
      108,
      55,
      47
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R22",
      "coco": "S9"
    }
  },
  {
    "code": "R23",
    "name": "MARD R23",
    "hex": "#FEB872",
    "rgb": [
      254,
      184,
      114
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R23",
      "coco": "S10"
    }
  },
  {
    "code": "R24",
    "name": "MARD R24",
    "hex": "#F3C1C0",
    "rgb": [
      243,
      193,
      192
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R24",
      "coco": "S11"
    }
  },
  {
    "code": "R25",
    "name": "MARD R25",
    "hex": "#C9675E",
    "rgb": [
      201,
      103,
      94
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R25",
      "coco": "S12"
    }
  },
  {
    "code": "R26",
    "name": "MARD R26",
    "hex": "#D293BE",
    "rgb": [
      210,
      147,
      190
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R26",
      "coco": "S13"
    }
  },
  {
    "code": "R27",
    "name": "MARD R27",
    "hex": "#EA8CB1",
    "rgb": [
      234,
      140,
      177
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R27",
      "coco": "S14"
    }
  },
  {
    "code": "R28",
    "name": "MARD R28",
    "hex": "#9C87D6",
    "rgb": [
      156,
      135,
      214
    ],
    "family": "鲜艳色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "R28",
      "coco": "S15"
    }
  },
  {
    "code": "T1",
    "name": "MARD T1",
    "hex": "#FFFFFF",
    "rgb": [
      255,
      255,
      255
    ],
    "family": "纯白色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "T1",
      "coco": "L14"
    }
  },
  {
    "code": "Y1",
    "name": "MARD Y1",
    "hex": "#FD6FB4",
    "rgb": [
      253,
      111,
      180
    ],
    "family": "荧光色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Y1"
    }
  },
  {
    "code": "Y2",
    "name": "MARD Y2",
    "hex": "#FEB481",
    "rgb": [
      254,
      180,
      129
    ],
    "family": "荧光色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Y2",
      "coco": "N2"
    }
  },
  {
    "code": "Y3",
    "name": "MARD Y3",
    "hex": "#D7FAA0",
    "rgb": [
      215,
      250,
      160
    ],
    "family": "荧光色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Y3",
      "coco": "N3"
    }
  },
  {
    "code": "Y4",
    "name": "MARD Y4",
    "hex": "#8BDBFA",
    "rgb": [
      139,
      219,
      250
    ],
    "family": "荧光色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Y4",
      "coco": "N4"
    }
  },
  {
    "code": "Y5",
    "name": "MARD Y5",
    "hex": "#E987EA",
    "rgb": [
      233,
      135,
      234
    ],
    "family": "荧光色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "Y5",
      "coco": "N5"
    }
  },
  {
    "code": "ZG1",
    "name": "MARD ZG1",
    "hex": "#DAABB3",
    "rgb": [
      218,
      171,
      179
    ],
    "family": "莫兰迪色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "ZG1",
      "coco": "GB1"
    }
  },
  {
    "code": "ZG2",
    "name": "MARD ZG2",
    "hex": "#D6AA87",
    "rgb": [
      214,
      170,
      135
    ],
    "family": "莫兰迪色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "ZG2",
      "coco": "GB2"
    }
  },
  {
    "code": "ZG3",
    "name": "MARD ZG3",
    "hex": "#C1BD8D",
    "rgb": [
      193,
      189,
      141
    ],
    "family": "莫兰迪色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "ZG3",
      "coco": "GB3"
    }
  },
  {
    "code": "ZG4",
    "name": "MARD ZG4",
    "hex": "#96B69F",
    "rgb": [
      150,
      182,
      159
    ],
    "family": "莫兰迪色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "ZG4",
      "coco": "GB4"
    }
  },
  {
    "code": "ZG5",
    "name": "MARD ZG5",
    "hex": "#849DC6",
    "rgb": [
      132,
      157,
      198
    ],
    "family": "莫兰迪色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "ZG5",
      "coco": "GB5"
    }
  },
  {
    "code": "ZG6",
    "name": "MARD ZG6",
    "hex": "#94BFE2",
    "rgb": [
      148,
      191,
      226
    ],
    "family": "莫兰迪色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "ZG6",
      "coco": "GB6"
    }
  },
  {
    "code": "ZG7",
    "name": "MARD ZG7",
    "hex": "#E2A9D2",
    "rgb": [
      226,
      169,
      210
    ],
    "family": "莫兰迪色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "ZG7",
      "coco": "GB7"
    }
  },
  {
    "code": "ZG8",
    "name": "MARD ZG8",
    "hex": "#AB91C0",
    "rgb": [
      171,
      145,
      192
    ],
    "family": "莫兰迪色系",
    "source": "xlsx-mard",
    "vendorCodes": {
      "mard": "ZG8",
      "coco": "GB8"
    }
  }
]

export const COCO_SPECIAL_COLORS: BeadColor[] = [
  {
    "code": "COCO_XMAS_RED",
    "name": "COCO 圣诞红",
    "hex": "#B83944",
    "rgb": [
      184,
      57,
      68
    ],
    "family": "COCO 限定色",
    "source": "coco-special",
    "vendorCodes": {
      "coco": "圣诞红"
    }
  },
  {
    "code": "COCO_XMAS_GREEN",
    "name": "COCO 圣诞绿",
    "hex": "#008571",
    "rgb": [
      0,
      133,
      113
    ],
    "family": "COCO 限定色",
    "source": "coco-special",
    "vendorCodes": {
      "coco": "圣诞绿"
    }
  }
]

const tier24Codes = [
"A4",
"A6",
"A7",
"B3",
"B5",
"B8",
"C3",
"C5",
"C8",
"D6",
"D7",
"D9",
"E2",
"E4",
"F5",
"G1",
"G5",
"G7",
"H1",
"H2",
"H3",
"H4",
"H5",
"H7"
] as const
const tier48Codes = [
"A4",
"A6",
"A7",
"B3",
"B5",
"B8",
"C3",
"C5",
"C8",
"D6",
"D7",
"D9",
"E2",
"E4",
"F5",
"G1",
"G5",
"G7",
"H1",
"H2",
"H3",
"H4",
"H5",
"H7",
"A10",
"A11",
"A13",
"B12",
"C2",
"C6",
"C7",
"C10",
"C11",
"C13",
"D3",
"D13",
"D15",
"D18",
"D19",
"D21",
"E3",
"E7",
"E8",
"F8",
"F13",
"G8",
"G9",
"G13"
] as const
const tier72Codes = [
"A4",
"A6",
"A7",
"B3",
"B5",
"B8",
"C3",
"C5",
"C8",
"D6",
"D7",
"D9",
"E2",
"E4",
"F5",
"G1",
"G5",
"G7",
"H1",
"H2",
"H3",
"H4",
"H5",
"H7",
"A10",
"A11",
"A13",
"B12",
"C2",
"C6",
"C7",
"C10",
"C11",
"C13",
"D3",
"D13",
"D15",
"D18",
"D19",
"D21",
"E3",
"E7",
"E8",
"F8",
"F13",
"G8",
"G9",
"G13",
"A3",
"B7",
"B10",
"B14",
"B17",
"B18",
"B19",
"B20",
"C16",
"D2",
"D8",
"D11",
"D12",
"D14",
"D16",
"D20",
"E1",
"E5",
"E12",
"E13",
"F7",
"F10",
"G2",
"G3"
] as const
const tier96Codes = [
"A4",
"A6",
"A7",
"B3",
"B5",
"B8",
"C3",
"C5",
"C8",
"D6",
"D7",
"D9",
"E2",
"E4",
"F5",
"G1",
"G5",
"G7",
"H1",
"H2",
"H3",
"H4",
"H5",
"H7",
"A10",
"A11",
"A13",
"B12",
"C2",
"C6",
"C7",
"C10",
"C11",
"C13",
"D3",
"D13",
"D15",
"D18",
"D19",
"D21",
"E3",
"E7",
"E8",
"F8",
"F13",
"G8",
"G9",
"G13",
"A3",
"B7",
"B10",
"B14",
"B17",
"B18",
"B19",
"B20",
"C16",
"D2",
"D8",
"D11",
"D12",
"D14",
"D16",
"D20",
"E1",
"E5",
"E12",
"E13",
"F7",
"F10",
"G2",
"G3",
"A14",
"D5",
"E6",
"E9",
"E10",
"E11",
"E14",
"E15",
"F1",
"F2",
"F3",
"F4",
"F6",
"F9",
"F11",
"F12",
"F14",
"G14",
"G17",
"H6",
"M5",
"M6",
"M9",
"M12"
] as const
const tier120Codes = [
"A4",
"A6",
"A7",
"B3",
"B5",
"B8",
"C3",
"C5",
"C8",
"D6",
"D7",
"D9",
"E2",
"E4",
"F5",
"G1",
"G5",
"G7",
"H1",
"H2",
"H3",
"H4",
"H5",
"H7",
"A10",
"A11",
"A13",
"B12",
"C2",
"C6",
"C7",
"C10",
"C11",
"C13",
"D3",
"D13",
"D15",
"D18",
"D19",
"D21",
"E3",
"E7",
"E8",
"F8",
"F13",
"G8",
"G9",
"G13",
"A3",
"B7",
"B10",
"B14",
"B17",
"B18",
"B19",
"B20",
"C16",
"D2",
"D8",
"D11",
"D12",
"D14",
"D16",
"D20",
"E1",
"E5",
"E12",
"E13",
"F7",
"F10",
"G2",
"G3",
"A14",
"D5",
"E6",
"E9",
"E10",
"E11",
"E14",
"E15",
"F1",
"F2",
"F3",
"F4",
"F6",
"F9",
"F11",
"F12",
"F14",
"G14",
"G17",
"H6",
"M5",
"M6",
"M9",
"M12",
"A1",
"A5",
"A8",
"A9",
"A12",
"A15",
"B1",
"B2",
"B4",
"B6",
"B11",
"B13",
"B15",
"B16",
"C1",
"C4",
"C9",
"C14",
"C15",
"C17",
"D1",
"D17",
"G6",
"H12"
] as const
const tier144Codes = [
"A4",
"A6",
"A7",
"B3",
"B5",
"B8",
"C3",
"C5",
"C8",
"D6",
"D7",
"D9",
"E2",
"E4",
"F5",
"G1",
"G5",
"G7",
"H1",
"H2",
"H3",
"H4",
"H5",
"H7",
"A10",
"A11",
"A13",
"B12",
"C2",
"C6",
"C7",
"C10",
"C11",
"C13",
"D3",
"D13",
"D15",
"D18",
"D19",
"D21",
"E3",
"E7",
"E8",
"F8",
"F13",
"G8",
"G9",
"G13",
"A3",
"B7",
"B10",
"B14",
"B17",
"B18",
"B19",
"B20",
"C16",
"D2",
"D8",
"D11",
"D12",
"D14",
"D16",
"D20",
"E1",
"E5",
"E12",
"E13",
"F7",
"F10",
"G2",
"G3",
"A14",
"D5",
"E6",
"E9",
"E10",
"E11",
"E14",
"E15",
"F1",
"F2",
"F3",
"F4",
"F6",
"F9",
"F11",
"F12",
"F14",
"G14",
"G17",
"H6",
"M5",
"M6",
"M9",
"M12",
"A1",
"A5",
"A8",
"A9",
"A12",
"A15",
"B1",
"B2",
"B4",
"B6",
"B11",
"B13",
"B15",
"B16",
"C1",
"C4",
"C9",
"C14",
"C15",
"C17",
"D1",
"D17",
"G6",
"H12",
"A2",
"G4",
"G10",
"G11",
"G12",
"G15",
"G16",
"H8",
"H9",
"H10",
"H11",
"H13",
"H14",
"M1",
"M2",
"M3",
"M4",
"M7",
"M8",
"M10",
"M11",
"M13",
"M14",
"M15"
] as const
const tier168Codes = [
"A4",
"A6",
"A7",
"B3",
"B5",
"B8",
"C3",
"C5",
"C8",
"D6",
"D7",
"D9",
"E2",
"E4",
"F5",
"G1",
"G5",
"G7",
"H2",
"H3",
"H4",
"H5",
"H7",
"A10",
"A11",
"A13",
"B12",
"C2",
"C6",
"C7",
"C10",
"C11",
"C13",
"D3",
"D13",
"D15",
"D18",
"D19",
"D21",
"E3",
"E7",
"E8",
"F8",
"F13",
"G8",
"G9",
"G13",
"A3",
"B7",
"B10",
"B14",
"B17",
"B18",
"B19",
"B20",
"C16",
"D2",
"D8",
"D11",
"D12",
"D14",
"D16",
"D20",
"E1",
"E5",
"E12",
"E13",
"F7",
"F10",
"G2",
"G3",
"A14",
"D5",
"E6",
"E9",
"E10",
"E11",
"E14",
"E15",
"F1",
"F2",
"F3",
"F4",
"F6",
"F9",
"F11",
"F12",
"F14",
"G14",
"G17",
"H6",
"M5",
"M6",
"M9",
"M12",
"A1",
"A5",
"A8",
"A9",
"A12",
"A15",
"B1",
"B2",
"B4",
"B6",
"B11",
"B13",
"B15",
"B16",
"C1",
"C4",
"C9",
"C14",
"C15",
"C17",
"D1",
"D17",
"G6",
"H12",
"A2",
"G4",
"G10",
"G11",
"G12",
"G15",
"G16",
"H8",
"H9",
"H10",
"H11",
"H13",
"H14",
"M1",
"M2",
"M3",
"M4",
"M7",
"M8",
"M10",
"M11",
"M13",
"M14",
"M15",
"P1",
"P2",
"P3",
"P4",
"P5",
"P6",
"P7",
"P8",
"P9",
"P10",
"P11",
"P12",
"P13",
"P14",
"P15",
"P16",
"P17",
"P18",
"P19",
"P20",
"P21",
"P22",
"P23",
"R12",
"Y1"
] as const
const tier221Codes = [
"A1",
"A2",
"A3",
"A4",
"A5",
"A6",
"A7",
"A8",
"A9",
"A10",
"A11",
"A12",
"A13",
"A14",
"A15",
"A16",
"A17",
"A18",
"A19",
"A20",
"A21",
"A22",
"A23",
"A24",
"A25",
"A26",
"B1",
"B2",
"B3",
"B4",
"B5",
"B6",
"B7",
"B8",
"B9",
"B10",
"B11",
"B12",
"B13",
"B14",
"B15",
"B16",
"B17",
"B18",
"B19",
"B20",
"B21",
"B22",
"B23",
"B24",
"B25",
"B26",
"B27",
"B28",
"B29",
"B30",
"B31",
"B32",
"C1",
"C2",
"C3",
"C4",
"C5",
"C6",
"C7",
"C8",
"C9",
"C10",
"C11",
"C12",
"C13",
"C14",
"C15",
"C16",
"C17",
"C18",
"C19",
"C20",
"C21",
"C22",
"C23",
"C24",
"C25",
"C26",
"C27",
"C28",
"C29",
"D1",
"D2",
"D3",
"D4",
"D5",
"D6",
"D7",
"D8",
"D9",
"D10",
"D11",
"D12",
"D13",
"D14",
"D15",
"D16",
"D17",
"D18",
"D19",
"D20",
"D21",
"D22",
"D23",
"D24",
"D25",
"D26",
"E1",
"E2",
"E3",
"E4",
"E5",
"E6",
"E7",
"E8",
"E9",
"E10",
"E11",
"E12",
"E13",
"E14",
"E15",
"E16",
"E17",
"E18",
"E19",
"E20",
"E21",
"E22",
"E23",
"E24",
"F1",
"F2",
"F3",
"F4",
"F5",
"F6",
"F7",
"F8",
"F9",
"F10",
"F11",
"F12",
"F13",
"F14",
"F15",
"F16",
"F17",
"F18",
"F19",
"F20",
"F21",
"F22",
"F23",
"F24",
"F25",
"G1",
"G2",
"G3",
"G4",
"G5",
"G6",
"G7",
"G8",
"G9",
"G10",
"G11",
"G12",
"G13",
"G14",
"G15",
"G16",
"G17",
"G18",
"G19",
"G20",
"G21",
"H1",
"H2",
"H3",
"H4",
"H5",
"H6",
"H7",
"H8",
"H9",
"H10",
"H11",
"H12",
"H13",
"H14",
"H15",
"H16",
"H17",
"H18",
"H19",
"H20",
"H21",
"H22",
"H23",
"M1",
"M2",
"M3",
"M4",
"M5",
"M6",
"M7",
"M8",
"M9",
"M10",
"M11",
"M12",
"M13",
"M14",
"M15"
] as const

export const MARD_TIER_CODES: Record<Exclude<BeadPaletteTier, 'all'>, readonly string[]> = {
  24: tier24Codes,
  48: tier48Codes,
  72: tier72Codes,
  96: tier96Codes,
  120: tier120Codes,
  144: tier144Codes,
  168: tier168Codes,
  221: tier221Codes
}

export const MARD_COLOR_BY_CODE = new Map(MARD_COLORS.map((color) => [color.code, color]))
export const BEAD_COLOR_BY_CODE = new Map([...MARD_COLORS, ...COCO_SPECIAL_COLORS].map((color) => [color.code, color]))

export function getMardTierPalette(tier: BeadPaletteTier, vendor: BeadVendorId = 'mard') {
  const baseColors = tier === 'all' ? MARD_COLORS : MARD_TIER_CODES[tier].map((code) => MARD_COLOR_BY_CODE.get(code)).filter((color): color is BeadColor => Boolean(color))
  return tier === 'all' && vendor === 'coco' ? [...baseColors, ...COCO_SPECIAL_COLORS] : baseColors
}

export function getMardTierMissingCodes(tier: BeadPaletteTier) {
  if (tier === 'all') {
    return []
  }
  return MARD_TIER_CODES[tier].filter((code) => !MARD_COLOR_BY_CODE.has(code))
}

export function getBeadDisplayCode(color: BeadColor, vendor: BeadVendorId) {
  return color.vendorCodes[vendor] ?? color.vendorCodes.mard ?? '-'
}

export function getVendorLabel(vendor: BeadVendorId) {
  return BEAD_VENDOR_OPTIONS.find((option) => option.id === vendor)?.label ?? vendor
}

export function getPaletteTierLabel(tier: BeadPaletteTier) {
  return tier === 'all' ? '全量' : `${tier}色`
}

export const MARD_TIER_SOURCE_NOTE = 'MARD 色值与多厂商编号来自项目根目录 拼豆色卡.xlsx；Q1/Q5 按人工确认修正；COCO 圣诞红/绿为用户补充色。'
