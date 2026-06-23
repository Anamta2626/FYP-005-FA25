import React, { useState } from "react";
import "./imageUpload.css";
import { useNavigate } from "react-router-dom";
import video from "../../../assets/Exercise_Video.mp4";

const PictureUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setSelectedFile(null);
  };

  const handleNext = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      if (!user) throw new Error("User not logged in");

      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch(`${API_URL}api/handwriting/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      console.log("Upload response:", data);

      if (res.ok && data.object?.sample_id) {
        localStorage.setItem("sample_id", data.object.sample_id);
        navigate("/dashboard/ResultPage");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="main-card">

        {/* LEFT */}
        <div className="inner-card left-card">
          <h2>INSTRUCTIONS</h2>

          <p>
            Please read the instructions carefully before uploading your image.
          </p>

          <ul>
            <li>
              The child must be 6 years of age or older to take this assessment.
            </li>

            <li>
              Use a pen or pencil that you normally use for writing.
            </li>

            <li>
              Write this sentence as it is on a blank page:
              "The quick brown fox jumps over a lazy dog. Bright birds fly above green trees and a small puppy runs to catch a yellow ball."
            </li>

            <li>
              Place the paper on a flat surface such as a table or desk.
            </li>

            <li>
              Write in your natural handwriting style.
            </li>

            <li>
              Do not erase or overwrite mistakes.
            </li>

            <li>
              Ensure the entire writing is clearly visible.
            </li>

            <li>
              Avoid shadows, blur, or low-quality images.
            </li>

            <li>
              Upload a clear photo or scanned image.
            </li>
          </ul>

          <video controls>
            <source src={video} type="video/mp4" />
          </video>
        </div>

        {/* RIGHT */}
        <div className="inner-card right-card">
          <h2>UPLOAD A PICTURE</h2>

          <div className="upload-wrapper">

            {!selectedFile && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            )}

            {selectedFile && (
              <div className="image-preview">

                <button
                  className="remove-btn"
                  onClick={handleRemoveImage}
                  type="button"
                >
                  ×
                </button>

                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                />

              </div>
            )}
          </div>

          <button
            disabled={!selectedFile || uploading}
            onClick={handleNext}
          >
            {uploading ? "Uploading..." : "Next"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PictureUpload;