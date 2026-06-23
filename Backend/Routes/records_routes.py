# Routes/records_routes.py

from flask import Blueprint, jsonify
from utils.auth import token_required

records_bp = Blueprint("records_bp", __name__)


def init_records_routes(app, db, users):
    samples = db["samples"]

    @records_bp.route("/api/records/<int:user_id>", methods=["GET"])
    @token_required(users)
    def get_records(current_user, user_id):

        # 🔒 Ensure token user_id matches requested user_id
        if current_user["user_id"] != user_id:
            return jsonify({
                "code": 401,
                "message": "Unauthorized access"
            }), 401

        # 👤 Fetch user details
        user = users.find_one({"user_id": user_id})

        if not user:
            return jsonify({
                "code": 404,
                "message": "User not found"
            }), 404

        # 🔎 Fetch all samples for this user
        user_samples = list(samples.find({"user_id": user_id}))

        if not user_samples:
            return jsonify({
                "code": 404,
                "message": "No records found"
            }), 404

        # 📦 Format output
        records_list = []

        for sample in user_samples:
            records_list.append({
                "sample_id": sample.get("sample_id"),

                # User information
                "user_id": user.get("user_id"),
                "user_name": user.get("name", ""),  # change if field name is different

                # Sample information
                "image_url": sample.get("image_filename"),

                # Prediction result
                "label": sample.get("label"),
                "result_label": sample.get("result_label", "Pending"),
                "severity": sample.get("severity", "Pending"),

                # Analysis
                "reason": sample.get("reason", ""),
                "summary": sample.get("summary", ""),

                # Recommended module
                "recommended_module": sample.get("recommended_module", ""),

                # Date
                "created_at": (
                    sample["created_at"].isoformat()
                    if sample.get("created_at")
                    else None
                )
            })

        return jsonify({
            "code": 200,
            "message": "Records fetched successfully",
            "object": records_list
        }), 200

    app.register_blueprint(records_bp)