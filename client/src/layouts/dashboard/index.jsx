import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashBoard";

import { getUser } from "utils/auth";

function Dashboard() {
  const { user } = getUser();
  if (user.type === "student") return <StudentDashboard />;
  else return <InstructorDashboard />;
}

export default Dashboard;
