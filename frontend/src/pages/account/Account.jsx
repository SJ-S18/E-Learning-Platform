import React from "react";
import { MdDashboard } from "react-icons/md";
import "./account.css";
import { IoMdLogOut } from "react-icons/io";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { user, setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token"); // ✅ FIXED
    setUser(null);                    // ✅ FIXED
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  if (!user) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  return (
    <div className="profile">
      <h2>My Profile</h2>

      <div className="profile-info">
        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <button
          onClick={() => navigate(`/user/${user._id}/dashboard`)}
          className="common-btn"
        >
          <MdDashboard /> Dashboard
        </button>

        <br />

        {user.role === "admin" && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="common-btn"
          >
            <MdDashboard /> Admin Dashboard
          </button>
        )}

        <br />

        <button
          onClick={logoutHandler}
          className="common-btn"
          style={{ background: "red" }}
        >
          <IoMdLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
