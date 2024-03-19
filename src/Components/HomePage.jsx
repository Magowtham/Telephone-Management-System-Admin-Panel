import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import HostelsPage from "./HostelsPage";
import UserManage from "./UserManage";

function HomePage() {
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("auth_token");
  const [pageIndex, setPageIndex] = useState(1);
  const [reductionStatus, setReductionStatus] = useState(false);
  const [hostelPageRefresh, setHostelPageRefresh] = useState(false);
  const [userManagePageRefresh, setUserManagePageRefresh] = useState(false);
  const [userRechargePageRefresh, setUserRechargePageRefresh] = useState(false);
  const [userExpensePageRefresh, setUserExpensePageRefresh] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/auto_login`,
          {
            method: "GET",
            headers: {
              Authorisation: `Bearer ${authToken}`,
            },
          }
        );
        const result = await response.json();
        switch (response.status) {
          case 200:
            setReductionStatus(result.reductionStatus);
            break;
          default:
            navigate("/");
        }
      } catch (error) {
        console.log(error.name);
      }
    };
    autoLogin();
  }, []);
  return (
    <>
      <Sidebar
        pageIndex={pageIndex}
        setHostelPageRefresh={setHostelPageRefresh}
        setUserManagePageRefresh={setUserManagePageRefresh}
        setUserRechargePageRefresh={setUserRechargePageRefresh}
        setUserExpensePageRefresh={setUserExpensePageRefresh}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HostelsPage
              setPageIndex={setPageIndex}
              hostelPageRefresh={hostelPageRefresh}
              setHostelPageRefresh={setHostelPageRefresh}
            />
          }
        />
        <Route
          path="/manage/*"
          element={
            <UserManage
              setPageIndex={setPageIndex}
              reductionStatus={reductionStatus}
              authToken={authToken}
              userManagePageRefresh={userManagePageRefresh}
              setUserManagePageRefresh={setUserManagePageRefresh}
              userRechargePageRefresh={userRechargePageRefresh}
              setUserRechargePageRefresh={setUserRechargePageRefresh}
              userExpensePageRefresh={userExpensePageRefresh}
              setUserExpensePageRefresh={setUserExpensePageRefresh}
            />
          }
        />
      </Routes>
    </>
  );
}

export default HomePage;
