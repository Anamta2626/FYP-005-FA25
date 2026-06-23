import React from "react";
import { jsPDF } from "jspdf";
import logo from "../../../assets/Dysgraphia Logo.png";

const GeneratePDF = ({ patientData }) => {
  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // 1️⃣ Add Logo (top-left)
    doc.addImage(logo, "PNG", 10, 10, 40, 20); // x, y, width, height

    // 2️⃣ Patient Heading
    const date = new Date().toLocaleDateString("en-PK", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    doc.setFontSize(16);
    doc.text(
      `Patient Name: ${patientData.name}   Age: ${patientData.age}   Date: ${date}`,
      60,
      20
    );

    doc.setFontSize(14);
    doc.text("Dysgraphia Report", 10, 50);

    // 3️⃣ Table / Info
    doc.setFontSize(12);
    const startY = 60;
    const lineHeight = 10;

    doc.text(`Dysgraphia: ${patientData.dysgraphia ? "Yes" : "No"}`, 10, startY);
    doc.text(`Reason: ${patientData.reason || "N/A"}`, 10, startY + lineHeight);
    doc.text(`Summary: ${patientData.summary || "N/A"}`, 10, startY + 2 * lineHeight);

    // 4️⃣ Save PDF
    doc.save(`${patientData.name}_Dysgraphia_Report.pdf`);
  };

  return (
    <button onClick={handleGeneratePDF}>
      Generate PDF
    </button>
  );
};

export default GeneratePDF;
