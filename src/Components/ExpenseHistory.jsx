import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Paginater from "./Paginater";
import PageLoader from "./PageLoader";
import "../CSS/ExpenseHistory.css";
import "../CSS/RetryForm.css";

function ExpenseHistory({
  setPageIndex,
  userExpensePageRefresh,
  setUserExpensePageRefresh,
  authToken,
}) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [networkError, setNetworkError] = useState(false);
  const [aborter, setAborter] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageData, setPageData] = useState([]);
  const [totalHistoryCount, setTotalHistoryCount] = useState(null);
  const [pageSize] = useState(15);
  const [presentPageNumber, setPresentPageNumber] = useState(0);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const fetchPageData = async (pageNumber, totalCount) => {
    try {
      setIsTableLoading(true);
      setNetworkError(false);
      aborter?.abort();
      const abortController = new AbortController();
      setAborter(abortController);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/expense_history?userId=${state?.userId}&pageNumber=${pageNumber}&pageLimit=${pageSize}`,
        {
          method: "GET",
          headers: { Authorisation: `Bearer ${authToken}` },
          signal: abortController.signal,
        }
      );
      const data = await response.json();
      setIsTableLoading(false);
      switch (response.status) {
        case 200:
          if (totalCount) {
            setTotalHistoryCount(data?.historyLength);
          }
          console.log(data.historyLength);
          setPageData(data?.history);
          break;
        case 401:
          navigate("/login");
        default:
          setErrorMessage(data.error + "!");
          setNetworkError(true);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setIsTableLoading(false);
        setErrorMessage("oops something went wrong!");
        setNetworkError(true);
      }
    }
  };
  const handleHistoryPage = (e) => {
    fetchPageData(e.selected, false);
    setPresentPageNumber(e.selected);
  };
  useEffect(() => {
    if (userExpensePageRefresh) {
      setNetworkError(false);
      setTotalHistoryCount(null);
      setPresentPageNumber(0);
      fetchPageData(0, true);
      setUserExpensePageRefresh(false);
    }
  }, [userExpensePageRefresh]);
  useEffect(() => {
    setPageIndex(4);
    fetchPageData(0, true);
  }, []);
  return (
    <>
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
          <div className="expense-table-container">
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
                  <th>Call Start Time</th>
                  <th>Call End Time</th>
                  <th>Reducted Amount</th>
                  <th>Test Amount</th>
                </tr>
              </thead>
              <tbody className={`${isTableLoading ? `hide` : ``}`}>
                {pageData?.map((element, index) => {
                  const date = new Date(element.date);
                  return (
                    <tr key={index}>
                      <td>{presentPageNumber * pageSize + (index + 1)}</td>
                      <td>{`${date.getDate()}/${
                        date.getMonth() + 1
                      }/${date.getFullYear()}`}</td>
                      <td>{element?.call_start_time}</td>
                      <td>{element?.call_end_time}</td>
                      <td>{element?.reducted_amount}</td>
                      <td>{element?.test_amount}</td>
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
          </div>
        </>
      )}

      <div
        className={`paginater-sec ${
          totalHistoryCount === 0 || totalHistoryCount === null ? `hide` : ``
        }`}
      >
        <Paginater
          totalElements={totalHistoryCount}
          pageSize={pageSize}
          forcePage={presentPageNumber}
          handlePageChange={handleHistoryPage}
          isVisible={
            !networkError &&
            totalHistoryCount !== null &&
            totalHistoryCount !== 0
          }
        />
      </div>
    </>
  );
}

export default ExpenseHistory;
