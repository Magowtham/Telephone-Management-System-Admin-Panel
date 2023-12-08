import React, { useEffect, useRef, useState } from "react";
import FormLoader from "./FormLoader";
import "../CSS/UserForm.css";
function UserForm({isVisible,isOverlay,setIsOverlay,editData,setIsPageRefresh,authToken,setFormLoading}) {
  const [userInput, setUserInput] = useState({
    name: "",
    rfid: "",
    rollNumber:""
  });
  const [formError, setFormError] = useState({});
  const [isFormValidted, setIsFormValidated] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [serverResponse,setServerResponse]=useState(null)
  const formRef=useRef(null);
  const handleFormInput = (event) => {
    const { name, value } = event.target;
    setUserInput((prevValues) => ({ ...prevValues, [name]: value }));
  };
  const formValidater = () => {
    if (!userInput.name) {
      setFormError({ nameError: "Full Name Required" });
      return false;
    } else if (!userInput.rfid) {
      setFormError({ rfidError: "RFID Required" });
      return false;
    } else if(!userInput.rollNumber){
        setFormError({ rollNumberError: "Roll Number Required" });
        return false;
    }else {
      setFormError({ nameError: "", rfidError: "",rollNumberError:"" });
      return true;
    }
  };
  const sendAddUserData= async () => {
    try {
      setIsFormLoading(true);
     setFormLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/add_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorisation":`Bearer ${authToken}` },
        body: JSON.stringify(userInput),
      });
      const result = await response.json();
      switch (response.status) {
        case 201:
          setServerResponse({status:true,message:result.message})
          break;
        case 409:
          setFormError({ rfidError: result.error });
          break;
        default:
          setServerResponse({status:false,message:result.error})
      }
    } catch (error) {
      alert("login failed check your connection!");
    } finally {
      setIsFormLoading(false);
      setFormLoading(false)
    }
  };
  const sendEditUserData=async ()=>{
    try{
      setIsFormLoading(true);
      setFormLoading(true);
      const response=await fetch(`${process.env.REACT_APP_API_URL}/edit_user/${editData._id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json", "Authorisation":`Bearer ${authToken}`},
        body:JSON.stringify(userInput)
      })
      const result=await response.json();
      switch(response.status){
        case 200:
          setIsOverlay(false)
          setIsPageRefresh(true)
          break;
        case 404:
         alert(result.error)
          break;
        case 409:
          setFormError({rfidError:result.error});
          break;
        default:
          setServerResponse({status:false,message:result.error})
      }
    }catch(error){
      alert("check your internet connection!")
    }finally{
      setIsFormLoading(false);
      setFormLoading(false);
    }
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormValidated(formValidater());
  };
  const handleRefresh=(e)=>{
    e?.preventDefault()
    setFormError({ nameError: "", rfidError: "",rollNumberError:"" });
    setUserInput({name:"",rfid:"",rollNumber:""})
    setServerResponse(null)
    const form=formRef.current;
    for(let i=0;i<3;i++){
        form[i].value=""
    }
  }
  useEffect(() => {
    if (isFormValidted) {
        if(editData){
          sendEditUserData()
        }else{
          sendAddUserData()
        }
      setIsFormValidated(false);
    }
  }, [isFormValidted]);
  useEffect(()=>{
    setUserInput({name:editData?.name,rfid:editData?.rfid,rollNumber:editData?.rollNumber})
  },[editData])
  return (
    <>
      <div className={`form-container ${isVisible&&isOverlay?`open`:``}`}>
        <form onSubmit={handleFormSubmit} ref={formRef}>
          <FormLoader isFormLoading={isFormLoading} />
          <h1>{!editData?"Add New User":"Edit User"}</h1>
          <div className="row">
            <label
              htmlFor="name"
              style={{ color: formError.nameError ? `red` : `` }}
            >
              {formError.nameError ? formError.nameError : "Full Name"}
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleFormInput}
              style={{
                borderColor: formError.nameError ? `red` : ``,
              }}
              value={userInput?.name}
            />
          </div>
          <div className="row">
            <label
              htmlFor="rfid"
              style={{ color: formError.rfidError ? `red` : `` }}
            >
              {formError.rfidError ? formError.rfidError : "RFID"}
            </label>
            <input
              type="text"
              name="rfid"
              placeholder="RFID"
              onChange={handleFormInput}
              style={{
                borderColor: formError.rfidError ? `red` : ``,
              }}
              value={userInput?.rfid}
            />
          </div>
          <div className="row">
            <label
              htmlFor="rollNumber"
              style={{ color: formError.rollNumberError ? `red` : `` }}
            >
              {formError.rollNumberError ? formError.rollNumberError : "Roll Number"}
            </label>
            <input
              type="text"
              name="rollNumber"
              placeholder="Roll Numebr"
              onChange={handleFormInput}
              style={{
                borderColor: formError.rollNumberError ? `red` : ``,
              }}
              value={userInput?.rollNumber}
            />
          </div>
          <div className="form-footer-sec"><div><button type="submit">Submit</button><button className="refresh-btn" onClick={handleRefresh}><img src="./Icons/refresh.png" alt=""/></button></div><p style={{color:`${serverResponse?.status?`green`:`red`}`}}>{serverResponse?.message}</p></div>
        </form>
      </div>
    </>
  );
}

export default UserForm;