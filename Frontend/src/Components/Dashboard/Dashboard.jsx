import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Header";
import DashboardHome from "./DashboardHome";
import Records from "./Record";
import PictureUpload from "./ImageUpload/PictureUpload";
import Module1 from "./Module/Module1";
import ResultPage from "./FinalResult/finalPage";
import Settings from "./Settings/UserSettings";
import "./styles.css";
 
const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />
        <div className="dashboard-content">
          <Routes>
            <Route index element={<PictureUpload />} />
            <Route path="ResultPage" element={<ResultPage />} />
            <Route path="Settings" element={<Settings />} />
            <Route path="records" element={<Records />} />
            <Route path="Module1" element={<Module1 />} />
            <Route path="Module2" element={<Module1 />} />
            <Route path="Module3" element={<Module1 />} />
           <Route path="module/:moduleId/exercise/:exerciseId" element={<Module1 />} />
            <Route path="*" element={<PictureUpload />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
