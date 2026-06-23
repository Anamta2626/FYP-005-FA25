from flask import Flask, Blueprint, send_file, abort
import io

records_bp = Blueprint('records', __name__)

def init_image_routes(app, db, users):
    samples = db["samples"]

    @records_bp.route("/image/<int:sample_id>", methods=["GET"])
    def get_image(sample_id):

        # Fetch sample by sample_id
        sample = samples.find_one({"sample_id": sample_id})

        if not sample or "image_data" not in sample:
            abort(404)

        img_data = sample["image_data"]  # binary image

        return send_file(
            io.BytesIO(img_data),
            mimetype="image/jpeg"
        )

    app.register_blueprint(records_bp)