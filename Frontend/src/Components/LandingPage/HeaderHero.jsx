
import { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./HeaderHero.css";
import "./HeroNav.css"
import { Link } from "react-router-dom";
import logo from "../../assets/Dysgraphia Logo.png";

const HeaderHero = () => {

const lastScrollTop = useRef(0);

  useEffect(() => {
    const navbar = document.querySelector(".transparent-nav");

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop.current && scrollTop > 100) {
        // scrolling down → hide
        navbar.classList.add("hide-nav");
      } else {
        // scrolling up → show
        navbar.classList.remove("hide-nav");
      }

      lastScrollTop.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top transparent-nav">
        <div className="container" >
          <a className="navbar-brand fw-bold text-white" href="#home">
            <img
              src={logo}
              alt="ORTHOC Logo"
              style={{ height: "70px", width: "auto" }}
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav gap-3">
              <li className="nav-item">
                <a className="nav-link active text-white" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#about">About Us</a>
              </li>
                 <li className="nav-item">
                <a className="nav-link text-white" href="#services">Our Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#contact">Contact Us</a>
              </li>
              <li className="nav-item">
                <Link className="btn btn-light px-3 py-1 fw-semibold" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item"> 
                <Link className="btn btn-light ms-2 px-3 py-1 fw-semibold" to="/signup">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section d-flex align-items-center text-white" style={{ fontFamily: "'Times New Roman', serif" }}>
        <div className="container text-start">
          <h5 className="fw-semibold">AI-POWERED SOLUTION</h5>
          <h4 className="display-5 fw-bold mb-4" >EARLY DYSGRAPHIA DIAGNOSIS</h4>
          <p className="lead mb-4" style={{ maxWidth: "500px" }}>
           Our AI analyzes handwriting to detect dysgraphia early and suggest personalized improvement plans
          </p>
          <a href="#about" className="btn btn-light btn-lg fw-semibold px-4 py-2 Home-Btn">
            Read More
          </a>
        </div>
        <div className="hero-bottom-wave">
          <svg viewBox="0 0 1440 150" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path
              d="M0,120 C360,20 1080,180 1440,60 L1440,150 L0,150 Z"
              fill="#fff"
            ></path>
          </svg>
        </div>

        <div className="hero-bottom-wave">
          {/* <svg viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          
 <path d="
M0,0 
C200,0 500,200 900,100 
C1200,20 1440,150 1440,150 
L1440,200 L0,200 Z
" fill="#fff" /> 
          </svg> */}
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ width: "200%", height: "100%" }}>
            <path fill="#ffffff" fill-opacity="1" d="M0,64L34.3,85.3C68.6,107,137,149,206,149.3C274.3,149,343,107,411,101.3C480,96,549,128,617,133.3C685.7,139,754,117,823,106.7C891.4,96,960,96,1029,117.3C1097.1,139,1166,181,1234,213.3C1302.9,245,1371,267,1406,277.3L1440,288L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path></svg>
        </div>
      </section>

    </>
  );
};

export default HeaderHero;
