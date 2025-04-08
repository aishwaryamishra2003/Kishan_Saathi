import React, { useState } from "react";

function SignupPage({ setPage }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    village: "",
    district: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      alert("Signup Successful! Please login.");
      setPage("login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        {["username", "password", "name", "age", "village", "district"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700">{field.toUpperCase()}</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-md px-3 py-2"
              required
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
