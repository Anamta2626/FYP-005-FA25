import React from "react";
import TotalLeadsChart from "./Charts/TotalLeadsChart";

const DashboardHome = () => {
  return (
    <div className="dashboard-home">
      <div className="summary-cards">
        <div className="card">Total Leads: <strong>200</strong></div>
        <div className="card">Consumer Finance: <strong>70</strong></div>
        <div className="card">Bank Account & Others: <strong>50</strong></div>
      </div>

      <div className="charts">
        <div className="chart-box">
          <h3>Total Leads</h3>
          <TotalLeadsChart />
        </div>
        <div className="chart-box">
          <h3>Consumer Finance</h3>
          <div className="chart-placeholder">Consumer Finance chart not available</div>
        </div>
        <div className="chart-box">
          <h3>Bank Account and Others</h3>
          <div className="chart-placeholder">Bank Account & Others chart not available</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
