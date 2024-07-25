import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsPieChart from "examples/Charts/PieChart/ReportsPieChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reportsPieChartData from "layouts/dashboard/data/reportsPieChartData";
import { useLayoutEffect, useMemo, useState } from "react";
import { fetch_authenticated } from "utils/globals";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [grades, setGrades] = useState([]);
  useLayoutEffect(() => {
    fetch_authenticated("course")
      .then((res) => res.json())
      .then((courses) => setCourses(courses));
    fetch_authenticated("assessment")
      .then((res) => res.json())
      .then((assessments) => setAssessments(assessments));
    fetch_authenticated("grade")
      .then((res) => res.json())
      .then((grades) => {
        console.log(grades);
        setGrades(grades);
      });
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Courses enrolled"
                count={courses.length}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Average Grade"
                count={grades.reduce((prev, curr) => prev + curr.grade, 0) / grades.length || 0}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Absent Days"
                count="34"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Assessments"
                count={assessments.length}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsPieChart
                  color="dark"
                  title="Attendance"
                  description="Absent vs Present"
                  date="Just updated"
                  chart={reportsPieChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsPieChart
                  color="dark"
                  title="Available assessments"
                  description="Assessments done vs not done"
                  date="Just updated"
                  chart={useMemo(
                    () => ({
                      labels: ["Assessments done", "Assessments not done"],
                      datasets: {
                        label: "Assessments",
                        data: [grades.length, assessments.length],
                        backgroundColors: ["info", "white"],
                      },
                    }),
                    [assessments, grades]
                  )}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
