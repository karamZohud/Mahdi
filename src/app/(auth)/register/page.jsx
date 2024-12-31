"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Camera from "../../../components/Face_Liveness/Camera";

const page = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [dob, setDob] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [roleId, setRoleId] = useState(0);
  const [imgs, setImgs] = useState(null); // For storing image files
  const [url, setUrl] = React.useState(null);

  const router = useRouter();

  const formData = new FormData();

  const clearData = () => {
    setName("");
    setUsername("");
    setEmail("");
    setPhone("");
    setIsActive(true);
    setPassword("");
    setIdNumber("");
    setSpeciality("");
    setDob("");
    setImgs(null);
  }

  // Image handling function
  const handleImagesChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setImgs(file); // Store the image in the state
    }
  };

  const onSubmitRegister = async (event) => {
    event.preventDefault();

    // Ensure to append image to formData
    formData.append("first_name", name.split(" ")[0]);
    formData.append("last_name", name.split(" ")[1] || ""); // Split the name
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("is_active", isActive);
    formData.append("password", password);
    formData.append("id_number", idNumber);
    formData.append("speciality", speciality);
    formData.append("dob", dob);
    formData.append("image", imgs); // Append image file to formData

    try {
      const { data } = await axios.post(backendUrl + "api/doctors", formData, {
        headers: {
          Authorization: `Bearer ${aToken}`,
          "ngrok-skip-browser-warning": "sss",
        },
      });

      if (data) {
        toast.success("Successfully added!");
        clearData(); // Clear data after successful submission
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitRegister} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">Create Account</p>

        {state === "Sign Up" && (
          <>
            <div className="w-full">
              <p>Username</p>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Full Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="email"
                required
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="password"
                required
              />
            </div>
            <div className="w-full">
              <p>Phone</p>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="tel"
                required
              />
            </div>
            <div className="w-full">
              <p>Doctor ID</p>
              <input
                onChange={(e) => setIdNumber(e.target.value)}
                value={idNumber}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Speciality</p>
              <input
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Date of Birth</p>
              <input
                onChange={(e) => setDob(e.target.value)}
                value={dob}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="date"
                required
              />
            </div>
            <div>
              <p>ID Photo</p>
              <input type="file" onChange={handleImagesChange} />
            </div>
          
              {imgs && (
              <div className="mt-3">
                <p>Selected Image:</p>
                <img
                  src={URL.createObjectURL(imgs)} 
                  alt="Selected image"
                  className="w-32 h-32 object-cover mt-2"
                />
              </div>
            )}
                  {/* <Camera url={url} setUrl={setUrl} /> */}

          </>
        )}

        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
          Create account
        </button>

        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            onClick={() => setState("Login")}
            className="text-primary underline cursor-pointer"
          >
            Login here
          </Link>
        </p>
      </div>
    </form>
  );
};

export default page;
