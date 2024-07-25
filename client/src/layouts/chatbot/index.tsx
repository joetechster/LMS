import React, { useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { getUser } from "utils/auth";
import { baseUrl, fetch_authenticated } from "utils/globals";
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
} from "@mui/material";
import logo from "assets/images/logo.jpg";
import { Send } from "@mui/icons-material";
import Answer from "layouts/chatbot/Answer";
import FlickeringBots from "components/FlickeringBots";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const [items, setItems] = useState<{ q: string; a: string }[]>([]);
  const { user } = getUser();
  const handleSubmit = async () => {
    const q = question;
    setQuestion("");
    setLoading(true);

    const context = items.reduce((prev, curr) => `${prev} ${curr.q}`, "");

    const res = await fetch_authenticated(`chat/`, {
      method: "POST",
      body: JSON.stringify({ question: q, context }),
    });
    const answer = await res.json();

    setItems(items.concat({ q: question, a: answer }));
    setLoading(false);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box maxWidth="md" sx={{ m: "auto", px: { xs: 1, sm: 3, md: 5 }, mb: 10, width: "100%" }}>
        {items.map((item, i) => (
          <>
            <Card
              sx={{
                p: 2,
                py: 1,
                borderRadius: 10,
                width: "fit-content",
                ml: "auto",
                mt: 4,
                mb: 1,
              }}
            >
              <Typography fontSize={14}>{item.q}</Typography>
            </Card>
            <Answer text={item.a} />
          </>
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
          {items.length < 1 && (
            <Typography variant="caption" pl={1} gutterBottom>
              Ask me anything and I'll do my best to help you!
            </Typography>
          )}
          <Paper elevation={2} sx={{ borderRadius: 10 }}>
            <TextField
              id="prompt-input"
              placeholder="Your prompt..."
              fullWidth
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyUp={(event) => {
                if (event.key === "Enter") handleSubmit();
              }}
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
