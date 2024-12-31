"use client";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const userIdFromLocal = localStorage.getItem("userId") ;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  const [doctors, setDoctors] = useState(null);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
const [doctor, setDoctor] = useState(null);
const [userId, setUserId] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));

setUserId(localStorage.getItem("userId"));
  }, [setToken, token]);


 

  // Getting Doctors using API
  const getDoctosData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "api/doctors", {
  headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning":"sss",
          'Cache-Control': 'no-cache',
        },
        
      });
      
      if (data) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.log(error);
    
    }
  };
  const getDoctor = async (id) => {
    try {
      const { data } = await axios.get(backendUrl + `api/doctors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning":"sss"
        },
      });
   
      
      if (data) {
        setDoctor(data.data);
      }
    } catch (error) {
      console.log(error);
    
    }
  };


  // Getting User Profile using API
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + `api/patients/${userIdFromLocal}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning":"sss"

        },
      });

      if (data) {
        console.log("object data", data);
        setUserData(data.data);
      }
    } catch (error) {
    //   console.log(error);
    //   toast.error(error.message);
    }
  };

  const value = {
    doctors,
    getDoctosData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    userId,
    setUserId
    ,
    getDoctor,
    doctor
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
