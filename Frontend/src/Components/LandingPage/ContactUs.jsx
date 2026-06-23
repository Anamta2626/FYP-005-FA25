import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./HeroNav.css";
import { toast } from "react-toastify";

function ContactUs() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleFeedbackSubmit = async () => {
    const { name, email, message } = feedbackData;

    if (!name || !email || !message) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${API_URL}api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      const data = await res.json();

      if (data.code === 200) {
        toast.success("Feedback submitted successfully!");
        setFeedbackData({ name: "", email: "", message: "" });
        document.querySelector("#feedbackModal .btn-close").click();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <>
      {/* ===== Contact Hero Section ===== */}
      <div
        id="contact"
        className="text-white"
        style={{
          background: "linear-gradient(90deg, #c9f3ff 0%, #00bfff 50%, #c9f3ff 100%)",
          padding: "20px 0",
        }}
      >
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-start ContantUs">
          <div className="intro-text mb-3 mb-md-0">
            <h2>What are you waiting for?</h2>
            <p>We'd love to hear from you! Whether you have questions, feedback</p>
          </div>

          <div className="d-flex gap-3">
            <button
              className="btn btn-light px-4 py-1 flex-fill"
              style={{ color: "#00bfff" }}
            >
              Contact Us
            </button>

            <button
              className="btn btn-light px-4 py-1 flex-fill"
              style={{ color: "#00bfff" }}
              data-bs-toggle="modal"
              data-bs-target="#feedbackModal"
            >
              Feedback Us
            </button>
          </div>
        </div>
      </div>

      {/* ===== Feedback Modal ===== */}
      <div
        className="modal fade"
        id="feedbackModal"
        tabIndex="-1"
        aria-labelledby="feedbackModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title" id="feedbackModalLabel">Feedback</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Your name"
                    value={feedbackData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Your email"
                    value={feedbackData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="3"
                    placeholder="Your feedback"
                    value={feedbackData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFeedbackSubmit}
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ===== Main Contact Section ===== */}
      <div
        className="text-dark py-5"
        style={{ backgroundColor: "#f2f2f2", color: "#4d4d4d" }}
      >
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <i className="bi bi-envelope-fill" style={{ fontSize: "2rem" }}></i>
              <p className="mt-2">info@graphcure.com</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-telephone-fill" style={{ fontSize: "2rem" }}></i>
              <p className="mt-2">03112252860</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-geo-alt-fill" style={{ fontSize: "2rem" }}></i>
              <p className="mt-2">Hamdard University, Karachi, Pakistan</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Footer Bottom ===== */}
      <div className="text-dark py-5" style={{ backgroundColor: "#f2f2f2" }}>
        <p className="mb-0 text-center">© 2025 GraphCure. All Rights Reserved.</p>
      </div>
    </>
  );
}

export default ContactUs;