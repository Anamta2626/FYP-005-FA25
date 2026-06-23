from flask import Flask, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS
import certifi
import ssl
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# from Routes.auth_routes import init_auth_routes
from Routes.upload_routes import init_upload_routes
from Routes.result_routes import result_bp
from Routes.result_routes import init_result_routes
from Routes.records_routes import init_records_routes
from Routes.modules_routes import init_modules_routes
from Routes.user_routes import init_user_routes
from Routes.imagesave_routes import init_image_routes 
from Routes.feedback import init_feedback_routes




# print("Certifi path:", certifi.where()) 


# Load .env
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
MONGO_URI = os.getenv("MONGO_URI")

# Initialize Flask app
app = Flask(__name__)
CORS(app)


# Try MongoDB connection
try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client['dysgraphia_db']  # correct indentation
    users = db["users"]
    client.admin.command('ping')  # check connection
    mongo_status = "MongoDB Connected Successfully "
except Exception as e:
    db = None
    mongo_status = f"MongoDB Connection Failed  : {e}"

# ---------------- Home route ---------------- #
@app.route("/")
def home():
    return jsonify({
        "message": "Backend Running Successfully ",
        "mongo_status": mongo_status
    })

# ----------------  Register Upload Routes  ---------------- #
init_upload_routes(app, db, users)

# ----------------  Result routes ---------------- #
init_result_routes(app, db, users)

# ----------------  Records routes ---------------- #
init_records_routes(app, db, users)

# ----------------  Modules routes ---------------- #
init_modules_routes(app, users, db) 

# ---------------- User routes ---------------- #
init_user_routes(app, users)

# ---------------- Image routes ---------------- #
init_image_routes(app, db, users)

# ---------------- Feedback routes ---------------- #
init_feedback_routes(app, db, users)

# ---------------- Register Blueprints ---------------- #
from Routes.auth_routes import auth_bp
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# ---------------- Run App ---------------- #
if __name__ == "__main__":
    app.run(debug=True)