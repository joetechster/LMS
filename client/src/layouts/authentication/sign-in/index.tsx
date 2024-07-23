import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signInUser, User } from "utils/auth";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "utils/globals";
import PageLayout from "examples/LayoutContainers/PageLayout";
import { useAlert } from "react-alert";
import logo from "assets/images/logo.jpg";
import MDBox from "components/MDBox";
import { MenuItem } from "@mui/material";

export default function SignIn() {
  const [type, setType] = React.useState("student");

  const navigate = useNavigate();
  const alert = useAlert();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const res = await fetch(`${baseUrl}sign-in/`, { method: "POST", body: data });
    if (res.status === 200) {
      const credentials: { token: string; user: User } = await res.json();
      signInUser(credentials.user, credentials.token);
      alert.show("Sign in successful", { type: "success" });
      navigate("/");
      location.reload();
    } else {
      alert.show("Something went wrong", { type: "error" });
    }
  };

  return (
    <PageLayout>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MDBox component="img" src={logo} alt="Brand" width="5rem" sx={{ borderRadius: 2 }} />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              required
              fullWidth
              name="type"
              label="User Type"
              select
              SelectProps={{ sx: { height: "45px", minHeight: "100%" } }}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              label={type === "student" ? "Matriculation Number" : "Username"}
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: "#fff" }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </PageLayout>
  );
}

const defaultTheme = createTheme({ typography: { fontFamily: "Inter" } });
