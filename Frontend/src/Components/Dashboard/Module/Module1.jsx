import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import exerciseVideo from "../../../assets/Exercise 2 module 1.mp4";
import "./Module.css";

const Module1 = () => {
  const { moduleId, exerciseId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [moduleName, setModuleName]   = useState("");
  const [module, setModule]           = useState(null);
  const [exercise, setExercise]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  // Default to module 1 / exercise 1 if no params
  const currentModule   = Number(moduleId)   || 1;
  const currentExercise = Number(exerciseId) || 1;

  useEffect(() => {
    setLoading(true);
    setExercise(null);
    setError("");

    const token = localStorage.getItem("token");

    fetch(`${API_URL}api/modules`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          const foundModule = data.modules.find((m) => m.id === currentModule);

          if (!foundModule) {
            setError("Module not found");
            setLoading(false);
            return;
          }

          setModuleName(foundModule.name);
          setModule(foundModule);

          const foundExercise = foundModule.exercises[currentExercise - 1];
          if (!foundExercise) {
            setError("Exercise not found");
            setLoading(false);
            return;
          }

          setExercise(foundExercise);
        } else {
          setError("Failed to load module");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, [moduleId, exerciseId, API_URL]);

  const totalExercises = module?.exercises?.length || 0;
  const hasPrev = currentExercise > 1;
  const hasNext = currentExercise < totalExercises;

  if (loading) {
    return (
      <div className="video-page">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-page">
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div className="video-page">
      {/* Module Heading */}
      <h2 className="module-heading">{moduleName}</h2>

      {/* Exercise Nav */}
      <div className="exercise-nav">
        {module?.exercises.map((ex, idx) => (
          <button
            key={ex.id}
            className={`ex-nav-btn ${idx + 1 === currentExercise ? "active" : ""}`}
            onClick={() =>
              navigate(`/dashboard/module/${currentModule}/exercise/${idx + 1}`)
            }
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Exercise Detail */}
      <div className="exercise-section">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3>
            Exercise {currentExercise}: {exercise.name}
          </h3>
          {exercise.is_new && (
            <span className="new-badge">NEW</span>
          )}
        </div>
        <p className="exercise-desc">{exercise.description}</p>
      </div>

      {/* Video Section
      <div className="video-card">
        <h3>Exercise Video</h3>

        {exercise.video_url ? (
          <video
            className="video-player"
            controls
            width="100%"
          >
            <source
              src={`${API_URL.replace(/\/$/, "")}${exercise.video_url}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="no-video">
            No video available for this exercise.
          </div>
        )}
      </div> */}

      <div className="video-card">
        <h3>Exercise Video</h3>

        <video className="video-player" controls width="100%">
          <source src={exerciseVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* PDF Section */}
      <div className="pdf-section">
        <h3>Exercise PDF</h3>
        {exercise.pdf_url ? (
          <a
            href={`${API_URL.replace(/\/$/, "")}${exercise.pdf_url}`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="download-btn"
          >
            Download PDF
          </a>
        ) : (
          <div className="no-pdf">No PDF available for this exercise.</div>
        )}
      </div>

      {/* Prev / Next Navigation */}
      <div className="exercise-pagination">
        <button
          className="primary-btn"
          disabled={!hasPrev}
          onClick={() =>
            navigate(
              `/dashboard/module/${currentModule}/exercise/${currentExercise - 1}`
            )
          }
        >
          ← Previous
        </button>

        <span className="page-info">
          {currentExercise} / {totalExercises}
        </span>

        <button
          className="primary-btn"
          disabled={!hasNext}
          onClick={() =>
            navigate(
              `/dashboard/module/${currentModule}/exercise/${currentExercise + 1}`
            )
          }
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Module1;
