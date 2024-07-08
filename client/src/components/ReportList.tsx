import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import {} from "@mui/icons-material";
import { baseUrl } from "../utils/globals";
import { User, getUser } from "../utils/auth";
import EditReportDialog from "./EditReport";
import NewReportDialogForm from "./NewReport";
import AddButton from "./AddButton";

export interface Report {
  id: number;
  crime_code: { code: string; description: string };
  crime_statement: string;
  crime_status: string;
  created_at: string;
  user: User;
}

const ReportList = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const { token } = useMemo(getUser, [])!;
  const [reload, setReload] = useState(true);

  useLayoutEffect(() => {
    fetch(`${baseUrl}report/`, { headers: { Authorization: `Token ${token}` } })
      .then((response) => response.json())
      .then((data) => setReports(data));
  }, [reload]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseNew = () => {
    setOpenNew(false);
  };
  const handleClick = (report: Report) => {
    setOpen(true);
    setReport(report);
  };

  return (
    <List>
      {reports.length > 0 ? (
        reports.map((report) => (
          <div key={report.id}>
            <ListItem button onClick={() => handleClick(report)} sx={{ gap: 3 }}>
              <ListItemAvatar sx={{ p: 0, display: "flex", alignItems: "center", flexShrink: 0.5 }}>
                <Avatar alt={report.user.first_name} src={`${baseUrl}${report.user.passport}`} />
                <div style={{ overflow: "hidden" }}>
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
                    {report.user.email}
                  </Typography>
                </div>
              </ListItemAvatar>
              <ListItemText
                primary={`${report.crime_code.code} - ${report.crime_code.description}`}
                secondary={report.crime_statement}
                style={{ marginLeft: "auto" }}
                primaryTypographyProps={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                secondaryTypographyProps={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              />
            </ListItem>
            <Divider />
          </div>
        ))
      ) : (
        <div style={{ height: "10rem", display: "grid", placeItems: "center", padding: 10 }}>
          <Typography variant="body1" component="p" textAlign="center">
            You have no reports yet
            <br />
            Please add a new report
          </Typography>
        </div>
      )}
      <EditReportDialog
        open={open}
        report={report}
        handleClose={handleClose}
        setReload={setReload}
      />
      <NewReportDialogForm
        open={openNew}
        handleClose={handleCloseNew}
        title="Add New Report"
        setReload={setReload}
      />
      <AddButton open={openNew} setOpen={setOpenNew} />
    </List>
  );
};

export default ReportList;
