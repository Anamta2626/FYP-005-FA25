
import "./HeroNav.css";
import image from "../../assets/services_1.jpeg";
import image1 from "../../assets/Testimonials_1.jpeg";
import image2 from "../../assets/Hero_Image.jpeg";
const servicesData = [
  {
    title: "AI-Based Dysgraphia Diagnosis",
    desc: "AI and deep learning powered handwriting analysis to detect dysgraphia and its severity level.",
    img:  image2,
    icon: "bi bi-robot",
    delay: "delay-1",
  },
  {
    title: "Handwriting Analysis & Reports",
    desc: "Automated PDF reports with handwriting insights, performance graphs, and diagnostic summaries.",
    img: image,
    icon: "bi bi-file-earmark-text",
    delay: "delay-2",
  },
  {
    title: "Personalized Writing Exercises",
    desc: "AI-recommended tracing sheets and handwriting exercises based on individual dysgraphia level.",
    img: image1,
    icon: "bi bi-pencil-square",
    delay: "delay-3",
  },
];


const ServicesSection = () => {


  return (
    <section id="services" className="services-section py-5">
      <div className="container">
        <h2 className="text-center text-white fw-bold mb-5">
          Our Demanding Services
        </h2>

        <div className="row g-4">
          {servicesData.map((service, index) => (
            <div className="col-md-4" key={index} data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 300}>
              <div className={`service-card animate-card ${service.delay} p-4`}>
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>

                <img src={service.img} className="service-img" alt="service" />

                <h4 className="mt-4 fw-bold text-white">{service.title}</h4>
                <p className="text-white-50">{service.desc}</p>

                {/* <div className="arrow-btn">
                  <i className="bi bi-arrow-right"></i>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
