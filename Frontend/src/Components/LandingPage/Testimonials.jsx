import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import heroImage from "../../assets/Testimonials_1.jpeg";

// Generate a consistent color based on the name (so same name = same color always)
const avatarColors = [
  "#F44336", "#E91E63", "#9C27B0", "#673AB7",
  "#3F51B5", "#2196F3", "#009688", "#4CAF50",
  "#FF9800", "#795548", "#607D8B"
];

const getColorFromName = (name = "") => {
  const charCode = name.charCodeAt(0) || 0;
  return avatarColors[charCode % avatarColors.length];
};

// Avatar component: shows image if available, otherwise first-letter circle
const Avatar = ({ name, img }) => {
  const hasValidImage = img && img.trim() !== "";

  if (hasValidImage) {
    return (
      <img
        src={img}
        className="rounded-circle mb-3"
        alt={name}
        width="90"
        height="90"
        style={{ objectFit: "cover" }}
      />
    );
  }

  const firstLetter = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className="rounded-circle mb-3 d-flex align-items-center justify-content-center mx-auto"
      style={{
        width: "90px",
        height: "90px",
        backgroundColor: getColorFromName(name),
        color: "#fff",
        fontSize: "36px",
        fontWeight: "bold",
      }}
    >
      {firstLetter}
    </div>
  );
};

const Testimonials = () => {
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}api/feedback`, { method: "GET" });
        const data = await res.json();

        if (data.code === 200) {
          // map backend fields to the shape this component expects
          const mapped = data.object.map((f) => ({
            img: f.img || "", // empty -> avatar fallback kicks in
            text: f.message || f.text || "",
            name: f.name || "Anonymous",
            role: f.role || "USER",
          }));
          setTestimonialsData(mapped);
        } else {
          setError(data.message || "Failed to load feedback");
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Group into chunks of 3 testimonials
  const chunked = [];
  for (let i = 0; i < testimonialsData.length; i += 3) {
    chunked.push(testimonialsData.slice(i, i + 3));
  }

  return (
    <section
      className="py-5"
      style={{
        background: `linear-gradient(
          rgba(0, 123, 255, 0.75), 
          rgba(0, 200, 200, 0.6)
        ), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
      }}
    >
      <div className="container text-center">
        {loading && <p>Loading feedback...</p>}
        {error && <p className="text-warning">{error}</p>}

        {!loading && !error && testimonialsData.length === 0 && (
          <p>No feedback available yet.</p>
        )}

        {!loading && !error && testimonialsData.length > 0 && (
          <div id="testimonialSlider" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {chunked.map((group, index) => (
                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                  <div className="row justify-content-center">
                    {group.map((t, i) => (
                      <div className="col-md-4 mb-4" data-aos="fade-up" key={i}>
                        <div className="testimonial-card p-4">
                          <Avatar name={t.name} img={t.img} />
                          <div className="quote-icon">❞</div>
                          <p className="mb-3">{t.text}</p>
                          <h6 className="fw-bold">{t.name}</h6>
                          <small>{t.role}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#testimonialSlider" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#testimonialSlider" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;