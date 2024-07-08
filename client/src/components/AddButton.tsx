import React from "react";
import { makeStyles } from "@mui/styles";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 16,
    right: 16,
  },
}));

export default function AddButton({ open, setOpen }) {
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <div className={classes.root}>
        <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      </div>
    </>
  );
}
