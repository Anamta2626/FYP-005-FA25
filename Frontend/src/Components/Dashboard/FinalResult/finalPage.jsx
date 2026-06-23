// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { jsPDF } from "jspdf";
// import logo from "../../../assets/Dysgraphia Logo.png";
// import "./finalResult.css";

// const ResultPage = () => {
//   const navigate = useNavigate();

//   const storedUser = JSON.parse(localStorage.getItem("userData"));
//   const patientName = storedUser?.name || storedUser?.fullName || "Unknown";
//   const age = storedUser?.age || "N/A";

//   const [result, setResult] = useState(null);
//   const API_URL = import.meta.env.VITE_API_URL;
//   const sampleId = localStorage.getItem("sample_id");

//   // ─── Severity badge color ───────────────────────────────────────────────────
//   const severityColor = (severity) => {
//     if (severity === "None")     return { background: "#d4edda", color: "#155724" };
//     if (severity === "Moderate") return { background: "#fff3cd", color: "#856404" };
//     if (severity === "Severe")   return { background: "#f8d7da", color: "#721c24" };
//     return { background: "#e2e3e5", color: "#383d41" };
//   };

//   // ─── Module number extract ──────────────────────────────────────────────────
//   const moduleNumber = (recommended) => {
//     if (!recommended) return 1;
//     const match = recommended.match(/\d+/);
//     return match ? parseInt(match[0]) : 1;
//   };

//   // ─── PDF Generation ─────────────────────────────────────────────────────────
//   const generatePDF = (data) => {
//     const doc = new jsPDF();
//     const pageWidth  = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     let y = 15;

//     // Header
//     doc.setFillColor(83, 188, 248);
//     doc.rect(0, 0, pageWidth, 35, "F");
//     doc.addImage(logo, "PNG", 10, 5, 40, 25);

//     const currentDate = new Date().toLocaleDateString("en-PK", {
//       weekday: "long", year: "numeric", month: "long", day: "numeric",
//     });
//     doc.setFontSize(10);
//     doc.setTextColor(255, 255, 255);
//     doc.text(`Generated: ${currentDate}`, pageWidth - 10, 20, { align: "right" });
//     y = 45;

//     // Title
//     doc.setFontSize(18);
//     doc.setFont(undefined, "bold");
//     doc.setTextColor(0, 0, 0);
//     doc.text("Dysgraphia Assessment Report", pageWidth / 2, y, { align: "center" });
//     y += 12;

//     doc.setDrawColor(83, 188, 248);
//     doc.setLineWidth(0.5);
//     doc.line(15, y, pageWidth - 15, y);
//     y += 10;

//     // Patient Info
//     doc.setFillColor(240, 248, 255);
//     doc.rect(15, y, pageWidth - 30, 18, "F");
//     doc.setFontSize(11);
//     doc.setFont(undefined, "normal");
//     doc.setTextColor(0, 0, 0);
//     doc.text(`Name: ${data.name}`, 20, y + 7);
//     doc.text(`Age: ${data.age}`, pageWidth / 2, y + 7);
//     y += 24;

//     // Result + Severity on same row
//     const isDysgraphia = data.result_label === "Dysgraphia";
//     doc.setFillColor(isDysgraphia ? 255 : 220, isDysgraphia ? 220 : 255, 220);
//     doc.rect(15, y, pageWidth - 30, 12, "F");
//     doc.setFont(undefined, "bold");
//     doc.setFontSize(12);
//     doc.setTextColor(isDysgraphia ? 192 : 0, isDysgraphia ? 0 : 128, 0);
//     doc.text(
//       `Result: ${isDysgraphia ? "Dysgraphia Detected" : "No Dysgraphia"}`,
//       20, y + 8
//     );
//     y += 18;

//     // Severity
//     if (data.severity && data.severity !== "None") {
//       doc.setFont(undefined, "bold");
//       doc.setFontSize(11);
//       doc.setTextColor(0, 0, 0);
//       doc.text("Severity:", 15, y);
//       doc.setFont(undefined, "normal");
//       doc.setFontSize(11);
//       doc.setTextColor(133, 100, 4);
//       doc.text(data.severity, 40, y);
//       doc.setTextColor(0, 0, 0);
//       y += 10;
//     }

//     // Recommended Module
//     if (data.recommended_module) {
//       doc.setFont(undefined, "bold");
//       doc.setFontSize(11);
//       doc.setTextColor(0, 0, 0);
//       doc.text("Recommended Module:", 15, y);
//       doc.setFont(undefined, "normal");
//       doc.text(data.recommended_module, 70, y);
//       y += 10;
//     }

//     // AI Confidence
//     if (data.confidence !== undefined) {
//       doc.setFont(undefined, "bold");
//       doc.setFontSize(11);
//       doc.text("AI Confidence:", 15, y);
//       doc.setFont(undefined, "normal");
//       doc.text(`${data.confidence}%`, 55, y);
//       y += 12;
//     }

//     // Reason
//     doc.setFont(undefined, "bold");
//     doc.setFontSize(11);
//     doc.setTextColor(0, 0, 0);
//     doc.text("Reason:", 15, y);
//     y += 6;
//     doc.setFont(undefined, "normal");
//     doc.setFontSize(10);
//     const reasonText = doc.splitTextToSize(data.reason, pageWidth - 40);
//     doc.text(reasonText, 20, y);
//     y += reasonText.length * 5 + 10;

//     // Summary
//     doc.setFont(undefined, "bold");
//     doc.setFontSize(11);
//     doc.text("Summary:", 15, y);
//     y += 6;
//     doc.setFont(undefined, "normal");
//     doc.setFontSize(10);
//     const summaryText = doc.splitTextToSize(data.summary, pageWidth - 40);
//     doc.text(summaryText, 20, y);
//     y += summaryText.length * 5 + 10;

//     // Disclaimer
//     doc.setFont(undefined, "italic");
//     doc.setFontSize(9);
//     doc.setTextColor(100, 100, 100);
//     const disclaimer =
//       "This report provides an initial indication of potential dysgraphia and is not a definitive " +
//       "diagnosis. Please consult a qualified specialist for a full evaluation. Recommended exercises " +
//       "and practice materials are available on our official website.";
//     const discLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
//     doc.text(discLines, 20, y);
//     y += discLines.length * 4 + 6;

//     // Footer
//     doc.setFontSize(9);
//     doc.text(
//       "This report is for assessment purposes only.",
//       pageWidth / 2, pageHeight - 10,
//       { align: "center" }
//     );

//     doc.save(
//       `dysgraphia_report_${data.name.replace(/\s+/g, "_")}_${
//         new Date().toISOString().split("T")[0]
//       }.pdf`
//     );
//   };

//   // ─── Fetch Result ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchResult = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${API_URL}api/result/${sampleId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         console.log("Fetch result response:", data);
//         if (data.code === 200) {
//           setResult(data.object);
//         }
//       } catch (error) {
//         console.error("Error fetching result:", error);
//       }
//     };
//     fetchResult();
//   }, [API_URL, sampleId]);

//   if (!result) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
//         <p>Loading result...</p>
//       </div>
//     );
//   }

//   const isDysgraphia = result.result_label === "Dysgraphia";
//   const modNum = moduleNumber(result.recommended_module);
//   const sevStyle = severityColor(result.severity);

//   return (
//     <div className="result-page">
//       <div className="result-card">
//         <h2 className="result-title">Dysgraphia Assessment Result</h2>

//         {/* ── Final Result ── */}
//         <div className="result-section">
//           <h4>Final Result</h4>
//           <span className={`result-badge ${isDysgraphia ? "danger" : "success"}`}>
//             {isDysgraphia ? "Dysgraphia Detected" : "Normal — No Dysgraphia"}
//           </span>
//         </div>

//         {/* ── Severity ── */}
//         {result.severity && (
//           <div className="result-section">
//             <h4>Severity</h4>
//             <span
//               className="result-badge"
//               style={sevStyle}
//             >
//               {result.severity}
//             </span>
//           </div>
//         )}

//         {/* ── AI Confidence ── */}
//         {result.confidence !== undefined && (
//           <div className="result-section">
//             <h4>AI Confidence</h4>
//             <div className="confidence-bar-wrapper">
//               <div
//                 className="confidence-bar"
//                 style={{ width: `${result.confidence}%` }}
//               />
//               <span className="confidence-label">{result.confidence}%</span>
//             </div>
//           </div>
//         )}

//         {/* ── Reason ── */}
//         <div className="result-section">
//           <h4>Reason</h4>
//           <p>{result.reason}</p>
//         </div>

//         {/* ── Summary ── */}
//         <div className="result-section">
//           <h4>Summary</h4>
//           <p>{result.summary}</p>
//         </div>

//         {/* ── Recommended Module ── */}
//         {result.recommended_module && (
//           <div className="result-section">
//             <h4>Recommended Module</h4>
//             <p style={{ marginBottom: 10 }}>
//               <strong>{result.recommended_module}</strong>
//             </p>
//             <button
//               className="primary-btn"
//               onClick={() =>
//                 navigate(`/dashboard/module/${modNum}/exercise/1`)
//               }
//             >
//               Start {result.recommended_module}
//             </button>
//           </div>
//         )}

//         {/* ── PDF Download ── */}
//         <div className="result-section">
//           <h4>Download Report</h4>
//           <button
//             className="secondary-btn"
//             onClick={() =>
//               generatePDF({
//                 name: patientName,
//                 age: age,
//                 result_label: result.result_label,
//                 severity: result.severity,
//                 reason: result.reason,
//                 summary: result.summary,
//                 recommended_module: result.recommended_module,
//                 confidence: result.confidence,
//               })
//             }
//           >
//             Download PDF Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import logo from "../../../assets/Dysgraphia Logo.png";
import "./finalResult.css";

const ResultPage = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("userData"));
  const patientName = storedUser?.name || storedUser?.fullName || "Unknown";
  const age = storedUser?.age || "N/A";
  const gender = storedUser?.gender || "N/A";

  const [result, setResult] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const sampleId = localStorage.getItem("sample_id");

  // ─── Severity pill class ────────────────────────────────────────────────────
  const severityPill = (severity) => {
    if (severity === "Moderate") return "pill moderate";
    if (severity === "Severe") return "pill severe";
    if (severity === "None") return "pill none";
    return "pill default";
  };

  // ─── Module number extract ──────────────────────────────────────────────────
  const moduleNumber = (recommended) => {
    if (!recommended) return 1;
    const match = recommended.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  };

  // ─── Format date ────────────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-PK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ─── PDF Generation ─────────────────────────────────────────────────────────
 const generatePDF = (data) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const L = 15;
  const R = W - 15;
  const CW = R - L;
  let y = 0;

  const isDysgraphia = data.result_label === "At Risk";

  const assessmentDate = data.created_at
    ? formatDate(data.created_at)
    : new Date().toLocaleDateString("en-PK", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });

  const sectionHeading = (title, yPos) => {
    doc.setFillColor(0, 119, 204);
    doc.rect(L, yPos, CW, 7, "F");
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), L + 3, yPos + 5);
    doc.setTextColor(0, 0, 0);
    return yPos + 12;
  };

  // ── HEADER (single color) ────────────────────────────────────────────────────
  doc.setFillColor(0, 119, 204);
  doc.rect(0, 0, W, 28, "F");-
  doc.setFillColor(255, 255, 255);
  doc.addImage(logo, "PNG", 14, 5, 18, 18);

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("DYSGRAPHIA ASSESSMENT REPORT", W / 2, 12, { align: "center" });
  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.setTextColor(220, 240, 255);
  doc.text("Handwriting & Learning Disability Screening", W / 2, 19, { align: "center" });
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`Date: ${assessmentDate}`, R - 2, 14, { align: "right" });

  y = 34;

  // ── PATIENT INFORMATION ──────────────────────────────────────────────────────
  y = sectionHeading("Patient Information", y);
  doc.setFillColor(245, 249, 255);
  doc.rect(L, y - 2, CW, 22, "F");
  doc.setDrawColor(200, 220, 240);
  doc.setLineWidth(0.3);
  doc.rect(L, y - 2, CW, 22, "S");

  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("Patient Name:", L + 3, y + 4);
  doc.text("Age:", L + 3, y + 11);
  doc.text("Report Date:", L + CW / 2 + 3, y + 4);
  doc.text("Gender:", L + CW / 2 + 3, y + 11);

  doc.setFont(undefined, "normal");
  doc.setTextColor(20, 20, 20);
  doc.text(data.name || "—", L + 35, y + 4);
  doc.text(String(data.age || "—"), L + 35, y + 11);
  doc.text(assessmentDate, L + CW / 2 + 33, y + 4);
  doc.text(data.gender || "—", L + CW / 2 + 33, y + 11);
  y += 28;

  // ── DIAGNOSTIC RESULT ────────────────────────────────────────────────────────
  y = sectionHeading("Diagnostic Result", y);
  if (isDysgraphia) {
    doc.setFillColor(255, 245, 245);
    doc.setDrawColor(220, 53, 69);
  } else {
    doc.setFillColor(245, 255, 248);
    doc.setDrawColor(40, 167, 69);
  }
  doc.setLineWidth(0.6);
  doc.rect(L, y - 2, CW, 14, "FD");
  if (isDysgraphia) doc.setFillColor(220, 53, 69);
  else doc.setFillColor(40, 167, 69);
  doc.rect(L, y - 2, 4, 14, "F");

  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.setTextColor(isDysgraphia ? 180 : 30, isDysgraphia ? 30 : 120, isDysgraphia ? 30 : 60);
  doc.text(
    isDysgraphia ? "Dysgraphia Detected" : "No Dysgraphia Detected",
    L + 8, y + 8
  );
  y += 20;

  // ── CLINICAL FINDINGS (severity only, no label) ──────────────────────────────
  y = sectionHeading("Clinical Findings", y);

  // AI Confidence bar
  if (data.confidence !== undefined) {
    doc.setFontSize(8.5);
    doc.setFont(undefined, "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("AI CONFIDENCE SCORE", L, y);
    doc.setFont(undefined, "normal");
    doc.setTextColor(0, 119, 204);
    doc.text(`${data.confidence}%`, R, y, { align: "right" });
    y += 4;
    doc.setFillColor(220, 230, 240);
    doc.roundedRect(L, y, CW, 5, 2, 2, "F");
    const fillW = (data.confidence / 100) * CW;
    doc.setFillColor(0, 119, 204);
    doc.roundedRect(L, y, fillW, 5, 2, 2, "F");
    y += 14;
  }

  // Severity
 if (data.label) {
  const labelColor =
    data.label === "high potential" ? [30, 130, 60] :
    data.label === "low potential"  ? [180, 30, 30] : [80, 80, 80];

  doc.setFontSize(8.5);
  doc.setFont(undefined, "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Label:", L, y);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...labelColor);
  doc.text(data.label, L + 30, y);
  y += 10;
}

  // ── CLINICAL NOTES ───────────────────────────────────────────────────────────
  y = sectionHeading("Clinical Notes", y);
  doc.setFontSize(8.5);
  doc.setFont(undefined, "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Assessment Reason:", L + 2, y);
  y += 5;
  doc.setFont(undefined, "normal");
  doc.setTextColor(50, 50, 50);
  const reasonLines = doc.splitTextToSize(data.reason || "—", CW - 4);
  doc.text(reasonLines, L + 2, y);
  y += reasonLines.length * 5 + 5;

  doc.setFont(undefined, "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Clinical Summary:", L + 2, y);
  y += 5;
  doc.setFont(undefined, "normal");
  doc.setTextColor(50, 50, 50);
  const summaryLines = doc.splitTextToSize(data.summary || "—", CW - 4);
  doc.text(summaryLines, L + 2, y);
  y += summaryLines.length * 5 + 8;

  // ── RECOMMENDATION ───────────────────────────────────────────────────────────
  if (data.recommended_module) {
    y = sectionHeading("Treatment & Recommendation", y);
    doc.setFillColor(237, 246, 255);
    doc.setDrawColor(0, 119, 204);
    doc.setLineWidth(0.4);
    doc.rect(L, y - 2, CW, 20, "FD");
    doc.setFillColor(0, 119, 204);
    doc.rect(L, y - 2, 4, 20, "F");
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 60, 120);
    doc.text("Recommended Intervention:", L + 8, y + 5);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 100, 180);
    doc.text(data.recommended_module, L + 8, y + 13);
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Exercises and practice materials available via the patient portal.", L + CW / 2, y + 9, { align: "center" });
    y += 26;
  }else {
  y = sectionHeading("Treatment & Recommendation", y);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, "italic");
  doc.text("No module recommended at this time.", L + 2, y);
  y += 12;
}

  // ── DISCLAIMER ───────────────────────────────────────────────────────────────
  doc.setFillColor(255, 253, 235);
  doc.setDrawColor(200, 170, 0);
  doc.setLineWidth(0.3);
  doc.rect(L, y, CW, 18, "FD");
  doc.setFontSize(7.5);
  doc.setFont(undefined, "bold");
  doc.setTextColor(120, 90, 0);
  doc.text("⚠  DISCLAIMER", L + 3, y + 5);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100, 75, 0);
  const disc = "This report provides an initial screening indication and does not constitute a definitive medical diagnosis. Please consult a qualified specialist or educational psychologist for a comprehensive evaluation. All treatment decisions should be made in consultation with a licensed professional.";
  const discLines = doc.splitTextToSize(disc, CW - 6);
  doc.text(discLines, L + 3, y + 10);

  // ── FOOTER ───────────────────────────────────────────────────────────────────
  doc.setFillColor(0, 119, 204);
  doc.rect(0, H - 14, W, 14, "F");
  doc.setFontSize(7.5);
  doc.setFont(undefined, "normal");
  doc.setTextColor(255, 255, 255);
  doc.text("Dysgraphia Screening System  |  For clinical use only", L, H - 7);
  doc.text(`Page 1 of 1  |  Generated: ${new Date().toLocaleDateString("en-PK")}`, R, H - 7, { align: "right" });

  doc.save(
    `dysgraphia_report_${(data.name || "patient").replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.pdf`
  );
};
  // ─── Fetch Result ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}api/result/${sampleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log("Fetch result response:", data);
        if (data.code === 200) {
          setResult(data.object);
        }
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    };
    fetchResult();
  }, [API_URL, sampleId]);

  if (!result) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading result…</p>
      </div>
    );
  }

  const isDysgraphia = result.result_label === "At Risk";
  const modNum = moduleNumber(result.recommended_module);

  return (
    <div className="result-page">
      <div className="result-card">

        {/* ── Header ── */}
        <div className="result-header">
          <p className="report-label">Assessment Report</p>
          <h2>Dysgraphia Screening</h2>
          {result.created_at && (
            <p className="report-date">{formatDate(result.created_at)}</p>
          )}
        </div>

        {/* ── Result Banner ── */}
        <div className={`result-banner ${isDysgraphia ? "at-risk" : "normal"}`}>
          <div className="banner-icon">
            {isDysgraphia ? "⚠" : "✓"}
          </div>
          <div className="banner-text">
            <strong>{isDysgraphia ? "Dysgraphia Detected" : "Normal — No Dysgraphia"}</strong>
            <span>
              {isDysgraphia
                ? "Targeted intervention is recommended"
                : "No significant dysgraphic patterns found"}
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="result-body">

          {/* Stat row: severity + label */}
          <div className="stat-row">
            {/* {result.severity && (
              <div className="stat-box">
                <p className="stat-label">Severity</p>
                <span className={severityPill(result.severity)}>
                  {result.severity}
                </span>
              </div>
            )} */}
            {result.label && (
              <div className="stat-box">
                <p className="stat-label">Label</p>
                <span className="pill label">{result.label}</span>
              </div>
            )}
          </div>

          {/* Confidence bar */}
          {result.confidence !== undefined && (
            <div className="confidence-section">
              <div className="conf-top">
                <span>AI Confidence</span>
                <strong>{result.confidence}%</strong>
              </div>
              <div className="conf-track">
                <div className="conf-fill" style={{ width: `${result.confidence}%` }} />
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="text-section">
            <h4>Reason</h4>
            <p>{result.reason}</p>
          </div>

          {/* Summary */}
          <div className="text-section">
            <h4>Summary</h4>
            <p>{result.summary}</p>
          </div>

       {/* ── Recommended Module ── */}
          <div className="result-section">
            <h4>Recommended Module</h4>
            {result.recommended_module ? (
              <>
                <p style={{ marginBottom: 10 }}>
                  <strong>{result.recommended_module}</strong>
                </p>
                <button
                  className="primary-btn"
                  onClick={() => navigate(`/dashboard/module/${modNum}/exercise/1`)}
                >
                  Start Module →
                </button>
              </>
            ) : (
              <p style={{ color: "#6c757d", fontStyle: "italic" }}>
                No module recommended at this time.
              </p>
            )}
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="result-footer">
          <p>
            This is a screening tool only.<br />
            Consult a specialist for a full evaluation.
          </p>
          <button
            className="secondary-btn"
            onClick={() =>
              generatePDF({
                name: patientName,

                gender: gender, 
                age,
                result_label: result.result_label,
                label: result.label,
                severity: result.severity,
                reason: result.reason,
                summary: result.summary,
                recommended_module: result.recommended_module,
                confidence: result.confidence,
                created_at: result.created_at,   // ← add this
              })
            }
          >
            ↓ Download PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultPage;