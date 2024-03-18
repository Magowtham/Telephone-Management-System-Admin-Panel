import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import HostelsPage from "./HostelsPage";
import UserManage from "./UserManage";

function HomePage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [hostelPageRefresh, setHostelPageRefresh] = useState(false);
  const [userManagePageRefresh, setUserManagePageRefresh] = useState(false);
  const [userRechargePageRefresh, setUserRechargePageRefresh] = useState(false);
  const [userExpensePageRefresh, setUserExpensePageRefresh] = useState(false);
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
