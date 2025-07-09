"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";

export default function ClientWrapper({ children }) {
  const { isAdminLoggedIn } = useAppContext();

  return <>{children}</>;
}