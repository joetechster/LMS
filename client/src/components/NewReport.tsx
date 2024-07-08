import React, { useLayoutEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { baseUrl } from "../utils/globals";
import { getUser } from "../utils/auth";
import Alert from "@mui/material/Alert";

interface DialogFormProps {
  title: string;
  open: boolean;
  handleClose: () => any;
  setReload: any;
}
export default function DialogForm({ title, open, handleClose, setReload }: DialogFormProps) {
  const [alert, setAlert] = useState<any | null>(null);
  const [codes, setCodes] = useState<{ code: string; description: string }[]>([]);
  const [code, setCode] = useState<string | undefined>("");
  const [statement, setStatement] = useState<string | undefined>("");
  const { user, token } = useMemo(getUser, [])!;

  const _handleClose = () => {
    setStatement("");
    setCode("");
    setAlert(null);
    handleClose();
    window.location.reload();
  };
  const handleAdd = async () => {
    try {
      const res = await fetch(`${baseUrl}report/`, {
        method: "POST",
        body: JSON.stringify({
          crime_statement: statement,
          user: user.id,
          crime_code: codes.find((item) => item.code === code)?.["code"],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      const data = await res.json();
      setAlert({ severity: "success", message: "Added report successfully" });
      setTimeout(_handleClose, 1000);
    } catch (e) {
      setAlert({ severity: "error", message: "Oops something went wrong" });
      console.log(e);
    } finally {
    }
  };

  useLayoutEffect(() => {
    fetch(`${baseUrl}crime-codes`)
      .then((res) => res.json())
      .then((codes) => setCodes(codes));
  }, []);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
        <FormControl fullWidth sx={{ mt: 1, minWidth: 120 }}>
          <InputLabel id="select-label">Crime Code</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            value={code}
            label="Crime Code"
            onChange={(e) => setCode(e.target.value)}
          >
            {codes.map((code, i) => {
              return (
                <MenuItem key={i} value={code.code}>
                  {code.description}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <TextField
          multiline
          minRows={3}
          maxRows={6}
          margin="dense"
          id="description"
          label="Description"
          type="text"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
