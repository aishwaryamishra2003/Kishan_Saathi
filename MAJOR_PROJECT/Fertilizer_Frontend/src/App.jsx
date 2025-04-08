import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import FarmerInputPage from "./components/FarmerInputPage";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Logout";
import ChatBot from "./components/ChatBot";

function App() {
  const [page, setPage] = useState("LandingPage"); // Default page

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center w-screen">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-lg">
        {/* Page Rendering */}
        {page === "LandingPage" && <LandingPage setPage={setPage} />}
        {page === "signup" && <SignupPage setPage={setPage} />}
        {page === "login" && <LoginPage setPage={setPage} />}
        {page === "farmerInput" && <FarmerInputPage setPage={setPage} />}
        {page === "dashboard" && <Dashboard setPage={setPage} />}
        {page === "ChatBot" && < ChatBot setPage={setPage} />}
        {page === "logout" && <Logout setPage={setPage} />}
      </div>
    </div>
  );
}

export default App;
