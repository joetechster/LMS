import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Alert,
} from "@mui/material";
import { Report } from "./ReportList";
import { baseUrl } from "../utils/globals";
import { getUser } from "../utils/auth";

const EditReportDialog = ({
  report,
  open,
  handleClose,
  setReload,
}: {
  report: Report | null;
  open: boolean;
  handleClose: () => any;
  setReload: (p: any) => any;
}) => {
  const [alert, setAlert] = useState<any | null>(null);
  const [statement, setStatement] = useState(report?.crime_statement);
  const [code, setCode] = useState(report?.crime_code.code);
  const [codes, setCodes] = useState<{ code: string; description: string }[]>([]);
  const { user, token } = useMemo(getUser, [])!;
  useEffect(() => {
    setStatement(report?.crime_statement);
    setCode(report?.crime_code.code);
  }, [report?.id]);

  useLayoutEffect(() => {
    fetch(`${baseUrl}crime-codes`)
      .then((res) => res.json())
      .then((codes) => setCodes(codes));
  }, []);

  const handleSend = async (method) => {
    return fetch(`${baseUrl}report/${report?.id}/`, {
      method,
      body: JSON.stringify({
        crime_statement: statement,
        user: user.id,
        crime_code: code,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
  };

  const _handleClose = () => {
    setAlert(null);
    handleClose();
    setReload((p) => !p);
  };

  const handleUpdate = async () => {
    const res = await handleSend("PUT");
    const data = await res.json();
    setAlert({ severity: "success", message: "Updated report successfully" });
    setTimeout(_handleClose, 1000);
  };

  const handleDelete = async () => {
    const res = await handleSend("DELETE");
    setAlert({ severity: "success", message: "Deleted report successfully" });
    setTimeout(_handleClose, 1000);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Report Details</DialogTitle>
      {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
      <DialogContent>
        <div style={{ display: "flex" }}>
          <Avatar alt={report?.user.first_name} src={`${baseUrl}${report?.user.passport}`} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="body1"
              component="p"
              style={{
                marginLeft: 10,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {report?.user.first_name + " " + report?.user.last_name}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              style={{
                marginLeft: 10,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {report?.user.email}
            </Typography>
          </div>
        </div>
        <TextField
          multiline
          variant="standard"
          margin="dense"
          id="description"
          label="Description"
          type="text"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel id="select-label" sx={{ left: -15, top: 5 }}>
            Crime Code
          </InputLabel>
          <Select
            labelId="select-label"
            id="select"
            value={code || ""}
            variant="standard"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpdate}>Update</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReportDialog;
