import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";
import Paginater from "./Paginater";
import "../CSS/RechargeHistory.css";
import "../CSS/RetryForm.css";

function RechargeHistory({
  reductionStatus,
  setPageIndex,
  userRechargePageRefresh,
  setUserRechargePageRefresh,
  authToken,
}) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [networkError, setNetworkError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageData, setPageData] = useState([]);
  const [totalHistoryCount, setTotalHistoryCount] = useState(null);
  const [pageLimit] = useState(14);
  const [presentPage, setPresentPage] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const fetchPageData = async (pageNumber, totalCount) => {
    try {
      setIsTableLoading(true);
      setNetworkError(false);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recharge_history?userId=${
          state?.userId
        }&pageNumber=${pageNumber}&pageLimit=${pageLimit}&reductionStatus=${
          reductionStatus ? 1 : 0
        }`,
        {
          method: "GET",
          headers: { Authorisation: `Bearer ${authToken}` },
        }
      );
      const data = await response.json();
      switch (response.status) {
        case 200:
          if (totalCount) {
            setTotalHistoryCount(data?.historyLength);
          }
          setPageData(data?.history);
          break;
        case 401:
          navigate("/login");
          break;
        default:
          setErrorMessage(data.error + "!");
          setNetworkError(true);
      }
    } catch (error) {
      setErrorMessage("oops something went wrong!");
      setNetworkError(true);
    } finally {
      setIsTableLoading(false);
    }
  };
  const handleHistoryPage = (e) => {
    fetchPageData(e.selected, false);
    setPresentPage(e.selected + 1);
  };

  useEffect(() => {
    if (userRechargePageRefresh) {
      setNetworkError(false);
      setTotalHistoryCount(null);
      fetchPageData(0, true);
      setUserRechargePageRefresh(false);
    }
  }, [userRechargePageRefresh]);

  useEffect(() => {
    setPageIndex(3);
    fetchPageData(0, true);
  }, []);

  return (
    <>
      <div className="recharge-table-container">
        {networkError ? (
          <div className="retry-form">
            <p>{errorMessage}</p>
            <button
              onClick={() => {
                fetchPageData(0, true);
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div
              className={`empty-animation-container ${
                totalHistoryCount === 0 ? `` : `hide`
              }`}
            >
              <h1>oops the table is empty!</h1>
            </div>
            <table
              className={`${
                totalHistoryCount === null || totalHistoryCount === 0
                  ? `hide`
                  : ``
              }`}
            >
              <thead>
                <tr>
                  <th>SL. NO.</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody className={`${isTableLoading ? `hide` : ``}`}>
                {pageData?.map((element, index) => {
                  const date = new Date(element.date);
                  return (
                    <tr key={index}>
                      <td>{(presentPage - 1) * pageLimit + (index + 1)}</td>
                      <td>{`${date.getDate()}/${
                        date.getMonth() + 1
                      }/${date.getFullYear()}`}</td>
                      <td>{element?.time}</td>
                      <td>{element?.amount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              className={`table-loader-container ${
                isTableLoading ? `` : `hide`
              }`}
            >
              <PageLoader />
            </div>
            <div
              className={`paginater-sec ${
                totalHistoryCount === null || totalHistoryCount === 0
                  ? `hide`
                  : ``
              }`}
            ></div>
          </>
        )}
      </div>
      <Paginater
        totalElements={totalHistoryCount}
        pageSize={pageLimit}
        handlePageChange={handleHistoryPage}
        isVisible={
          !networkError && totalHistoryCount !== null && totalHistoryCount !== 0
        }
      />
    </>
  );
}

export default RechargeHistory;
