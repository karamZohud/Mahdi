"use client";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import mage from "@/assets/123.jpg";

const Doctors = () => {
  const { speciality } = useParams();

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [spaciality, setSpaciality] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useRouter();

  const { doctors = [], getDoctosData } = useContext(AppContext);

  useEffect(() => {
    getDoctosData();
  }, []); // Fetch data only once

  useEffect(() => {
    if (doctors?.length > 0) {
      setFilterDoc(doctors);
      const uniqueSpecialities = new Set(doctors.map((item) => item.speciality));
      setSpaciality([...uniqueSpecialities]); // Set unique specialities once
    }
  }, [doctors]); // Update when doctors data changes

  const filterSpeciality = (speciality) => {
    if (speciality === "All") {
      setFilterDoc(doctors); // Reset to show all doctors
    } else {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilterDoc(
      doctors.filter(
        (doc) =>
          doc.user.first_name.toLowerCase().includes(query.toLowerCase()) ||
          doc.user.last_name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search doctors by name..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full sm:w-auto mb-5"
      />

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() => filterSpeciality("All")}
            className="cursor-pointer border border-gray-300 rounded py-1 px-3"
          >
            All
          </p>
          {spaciality.map((item, index) => (
            <p
              key={index}
              onClick={() => filterSpeciality(item)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === item ? "bg-[#E2E5FF] text-black " : ""
              }`}
            >
              {item}
            </p>
          ))}
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc?.map((item, index) => (
            <div
              onClick={() => {
                navigate.push(`/appointment/${item.id}`);
                scrollTo(0, 0);
              }}
              className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <Image
                width={300}
                height={300}
                className="bg-[#EAEFFF] w-full"
                src={mage}
                alt=""
              />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <p
                    className={`w-2 h-2 rounded-full ${
                      item.available ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-[#262626] text-lg font-medium">
                  {item.user.first_name} {item.user.last_name}
                </p>
                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
