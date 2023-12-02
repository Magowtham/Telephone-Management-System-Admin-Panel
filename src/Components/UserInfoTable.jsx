import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Paginater from "./Paginater";
import PageLoader from "./PageLoader";
import UserForm from "./UserForm";
import RemoveForm from "./RemoveForm";
import "../CSS/UserInfoTable.css";
import "../CSS/RetryForm.css";
let abortControllers = [];
function UserInfoTable({
  isSearchLoading,
  searchData,
  searchRefresh,
  initialRefresh,
  inputClear,
  isOverlay,
  setIsOverlay,
  reductionStatus,
  setNavigation,
  refreshUserInfoTable,
  setRefreshUserInfoTable,
  isAddUserBtnClicked,
  isMonthlyButtonClicked,
  authToken,
  setFormLoading
}) {
  const navigate = useNavigate();
  const [isEditBtnClicked,setIsEditBtnClicked]=useState(false);
  const [isRemoveBtnClicked,setIsRemoveBtnClicked]=useState(false)
  const [editIndex,setEditIndex]=useState(-1)
  const [removeIndex,setRemoveIndex]=useState(-1)
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [pageSize] = useState(9);
  const [presentPageNumber, setpresentPageNumber] = useState(0);
  const [totalUsers, setTotalUsers] = useState(null);
  const [isPageRefresh,setIsPageRefresh]=useState(false)
  const [expenseBtnMedia,setExpenseBtnMedia]=useState(false);

  const fetchPageData = async (pageNumber, totalCount) => {
    try {
      setIsTableLoading(true);
      abortControllers.forEach((signal) => {
        signal.abort();
      });
      const abortController = new AbortController();
      if (!totalCount) {
        abortControllers.push(abortController);
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/get_users?pageNumber=${pageNumber}&pageLimit=${pageSize}`,
        {
          method:"GET",
          headers:{ "Authorisation":`Bearer ${authToken}`},
          signal: abortController.signal,
        }
      );
      const data = await response.json();
      switch (response.status) {
        case 200:
          if (totalCount) {
            setTotalUsers(data?.totalUsers);
          }
          abortControllers = [];
          setPageData(data?.users);
          break;
        case 401:
          abortControllers = [];
          break;
        default:
          abortControllers = [];
      }
    } catch (error) {
      console.log(error.name)
    } finally {
      if (abortControllers.length === 0) {
        setIsTableLoading(false);
      }
    }
  };
  const handleRechargeHistory = (userId) => {
    setNavigation(2);
    navigate("recharge_history", {
      state: { userId },
    });
  };
  const handleExpenseHistory = (userId) => {
    setNavigation(3);
    navigate("expense_history", {
      state: {userId },
    });
  };
  const handleTablePageChange = (e) => {
    fetchPageData(e.selected, false);
    setpresentPageNumber(e.selected);
    inputClear(true);
  };
const handleEditBtn=(index)=>{
  setEditIndex(index)
  setIsEditBtnClicked(true);
  setIsOverlay(true)
}
const handleRemoveBtn=(index)=>{
  setRemoveIndex(index);
  setIsRemoveBtnClicked(true);
  setIsOverlay(true)
}
const expenseBtnMediaHandler=()=>{
  if(window.innerWidth<1470&&window.innerWidth>1200){
    setExpenseBtnMedia(true);
  }else{
    setExpenseBtnMedia(false);
  }
}
useEffect(()=>{
  if(isPageRefresh){
    fetchPageData(presentPageNumber,false)
    setIsPageRefresh(false)
  }
},[isPageRefresh])
  useEffect(() => {
    setPageData(searchData);
  }, [searchData]);

  useEffect(() => {
    if (searchRefresh && !initialRefresh) {
      fetchPageData(presentPageNumber, false);
    }
  }, [searchRefresh]);
  useEffect(() => {
    if (refreshUserInfoTable) {
      setTotalUsers(null);
      fetchPageData(0, true);
      setRefreshUserInfoTable(false);
    }
  }, [refreshUserInfoTable]);
  useEffect(()=>{
    if(!isOverlay){
      setIsRemoveBtnClicked(false)
      setIsEditBtnClicked(false)
    }
  },[isOverlay])

  useEffect(()=>{
    window.addEventListener("resize",expenseBtnMediaHandler);
    expenseBtnMediaHandler()
    return ()=>window.removeEventListener("resize",expenseBtnMediaHandler);
  },[window.innerWidth])
  useEffect(() => {
    setNavigation(1);
    fetchPageData(0, true);
  }, []);
  if(!searchRefresh&&!searchData.length){
    return(
      <>
      <h1 className="user_not_found_heading">user not found</h1>
      </>
    )
  }
  return (
    <>
    <UserForm isVisible={isEditBtnClicked&&!isAddUserBtnClicked&&!isRemoveBtnClicked} isOverlay={!isMonthlyButtonClicked?isOverlay:false} setIsOverlay={setIsOverlay} editData={pageData[editIndex]} setIsPageRefresh={setIsPageRefresh} authToken={authToken} setFormLoading={setFormLoading}/>
    <RemoveForm isVisible={isRemoveBtnClicked&&isOverlay} rfid={pageData[removeIndex]?.rfid} setIsOverlay={setIsOverlay} setIsRemoveBtnClicked={setIsRemoveBtnClicked} setIsPageRefresh={setIsPageRefresh} authToken={authToken} setFormLoading={setFormLoading}/>
      <div className="sub-table-sec">
            <table
            >
              <thead>
                <tr>
                  <th>SL. NO.</th>
                  <th>RFID</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th className={`${reductionStatus ? `hide` : ``}`}>
                    Balance Amount
                  </th>
                  <th>Manage</th>
                  <th>{reductionStatus ? `Recharge` : `View`} Details</th>
                </tr>
              </thead>
              <tbody
                className={`${isTableLoading || isSearchLoading ? `hide` : ``}`}
              >
                {pageData?.map((user, index) => (
                  <tr key={index + 1}>
                    <td className="slno">
                      {presentPageNumber * pageSize + (index + 1)}
                    </td>
                    <td>{user?.rfid}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {user?.name}
                    </td>
                    <td>{user?.rollNumber}</td>
                    <td className={`${reductionStatus ? `hide` : ``}`}>
                      {user?.balance}
                    </td>
                    <td className="manage-sec">
                      <button
                        className="edit-btn"
                        onClick={()=>{
                          handleEditBtn(index)
                        }}
                      >
                        <img src="/Icons/edit.png" alt="" />
                      </button>
                      <button
                        onClick={()=>{
                          handleRemoveBtn(index)
                        }}
                        className="delete-btn"
                      >
                        <img src="/Icons/remove.png" alt="" />
                      </button>
                    </td>
                    <td className="view-details-sec">
                      <button
                        onClick={() => {
                          handleRechargeHistory(user?._id);
                        }}
                        className={`recharge-history-btn ${reductionStatus?`reduction_status`:``}`}
                      >
                        Recharge
                      </button>
                      <button
                        onClick={() => {
                          handleExpenseHistory(user?._id);
                        }}
                        className={`expense-history-btn ${
                          reductionStatus ? `hide` : ``
                        } ${expenseBtnMedia&&!reductionStatus?`expense_btn_media`:``}`}
                      >
                        Expense
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        <div
          className={`table-loader-container ${
            isTableLoading || isSearchLoading ? `` : `hide`
          }`}
        >
          <PageLoader />
        </div>
      </div>
      <div className="paginater-sec">
        <Paginater
          totalElements={totalUsers}
          pageSize={pageSize}
          handlePageChange={handleTablePageChange}
          isVisible={
            searchRefresh &&
            totalUsers !== null &&
            totalUsers !== 0
          }
        />
      </div>
    </>
  );
}

export default UserInfoTable;
