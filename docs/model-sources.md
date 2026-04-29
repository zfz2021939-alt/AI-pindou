# AIpindou 本地模型来源

本项目的本地 AI 功能只在用户设备上推理，不上传图片。

| 文件 | 用途 | 来源 | SHA256 |
| --- | --- | --- | --- |
| `frontend/public/models/u2netp.onnx` | 本地背景分割 | https://huggingface.co/bluefoxcreation/background-removers/resolve/main/u2netp.onnx | `3E9DACB24FDB7064E6F3462DAA6F828DBE168E0D6B6F253C4B709905646E8A62` |
| `frontend/public/models/face_landmarker.task` | 真人/类人脸 landmarks | https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task | `64184E229B263107BC2B804C6625DB1341FF2BB731874B0BCC2FE6544E0BC9FF` |
| `frontend/public/models/lbpcascade_animeface.xml` | 卡通脸检测参考模型 | https://github.com/nagadomi/lbpcascade_animeface | `9376D30AC38DB6BDA2A68B88B3B76BBD7E6AA33AF47F7F5C76BC88CA75F1CE30` |

## 参考算法

- U2-Net / U2-NetP: https://arxiv.org/abs/2005.09007
- U2-Net repo: https://github.com/xuebinqin/U-2-Net
- ONNX Runtime Web WebGPU: https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html
- MediaPipe Face Detector Web: https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector/web_js
- MediaPipe Face Mesh background: https://github.com/google/mediapipe/wiki/MediaPipe-Face-Mesh
- YuNet 备选模型: https://huggingface.co/opencv/opencv_zoo/tree/main/models/face_detection_yunet
