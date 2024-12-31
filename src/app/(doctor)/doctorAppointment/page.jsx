"use client";
import React from "react";
import { useContext, useEffect } from "react";
import { DoctorContext } from "@/context/DoctorContext";
import { assetsDashboard } from "@/assets/assets";
import { DashboardContext } from "@/context/DashboardContext";
import Image from "next/image";
import images from "@/assets/123.jpg";
import { calculateAge } from "../../../../utils/fun";
const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);
  const { slotDateFormat, currency } =
    useContext(DashboardContext);

  useEffect(() => {
    getAppointments();
  }, []);

  console.log(appointments);
  const dateFormate=(date2)=>{
    const date = new Date(date2);
    
    // Format the date
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return formattedDate;
  }
  
  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index+1}</p>
            <div className="flex items-center gap-2">
              <Image src={images} className="w-8 rounded-full" alt="" />{" "}
              <p>{item.patient.user.first_name} {item.patient.user.last_name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.visit_type!=="locale" ? "Online" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.patient.user.dob)}</p>
            <p>
              {dateFormate(item.date)}:{item.time}
            </p>
            <p>
              {currency}
              {item.amount || 20}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <div className="flex">
                <Image
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assetsDashboard.cancel_icon}
                  alt=""
                />
                <Image
                  onClick={() => completeAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assetsDashboard.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
