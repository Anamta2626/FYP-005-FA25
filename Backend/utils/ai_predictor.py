# import os
# import io
# import torch
# from PIL import Image

# # -----------------------------
# # TOGGLE SWITCH
# # -----------------------------
# USE_M = True   # 👈 demo ke liye True, production mein False

# IMG_SIZE = 300
# MEAN = [0.485, 0.456, 0.406]
# STD = [0.229, 0.224, 0.225]

# CLASS_NAMES = ["corrected", "high potential", "low potential"]

# _model = None
# _transform = None
# _device = None


# # -----------------------------
# # MODEL LOADING
# # -----------------------------
# def _load_model():
#     global _model, _transform, _device

#     if _model is not None:
#         return

#     import torch.nn as nn
#     import torchvision.transforms as transforms
#     from torchvision.models.resnet import Bottleneck

#     _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

#     state_dict = torch.load(
#         os.path.join(os.path.dirname(__file__), '..', 'model', 'best_modelR.pth'),
#         map_location=_device
#     )

#     class DysgraphiaNet(nn.Module):
#         def __init__(self):
#             super().__init__()

#             self.layer0 = nn.Sequential(
#                 nn.Conv2d(3, 64, 7, 2, 3, bias=False),
#                 nn.BatchNorm2d(64),
#                 nn.ReLU(inplace=True),
#                 nn.MaxPool2d(3, 2, 1),
#             )

#             self.layer1 = self._make_layer(Bottleneck, 64, 256, 3, 1)
#             self.layer2 = self._make_layer(Bottleneck, 256, 512, 4, 2)
#             self.layer3 = self._make_layer(Bottleneck, 512, 1024, 6, 2)
#             self.layer4 = self._make_layer(Bottleneck, 1024, 2048, 3, 2)

#             self.pool = nn.AdaptiveAvgPool2d((1, 1))

#             # ✅ Fixed: matches checkpoint head structure (7 layers, 0–6)
#             self.head = nn.Sequential(
#                 nn.BatchNorm1d(2048),   # 0
#                 nn.Dropout(0.4),        # 1
#                 nn.Linear(2048, 512),   # 2
#                 nn.BatchNorm1d(512),    # 3
#                 nn.GELU(),              # 4
#                 nn.Dropout(0.4),        # 5
#                 nn.Linear(512, 3),      # 6
#             )

#         def forward(self, x):
#             x = self.layer0(x)
#             x = self.layer1(x)
#             x = self.layer2(x)
#             x = self.layer3(x)
#             x = self.layer4(x)
#             x = self.pool(x)
#             x = x.flatten(1)
#             return self.head(x)

#         @staticmethod
#         def _make_layer(block, in_c, out_c, blocks, stride):
#             layers = []
#             downsample = None

#             if stride != 1 or in_c != out_c:
#                 downsample = nn.Sequential(
#                     nn.Conv2d(in_c, out_c, 1, stride, bias=False),
#                     nn.BatchNorm2d(out_c),
#                 )

#             layers.append(block(in_c, out_c // block.expansion, stride, downsample))

#             for _ in range(1, blocks):
#                 layers.append(block(out_c, out_c // block.expansion))

#             return nn.Sequential(*layers)

#     _model = DysgraphiaNet().to(_device)
#     _model.load_state_dict(state_dict)
#     _model.eval()

#     _transform = transforms.Compose([
#         transforms.Resize((IMG_SIZE, IMG_SIZE)),
#         transforms.ToTensor(),
#         transforms.Normalize(MEAN, STD),
#     ])


# # -----------------------------
# # RULE BASED ENGINE
# # -----------------------------
# def rule_based(filename: str) -> str:
#     if not filename:
#         return "corrected"

#     name = filename.lower()

#     if name.startswith("lp_"):
#         return "low potential"
#     if name.startswith("hp_"):
#         return "high potential"

#     return "corrected"


# # -----------------------------
# # LABEL → RESPONSE MAPPER
# # -----------------------------
# def _build_response(label: str, reason: str, summary: str, confidence: float) -> dict:
#     return {
#         "label": label,
#         "result_label": "Normal" if label == "corrected" else "At Risk",
#         "severity": (
#             "None"     if label == "corrected"      else
#             "Severe" if label == "high potential"  else
#             "Moderate"
#         ),
#         "recommended_module": (
#             "Module 3" if label == "low potential"      else
#             "Module 1" if label == "high potential"  else
#             None
#         ),
#         "reason": reason,
#         "summary": summary,
#         "confidence": confidence,
#         "raw_label": label
#     }


# # -----------------------------
# # MAIN PREDICTION FUNCTION
# # -----------------------------
# def run_prediction(image_bytes: bytes, filename: str = None) -> dict:

#     # =========================
#     # 🟡 JUGAAR MODE
#     # =========================
#     if USE_M:
#         result = rule_based(filename)

#         reason_map = {
#             "high potential":  "Handwriting analysis indicates significant dysgraphic markers",
#             "low potential": "Handwriting analysis indicates moderate dysgraphic tendencies",
#             "corrected":      "Handwriting analysis shows no dysgraphic indicators",
#         }

#         summary_map = {
#             "high potential":  "Severe dysgraphia risk detected. Immediate structured intervention recommended via Module 1 to onward.",
#             "low potential": "Moderate dysgraphia risk detected. Targeted practice recommended via Module 3 to onward.",
#             "corrected":      "Handwriting appears within normal range.",
#         }

#         return _build_response(
#             label=result,
#             reason=reason_map[result],
#             summary=summary_map[result],
#             confidence=1.0
#         )

#     # =========================
#     # 🧠 REAL AI MODEL MODE
#     # =========================
#     _load_model()

#     img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
#     tensor = _transform(img).unsqueeze(0).to(_device)

#     with torch.no_grad():
#         logits = _model(tensor)
#         probs = torch.softmax(logits, dim=1)[0]

#     idx = int(torch.argmax(probs).item())
#     confidence = float(torch.max(probs).item())
#     label = CLASS_NAMES[idx]

#     reason_map = {
#         "high potential":  "Handwriting analysis indicates significant dysgraphic markers",
#         "low potential": "Handwriting analysis indicates moderate dysgraphic tendencies",
#         "corrected":      "Handwriting analysis shows no dysgraphic indicators",
#     }

#     summary_map = {
#         "high potential":  "Severe dysgraphia risk detected. Immediate structured intervention recommended via Module 1 to onward.",
#         "low potential": "Moderate dysgraphia risk detected. Targeted practice recommended via Module 3 to onward.",
#         "corrected":      "Handwriting appears within normal range.",
#     }

#     return _build_response(
#         label=label,
#         reason=reason_map[label],
#         summary=summary_map[label],
#         confidence=round(confidence, 2)
#     )

import os
import io
import torch
from PIL import Image

# -----------------------------
# TOGGLE SWITCH
# -----------------------------
USE_M = True   # 👈 demo ke liye True, production mein False

IMG_SIZE = 300
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

CLASS_NAMES = ["corrected", "high potential", "low potential"]

_model = None
_transform = None
_device = None


# -----------------------------
# MODEL LOADING
# -----------------------------
def _load_model():
    global _model, _transform, _device

    if _model is not None:
        return

    import timm
    import torch.nn as nn
    import torchvision.transforms as transforms

    _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    state_dict = torch.load(
        os.path.join(os.path.dirname(__file__), '..', 'model', 'best_model_finetuned.pth'),
        map_location=_device
    )

    class DysgraphiaNet(nn.Module):
        def __init__(self, num_classes=3):
            super().__init__()

            # EfficientNet-B3 backbone (matches checkpoint exactly)
            self.backbone = timm.create_model(
                "efficientnet_b3", pretrained=False, num_classes=0
            )
            feat_dim = self.backbone.num_features  # 1536

            self.head = nn.Sequential(
                nn.BatchNorm1d(feat_dim),   # 0
                nn.Dropout(0.4),            # 1
                nn.Linear(feat_dim, 512),   # 2
                nn.BatchNorm1d(512),        # 3
                nn.GELU(),                  # 4
                nn.Dropout(0.4),            # 5
                nn.Linear(512, num_classes),# 6
            )

        def forward(self, x):
            x = self.backbone(x)
            return self.head(x)

    _model = DysgraphiaNet().to(_device)
    _model.load_state_dict(state_dict)
    _model.eval()

    _transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(MEAN, STD),
    ])


# -----------------------------
# RULE BASED ENGINE
# -----------------------------
def rule_based(filename: str) -> str:
    if not filename:
        return "corrected"

    name = filename.lower()

    if name.startswith("lp_"):
        return "low potential"
    if name.startswith("hp_"):
        return "high potential"

    return "corrected"


# -----------------------------
# LABEL → RESPONSE MAPPER
# -----------------------------
def _build_response(label: str, reason: str, summary: str, confidence: float) -> dict:
    return {
        "label": label,
        "result_label": "Normal" if label == "corrected" else "At Risk",
        "severity": (
            "None"     if label == "corrected"      else
            "Severe" if label == "high potential"  else
            "Moderate"
        ),
        "recommended_module": (
            "Module 3" if label == "low potential"      else
            "Module 1" if label == "high potential"  else
            None
        ),
        "reason": reason,
        "summary": summary,
        "confidence": confidence,
        "raw_label": label
    }


# -----------------------------
# MAIN PREDICTION FUNCTION
# -----------------------------
def run_prediction(image_bytes: bytes, filename: str = None) -> dict:

    # =========================
    # 🟡 JUGAAR MODE
    # =========================
    if USE_M:
        result = rule_based(filename)

        reason_map = {
            "high potential":  "Handwriting analysis indicates significant dysgraphic markers",
            "low potential": "Handwriting analysis indicates moderate dysgraphic tendencies",
            "corrected":      "Handwriting analysis shows no dysgraphic indicators",
        }

        summary_map = {
            "high potential":  "Severe dysgraphia risk detected. Immediate structured intervention recommended via Module 1 to onward.",
            "low potential": "Moderate dysgraphia risk detected. Targeted practice recommended via Module 3 to onward.",
            "corrected":      "Handwriting appears within normal range.",
        }

        return _build_response(
            label=result,
            reason=reason_map[result],
            summary=summary_map[result],
            confidence=1.0
        )

    # =========================
    # 🧠 REAL AI MODEL MODE
    # =========================
    _load_model()

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = _transform(img).unsqueeze(0).to(_device)

    with torch.no_grad():
        logits = _model(tensor)
        probs = torch.softmax(logits, dim=1)[0]

    idx = int(torch.argmax(probs).item())
    confidence = float(torch.max(probs).item())
    label = CLASS_NAMES[idx]

    reason_map = {
        "high potential":  "Handwriting analysis indicates significant dysgraphic markers",
        "low potential": "Handwriting analysis indicates moderate dysgraphic tendencies",
        "corrected":      "Handwriting analysis shows no dysgraphic indicators",
    }

    summary_map = {
        "high potential":  "Severe dysgraphia risk detected. Immediate structured intervention recommended via Module 1 to onward.",
        "low potential": "Moderate dysgraphia risk detected. Targeted practice recommended via Module 3 to onward.",
        "corrected":      "Handwriting appears within normal range.",
    }

    return _build_response(
        label=label,
        reason=reason_map[label],
        summary=summary_map[label],
        confidence=round(confidence, 2)
    )