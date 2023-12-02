import React,{useState,useEffect} from "react";
import FormLoader from "./FormLoader";
import "../CSS/RemoveForm.css"

function RemoveForm({isVisible,rfid,setIsRemoveBtnClicked,setIsOverlay,setIsPageRefresh,authToken,setFormLoading}){
    const [userInput, setUserInput] = useState({
        rfid: "",
      });
      const [formError, setFormError] = useState({});
      const [isFormValidted, setIsFormValidated] = useState(false);
      const [isFormLoading, setIsFormLoading] = useState(false);
      const handleFormInput = (event) => {
        const { name, value } = event.target;
        setUserInput((prevValues) => ({ ...prevValues, [name]: value }));
      };
      const formVaidater = () => {
        if (!userInput.rfid) {
          setFormError({ rfidError: "RFID Required" });
          return false;
        } else if(userInput.rfid!==rfid){
            setFormError({ rfidError: "RFID Not Matching" });
            return false;
        }else {
          setFormError({rfidError:""});
          return true;
        }
      };
      const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsFormValidated(formVaidater());
      };
      const removeUser=async ()=>{
        try{
            setIsFormLoading(true);
            setFormLoading(true);
            const response=await fetch(`${process.env.REACT_APP_API_URL}/delete_user`,{
                method:"POST",
                headers:{"Content-Type":"application/json", "Authorisation":`Bearer ${authToken}`},
                body:JSON.stringify(userInput)
            })
            const result=await response.json();
            switch(response.status){
                case 200:
                    setIsRemoveBtnClicked(false);
                    setIsOverlay(false);
                    setIsPageRefresh(true)
                break;
                default:
                    alert(result.error)
            }
        }catch(error){
            alert(error.name)
            setIsFormLoading(false);
            setFormLoading(false);
        }finally{
        setIsFormLoading(false);
        setFormLoading(true);
        }
      }
      useEffect(() => {
        if (isFormValidted) {
          removeUser();
          setIsFormValidated(false);
        }
      }, [isFormValidted]);
    return(
<>
<div className={`remove-container ${isVisible?`open`:``}`}>
        <form onSubmit={handleFormSubmit}>
          <FormLoader isFormLoading={isFormLoading} />
          <h1>Remove User</h1>
          <p style={{marginBottom:"10px"}}>Type <span style={{color:"red"}}>{rfid}</span> below to confirm</p>
          <div className="row">
            <label
              htmlFor="rfid"
              style={{color:`${formError.rfidError?`red`:`black`}`}}
            >
              {formError.rfidError?formError.rfidError:"RFID"}
            </label>
            <input
              type="text"
              name="rfid"
              placeholder="RFID"
              onChange={handleFormInput}
              style={{border:`${formError.rfidError?`1px solid red`:``}`}}
            />
          </div>
          <button type="submit">Remove</button>
        </form>
      </div>   
</>
    )
}


export default RemoveForm;