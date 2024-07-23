// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import { baseUrl, fetch_authenticated } from "utils/globals";
import { useContext, useLayoutEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { getUser } from "utils/auth";
import { SearchContext } from "context/index";
import { useAlert } from "react-alert";

export default function data(fetch, update, setUpdate) {
  const [courses, setCourses] = useState([]);
  const { search } = useContext(SearchContext);
  const user = getUser().user;
  const alert = useAlert();

  useLayoutEffect(() => {
    fetch(setCourses);
  }, [update]);

  const handleEnroll = async (id) => {
    const res = await fetch_authenticated(`enroll/${id}`, { method: "POST" });
    if (res.status === 200) {
      setUpdate((p) => ++p);
      alert.show("Successfully enrolled", { type: "success" });
    } else {
      alert.show("Something went wrong", { type: "error" });
    }
  };

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
      { Header: "Instructor", accessor: "instructor", width: "35%", align: "left" },
      { Header: "Course", accessor: "course", align: "left" },
    ].concat(
      user.type === "student"
        ? [{ Header: "action", accessor: "action", align: "center", width: "10%" }]
        : []
    ),
    rows: courses
      .filter(
        (course) =>
          course.code.toLowerCase().includes(search?.toLowerCase() || "") ||
          course.title.toLowerCase().includes(search?.toLowerCase() || "")
      )
      .map((course) => ({
        instructor: <Instructor instructor={course.instructor} />,
        course: <Course code={course.code} title={course.title} />,
        action: course.students.find((student) => student.id === user.id) ? (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Enrolled
          </MDTypography>
        ) : (
          <Button
            variant="contained"
            size="small"
            sx={{ color: "#fff" }}
            onClick={() => handleEnroll(course.id)}
          >
            Enroll
          </Button>
        ),
      })),
  };
}
