import React, { useLayoutEffect, useState } from "react";
import gif1 from "assets/images/gifs/1.gif";
import gif2 from "assets/images/gifs/2.gif";
import gif3 from "assets/images/gifs/3.gif";
import gif4 from "assets/images/gifs/5.gif";
import { Box } from "@mui/material";

const gifs = [gif1, gif2, gif3, gif4];
export default function FlickeringBots() {
  const [gif, setGif] = useState(gifs[0]);
  useLayoutEffect(() => {
    setInterval(() => {
      const rand = Math.floor(Math.random() * gifs.length);
      setGif(gifs[rand]);
    }, 5000);
  }, []);

  return (
    <Box width={35} display="flex" sx={{ justifyContent: "center", alignItems: "center" }}>
      <img src={gif} height={40} alt="AI Bot" title="AI Bot" />
    </Box>
  );
}
