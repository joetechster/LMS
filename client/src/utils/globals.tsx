import React, { useLayoutEffect, useState } from "react";
import MDBox from "components/MDBox";
import { getUser } from "./auth";
import MDTypography from "components/MDTypography";
import { Avatar, Button } from "@mui/material";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export const baseUrl = "http://127.0.0.1:8000/";

export const fetch_authenticated = (route, options, form = false) => {
  const { token } = getUser();
  const headers = new Headers();
  headers.append("Authorization", `Token ${token}`);
  if (!form) headers.append("Content-Type", "application/json");

  return fetch(`${baseUrl}${route}`, {
    ...options,
    headers,
  });
};

export const Course = ({ title, code }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {code}
    </MDTypography>
    <MDTypography variant="caption">{title}</MDTypography>
  </MDBox>
);

export const Instructor = ({ instructor: user }) => {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <Avatar src={user.passport} />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {`${user.first_name} ${user.last_name}`}
        </MDTypography>
        <MDTypography variant="caption">{user.email}</MDTypography>
      </MDBox>
    </MDBox>
  );
};

export const PrintAssessmentGrades = ({ id }) => {
  const [grades, setGrades] = useState([]);
  useLayoutEffect(() => {
    fetch_authenticated(`/grades/${id}`, {})
      .then((res) => res.json())
      .then((grades) => {
        setGrades(grades);
      });
  }, []);
  console.log(grades);

  const printPdf = () => {
    if (grades.length < 1) return;
    const docDefinition = {
      content: [
        { text: "Assessment Grades", style: "header" },
        { text: grades[0].assessment.title, style: "header" },
        {
          layout: "lightHorizontalLines", // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ["*", "*", "auto", "*"],

            body: [["Student", "Course Title", "Course Code", "Grade"]].concat(
              grades.map((grade) => [
                grade.student.first_name + " " + grade.student.last_name,
                grade.assessment.course.code,
                grade.assessment.course.title,
                grade.grade,
              ])
            ),
          },
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: "center",
        },
      },
    };
    pdfMake.createPdf(docDefinition).open();
  };
  return (
    <Button variant="outlined" onClick={printPdf} color="white">
      Print Grades
    </Button>
  );
};
