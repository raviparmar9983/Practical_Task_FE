"use client";

import { useAuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({})

  const getInitials = () => {
    if (!user?.firstName || !user?.lastName) return "";
    return user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase();
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") ?? {}))
    
}, [])
  return (
    <div className="d-flex align-items-center gap-2">
      {user?.profilePic ? (
        <Image src={`http://localhost:3000${user.profilePic}`} alt="profile" className="rounded-circle" width="40" height="40" />
      ) : (
        <div className="bg-light text-dark rounded-circle d-flex justify-content-center align-items-center" style={{ width: 40, height: 40 }}>
          <strong>{getInitials()}</strong>
        </div>
      )}
      <span>
        {user?.firstName} {user?.lastName}
      </span>
    </div>
  );
}
