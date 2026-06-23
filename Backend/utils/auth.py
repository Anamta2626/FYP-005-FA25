import jwt
from functools import wraps
from bson import ObjectId
from flask import request
import os

SECRET_KEY = os.getenv("SECRET_KEY")

def token_required(users_collection):

    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):

            token = None

            if "Authorization" in request.headers:
                token = request.headers["Authorization"].split(" ")[1]

            if not token:
                return {"message": "Token missing"}, 401

            try:
                data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                current_user = users_collection.find_one({
                    "user_id": data["user_id"]
                })

                if not current_user:
                    return {"message": "User not found"}, 404
            except:
                return {"message": "Invalid token"}, 401

            return f(current_user, *args, **kwargs)

        return decorated
    return decorator