import React, { useEffect, useState, useRef } from "react";
import CountUp from "react-countup";
import FormLoader from "./FormLoader";
import LoadingBar from "react-top-loading-bar";
import { useNavigate } from "react-router-dom";
import "../CSS/HostelsPage.css";

function HostelsPage({
  setPageIndex,
  hostelPageRefresh,
  setHostelPageRefresh,
}) {
  const authToken = sessionStorage.getItem("auth_token");
  const navigate = useNavigate();
  const loaderRef = useRef(null);
  const [isOverlay, setIsOverlay] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [userInput, setUserInput] = useState({ hostel: "" });
  const [isFormValidated, setIsFormValidated] = useState(false);
  const [formError, setFormError] = useState({});
  const [isFormLoading, setIsFormLoading] = useState(false);

  const fetchDataFromServer = async () => {
    try {
      loaderRef.current.continuousStart();
      const response = await fetch("http://localhost:9000/admin/hostels", {
        method: "GET",
        headers: { Authorisation: `Bearer ${authToken}` },
      });
      const result = await response.json();
      switch (response.status) {
        case 200:
          setHostels(result.data);
          loaderRef.current.complete();
          break;
      }
    } catch (error) {}
  };

  const sendDataToServer = async () => {
    try {
      setIsFormLoading(true);
      const response = await fetch(
        "http://localhost:9000/admin/create_hostel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorisation: `Bearer ${authToken}`,
          },
          body: JSON.stringify(userInput),
        }
      );

      const result = await response.json();

      switch (response.status) {
        case 201:
          setIsOverlay(false);
          fetchDataFromServer();
          break;
        default:
          setFormError({ nameError: result.error });
      }
    } catch (error) {
      setFormError({ nameError: "something went wrong" });
    } finally {
      setIsFormLoading(false);
    }
  };

  const formValidater = () => {
    if (!userInput.hostel) {
      setFormError({ nameError: "Hostel Name Required" });
      setIsFormValidated(false);
      return;
    }
    setFormError({});
    setIsFormValidated(true);
  };

  const handleCreate = () => {
    setIsOverlay(true);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    formValidater();
    console.log(userInput);
  };

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setUserInput((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleManageBtn = (index) => {
    navigate("/home/manage", { state: hostels[index] });
  };
  const handleOverlay = () => {
    setIsOverlay(false);
  };
  useEffect(() => {
    if (isFormValidated) {
      sendDataToServer();
      setIsFormValidated(false);
    }
  }, [isFormValidated]);
  useEffect(() => {
    setPageIndex(1);
    fetchDataFromServer();
  }, []);
  useEffect(() => {
    if (hostelPageRefresh) {
      fetchDataFromServer();
      setHostelPageRefresh(false);
    }
  }, [hostelPageRefresh]);
  return (
    <>
      <LoadingBar color="mediumslateblue" ref={loaderRef} height={5} />
      <div
        className={`hostelspage-overlay ${isOverlay ? `open` : ""}`}
        onClick={handleOverlay}
      ></div>
      <div className="hostelspage-container">
        <h1>Alva's Hostels</h1>
        <div className="hostel-card-container">
          {hostels.map((hostel, index) => (
            <div className="hostel-card" key={index}>
              <div className="img-sec">
                <img src="/images/hostel.png" alt="" />
              </div>
              <div className="manage-sec">
                <h2>{hostel.name}</h2>
                <div className="homepage-footer-sec">
                  <h2>
                    <CountUp
                      start={0}
                      end={hostel.amount}
                      duration={2}
                      prefix="₹"
                    />
                  </h2>
                  <button onClick={() => handleManageBtn(index)}>Manage</button>
                </div>
              </div>
            </div>
          ))}
          <div className="add-hostel-card" onClick={handleCreate}>
            <span class="material-symbols-outlined">add</span>
          </div>
        </div>
      </div>

      <form
        className={`create-hostel-form ${isOverlay ? `open` : ``}`}
        onSubmit={handleFormSubmit}
      >
        <FormLoader isFormLoading={isFormLoading} />
        <h1>Create Hostel</h1>
        <label
          htmlFor="hostel"
          style={{
            color: `${formError.nameError ? `mediumslateblue` : `black`}`,
          }}
        >
          {formError.nameError ? formError.nameError : `Hostel Name`}
        </label>
        <input
          type="text"
          name="hostel"
          placeholder="Hostel Name"
          onChange={handleFormInput}
        />
        <button type="submit">Create</button>
      </form>
    </>
  );
}

export default HostelsPage;
