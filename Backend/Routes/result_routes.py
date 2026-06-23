from fileinput import filename
from random import sample
from typing import override

from flask import Blueprint, jsonify
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import os

from utils.ai_predictor import run_prediction
from utils.auth import token_required

load_dotenv()

result_bp = Blueprint("result", __name__)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["dysgraphia_db"]
samples = db["samples"]


def init_result_routes(app, db, users):
    samples = db["samples"]

    @result_bp.route("/api/result/<int:sample_id>", methods=["GET"])
    @token_required(users)  # <-- pass users collection here
    def get_result(current_user, sample_id):

        # 🔎 Sample find karo
        sample = samples.find_one({
            "sample_id": sample_id,
            "user_id": current_user["user_id"]
        })

        if not sample:
            return jsonify({
                "code": 404,
                "message": "Sample not found"
                }), 404
        
        print("Sample ID:", sample_id)
        print("Existing Prediction:", sample.get("result_label"))
        print("Image Bytes:", len(sample.get("image_data", b"")))

        # ✅ Agar already prediction hai to wahi return karo
        if sample.get("result_label") is not None:
            return jsonify({
                "code": 200,
                "message": "fetch successfully",
                "object": {
                    "sample_id": sample["sample_id"],
                    "image_url": sample["image_filename"],  # adjust field
                    "label": sample.get("label"),
                    "result_label": sample["result_label"],
                    "severity": sample["severity"],
                    "reason": sample["reason"],
                    "summary": sample["summary"],
                    "recommended_module": sample["recommended_module"],
                    "created_at": sample["created_at"]
                }
            }), 200
        
        image_bytes = sample.get("image_data", b"")
        prediction = run_prediction(
        bytes(image_bytes),
        filename=sample.get("image_filename") or sample.get("image_url")
        )

        # 📝 DB me update karo
        samples.update_one(
            {"sample_id": sample_id},
            {
                "$set": {
                    "label": prediction["label"],
                    "result_label": prediction["result_label"],
                    "severity": prediction["severity"],
                    "reason": prediction["reason"],
                    "summary": prediction["summary"],
                    "recommended_module": prediction["recommended_module"]
                }
            }
        )

        # Use updated fields for return
        return jsonify({
             "code": 200,
             "message": "fetch successfully",
             "object": {
                "sample_id": sample["sample_id"],
                "image_url": sample["image_filename"],
                "label": prediction["label"],
                "result_label": prediction["result_label"],
                "severity": prediction["severity"],
                "reason": prediction["reason"],
                "summary": prediction["summary"],
                "recommended_module": prediction["recommended_module"],
                "created_at": sample["created_at"]
            }
        }), 200

    app.register_blueprint(result_bp)