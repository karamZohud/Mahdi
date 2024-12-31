"use client";
import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "@/context/DoctorContext";
import { toast } from "react-toastify";
import axios from "axios";
import { DashboardContext } from "@/context/DashboardContext";
import images from "@/assets/123.jpg";
import Image from "next/image";

const DoctorProfile = () => {
  useEffect(() => {
    getProfileData();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const { dToken, profileData, setProfileData, getProfileData, doctorId } =
    useContext(DoctorContext);
  const { currency, backendUrl } = useContext(DashboardContext);
  const [isEdit, setIsEdit] = useState(false);

  const [available, setAvailable] = useState(false);
  const [fees, setFees] = useState(0);

  const [about, setAbout] = useState("");

  useEffect(() => {
    if (profileData) {
      setAvailable(profileData.available === 1 ? true : false);
    setAbout(profileData.about);
    }
  }, [profileData]);

  const params = new URLSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log("DOcorasdasdad");

    params.append("about", about);
    params.append("available", available ? 1 : 0);
    params.append("fee", fees);
console.log(about, available);

    try {
      const response = await axios.put(
        `${API_URL}api/doctors/${doctorId}`,
        params,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
            "content-type": "application/x-www-form-urlencoded",
            "ngrok-skip-browser-warning":"sss"

          },
        }
      );
      console.log("Success", response);
      toast.success("Doctor updated successfully");
   
    } catch (err) {
      console.log("Error updating User:", err);
      toast.error("Failed to update User. Please try again.");
    }
  };



  useEffect(() => {
    getProfileData();
  }, []);


  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <Image
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={images}
              alt=""
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* ----- Doc Info : name, degree, experience ----- */}

            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>Speciality:{profileData.speciality}</p>
              {/* <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button> */}
            </div>

            {/* ----- Doc About ----- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
                About :{" "}
              </p>

              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {isEdit ? (
                  <textarea
                    onChange={(e) => setAbout(e.target.value)}
                    type="text"
                    className="w-full outline-primary p-2"
                    rows={8}
                    value={about || ""}
                  />
                ) : (
                    about
                )}
              </p>
            </div>

            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) => setFees(e.target.value)}
                    value={fees}
                  />
                ) : (
                  profileData.fee
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p>Address:</p>
              {profileData.clinics.data.map((item, index) => (
                <p key={index} className="text-sm">
                  {item.address}
                </p>
              ))}
            </div>

            <div className="flex gap-1 pt-2">
              <input
                id="availability"
                type="checkbox"
                onChange={() => setAvailable(!available)}
                checked={available}
              />{" "}
              <label htmlFor="">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit((prev) => !prev)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
