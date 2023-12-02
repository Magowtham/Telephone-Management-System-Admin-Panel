import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLoader from "./FormLoader";
import "../CSS/Login.css";
function Login() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
  });
  const [formError, setFormError] = useState({});
  const [isFormValidted, setIsFormValidated] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const handleFormInput = (event) => {
    const { name, value } = event.target;
    setUserInput((prevValues) => ({ ...prevValues, [name]: value }));
  };
  const formVaidater = () => {
    if (!userInput.userName) {
      setFormError({ userNameError: "UserName Required" });
      return false;
    } else if (!userInput.password) {
      setFormError({ passwordError: "Password Required" });
      return false;
    } else {
      setFormError({ userNameError: "", passwordError: "" });
      return true;
    }
  };
  const sendLoginData = async () => {
    try {
      setIsFormLoading(true);
      const response = await fetch(`${process.env.REACT_APP_ADMIN_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput),
      });
      const result = await response.json();
      switch (response.status) {
        case 200:
          sessionStorage.setItem("auth_token",result.token)
          navigate("/")
          break;
        case 404:
          setFormError({ userNameError: result.error });
          break;
        case 401:
          setFormError({ passwordError: result.error });
          break;
        default:
          alert(result.error);
      }
    } catch (error) {
      alert("login failed check your internet connection!");
    } finally {
      setIsFormLoading(false);
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormValidated(formVaidater());
  };
  useEffect(() => {
    if (isFormValidted) {
      sendLoginData();
      setIsFormValidated(false);
    }
  }, [isFormValidted]);
  return (
    <>
      <div className="login-container">
        <form onSubmit={handleFormSubmit}>
          <FormLoader isFormLoading={isFormLoading} />
          <h1>Admin Login</h1>
          <div className="row">
            <label
              htmlFor="userName"
              style={{ color: formError.userNameError ? `red` : `` }}
            >
              {formError.userNameError ? formError.userNameError : "Email"}
            </label>
            <input
              type="text"
              name="userName"
              placeholder="UserName"
              onChange={handleFormInput}
              style={{
                borderColor: formError.userNameError ? `red` : ``,
              }}
            />
          </div>
          <div className="row">
            <label
              htmlFor="password"
              style={{ color: formError.passwordError ? `red` : `` }}
            >
              {formError.passwordError ? formError.passwordError : "Password"}
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleFormInput}
              style={{
                borderColor: formError.passwordError ? `red` : ``,
              }}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}

export default Login;