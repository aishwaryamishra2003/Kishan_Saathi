import React from "react";
import bgImage from "../assets/homepage1.jpg";

function LandingPage({ setPage }) {
  return (
    <div className="w-full min-h-screen relative">
      {/* ✅ Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-60 shadow-md py-4 px-10 flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold text-gray-900">Fertilizer Optimizer</h1>
        <div className="flex space-x-6">
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition text-lg font-medium shadow-md" onClick={() => setPage("login")}>
  Log in
</button>

          
          <button className="bg-transparent text-black px-5 py-2 transition font-medium" onClick={() => setPage("dashboard")}>
            Dashboard
          </button>
          <button className="bg-transparent text-black px-5 py-2 transition font-medium" onClick={() => setPage("ChatBot")}>
           ChatBot
          </button>
          <button className="bg-transparent text-black px-5 py-2 transition font-medium" onClick={() => setPage("logout")}>
            Log out
          </button>
        </div>
      </nav>

      {/* ✅ Fullscreen Background */}
      <div
  className="fixed inset-0 w-full h-full bg-black bg-opacity-50 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `linear-gradient(to bottom, rgba(34, 139, 34, 0.5), rgba(144, 238, 144, 0.5)), url(${bgImage})`,
  }}
></div>



      {/* ✅ Tree Structure (Centered in the Body) */}
      <div className="relative flex flex-col items-center justify-center min-h-screen pt-32">
        
        {/* Root Node - Fertilizer */}
        <div className="bg-green-200 p-6 rounded-lg shadow-lg text-center w-96">
          <h2 className="text-2xl font-bold text-green-900">🌱 What is Fertilizer?</h2>
          <p className="text-gray-700 text-sm">
          A fertilizer is a natural or synthetic substance supplying essential nutrients like nitrogen, phosphorus, and potassium to soil or plants, enhancing their growth and productivity. It replenishes nutrients depleted by previous crops, ensuring healthy plant development and increased yields.
          </p>
        </div>

        {/* Vertical Connecting Line */}
        <div className="h-12 w-1 "></div>

        {/* Branching Line */}
        <div className="relative flex items-center justify-center w-full mt-2">
          {/* Increase width for Horizontal Line to match spacing */}
          <div className="absolute w-64 h-1 "></div>

          {/* Branches with more space */}
          <div className="flex space-x-72">  {/* ⬅ Increased spacing here */}
            {/* Left Branch - Soil pH */}
            <div className="relative flex flex-col items-center">
              {/* Small Vertical Line */}
              <div className="h-10 w-5 "></div>
              <div className="bg-blue-200 p-6 rounded-lg shadow-lg text-center w-96">
                <h2 className="text-2xl font-bold text-blue-900">🌍 What is Soil pH?</h2>
                <p className="text-gray-700 text-sm">Soil pH measures a soil's acidity or alkalinity on a 0-14 scale. Below 7 is acidic, 7 is neutral, and above 7 is alkaline. It significantly impacts nutrient availability, microbial activity, and plant health, making it a crucial factor for plant growth.Soil pH measures acidity or alkalinity on a scale of 0-14. Below 7 is acidic, 7 is neutral, and above 7 is alkaline.
                </p>
              </div>
            </div>

            {/* Right Branch - Soil Nutrients */}
            <div className="relative flex flex-col items-center">
              {/* Small Vertical Line */}
              <div className="h-10 w-1 "></div>
              <div className="bg-yellow-200 p-6 rounded-lg shadow-lg text-center w-96">
                <h2 className="text-2xl font-bold text-yellow-900">🌾 What is Soil Nutrient?</h2>
                <p className="text-gray-700 text-sm">
                Soil nutrients are vital elements like nitrogen, phosphorus, and potassium, plus others, essential for plant growth and health. Macronutrients are needed in larger amounts, while micronutrients are required in smaller quantities. Their presence and availability in the soil dictate plant productivity.
                </p>
              </div>
            </div>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition text-lg font-medium shadow-md mt-[-40px] " onClick={() => setPage("signup")}>
            Get Started
          </button>
          

      </div>
    </div>
  );
}

export default LandingPage;
