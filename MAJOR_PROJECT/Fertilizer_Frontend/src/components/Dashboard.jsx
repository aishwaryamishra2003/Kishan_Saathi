import React, { useEffect, useState } from "react";

function Dashboard({ setPage }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/auth/user-details", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <button
        onClick={() => setPage("LandingPage")}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        ⬅ Back
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {user ? (
        <div className="bg-gray-100 p-4 rounded-md shadow-md text-black">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Village:</strong> {user.village}</p>
          <p><strong>District:</strong> {user.district}</p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}

      <button
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md"
        onClick={() => setPage("logout")}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
