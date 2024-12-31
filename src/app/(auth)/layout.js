"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AdminContext } from "@/context/AdminContext";
import { DoctorContext } from "@/context/DoctorContext";
import { AppContext } from "@/context/AppContext";



export default function RootLayout({ children }) {
  const nav = useRouter();
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { token } = useContext(AppContext);

  useEffect(() => {
    if (aToken || dToken || token) {
      nav.push("/"); // Redirect authenticated users to the home page
    } else {
      nav.push("/login"); // Redirect unauthenticated users to login
    }
  }, [aToken, dToken, token, nav]);



  return (
    
      <div className="-mx-4 sm:-mx-16">
        {children}
      </div>
  );
}
