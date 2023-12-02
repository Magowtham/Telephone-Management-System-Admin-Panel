import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "../CSS/Paginater.css";
function Paginater({ totalElements, pageSize, handlePageChange, isVisible }) {
  const [isMedia, setIsMedia] = useState(false);
  const handleMediaScreen = () => {
    if (window.innerWidth <= 1000) {
      setIsMedia(true);
    } else {
      setIsMedia(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleMediaScreen);
    handleMediaScreen();
    return () => window.removeEventListener("resize", handleMediaScreen);
  }, []);
  return (
    <>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={Math.ceil(totalElements / pageSize)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={` pagination-container ${
          isMedia ? `media-screen` : ``
        } ${!isVisible ? `hide` : ``}`}
        activeClassName="page-active"
        pageClassName="page-btn"
        pageLinkClassName="page-btn-link"
        previousClassName="page-next-btn"
        nextClassName="page-prev-btn"
        previousLinkClassName="page-next-btn-link"
        nextLinkClassName="page-next-btn-link"
      />
    </>
  );
}

export default Paginater;
