// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import assessmentsTableData from "layouts/assessments/data/assessmentsTableData";

import { Course, fetch_authenticated } from "utils/globals";
import { getUser } from "utils/auth";
import { Box, Button, Dialog, MenuItem, TextField } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tables() {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const { user } = getUser();
  const navigate = useNavigate();

  const { columns, rows } = assessmentsTableData((setAssessment) => {
    fetch_authenticated(`/assessment`)
      .then((res) => res.json())
      .then((assessments) => setAssessment(assessments));
  });
  const getCourses = () => {
    fetch_authenticated(`/course`)
      .then((res) => res.json())
      .then((courses) => setCourses(courses));
  };
  useLayoutEffect(getCourses, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await fetch_authenticated("assessment/", { method: "POST", body: formData }, true);
    const assessment = await res.json();
    navigate(`/assessments/${assessment.id}`);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  {user.type === "student" ? "Take your Assessments" : "Assessments You Created"}
                </MDTypography>
                {user.type === "instructor" && (
                  <Button variant="outlined" color="white" onClick={() => setOpen(true)}>
                    New
                  </Button>
                )}
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <Grid
          container
          component="form"
          onSubmit={handleSubmit}
          maxWidth={"500px"}
          spacing={2}
          py={4}
          justifyContent="center"
          m="auto"
        >
          <MDTypography>Create Assessment</MDTypography>
          <Grid item xs={12}>
            <TextField fullWidth label="Title" name="title" defaultValue="" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" name="description" defaultValue="" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course"
              name="course"
              select
              SelectProps={{ sx: { height: 45 } }}
              defaultValue=""
            >
              {courses.map((course) => (
                <MenuItem value={course.id} key={course.id}>
                  <Course {...course} />
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ color: "#fff", m: "auto", display: "block" }}
              type="submit"
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
