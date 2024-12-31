"use client";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { assets } from "../../../assets/assets";
import RelatedDoctors from "../../../components/RelatedDoctors";
import Image from "next/image";
import mage from "@/assets/123.jpg";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  console.log("Appointment component rendered");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { _id } = useParams();
  const docId = _id;

  const { currencySymbol, doctor, getDoctor, getDoctosData } =
    useContext(AppContext);
  const [clinicID, setClinicID] = useState("");

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [appoitment, setAppoitment] = useState([]);
  const { token } = useContext(AppContext);
  const [userId, setUserId] = useState("");
  //   const getClinics = async() => {
  //     // Check if doctor and clinics are defined before accessing them
  //     if (doctor && doctor.clinics) {
  //       setClinics(doctor.clinics.data || []); // Use a default empty array if `data` is undefined
  //     } else {
  //       console.log("Doctor or clinics data is not available.");
  //       setClinics([]); // Ensure clinics state is always an array
  //     }
  //   };

  // Fetch doctor data when component mounts
  useEffect(() => {
    if (docId) {
      console.log("Fetching doctor data for ID:", docId);
      getDoctor(docId); // Fetch doctor data
      getDoctosData();
      doctorAppoitment();
      setUserId(localStorage.getItem("userId"));
    }
  }, [docId]);

  // Fetch clinics whenever the doctor data changes
  useEffect(() => {
    if (doctor && doctor.clinics) {
      console.log("Updating clinics from doctor data");
      setClinics(doctor.clinics.data || []);
      // Update clinics when doctor data is ready
    } else {
      setClinics([]); // Reset clinics if doctor data is not available
    }
  }, [doctor]); // Dependency on `doctor`
  const [days, setDaysAppoit] = useState([]);
  const [clinics, setClinics] = useState([]);
  // console.log(doctor);
  // console.log(clinics);
  const getDayAppoit = async (e) => {
    try {
      const clinicId = e.target.value; // Correctly accessing the value
      setClinicID(clinicId);
      console.log("Selected Clinic ID:", clinicId);
      if (clinicId != null) {
        const res = await axios.get(
          `${backendUrl}api/doctors/${docId}/clinics/${clinicId}/schedule`,
          {
            headers: {
              "ngrok-skip-browser-warning": "sss",
            },
          }
        );
        setDaysAppoit(res.data); // Update days with fetched data
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error(error.message); // Notify user of the error
    }
  };

  // Trigger slot calculation when `days` state updates
  useEffect(() => {
    if (days.length > 0) {
      getAvailableSlots(); // Recalculate available slots
    }
  }, [days]);

  console.log(days);

  const doctorAppoitment = async () => {
    console.log("Fetching appointment for doctor ID:", docId);

    try {
      const res = await axios.get(
        `${backendUrl}api/doctors/${docId}/appointments`,
        {
          headers: {
            "ngrok-skip-browser-warning": "sss",
          },
        }
      );
      // Update the state with the correct data path
      setAppoitment(res.data.data || []); // Use res.data.data to set appointments
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  console.log(appoitment);

  const getAvailableSlots = () => {
    let today = new Date();
    let updatedSlots = []; // Temporary variable to hold slots
    const hourNow = today.getHours();
    const minuteNow = today.getMinutes();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayName = currentDate.toLocaleString("en-US", { weekday: "long" });
      const todayData = days.filter((day) => day.day === dayName);

      if (todayData.length === 0) continue;

      const { start_time, end_time } = todayData[0];

      const startTime = new Date(currentDate);
      const endTime = new Date(currentDate);

      const [startHours, startMinutes] = start_time.split(":");
      const [endHours, endMinutes] = end_time.split(":");
      startTime.setHours(startHours, startMinutes, 0, 0);
      endTime.setHours(endHours, endMinutes, 0, 0);

      let timeSlots = [];
      let slotTime = new Date(startTime);

      // Check if the day is today and adjust the starting slot
      if (currentDate.toDateString() === today.toDateString()) {
        slotTime.setHours(hourNow, minuteNow, 0, 0); // Start from current time
        if (slotTime < startTime) slotTime = new Date(startTime); // Adjust if current time is earlier than start time
      }

      // Generate slots between startTime and endTime
      while (slotTime < endTime) {
        timeSlots.push({
          datetime: new Date(slotTime),
          time: slotTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });

        slotTime.setMinutes(slotTime.getMinutes() + 30); // Increment by 30 minutes
      }

      updatedSlots.push(timeSlots);
    }

    setDocSlots(updatedSlots); // Update state with calculated slots
  };
  const isSlotTaken = (selectedDate, selectedTime) => {
    // Compare the selected slot with the existing appointments
    return appoitment.some((appointment) => {
      const appointmentDate = new Date(appointment.date).toLocaleDateString();
      const appointmentTime = appointment.time.split(" ")[0]; // Extract time portion

      const time = selectedTime.split(" ")[0];

      // Return true if the selected date and time match any appointment
      return (
        appointmentDate === selectedDate.toLocaleDateString() &&
        appointmentTime == time
      );
    });
  };
  const route = useRouter();
  const formData = new FormData();

  const bookAppointment = async () => {
    const date = docSlots[slotIndex][0]?.datetime;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const slotDate = `${day}-${month}-${year}`;
    const time = slotTime.split(" ")[0]; // Ensure this is valid

    formData.append("date", slotDate);
    formData.append("time", time);
    formData.append("doctor_id", docId);
    formData.append("clinic_id", clinicID);
    formData.append("patient_id", userId);
    formData.append("visit_type", "locale");

    if (!slotTime || !clinicID) {
      toast.error("Please select a valid time slot and clinic.");
      return;
    }

    if (!date) {
      toast.error("Invalid appointment date.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}api/appointments`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "sss",
          },
        }
      );
      console.log(data);

      if (data) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  // console.log(docSlots);
  console.log(docSlots);

  return (
    <div>
      {/* ---------- Doctor Details ----------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Image
          width={300}
          height={300}
          className="bg-primary w-full sm:max-w-72 rounded-lg"
          src={mage}
          alt="Doctor's image"
        />

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* ----- Doctor Info : name, degree, experience ----- */}
          {doctor && (
            <>
              <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
                {doctor.user?.first_name}{" "}
                <Image className="w-5" src={assets.verified_icon} alt="" />
              </p>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <p>
                  "{doctor.degree || "PCD"}" - {doctor.speciality}
                </p>
              </div>

              {/* ----- Doctor About ----- */}
              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
                  About <Image className="w-3" src={assets.info_icon} alt="" />
                </p>
                <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                  {doctor.about}
                </p>
              </div>

              <p className="text-gray-600 font-medium mt-4">
                Appointment fee:{" "}
                <span className="text-gray-800">
                  {currencySymbol}
                  {doctor.fees || 20}
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Booking slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Booking slots</p>

        <form className="mt-4">
          <select
            onChange={getDayAppoit}
            id="clinics"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Clinic</option>
            {clinics &&
              clinics.map((clinic, index) => (
                <option key={index} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
          </select>
        </form>

        {days.length !== 0 && (
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-[#DDDDDD]"
                  }`}
                >
                  <p>
                    {(item[0] && daysOfWeek[item[0].datetime.getDay()]) ||
                      "None"}
                  </p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
        )}

        {days.length !== 0 && (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full mt-4">
            {docSlots.length > 0 &&
            docSlots[slotIndex]?.map((item, index) => {
              const slotDate = item.datetime; // Get the datetime of the slot
              const SlotTime = item.time; // Get the time of the slot
            
              // Check if the slot is taken
              const isTaken = isSlotTaken(slotDate, SlotTime);
            
              return (
                <p
                  key={index}
                  onClick={() => !isTaken && setSlotTime(SlotTime)} // Use SlotTime here
                  className={`text-sm font-light text-center flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    isTaken
                      ? "bg-gray-400 text-white cursor-not-allowed" // Disabled style if taken
                      : SlotTime === slotTime
                      ? "bg-primary text-white"
                      : "text-[#949494] border border-[#B4B4B4]"
                  }`}
                >
                  {SlotTime.toLowerCase()}
                </p>
              );
              })}
          </div>
        )}

        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      {/* Listing Related Doctors */}
      {doctor && (
        <RelatedDoctors speciality={doctor.speciality} docId={docId} />
      )}
    </div>
  );
};

export default Appointment;
