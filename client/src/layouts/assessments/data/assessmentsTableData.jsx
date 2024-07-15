// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import { useContext, useLayoutEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { getUser } from "utils/auth";
import { SearchContext } from "context/index";

export default function data(fetch) {
  const [assessments, setAssessments] = useState([]);
  const { search } = useContext(SearchContext);
  const user = getUser().user;

  useLayoutEffect(() => {
    fetch(setAssessments);
  }, []);

  const Instructor = ({ instructor }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <Avatar src={instructor.passport} />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {`${instructor.first_name} ${instructor.last_name}`}
        </MDTypography>
        <MDTypography variant="caption">{instructor.email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Course = ({ title, code }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {code}
      </MDTypography>
      <MDTypography variant="caption">{title}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Instructor", accessor: "instructor", width: "30%", align: "left" },
      { Header: "Course", accessor: "course", width: "30%", align: "left" },
      { Header: "Time", accessor: "time", width: "30%", align: "left" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: assessments
      .filter(
        (assessment) =>
          assessment.title.toLowerCase().includes(search?.toLowerCase() || "") ||
          assessment.description.toLowerCase().includes(search?.toLowerCase() || "") ||
          assessment.course.code.toLowerCase().includes(search?.toLowerCase() || "") ||
          assessment.course.title.toLowerCase().includes(search?.toLowerCase() || "")
      )
      .map((assessment) => ({
        instructor: <Instructor instructor={assessment.course.instructor} />,
        course: <Course code={assessment.course.code} title={assessment.course.title} />,
        time: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {assessment.time}
          </MDTypography>
        ),
        action: (
          <Button variant="contained" size="small" sx={{ color: "#fff" }}>
            Start
          </Button>
        ),
      })),
  };
}
