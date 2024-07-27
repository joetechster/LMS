import React, { useLayoutEffect, useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { getUser } from "utils/auth";
import { baseUrl, Course, fetch_authenticated, Instructor } from "utils/globals";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Link,
  Card,
  MenuItem,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import Answer from "components/Answer";

export default function Feedback() {
  const [course, setCourse] = useState("");
  const [student, setStudent] = useState("");
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const { user } = getUser();

  useLayoutEffect(() => {
    fetch_authenticated("course", {})
      .then((res) => res.json())
      .then((courses) => setCourses(courses));
  }, []);
  useLayoutEffect(() => {
    if (!course) return;
    fetch_authenticated(`student/${course}`, {})
      .then((res) => res.json())
      .then((students) => {
        console.log(students);
        setStudents(students);
      });
  }, [course]);

  useLayoutEffect(() => {
    if (course && (user.type === "instructor" ? student : true)) {
      fetch_authenticated(
        `message/${course}${user.type === "instructor" ? `?student_id=${student}` : ""}`,
        {}
      )
        .then((res) => {
          if (res.status == 200) return res.json();
          else return [];
        })
        .then((messages) => setMessages(messages));
    }
  }, [course, student]);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    if (!course) return;
    if (user.type === "instructor" && !student) return;
    setMessage("");
    setLoading(true);

    const res = await fetch_authenticated(`message/`, {
      method: "POST",
      body: JSON.stringify({
        message: message,
        course: course,
        sent_to: user.type === "instructor" ? student : 1,
      }),
    });
    const newMessage = await res.json();
    setMessages(messages.concat(newMessage));
    setLoading(false);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TextField
        label="Select Course"
        select
        SelectProps={{ sx: { height: 60, minWidth: 200 } }}
        sx={{ ml: 2 }}
        onChange={(e) => setCourse(e.target.value)}
        value={course}
      >
        {courses.map((course) => (
          <MenuItem value={course.id} key={course.id}>
            <Course code={course.code} title={course.title} />
          </MenuItem>
        ))}
      </TextField>
      {course && user.type === "instructor" && (
        <TextField
          label="Select Student"
          select
          SelectProps={{ sx: { height: 60, minWidth: 200 } }}
          sx={{ ml: 2 }}
          onChange={(e) => setStudent(e.target.value)}
          value={student}
        >
          {students.map((student) => (
            <MenuItem value={student.id} key={student.id}>
              <Instructor instructor={student} />
            </MenuItem>
          ))}
        </TextField>
      )}
      <Box maxWidth="md" sx={{ m: "auto", px: { xs: 1, sm: 3, md: 5 }, mb: 10, width: "100%" }}>
        {messages.map((message, i) => (
          <Card
            key={message.id}
            sx={{
              p: 2,
              py: 1,
              width: "fit-content",
              ml: message.sent_by.id === user.id ? "auto" : 0,
              mt: 1.5,
              gap: 1,
              alignItems: message.sent_by.id === user.id ? "end" : "start",
            }}
          >
            <Instructor instructor={message.sent_by} />
            <Typography fontSize={14}>{message.message}</Typography>
          </Card>
        ))}
        <div ref={bottomRef} />
      </Box>
      <Box
        display="grid"
        sx={{
          position: "fixed",
          bottom: 10,
          width: { xs: "88%", sm: "clamp(100px, 70vw, 500px)" },
        }}
      >
        <Container maxWidth="md" sx={{ mt: "auto", mb: 1, p: 0 }}>
          <Paper elevation={2} sx={{ borderRadius: 2 }}>
            <TextField
              id="prompt-input"
              placeholder="Your message"
              fullWidth
              multiline
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                background: "transparent",
                pl: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  outline: "none",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="info" onClick={handleSubmit}>
                      {loading ? <CircularProgress size={28} color="info" /> : <Send />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
