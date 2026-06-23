from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import bcrypt
import jwt
from datetime import datetime, timedelta
from utils.id_generator import get_next_sequence

load_dotenv()

auth_bp = Blueprint("auth", __name__)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["dysgraphia_db"]
users = db["users"]

SECRET_KEY = os.getenv("SECRET_KEY")

@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        if not data:
            
            return jsonify({
                "code": 404,
                "message": "Invalid JSON body"
                
            }),400
        if users.find_one({"email": data.get("email")}):
             return jsonify({
                "code": 404,
                "message": "User already exists"
                
            }),400

        hashed_pw = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
        user_id = get_next_sequence(db, "user_id")
        user = {
            "user_id": user_id,
            "name": data.get("name"),
            "email": data.get("email"),
            "password": hashed_pw.decode("utf-8"),
            "age": data.get("age"),
            "address": data.get("address"),
            "gender": data.get("gender"),
            "created_at": datetime.utcnow()
        }

        users.insert_one(user)
        return jsonify({"code": 200,
            "message": "Signup successful",}), 201

    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json

        user = users.find_one({"email": data["email"]})
        if not user:
            return jsonify({
                "code": 404,
                "message": "User not found",
                "object": None
            }), 404

        print("Stored password:", user["password"])
        print("Type:", type(user["password"]))
        if not bcrypt.checkpw(data["password"].encode("utf-8"), user["password"].encode("utf-8")):
            return jsonify({"code": 401, "message": "Invalid password", "object": None}), 400
        

        token = jwt.encode({
            "user_id": user["user_id"] ,
            "exp": datetime.utcnow() + timedelta(hours=2)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "code": 200,
            "message": "Login successful",
            "object": {
                "user_id": user["user_id"],
                "name": user["name"],
                "email": user["email"],
                "age": user.get("age"),
                "address": user.get("address"),
                "gender": user.get("gender"),
                "token": token
            }
        }), 200

    except Exception as e:
        return jsonify({
            "code": 500,
            "message": "Internal Server Error",
            "object": None
        }), 500