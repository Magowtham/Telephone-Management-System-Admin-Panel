import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Sidebar.css";

function Sidebar({
  pageIndex,
  setHostelPageRefresh,
  setUserManagePageRefresh,
  setUserRechargePageRefresh,
  setUserExpensePageRefresh,
}) {
  const navigate = useNavigate();
  const handleHomePage = () => {
    navigate("/home");
  };
  const handleLogOut = () => {
    navigate("/");
    sessionStorage.removeItem("auth_token");
  };
  const handlePageRefresh = () => {
    switch (pageIndex) {
      case 1:
        setHostelPageRefresh(true);
        break;
      case 2:
        setUserManagePageRefresh(true);
        break;
      case 3:
        setUserRechargePageRefresh(true);
        break;
      case 4:
        setUserExpensePageRefresh(true);
    }
  };
  return (
    <div className="homepage-sidebar">
      <div className="btn-sec">
        <button onClick={handleHomePage}>
          <span className="material-symbols-outlined">home</span>
        </button>
        <button onClick={handlePageRefresh}>
          <span className="material-symbols-outlined">refresh</span>
        </button>
        <button>
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button onClick={handleLogOut}>
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
