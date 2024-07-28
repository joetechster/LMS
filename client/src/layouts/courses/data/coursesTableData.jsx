// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import { baseUrl, fetch_authenticated } from "utils/globals";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Avatar, Button, TextField, Typography } from "@mui/material";
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
        : [{ Header: "action", accessor: "action-instructor", align: "center", width: "10%" }]
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
          <Button
            variant="contained"
            size="small"
            sx={{ color: "#fff" }}
            href={course.material}
            disabled={!course.material}
          >
            Course Material
          </Button>
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
        "action-instructor": (
          <UploadMaterial id={course.id} disabled={Boolean(course.material)} a={course} />
        ),
      })),
  };
}

function UploadMaterial({ id, disabled }) {
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("course_material", image);
    fetch_authenticated(`upload-material/${id}`, { method: "POST", body: formData }, true)
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  useEffect(handleSubmit, [image]);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  return (
    <Button variant="contained" size="small" sx={{ color: "#fff" }} disabled={disabled}>
      Upload Course Material
      {!disabled && (
        <TextField
          type="file"
          sx={{ position: "absolute", inset: 0 }}
          inputProps={{ style: { padding: 0, height: 32, opacity: 0 } }}
          onChange={handleImageChange}
        />
      )}
    </Button>
  );
}
