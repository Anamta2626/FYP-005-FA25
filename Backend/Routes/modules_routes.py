# # routes/modules_routes.py
# from flask import Blueprint, jsonify, request, send_from_directory
# from utils.auth import token_required
# import copy
# import os
# from werkzeug.utils import secure_filename

# modules_bp = Blueprint("modules_bp", __name__)

# # PDF files ke liye upload folder
# PDF_UPLOAD_FOLDER = "uploads/pdfs"
# os.makedirs(PDF_UPLOAD_FOLDER, exist_ok=True)

# MODULES_DATA = [
#     {
#         "id": 1,
#         "name": "Module 1 — Fine Motor Development",
#         "description": "Hand strength · pencil grip · muscle memory · gross motor readiness",
#         "weakness_indicator": "Indicated when: the student's hand tires quickly, the pencil is held incorrectly, the arm is stiff, or strokes are shaky and inconsistent.",
#         "exercises": [
#             {
#                 "id": "ex_1_1",
#                 "name": "Gross Motor Warm-Up",
#                 "is_new": True,
#                 "description": "Cross-body movements — left hand to right knee, right hand to left knee, shoulder rolls. Performed for 5 minutes at the start of every session. Activates the cerebellum, the neurological root cause of dysgraphia. Research (Edmonson, 2022) confirms that completing gross motor activity before fine motor tasks significantly improves writing outcomes.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_1_2",
#                 "name": "Pencil Grip Training",
#                 "is_new": False,
#                 "description": "Learning the correct 3-finger tripod grip. Students with dysgraphia develop compensatory grips that fatigue the hand rapidly and worsen letter quality. A correct grip also naturally regulates pen pressure.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_1_3",
#                 "name": "Hand Strengthening — Resistance Exercises",
#                 "is_new": True,
#                 "description": "Therapy putty squeezing, finger pinching, and bead stringing. Occupational therapy research confirms that without strengthening the hand muscles, lasting improvement in letter formation cannot be achieved.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_1_4",
#                 "name": "Tracing on Lentils (Tactile Tracing)",
#                 "is_new": False,
#                 "description": "Drawing letter paths with a finger through lentils or sand. Engages tactile-proprioceptive feedback to build letter shape memory. Particularly effective for students with weak sensory-motor integration.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_1_5",
#                 "name": "Rolling and Tapping Activity",
#                 "is_new": False,
#                 "description": "Develops isolated finger movement and rhythmic motor control. Students who cannot control individual fingers produce letters with uneven pressure and inconsistent stroke weight throughout the page.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_1_6",
#                 "name": "Scrubbing Blank Page",
#                 "is_new": False,
#                 "description": "Free arm movement across a large surface to loosen forearm and shoulder muscles. Students with dysgraphia often write with a tense, rigid arm; this exercise builds the fluid arm movement required for fluent, effortless writing.",
#                 "video_url": None,
#                 "pdf_url": None
#             }
#         ]
#     },
#     {
#         "id": 2,
#         "name": "Module 2 — Stroke and Path Control",
#         "description": "Pen guidance · directional control · boundary awareness · motor accuracy",
#         "weakness_indicator": "Indicated when: lines tremble, letter strokes wander off course, or the student cannot stay within ruled lines or defined boundaries.",
#         "exercises": [
#             {
#                 "id": "ex_2_1",
#                 "name": "Line Tracing",
#                 "is_new": False,
#                 "description": "Following defined straight and curved paths. Improves stroke directionality and hand steadiness. Wandering or broken strokes are the primary indicator that this skill needs targeted practice.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_2_2",
#                 "name": "Shapes Tracing",
#                 "is_new": False,
#                 "description": "Tracing closed shapes — circles, squares, triangles. Since most letters are composed of basic geometric shapes, mastering shape paths directly transfers to improved letter quality and consistency.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_2_3",
#                 "name": "Scrubbing — Within Boundary",
#                 "is_new": False,
#                 "description": "Student scrubs freely but must stay within a bordered area. Builds internal boundary awareness — the core spatial skill needed for staying within ruled lines and letter boundaries while writing.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_2_4",
#                 "name": "Draw by Itself (Free Shape Drawing)",
#                 "is_new": False,
#                 "description": "Drawing basic shapes from memory without any guide. Tests whether motor memory has been internalized. Students who cannot reproduce shapes independently have not yet built the automatic motor programs required for fluent, effort-free writing.",
#                 "video_url": None,
#                 "pdf_url": None
#             }
#         ]
#     },
#     {
#         "id": 3,
#         "name": "Module 3 — Letter Formation and Orthographic Coding",
#         "description": "Letter shape memory · correct stroke sequence · size differentiation",
#         "weakness_indicator": "Indicated when: letters are poorly formed, incomplete, reversed, or the student confuses mirror-image pairs such as b/d or p/q.",
#         "exercises": [
#             {
#                 "id": "ex_3_1",
#                 "name": "2-Letter Tracing",
#                 "is_new": False,
#                 "description": "Practicing only two letters at a time to prevent cognitive overload. Students with dysgraphia cannot maintain attention on multiple letter forms simultaneously; paired practice allows deep, focused encoding of each letter's shape.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_3_2",
#                 "name": "Small (Lowercase) Alphabet Tracing",
#                 "is_new": False,
#                 "description": "Systematically building motor memory for all 26 lowercase letters. Lowercase letters are the most frequently written and the most consistently malformed in students with dysgraphia — making this the highest-priority letter practice.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_3_3",
#                 "name": "Capital Alphabet Tracing",
#                 "is_new": False,
#                 "description": "Learning uppercase letter forms and their distinct stroke sequences. Also introduces size differentiation — students with dysgraphia frequently write capitals and lowercase at the same height, which reduces overall text readability.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_3_4",
#                 "name": "Spy Letters Hunt (b/d, p/q)",
#                 "is_new": False,
#                 "description": "Targeting mirror-image letter confusion — one of the most persistent problems in dysgraphia. The student identifies and marks b vs d and p vs q within a mixed letter list. Builds perceptual discrimination so the brain stops substituting visually similar letter forms.",
#                 "video_url": None,
# "pdf_url": None
#             }
#         ]
#     },
#     {
#         "id": 4,
#         "name": "Module 4 — Visual-Cognitive Recognition",
#         "description": "Symbol-meaning connection · visual memory · perceptual discrimination",
#         "weakness_indicator": "Indicated when: the student cannot read back their own handwriting, cannot link written letters to meaning, or struggles to follow written instructions.",
#         "exercises": [
#             {
#                 "id": "ex_4_1",
#                 "name": "Picture to Picture Matching",
#                 "is_new": False,
#                 "description": "Trains visual discrimination and working memory — the student holds a visual form in mind and locates its match. Strengthens the visual attention skills needed to notice and self-correct letter malformation while writing.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_4_2",
#                 "name": "Picture to Word Matching",
#                 "is_new": False,
#                 "description": "Matching an image to its written word. Strengthens the visual-semantic link between printed letters and real-world meaning. Students with weak letter recognition often cannot accurately read back what they themselves have written.",
#                 "video_url": None,
#                 "pdf_url": None
#             }
#         ]
#     },
#     {
#         "id": 5,
#         "name": "Module 5 — Written Expression and Spatial Organisation",
#         "description": "Word spacing · independent writing · self-assessment · metacognition",
#         "weakness_indicator": "Indicated when: words are cramped or run together, page layout is disorganised, or the student cannot evaluate and correct their own writing.",
#         "exercises": [
#             {
#                 "id": "ex_5_1",
#                 "name": "Spacing Activity",
#                 "is_new": False,
#                 "description": "Learning correct gaps between letters and words using visual cues such as finger-width spacing. Students with dysgraphia frequently merge words or over-space letters — both errors reduce the readability of their written work.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_5_2",
#                 "name": "Sentence Copying",
#                 "is_new": False,
#                 "description": "Copying a model sentence while applying spacing, line alignment, and correct letter size simultaneously. Serves as the bridge between guided tracing and fully independent writing.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_5_3",
#                 "name": "Independent Writing",
#                 "is_new": True,
#                 "description": "The student writes freely in their own words — their name, something they saw today, a word they like — with no model or guide provided. This is the final stage of SRSD (Self-Regulated Strategy Development), the evidence-based framework recommended by the psychologist. It confirms that all learned skills have been fully internalized.",
#                 "video_url": None,
#                 "pdf_url": None
#             },
#             {
#                 "id": "ex_5_4",
#                 "name": "Self-Check Worksheet",
#                 "is_new": True,
#                 "description": "The student rates their own writing: Were letters formed correctly? Was there spacing between words? Did writing stay on the line? A star rating system can be used. Develops metacognition — the ability to independently identify and correct one's own mistakes, which is essential for long-term writing improvement.",
#                 "video_url": None,
#                 "pdf_url": None
#             }
#         ]
#     }
# ]


# def init_modules_routes(app, users, db):
#     exercise_videos = db["exercise_videos"]
#     exercise_pdfs = db["exercise_pdfs"]  # naya MongoDB collection

#     def attach_media(module_copy):
#         for exercise in module_copy["exercises"]:
#             video = exercise_videos.find_one({"exercise_id": exercise["id"]})
#             if video:
#                 exercise["video_url"] = video["video_url"]

#             pdf = exercise_pdfs.find_one({"exercise_id": exercise["id"]})
#             if pdf:
#                 exercise["pdf_url"] = pdf["pdf_url"]
#         return module_copy

#     @modules_bp.route("/api/modules", methods=["GET"])
#     @token_required(users)
#     def get_all_modules(current_user):
#         modules_with_media = copy.deepcopy(MODULES_DATA)
#         for module in modules_with_media:
#             attach_media(module)

#         return jsonify({
#             "code": 200,
#             "message": "Modules fetched successfully",
#             "total_modules": len(modules_with_media),
#             "modules": modules_with_media
#         }), 200

#     @modules_bp.route("/api/modules/<int:module_id>", methods=["GET"])
#     @token_required(users)
#     def get_module(current_user, module_id):
#         module = next((m for m in MODULES_DATA if m["id"] == module_id), None)
#         if not module:
#             return jsonify({"message": f"Module {module_id} not found"}), 404

#         module_copy = copy.deepcopy(module)
#         attach_media(module_copy)

#         return jsonify({
#             "code": 200,
#             "message": "Module fetched successfully",
#             "module": module_copy
#         }), 200

#     @modules_bp.route("/api/admin/exercises/<exercise_id>/video", methods=["POST"])
#     @token_required(users)
#     def upload_exercise_video(current_user, exercise_id):
#         data = request.get_json()
#         if not data or "video_url" not in data:
#             return jsonify({"message": "video_url is required"}), 400

#         video_url = data["video_url"].strip()

#         exercise_exists = any(
#             ex["id"] == exercise_id
#             for module in MODULES_DATA
#             for ex in module["exercises"]
#         )
#         if not exercise_exists:
#             return jsonify({"message": f"Exercise '{exercise_id}' not found"}), 404

#         exercise_videos.update_one(
#             {"exercise_id": exercise_id},
#             {"$set": {"video_url": video_url}},
#             upsert=True
#         )

#         return jsonify({
#             "code": 200,
#             "message": "Video URL saved successfully",
#             "exercise_id": exercise_id,
#             "video_url": video_url
#         }), 200

#     # NAYA ROUTE — PDF file upload (multipart/form-data)
#     @modules_bp.route("/api/admin/exercises/<exercise_id>/pdf", methods=["POST"])
#     @token_required(users)
#     def upload_exercise_pdf(current_user, exercise_id):
#         exercise_exists = any(
#             ex["id"] == exercise_id
#             for module in MODULES_DATA
#             for ex in module["exercises"]
#         )
#         if not exercise_exists:
#             return jsonify({"message": f"Exercise '{exercise_id}' not found"}), 404

#         if "pdf" not in request.files:
#             return jsonify({"message": "No PDF file part named 'pdf' found"}), 400

#         file = request.files["pdf"]

#         if file.filename == "":
#             return jsonify({"message": "No file selected"}), 400

#         if not file.filename.lower().endswith(".pdf"):
#             return jsonify({"message": "Only PDF files are allowed"}), 400

#         filename = secure_filename(f"{exercise_id}_{file.filename}")
#         filepath = os.path.join(PDF_UPLOAD_FOLDER, filename)
#         file.save(filepath)

#         # Accessible URL jo frontend use karega
#         pdf_url = f"/api/pdfs/{filename}"

#         exercise_pdfs.update_one(
#             {"exercise_id": exercise_id},
#             {"$set": {"pdf_url": pdf_url, "filename": filename}},
#             upsert=True
#         )

#         return jsonify({
#             "code": 200,
#             "message": "PDF uploaded successfully",
#             "exercise_id": exercise_id,
#             "pdf_url": pdf_url
#         }), 200

#     # PDF serve karne ka route
#     @modules_bp.route("/api/pdfs/<filename>", methods=["GET"])
#     def serve_pdf(filename):
#         return send_from_directory(PDF_UPLOAD_FOLDER, filename, as_attachment=False)

#     @modules_bp.route("/api/admin/exercises/videos", methods=["GET"])
#     @token_required(users)
#     def get_all_videos(current_user):
#         videos = list(exercise_videos.find({}, {"_id": 0}))
#         return jsonify({
#             "code": 200,
#             "videos": videos
#         }), 200

#     app.register_blueprint(modules_bp)

from flask import Blueprint, jsonify, request, send_from_directory
from utils.auth import token_required
import copy
import os
from werkzeug.utils import secure_filename

modules_bp = Blueprint("modules_bp", __name__)

# -----------------------------
# MODULE DATA (unchanged)
# -----------------------------
MODULES_DATA = [
    {
        "id": 1,
        "name": "Module 1 — Fine Motor Development",
        "description": "Hand strength · pencil grip · muscle memory · gross motor readiness",
        "weakness_indicator": "Indicated when: the student's hand tires quickly, the pencil is held incorrectly, the arm is stiff, or strokes are shaky and inconsistent.",
        "exercises": [
            {
                "id": "ex_1_1",
                "name": "Gross Motor Warm-Up",
                "is_new": True,
                "description": "Cross-body movements — left hand to right knee, right hand to left knee, shoulder rolls. Performed for 5 minutes at the start of every session. Activates the cerebellum, the neurological root cause of dysgraphia. Research (Edmonson, 2022) confirms that completing gross motor activity before fine motor tasks significantly improves writing outcomes.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_1_2",
                "name": "Pencil Grip Training",
                "is_new": False,
                "description": "Learning the correct 3-finger tripod grip. Students with dysgraphia develop compensatory grips that fatigue the hand rapidly and worsen letter quality. A correct grip also naturally regulates pen pressure.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_1_3",
                "name": "Hand Strengthening — Resistance Exercises",
                "is_new": True,
                "description": "Therapy putty squeezing, finger pinching, and bead stringing. Occupational therapy research confirms that without strengthening the hand muscles, lasting improvement in letter formation cannot be achieved.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_1_4",
                "name": "Tracing on Lentils (Tactile Tracing)",
                "is_new": False,
                "description": "Drawing letter paths with a finger through lentils or sand. Engages tactile-proprioceptive feedback to build letter shape memory. Particularly effective for students with weak sensory-motor integration.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_1_5",
                "name": "Rolling and Tapping Activity",
                "is_new": False,
                "description": "Develops isolated finger movement and rhythmic motor control. Students who cannot control individual fingers produce letters with uneven pressure and inconsistent stroke weight throughout the page.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_1_6",
                "name": "Scrubbing Blank Page",
                "is_new": False,
                "description": "Free arm movement across a large surface to loosen forearm and shoulder muscles. Students with dysgraphia often write with a tense, rigid arm; this exercise builds the fluid arm movement required for fluent, effortless writing.",
                "video_url": None,
                "pdf_url": None
            }
        ]
    },
    {
        "id": 2,
        "name": "Module 2 — Stroke and Path Control",
        "description": "Pen guidance · directional control · boundary awareness · motor accuracy",
        "weakness_indicator": "Indicated when: lines tremble, letter strokes wander off course, or the student cannot stay within ruled lines or defined boundaries.",
        "exercises": [
            {
                "id": "ex_2_1",
                "name": "Line Tracing",
                "is_new": False,
                "description": "Following defined straight and curved paths. Improves stroke directionality and hand steadiness. Wandering or broken strokes are the primary indicator that this skill needs targeted practice.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_2_2",
                "name": "Shapes Tracing",
                "is_new": False,
                "description": "Tracing closed shapes — circles, squares, triangles. Since most letters are composed of basic geometric shapes, mastering shape paths directly transfers to improved letter quality and consistency.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_2_3",
                "name": "Scrubbing — Within Boundary",
                "is_new": False,
                "description": "Student scrubs freely but must stay within a bordered area. Builds internal boundary awareness — the core spatial skill needed for staying within ruled lines and letter boundaries while writing.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_2_4",
                "name": "Draw by Itself (Free Shape Drawing)",
                "is_new": False,
                "description": "Drawing basic shapes from memory without any guide. Tests whether motor memory has been internalized. Students who cannot reproduce shapes independently have not yet built the automatic motor programs required for fluent, effort-free writing.",
                "video_url": None,
                "pdf_url": None
            }
        ]
    },
    {
        "id": 3,
        "name": "Module 3 — Letter Formation and Orthographic Coding",
        "description": "Letter shape memory · correct stroke sequence · size differentiation",
        "weakness_indicator": "Indicated when: letters are poorly formed, incomplete, reversed, or the student confuses mirror-image pairs such as b/d or p/q.",
        "exercises": [
            {
                "id": "ex_3_1",
                "name": "2-Letter Tracing",
                "is_new": False,
                "description": "Practicing only two letters at a time to prevent cognitive overload. Students with dysgraphia cannot maintain attention on multiple letter forms simultaneously; paired practice allows deep, focused encoding of each letter's shape.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_3_2",
                "name": "Small (Lowercase) Alphabet Tracing",
                "is_new": False,
                "description": "Systematically building motor memory for all 26 lowercase letters. Lowercase letters are the most frequently written and the most consistently malformed in students with dysgraphia — making this the highest-priority letter practice.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_3_3",
                "name": "Capital Alphabet Tracing",
                "is_new": False,
                "description": "Learning uppercase letter forms and their distinct stroke sequences. Also introduces size differentiation — students with dysgraphia frequently write capitals and lowercase at the same height, which reduces overall text readability.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_3_4",
                "name": "Spy Letters Hunt (b/d, p/q)",
                "is_new": False,
                "description": "Targeting mirror-image letter confusion — one of the most persistent problems in dysgraphia. The student identifies and marks b vs d and p vs q within a mixed letter list. Builds perceptual discrimination so the brain stops substituting visually similar letter forms.",
                "video_url": None,
"pdf_url": None
            }
        ]
    },
    {
        "id": 4,
        "name": "Module 4 — Visual-Cognitive Recognition",
        "description": "Symbol-meaning connection · visual memory · perceptual discrimination",
        "weakness_indicator": "Indicated when: the student cannot read back their own handwriting, cannot link written letters to meaning, or struggles to follow written instructions.",
        "exercises": [
            {
                "id": "ex_4_1",
                "name": "Picture to Picture Matching",
                "is_new": False,
                "description": "Trains visual discrimination and working memory — the student holds a visual form in mind and locates its match. Strengthens the visual attention skills needed to notice and self-correct letter malformation while writing.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_4_2",
                "name": "Picture to Word Matching",
                "is_new": False,
                "description": "Matching an image to its written word. Strengthens the visual-semantic link between printed letters and real-world meaning. Students with weak letter recognition often cannot accurately read back what they themselves have written.",
                "video_url": None,
                "pdf_url": None
            }
        ]
    },
    {
        "id": 5,
        "name": "Module 5 — Written Expression and Spatial Organisation",
        "description": "Word spacing · independent writing · self-assessment · metacognition",
        "weakness_indicator": "Indicated when: words are cramped or run together, page layout is disorganised, or the student cannot evaluate and correct their own writing.",
        "exercises": [
            {
                "id": "ex_5_1",
                "name": "Spacing Activity",
                "is_new": False,
                "description": "Learning correct gaps between letters and words using visual cues such as finger-width spacing. Students with dysgraphia frequently merge words or over-space letters — both errors reduce the readability of their written work.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_5_2",
                "name": "Sentence Copying",
                "is_new": False,
                "description": "Copying a model sentence while applying spacing, line alignment, and correct letter size simultaneously. Serves as the bridge between guided tracing and fully independent writing.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_5_3",
                "name": "Independent Writing",
                "is_new": True,
                "description": "The student writes freely in their own words — their name, something they saw today, a word they like — with no model or guide provided. This is the final stage of SRSD (Self-Regulated Strategy Development), the evidence-based framework recommended by the psychologist. It confirms that all learned skills have been fully internalized.",
                "video_url": None,
                "pdf_url": None
            },
            {
                "id": "ex_5_4",
                "name": "Self-Check Worksheet",
                "is_new": True,
                "description": "The student rates their own writing: Were letters formed correctly? Was there spacing between words? Did writing stay on the line? A star rating system can be used. Develops metacognition — the ability to independently identify and correct one's own mistakes, which is essential for long-term writing improvement.",
                "video_url": None,
                "pdf_url": None
            }
        ]
    }
]

# -----------------------------
# UPLOAD FOLDERS
# -----------------------------
VIDEO_UPLOAD_FOLDER = "uploads/videos"
PDF_UPLOAD_FOLDER = "uploads/pdfs"

os.makedirs(VIDEO_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PDF_UPLOAD_FOLDER, exist_ok=True)


def init_modules_routes(app, users, db):
    exercise_videos = db["exercise_videos"]
    exercise_pdfs = db["exercise_pdfs"]

    # -----------------------------
    # helper: attach media
    # -----------------------------
    def attach_media(module_copy):
        for exercise in module_copy["exercises"]:
            video = exercise_videos.find_one({"exercise_id": exercise["id"]})
            if video:
                exercise["video_url"] = video["video_url"]

            pdf = exercise_pdfs.find_one({"exercise_id": exercise["id"]})
            if pdf:
                exercise["pdf_url"] = pdf["pdf_url"]

        return module_copy

    # -----------------------------
    # GET ALL MODULES
    # -----------------------------
    @modules_bp.route("/api/modules", methods=["GET"])
    @token_required(users)
    def get_all_modules(current_user):
        modules_with_media = copy.deepcopy(MODULES_DATA)

        for module in modules_with_media:
            attach_media(module)

        return jsonify({
            "code": 200,
            "message": "Modules fetched successfully",
            "total_modules": len(modules_with_media),
            "modules": modules_with_media
        }), 200

    # -----------------------------
    # GET SINGLE MODULE
    # -----------------------------
    @modules_bp.route("/api/modules/<int:module_id>", methods=["GET"])
    @token_required(users)
    def get_module(current_user, module_id):
        module = next((m for m in MODULES_DATA if m["id"] == module_id), None)

        if not module:
            return jsonify({"message": f"Module {module_id} not found"}), 404

        module_copy = copy.deepcopy(module)
        attach_media(module_copy)

        return jsonify({
            "code": 200,
            "message": "Module fetched successfully",
            "module": module_copy
        }), 200

    # -----------------------------
    # VIDEO UPLOAD (.mov supported)
    # -----------------------------
    @modules_bp.route("/api/admin/exercises/<exercise_id>/video", methods=["POST"])
    @token_required(users)
    def upload_exercise_video(current_user, exercise_id):

        exercise_exists = any(
            ex["id"] == exercise_id
            for module in MODULES_DATA
            for ex in module["exercises"]
        )

        if not exercise_exists:
            return jsonify({"message": f"Exercise '{exercise_id}' not found"}), 404

        # IMPORTANT: Postman key must be "video"
        if "video" not in request.files:
            return jsonify({"message": "No video file found (use key: video)"}), 400

        file = request.files["video"]

        if file.filename == "":
            return jsonify({"message": "No file selected"}), 400

        # allow video formats including .mov
        allowed_extensions = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
        file_ext = os.path.splitext(file.filename.lower())[1]

        if file_ext not in allowed_extensions:
            return jsonify({"message": "Only video files allowed"}), 400

        filename = secure_filename(f"{exercise_id}_{file.filename}")
        filepath = os.path.join(VIDEO_UPLOAD_FOLDER, filename)

        file.save(filepath)

        video_url = f"/api/videos/{filename}"

        exercise_videos.update_one(
            {"exercise_id": exercise_id},
            {"$set": {"video_url": video_url, "filename": filename}},
            upsert=True
        )

        return jsonify({
            "code": 200,
            "message": "Video uploaded successfully",
            "exercise_id": exercise_id,
            "video_url": video_url
        }), 200

    # -----------------------------
    # SERVE VIDEO FILE
    # -----------------------------
    @modules_bp.route("/api/videos/<filename>", methods=["GET"])
    def serve_video(filename):
        return send_from_directory(VIDEO_UPLOAD_FOLDER, filename, as_attachment=False)

    # -----------------------------
    # PDF UPLOAD (UNCHANGED LOGIC)
    # -----------------------------
    @modules_bp.route("/api/admin/exercises/<exercise_id>/pdf", methods=["POST"])
    @token_required(users)
    def upload_exercise_pdf(current_user, exercise_id):

        exercise_exists = any(
            ex["id"] == exercise_id
            for module in MODULES_DATA
            for ex in module["exercises"]
        )

        if not exercise_exists:
            return jsonify({"message": f"Exercise '{exercise_id}' not found"}), 404

        if "pdf" not in request.files:
            return jsonify({"message": "No PDF file part named 'pdf' found"}), 400

        file = request.files["pdf"]

        if file.filename == "":
            return jsonify({"message": "No file selected"}), 400

        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"message": "Only PDF allowed"}), 400

        filename = secure_filename(f"{exercise_id}_{file.filename}")
        filepath = os.path.join(PDF_UPLOAD_FOLDER, filename)

        file.save(filepath)

        pdf_url = f"/api/pdfs/{filename}"

        exercise_pdfs.update_one(
            {"exercise_id": exercise_id},
            {"$set": {"pdf_url": pdf_url, "filename": filename}},
            upsert=True
        )

        return jsonify({
            "code": 200,
            "message": "PDF uploaded successfully",
            "exercise_id": exercise_id,
            "pdf_url": pdf_url
        }), 200

    # -----------------------------
    # SERVE PDF
    # -----------------------------
    @modules_bp.route("/api/pdfs/<filename>", methods=["GET"])
    def serve_pdf(filename):
        return send_from_directory(PDF_UPLOAD_FOLDER, filename, as_attachment=False)

    # -----------------------------
    # GET ALL VIDEOS
    # -----------------------------
    @modules_bp.route("/api/admin/exercises/videos", methods=["GET"])
    @token_required(users)
    def get_all_videos(current_user):
        videos = list(exercise_videos.find({}, {"_id": 0}))
        return jsonify({
            "code": 200,
            "videos": videos
        }), 200

    # register blueprint
    app.register_blueprint(modules_bp)