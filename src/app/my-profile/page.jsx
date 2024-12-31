"use client";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import images from "@/assets/123.jpg";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [image, setImage] = useState(false);

  const { token, backendUrl, userId, userData, loadUserProfileData } =
    useContext(AppContext);

  // Load user data once on mount
  useEffect(() => {
    const fetchData = async () => {
      await loadUserProfileData();
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  // Update local state when userData changes
  useEffect(() => {
    if (userData && userData.user) {
      setName(`${userData.user.first_name} ${userData.user.last_name}`);
      setEmail(userData.user.email || "");
      setPhone(userData.user.phone || "");
      setDob(userData.user.dob || "");
    }
  }, [userData]); // Dependency on userData ensures state updates when it changes

  // API call to update user profile data
  const param=new URLSearchParams();
  const updateUserProfileData = async () => {

    // param.append("image", image);
    try {
      param.append("first_name", name.split(" ")[0]);
      param.append("last_name", name.split(" ")[1] || "");
      param.append("phone", phone);
      param.append("dob", dob);
      const { data } = await axios.put(`${backendUrl}api/patients/${userId}`, param, {
        headers: { token },
        "content-type": "application/x-www-form-urlencoded",
        "ngrok-skip-browser-warning":"sss"

      });

      if (data) {
        toast.success(data.message);
        await loadUserProfileData(); // Refresh user data after update
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating profile");
    }
  };

  return userData ? (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
   {isEdit ? (
  <label htmlFor="image" className="relative inline-block cursor-pointer group">
    <div className="relative w-36 h-36 rounded overflow-hidden">
      <Image
        className="w-full h-full object-cover rounded opacity-75 group-hover:opacity-50 transition-all duration-300"
        src={image ? URL.createObjectURL(image) : userData.image || images}
        alt="Profile Picture"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm font-medium">Change Photo</p>
      </div>
    </div>
    <input
      onChange={(e) => setImage(e.target.files[0])}
      type="file"
      id="image"
      accept="image/*"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </label>
) : (
  <Image className="w-36 rounded" src={userData.image || images} alt="Profile Picture" />
)}

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      ) : (
        <p className="font-medium text-2xl text-[#262626] mt-4">{name}</p>
      )}

      <hr className="bg-[#ADADAD] h-[1px] border-none" />

      <div>
        <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">Email id: </p>
          <p className="text-blue-500">{email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-50 max-w-52"
              type="text"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
          ) : (
            <p className="text-blue-500">{phone}</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-50"
              type="date"
              onChange={(e) => setDob(e.target.value)}
              value={dob}
            />
          ) : (
            <p className="text-gray-500">{dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  ) : (
    <p>Loading user data...</p>
  );
};

export default MyProfile;
