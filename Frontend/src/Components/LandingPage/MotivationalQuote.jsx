import React from "react";
import "./HeroNav.css";
import mainImage from "../../assets/Quote_1.jpeg";
import SmallImage from "../../assets/Quote_2.jpeg";

const MotivationalQuote = () => {
  return (
    <section id="motivation" className="quote-section">
      <div className="quote-wrapper">

          {/* LEFT IMAGES */}
         <div className="col-lg-6 position-relative"  data-aos="zoom-out"
  data-aos-delay="200">
           <img
              src= {mainImage}
              className="img-fluid rounded shadow main-img fade-in"
              alt="main-img"
               data-aos="zoom-in-up"
    data-aos-delay="400"
            />

            <img
              src= {SmallImage}
              className="img-fluid rounded small-img float-anim shadow"
              alt="small-img"
                data-aos="slide-left"
    data-aos-delay="700"
            />
          </div>

        {/* Right Quote */}
        <div className="quote-content"   data-aos="fade-up"
  data-aos-delay="500">
          <h5  data-aos="zoom-in" data-aos-delay="700">“Diagnose Early, Support Effectively”</h5>
          <p data-aos="fade-up" data-aos-delay="900">
            Struggles in writing don't define a child's intelligence  they show where support can begin , with guidance and encouragement, every challenge becomes an opportunity to grow and shine.
            </p>
          {/* <a href="#contact" className="quote-btn">Learn More</a> */}
        </div>

      </div>
    </section>
  );
};

export default MotivationalQuote;