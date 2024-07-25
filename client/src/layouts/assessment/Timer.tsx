import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TimerOutlined } from "@mui/icons-material";

const CountdownTimer = ({ callback, seconds = 300 }) => {
  const [time, setTime] = useState(seconds); // Initial countdown value in seconds (e.g., 5 minutes)
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      clearInterval(interval);
      callback();
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const resetTimer = () => {
    setTime(300); // Reset to initial value (5 minutes)
    setIsActive(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        padding: "20px",
      }}
    >
      <TimerOutlined color="white" />
      <Typography color={"#fff"}>{formatTime(time)}</Typography>
    </Box>
  );
};

export default CountdownTimer;
