import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useLayoutEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getUser } from "utils/auth";
import { fetch_authenticated } from "utils/globals";

export default function Assessment() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState();
  const [questions, setQuestions] = useState({});
  const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const { user } = getUser();
  const alert = useAlert();
  const navigate = useNavigate();

  const handleChange = (event, question_id) => {
    setSelectedAnswers((p) => ({ ...p, [question_id]: event.target.value }));
  };

  const handleSubmit = async () => {
    if (user.type === "instructor") {
      // Submit the answer
      const data = JSON.stringify(
        Object.keys(questions).map((key) => ({ ...questions[key], id: key }))
      );
      const res = await fetch_authenticated("many-question/", { method: "POST", body: data });
      const res_data = await res.json();
      if (res.status === 200 || res.status === 201) {
        alert.show("Updated Successfully", { type: "success" });
        navigate("/assessments");
      }
      console.log(res_data);
    } else if (user.type === "student") {
      const data = {
        student: getUser().user.id,
        assessment: assessment.id,
        answers: JSON.stringify(selectedAnswers),
      };
      const res = await fetch_authenticated("grade/", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.status === 201 || res.status === 200) {
        alert.success("Assessment submitted");
        navigate("/assessments");
      }
    }
  };

  const handleAddNew = () => {
    const id = assessment.questions.length + 1;
    setAssessment((p) => ({
      ...p,
      questions: [...p.questions, { id }],
    }));
    setQuestions((p) => ({ ...p, [id]: { new: true, assessment: assessment.id } }));
  };

  useLayoutEffect(() => {
    fetch_authenticated(`assessment/${id}`)
      .then((res) => res.json())
      .then((assessment) => {
        setAssessment(assessment);
      });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {assessment && (
        <Card sx={{ mt: 6, pb: 3 }}>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h5" color="white">
              {assessment.title}
            </MDTypography>
            <MDTypography variant="subtitle2" color="white">
              {assessment.description}
            </MDTypography>
          </MDBox>
          <Grid container spacing={2} px={4} pt={3}>
            {assessment.questions.map((question) =>
              user.type === "student" ? (
                <Grid item key={question.id} mb={4} xs={12} sm={6} lg={4}>
                  <Typography variant="h6" gutterBottom>
                    {question.description}
                  </Typography>
                  <RadioGroup
                    value={selectedAnswers[question.id] || ""}
                    onChange={(event) => handleChange(event, question.id)}
                    name={`question-${question.id}`}
                  >
                    <FormControlLabel value="a" control={<Radio />} label={question.a} />
                    <FormControlLabel value="b" control={<Radio />} label={question.b} />
                    <FormControlLabel value="c" control={<Radio />} label={question.c} />
                    <FormControlLabel value="d" control={<Radio />} label={question.d} />
                  </RadioGroup>
                </Grid>
              ) : (
                <Grid container item key={question.id} mb={4} xs={12} sm={6} lg={4} px={2} gap={2}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Description"
                    defaultValue={question.description || ""}
                    onChange={(e) =>
                      setQuestions((p) => ({
                        ...p,
                        [question.id]: { ...p[question.id], description: e.target.value },
                      }))
                    }
                  />
                  <TextField
                    fullWidth
                    name="answer"
                    label="Answer"
                    defaultValue={question.answer || ""}
                    onChange={(e) =>
                      setQuestions((p) => ({
                        ...p,
                        [question.id]: { ...p[question.id], answer: e.target.value },
                      }))
                    }
                    select
                    SelectProps={{ sx: { height: 45 } }}
                  >
                    <MenuItem value="a">A</MenuItem>
                    <MenuItem value="b">B</MenuItem>
                    <MenuItem value="c">C</MenuItem>
                    <MenuItem value="d">D</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    name="a"
                    label="A"
                    defaultValue={question.a || ""}
                    onChange={(e) =>
                      setQuestions((p) => ({
                        ...p,
                        [question.id]: { ...p[question.id], a: e.target.value },
                      }))
                    }
                  />
                  <TextField
                    fullWidth
                    name="b"
                    label="B"
                    defaultValue={question.b || ""}
                    onChange={(e) =>
                      setQuestions((p) => ({
                        ...p,
                        [question.id]: { ...p[question.id], b: e.target.value },
                      }))
                    }
                  />
                  <TextField
                    fullWidth
                    name="c"
                    label="C"
                    defaultValue={question.c || ""}
                    onChange={(e) =>
                      setQuestions((p) => ({
                        ...p,
                        [question.id]: { ...p[question.id], c: e.target.value },
                      }))
                    }
                  />
                  <TextField
                    fullWidth
                    name="d"
                    label="D"
                    defaultValue={question.d || ""}
                    onChange={(e) =>
                      setQuestions((p) => ({
                        ...p,
                        [question.id]: { ...p[question.id], d: e.target.value },
                      }))
                    }
                  />
                  <Grid
                    container
                    item
                    mb={4}
                    xs={12}
                    sm={6}
                    lg={4}
                    px={2}
                    gap={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button variant="text" onClick={handleAddNew}>
                      Add Question
                    </Button>
                  </Grid>
                </Grid>
              )
            )}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ color: "#fff", alignSelf: "center", m: "auto", display: "block" }}
          >
            Submit
          </Button>
        </Card>
      )}
    </DashboardLayout>
  );
}
