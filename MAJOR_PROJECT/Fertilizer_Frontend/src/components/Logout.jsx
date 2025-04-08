import React, { useEffect } from "react";

function Logout({ setPage }) {
  useEffect(() => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    setPage("login");
  }, [setPage]);

  return <p>Logging out...</p>;
}

export default Logout;
