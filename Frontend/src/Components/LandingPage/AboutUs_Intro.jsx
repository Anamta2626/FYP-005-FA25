import { useState } from "react";
import "./AboutUs.css";
import javeriaImg from "../../assets/javeria.jpeg";
import anamtaImg from "../../assets/Anamta.jpeg";
import hussainImg from "../../assets/Hussain.jpeg";
import groupImg from "../../assets/Group Picture.jpeg"

const supervisor = {
  name: "Sir Dr. Umer Farooq",
  role: "Project Supervisor",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
  bio: "Dr. Umer Farooq is a dedicated academician and researcher with a PhD in Computer Science and more than 15 years of experience in higher education, teaching, and research. He is currently serving in the Department of Computing at Hamdard University, with expertise in Artificial Intelligence, Machine Learning, Computer Vision, Cloud Computing, and Explainable AI. Dr. Farooq has published numerous research articles in internationally recognized journals and conferences, supervised research projects in deep learning and data analytics, and actively contributed to academic leadership through editorial, research, and conference management roles. His work reflects a strong commitment to innovation, academic excellence, and the advancement of computing research.",
};
const consultant = {
  name: "Dr. [Consultant Name]",
  role: "Psychologist Consultant",
  image: "https://randomuser.me/api/portraits/women/45.jpg",
  bio: "Dr. [Consultant Name] is a licensed clinical psychologist with extensive experience in learning disabilities and developmental assessments. She specializes in evaluating cognitive and behavioral patterns related to dysgraphia and other learning difficulties. Her clinical insight helped shape the assessment criteria and exercise recommendations used in this system, ensuring the platform's psychological foundation is both evidence-based and practically effective for patients of all ages.",
};

const members = [
  {
    name: "Javeria Asif",
    role: "Full Stack Developer",
    image: javeriaImg,
    bio: "My name is Javeria Asif, and I am currently pursuing my Bachelor's degree in Software Engineering from Hamdard University, where I am in my final semester. Alongside my academic journey, I am also working professionally in the field of mobile application development, gaining practical industry experience and enhancing my technical expertise. /n Currently, I am working on a Dysgraphia-related AI project that focuses on utilizing technology to support individuals with learning and writing difficulties. Through this project, I aim to contribute toward creating accessible and intelligent solutions that can positively impact education and healthcare sectors. /n I am passionate about continuous learning, research, and developing technology-driven solutions that create meaningful change in society.",
  },
  {
    name: "Anamta Sajid Ali",
    role: "AI Enginneer",
    image: anamtaImg,
    bio: "I am Anamta Sajid Ali, a BS Computer Science student with a strong interest in Artificial Intelligence and innovative technology solutions. As an aspiring AI Engineer, I am passionate about developing intelligent systems that solve real-world problems and improve user experiences. My expertise includes Python, Machine Learning, and Web Development, which I have utilized in various academic and project-based applications. In our AI-Based System to Diagnose Dysgraphia project, I contributed to building smart and user-focused solutions aimed at supporting individuals with handwriting difficulties. I am dedicated to continuous learning and enhancing my technical skills to create impactful AI-driven applications in the future.",
  },
  {
    name: "Hussain Ali Khatri",
    role: "Researcher",
    image: hussainImg,
    bio: "I am Hussain Ali Khatri, a BS Computer Science student with a keen interest in technology, research, and problem-solving. In our AI-Based System to Diagnose Dysgraphia project, I contributed to research activities, data collection, and analytical tasks that supported the development process of the system. I also have knowledge of Python and its applications in academic and technical projects. My future goal is to build a career in the field of Networking and continuously enhance my technical expertise through learning and practical experience. I am passionate about exploring innovative solutions and contributing effectively to team-based projects.",
  },
];

const PREVIEW_WORDS = 20;

function BioCard({ name, role, image, bio, large, onImageClick }) {
  const [expanded, setExpanded] = useState(false);
  const words = bio.split(" ");
  const isLong = words.length > PREVIEW_WORDS;
  const preview = words.slice(0, PREVIEW_WORDS).join(" ") + (isLong ? "..." : "");

  return (
    <div className={`bio-card ${large ? "large" : "small"}`}>
      <img
        src={image}
        alt={name}
        className="bio-card-photo"
        onClick={() => onImageClick(image, name)}
      />
      <div className="bio-card-body">
        <p className="bio-card-name">{name}</p>
        <p className="bio-card-role">{role}</p>
        <p className="bio-card-bio">
          {expanded || !isLong ? bio : preview}
        </p>
        {isLong && (
          <button
            className="bio-card-toggle"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "See less ▲" : "See more ▼"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AboutUs_Intro() {
  const [zoomImage, setZoomImage] = useState(null);

  const handleImageClick = (src, name) => {
    setZoomImage({ src, name });
  };

  const closeZoom = () => setZoomImage(null);

  return (
    <div className="about-page">

      {/* HERO BANNER */}
      <div className="hero">
        <img
          src={groupImg}
          alt="Team background"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>About Us</h1>
          <p>Telling our inspiring story from the very beginning to our days</p>
        </div>
      </div>

      {/* SUPERVISOR SECTION */}
      <div className="supervisor-section">
        <h2>OUR SUPERVISOR</h2>
        <div className="supervisor-wrapper">
          <BioCard {...supervisor} large onImageClick={handleImageClick} />
        </div>
      </div>

      {/* CONSULTANT SECTION */}
      <div className="consultant-section">
        <h2>OUR CONSULTANT</h2>
        <div className="supervisor-wrapper">
          <BioCard {...consultant} large onImageClick={handleImageClick} />
        </div>
      </div>

      {/* GROUP MEMBERS SECTION */}
      <div className="members-section">
        <h2>GROUP MEMBERS</h2>
        <div className="members-grid">
          {members.map((m) => (
            <BioCard key={m.name} {...m} onImageClick={handleImageClick} />
          ))}
        </div>
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {zoomImage && (
        <div className="image-zoom-overlay" onClick={closeZoom}>
          <button className="image-zoom-close" onClick={closeZoom}>
            &times;
          </button>
          <img
            src={zoomImage.src}
            alt={zoomImage.name}
            className="image-zoom-content"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="image-zoom-caption">{zoomImage.name}</p>
        </div>
      )}

    </div>
  );
}