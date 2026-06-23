# import datetime
# import cv2
# import numpy as np

# from flask import Blueprint, request
# from bson.binary import Binary

# from utils.auth import token_required
# from utils.id_generator import get_next_sequence

# upload_bp = Blueprint("upload_bp", __name__)

# # Allowed image formats
# ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp", "webp"}


# def allowed_file(filename):
#     return (
#         "." in filename and
#         filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
#     )


# def init_upload_routes(app, db, users):

#     samples = db["samples"]

#     @upload_bp.route("/api/handwriting/upload", methods=["POST"])
#     @token_required(users)
#     def upload_handwriting(current_user):

#         # Check if image exists
#         if "image" not in request.files:
#             return {
#                 "code": 400,
#                 "message": "No image provided"
#             }, 400

#         file = request.files["image"]

#         # Check filename
#         if file.filename == "":
#             return {
#                 "code": 400,
#                 "message": "No file selected"
#             }, 400

#         # Validate extension
#         if not allowed_file(file.filename):
#             return {
#                 "code": 400,
#                 "message": "Only image files are allowed (PNG, JPG, JPEG, GIF, BMP, WEBP)"
#             }, 400

#         try:
#             # Read image bytes
#             file_data = file.read()

#             if not file_data:
#                 return {
#                     "code": 400,
#                     "message": "Uploaded image is empty"
#                 }, 400

#             # Convert bytes to OpenCV image
#             image_array = np.frombuffer(file_data, np.uint8)
#             image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

#             # Validate image content
#             if image is None:
#                 return {
#                     "code": 400,
#                     "message": "Invalid image file"
#                 }, 400

#             # Convert to grayscale
#             gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#             # =========================
#             # Blur Detection
#             # =========================
#             blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()

#             if blur_score < 100:
#                 return {
#                     "code": 400,
#                     "message": "Image quality too poor. Please upload a clearer image."
#                 }, 400

#             # =========================
#             # Low-Light Detection
#             # =========================
#             brightness = gray.mean()

#             if brightness < 50:
#                 return {
#                     "code": 400,
#                     "message": "Image is too dark. Please upload a well-lit image."
#                 }, 400

#             # Generate Sample ID
#             sample_id = get_next_sequence(db, "sample_id")

#             # Save in MongoDB
#             sample_data = {
#                 "sample_id": sample_id,
#                 "user_id": current_user["user_id"],
#                 "image_data": Binary(file_data),
#                 "image_filename": file.filename,
#                 "created_at": datetime.datetime.utcnow()
#             }

#             samples.insert_one(sample_data)

#             return {
#                 "code": 200,
#                 "message": "Image uploaded successfully",
#                 "object": {
#                     "sample_id": sample_id
#                 }
#             }, 200

#         except Exception as e:
#             return {
#                 "code": 500,
#                 "message": f"Upload failed: {str(e)}"
#             }, 500

#     app.register_blueprint(upload_bp)

import datetime

from flask import Blueprint, request
from bson.binary import Binary

from utils.auth import token_required
from utils.id_generator import get_next_sequence

upload_bp = Blueprint("upload_bp", __name__)

# Allowed image formats
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp", "webp"}


def allowed_file(filename):
    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def init_upload_routes(app, db, users):

    samples = db["samples"]

    @upload_bp.route("/api/handwriting/upload", methods=["POST"])
    @token_required(users)
    def upload_handwriting(current_user):

        # Check if image exists
        if "image" not in request.files:
            return {
                "code": 400,
                "message": "No image provided"
            }, 400

        file = request.files["image"]

        # Check filename
        if file.filename == "":
            return {
                "code": 400,
                "message": "No file selected"
            }, 400

        # Validate extension
        if not allowed_file(file.filename):
            return {
                "code": 400,
                "message": "Only image files are allowed (PNG, JPG, JPEG, GIF, BMP, WEBP)"
            }, 400

        try:
            # Read image bytes
            file_data = file.read()

            if not file_data:
                return {
                    "code": 400,
                    "message": "Uploaded image is empty"
                }, 400

            # Generate Sample ID
            sample_id = get_next_sequence(db, "sample_id")

            # Save in MongoDB
            sample_data = {
                "sample_id": sample_id,
                "user_id": current_user["user_id"],
                "image_data": Binary(file_data),
                "image_filename": file.filename,
                "created_at": datetime.datetime.utcnow()
            }

            samples.insert_one(sample_data)

            return {
                "code": 200,
                "message": "Image uploaded successfully",
                "object": {
                    "sample_id": sample_id
                }
            }, 200

        except Exception as e:
            return {
                "code": 500,
                "message": f"Upload failed: {str(e)}"
            }, 500

    app.register_blueprint(upload_bp)