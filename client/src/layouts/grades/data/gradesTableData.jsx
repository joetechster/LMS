// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import { useContext, useLayoutEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { getUser } from "utils/auth";
import { SearchContext } from "context/index";

export default function data(fetch) {
  const [grades, setGrades] = useState([]);
  const { search } = useContext(SearchContext);
  const user = getUser().user;

  useLayoutEffect(() => {
    fetch(setGrades);
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
      { Header: "Grade", accessor: "grade", align: "center" },
    ],
    rows: grades
      .filter(
        (grade) =>
          grade.assessment.course.code.toLowerCase().includes(search?.toLowerCase() || "") ||
          grade.assessment.course.title.toLowerCase().includes(search?.toLowerCase() || "")
      )
      .map((grade) => ({
        instructor: <Instructor instructor={grade.assessment.course.instructor} />,
        course: (
          <Course code={grade.assessment.course.code} title={grade.assessment.course.title} />
        ),
        grade: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {grade.grade}
          </MDTypography>
        ),
      })),
  };
}
