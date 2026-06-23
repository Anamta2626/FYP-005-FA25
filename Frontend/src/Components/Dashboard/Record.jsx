import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import { FaEye, FaDownload } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./record.css";
import logo from "../../assets/Dysgraphia Logo.png";
import placeholderImg from "../../assets/Dysgraphia Handwriting.jpg";

const Records = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [reportPreview, setReportPreview] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [records, setRecords] = useState([]);
  const [userName, setUserName] = useState("");
  const [patientAge, setPatientAge] = useState("N/A");
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("userData"));
  const patientName = storedUser?.name || storedUser?.fullName || "Unknown";
  const age = storedUser?.age || "N/A";
  const gender = storedUser?.gender || "N/A";

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      const storedUserRaw = localStorage.getItem("userData");
      if (!storedUserRaw) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUserRaw);
      setUserName(
        user.role === "Organization" ? user.organizationName : user.fullName
      );
      setPatientAge(user.age || "N/A");

      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}api/records/${user.user_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setRecords(data.object || []);
        } else {
          console.error("Error fetching records:", data.message);
        }
      } catch (err) {
        console.error("Server error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [API_URL]);

  // ── Date formatter ──────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-PK", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  };

  // ── Severity badge style ───────────────────────────────────────────────
  const severityClass = (severity) => {
    if (severity === "None") return "bg-success";
    if (severity === "Moderate") return "bg-warning text-dark";
    if (severity === "Severe") return "bg-danger";
    return "bg-secondary";
  };

  // ── Result badge style (based on result_label, text shown is `label`) ──
  const resultClass = (resultLabel) => {
    if (resultLabel === "Normal") return "bg-success";
    if (resultLabel === "At Risk") return "bg-danger";
    return "bg-secondary";
  };

  // ── Module number from string e.g. "Module 2" → 2 ───────────────────────
  const moduleNumber = (recommended) => {
    if (!recommended) return 1;
    const match = recommended.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  };

  // ── Generate PDF for a single record ────────────────────────────────────
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

    // ── HEADER ──────────────────────────────────────────────────────────
    doc.setFillColor(0, 119, 204);
    doc.rect(0, 0, W, 28, "F");
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

    // ── PATIENT INFORMATION ────────────────────────────────────────────
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

    // ── DIAGNOSTIC RESULT ───────────────────────────────────────────────
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

    // ── CLINICAL FINDINGS ────────────────────────────────────────────────
    y = sectionHeading("Clinical Findings", y);

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

    if (data.label) {
      const labelColor =
        data.label === "high potential" ? [30, 130, 60] :
        data.label === "low potential" ? [180, 30, 30] : [80, 80, 80];

      doc.setFontSize(8.5);
      doc.setFont(undefined, "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Label:", L, y);
      doc.setFont(undefined, "normal");
      doc.setTextColor(...labelColor);
      doc.text(data.label, L + 30, y);
      y += 10;
    }

    // ── CLINICAL NOTES ───────────────────────────────────────────────────
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

    // ── RECOMMENDATION ────────────────────────────────────────────────────
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
    } else {
      y = sectionHeading("Treatment & Recommendation", y);
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, "italic");
      doc.text("No module recommended at this time.", L + 2, y);
      y += 12;
    }

    // ── DISCLAIMER ────────────────────────────────────────────────────────
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

    // ── FOOTER ────────────────────────────────────────────────────────────
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

  // ── Wrapper: map a record (`item`) into generatePDF's expected shape ────
  const handleDownload = (item) => {
    generatePDF({
      name: item.user_name || patientName,
      gender,
      age,
      result_label: item.result_label,
      label: item.label,
      severity: item.severity,
      reason: item.reason,
      summary: item.summary,
      recommended_module: item.recommended_module,
      confidence: item.confidence,
      created_at: item.created_at,
    });
  };

  return (
    <>
      <div className="records-page flex-grow-1 d-flex flex-column w-100">
        <div className="records-container flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1">
            <h4 className="records-title">PERSON RECORD</h4>

            <div className="table-responsive records-table-wrapper">
              <table className="table records-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>DATE</th>
                    <th>RESULT</th>
                    <th>SEVERITY</th>
                    <th>RECOMMENDED MODULE</th>
                    <th>UPLOADED PICTURE</th>
                    <th>REPORTS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        <div className="spinner-border text-primary" role="status" style={{ width: "2rem", height: "2rem" }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2 text-muted">Loading records...</div>
                      </td>
                    </tr>
                  ) : records.length > 0 ? (
                    records.map((item, index) => {
                      const imgSrc = item.sample_id
                        ? `${API_URL}image/${item.sample_id}`
                        : placeholderImg;

                      return (
                        <tr key={index}>
                          <td className="fw-semibold">{item.user_name || userName}</td>

                          <td>
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString()
                              : "—"}
                          </td>

                          <td>
                            <span className={`badge ${resultClass(item.result_label)}`}>
                              {item.label || item.result_label || "Pending"}
                            </span>
                          </td>

                          <td>
                            {item.severity ? (
                              <span className={`badge ${severityClass(item.severity)}`}>
                                {item.severity}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>

                          <td>
                            {item.recommended_module ? (
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  navigate(
                                    `/dashboard/module/${moduleNumber(
                                      item.recommended_module
                                    )}/exercise/1`
                                  )
                                }
                              >
                                {item.recommended_module}
                              </button>
                            ) : (
                              <span className="text-muted fst-italic" style={{ fontSize: "12px" }}>
                                No module
                              </span>
                            )}
                          </td>

                          <td className="img-cell">
                            <img
                              src={imgSrc}
                              alt="uploaded"
                              className="records-img"
                              onClick={() => {
                                setPreviewImage(imgSrc);
                                setZoom(1);
                              }}
                            />
                          </td>

                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="action-btn action-btn-view"
                                onClick={() => setReportPreview(item)}
                              >
                                <FaEye size={13} />
                                View
                              </button>
                              <button
                                className="action-btn action-btn-download"
                                onClick={() => handleDownload(item)}
                              >
                                <FaDownload size={13} />
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              style={{ transform: `scale(${zoom})` }}
            />
            <div className="zoom-controls">
              <button onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}>+</button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.2, 1))}>−</button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT PREVIEW MODAL */}
      {reportPreview && (
        <div className="image-modal" onClick={() => setReportPreview(null)}>
          <div
            className="report-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="report-modal-close" onClick={() => setReportPreview(null)}>
              &times;
            </button>

            <div className="report-modal-header">
              <h5>Dysgraphia assessment report</h5>
              <span className="report-modal-date">
                {reportPreview.created_at
                  ? new Date(reportPreview.created_at).toLocaleDateString("en-PK", {
                      day: "2-digit", month: "long", year: "numeric",
                    })
                  : "—"}
              </span>
            </div>

            <div className="report-modal-body">
              <div className="report-modal-image-wrap">
                <img
                  src={
                    reportPreview.sample_id
                      ? `${API_URL}image/${reportPreview.sample_id}`
                      : placeholderImg
                  }
                  alt="Handwriting sample"
                  className="report-modal-image"
                />
              </div>

              <div className="report-modal-info">
                <div className="report-row">
                  <span className="report-label">Patient</span>
                  <span className="report-value">{reportPreview.user_name || userName}</span>
                </div>

                <div className="report-row">
                  <span className="report-label">Result</span>
                  <span className={`badge ${resultClass(reportPreview.result_label)}`}>
                    {reportPreview.label || reportPreview.result_label || "Pending"}
                  </span>
                </div>

                {reportPreview.severity && (
                  <div className="report-row">
                    <span className="report-label">Severity</span>
                    <span className={`badge ${severityClass(reportPreview.severity)}`}>
                      {reportPreview.severity}
                    </span>
                  </div>
                )}

                {reportPreview.recommended_module && (
                  <div className="report-row">
                    <span className="report-label">Recommended module</span>
                    <span className="report-value">{reportPreview.recommended_module}</span>
                  </div>
                )}

                {reportPreview.reason && (
                  <div className="report-block">
                    <span className="report-label">Reason</span>
                    <p className="report-text">{reportPreview.reason}</p>
                  </div>
                )}

                {reportPreview.summary && (
                  <div className="report-block">
                    <span className="report-label">Summary</span>
                    <p className="report-text">{reportPreview.summary}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="report-modal-footer">
              <button
                className="action-btn action-btn-download"
                onClick={() => handleDownload(reportPreview)}
              >
                <FaDownload size={13} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Records;