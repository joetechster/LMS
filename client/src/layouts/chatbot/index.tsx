import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { getUser } from "utils/auth";

export default function Chatbot() {
  const { user } = getUser();
  return (
    <DashboardLayout>
      <DashboardNavbar />
    </DashboardLayout>
  );
}
