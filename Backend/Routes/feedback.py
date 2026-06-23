import datetime
from flask import Blueprint, app, app, request
from utils.auth import token_required
from utils.id_generator import get_next_sequence

feedback_bp = Blueprint("feedback_bp", __name__)

def init_feedback_routes(app, db, users):

    feedback_col = db["feedback"]

    @feedback_bp.route("/api/feedback", methods=["POST"])
    def submit_feedback():
        data = request.get_json()

        name    = data.get("name", "").strip()
        email   = data.get("email", "").strip()
        message = data.get("message", "").strip()

        if not name or not email or not message:
            return {
                "code": 400,
                "message": "All fields are required"
            }, 400

        feedback_id = get_next_sequence(db, "feedback_id")

        feedback_col.insert_one({
            "feedback_id": feedback_id,
            "name":        name,
            "email":       email,
            "message":     message,
            "created_at":  datetime.datetime.utcnow()
        })

        return {
            "code": 200,
            "message": "Feedback submitted successfully"
        }, 200
    
    @feedback_bp.route("/api/feedback", methods=["GET"])
    def get_feedback():
        feedbacks = list(feedback_col.find({}, {"_id": 0}))

        for f in feedbacks:
            if "created_at" in f:
                f["created_at"] = f["created_at"].strftime("%a, %d %b %Y %H:%M:%S GMT")

        return {
            "code": 200,
            "message": "Feedback fetched successfully",
            "object": feedbacks
        }, 200

    app.register_blueprint(feedback_bp)