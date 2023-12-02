import React, { useState, useEffect,} from "react";
import { Routes, Route} from "react-router-dom";
import HomePage from "./Components/HomePage"
import Login from "./Components/Login";
import "./CSS/App.css";

function App() {
  const [isMedia,setIsMedia]=useState(false);
  const handleMediaScreen=()=>{
    if(window.innerWidth<850){    
      setIsMedia(true);
    } else{
      setIsMedia(false);
    }
  }
 useEffect(()=>{
    window.addEventListener("resize",handleMediaScreen);
    handleMediaScreen()
    return ()=>window.removeEventListener("resize",handleMediaScreen);
 },[window.innerWidth])
 if(isMedia){
  return (
    <>
    <div className="media-screen-container"><p>This admin panel is optimized for screens wider than 850px. Please use a larger screen for the best experience.</p></div>
    </>
  )
 }
  return (
    <>
 <Routes>
  <Route path="/login" Component={Login}/>
  <Route path="/*" Component={HomePage}/>
 </Routes>
    </>
  );
}

export default App;
