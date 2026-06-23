import React, { useEffect } from "react";
import "./HeroNav.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from 'react-router-dom';
import doctorImg from "../../assets/health-care.png";


export default function AboutUs() {
  useEffect(() => {
    AOS.init({
      once: true,      // animation sirf ek dafa
      duration: 1000,  // 1 second animation
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div id="about" className="about-wrapper">

      {/* SECTION 1 — TOP BANNER */}
      <div className="about-top-banner" data-aos="fade-down">
        <h1 className="about-top-title">About Us</h1>
      </div>

      {/* SECTION 2 — MAIN CONTAINER */}
      <div className="about-section">
        <div className="about-content">

          {/* LEFT */}
          <div className="about-left" data-aos="fade-right"
            data-aos-delay="200">
            <h1 className="about-main-title" data-aos="fade-up"
              data-aos-delay="300">
              We are building an AI system that empowers every child
            </h1>

            <p className="about-desc" data-aos="fade-up"
              data-aos-delay="500">
              At GraphCure, we believe every child deserves the chance to learn, write, and
              express themselves with confidence. Our team is dedicated to creating an
              intelligent, accessible, and ethical AI solution that identifies dysgraphia early
              and supports parents, teachers, and healthcare professionals with meaningful insights.

            </p>


            <Link to="/aboutUs">
              <button
                className="learn-btn"
                data-aos="zoom-in"
                data-aos-delay="700"
              >
                Learn More
              </button>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="about-right" data-aos="fade-left"
            data-aos-delay="400">
            <img src={doctorImg} className="doctor-img" alt="doctor" data-aos="zoom-in"
              data-aos-delay="600" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>

        </div>
      </div>

    </div>
  );
}

// export default function AboutUs() {
//   return (
//     <h1 style={{ color: "red", fontSize: "50px" }}>HELLO ABOUT US</h1>
//   );
// }
