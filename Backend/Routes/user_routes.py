
from flask import Blueprint, request, jsonify
from utils.auth import token_required
import bcrypt
from datetime import datetime

user_bp = Blueprint("user_bp", __name__)

def init_user_routes(app, users):
    @user_bp.route("/api/user/update", methods=["PUT"])
    @token_required(users)
    def update_profile(current_user):
        try:
            data = request.json
            if not data:
                return jsonify({"code": 400, "message": "Invalid JSON body"}), 400

            update_fields = {}

            if "name" in data:
                update_fields["name"] = data["name"]
            if "password" in data and data["password"]:
                 if "old_password" not in data or not data["old_password"]:
                        return jsonify({
                            "code": 400,
                            "message": "Old password is required"
                }), 400

            # Fetch latest user from DB
            user = users.find_one({"user_id": current_user["user_id"]})

            if not bcrypt.checkpw(
                data["old_password"].encode("utf-8"),
                user["password"].encode("utf-8")
            ):
                return jsonify({
                    "code": 400,
                    "message": "Old password is incorrect"
                }), 400

            # Hash new password
            hashed_pw = bcrypt.hashpw(
                data["password"].encode("utf-8"),
                bcrypt.gensalt()
            )

            update_fields["password"] = hashed_pw.decode("utf-8")
            if "age" in data:
                update_fields["age"] = data["age"]
            if "address" in data:
                update_fields["address"] = data["address"]
            if "gender" in data:
                update_fields["gender"] = data["gender"]

            if not update_fields:
                return jsonify({"code": 400, "message": "No fields to update"}), 400

            update_fields["updated_at"] = datetime.utcnow()

            users.update_one(
                {"user_id": current_user["user_id"]},
                {"$set": update_fields}
            )

            updated_user = users.find_one({"user_id": current_user["user_id"]})  # hide password

            updated_user.pop("_id", None)  # remove _id
            if "created_at" in updated_user:
                updated_user["created_at"] = updated_user["created_at"].isoformat()
            if "updated_at" in updated_user:
                updated_user["updated_at"] = updated_user["updated_at"].isoformat()
            updated_user.pop("password", None)  # never return password

            return jsonify({
                "code": 200,
                "message": "Profile updated successfully",
                "object": updated_user
            }), 200

        except Exception as e:
            return jsonify({
                "code": 500,
                "message": "Internal Server Error",
                "error": str(e)
            }), 500

    app.register_blueprint(user_bp)