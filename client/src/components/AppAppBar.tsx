import * as React from "react";
import { PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "./ToggleColorMode";
import { getUser, signOut } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/globals";

const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const navigate = useNavigate();
  const { user } = React.useMemo(getUser, [])!;
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              {/* <img
                src={
                  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg"
                }
                style={logoStyle}
                alt="logo of sitemark"
              /> */}
              <Typography variant="h5" color="text.primary" sx={{ pl: 2 }}>
                Security System
              </Typography>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              {user && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 10 }}>
                  <img
                    src={(baseUrl + user.passport) as string}
                    alt="profile picture"
                    style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <Typography variant="body1" color="text.primary">
                    Hi {user.first_name || user.email}
                  </Typography>
                </div>
              )}
              <SignInSignOut ls />
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "end",
                      p: 2,
                      justifyContent: "space-between",
                      flexGrow: 1,
                    }}
                  >
                    {user && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={(baseUrl + user.passport) as string}
                          alt="profile picture"
                          style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
                        />
                        <Typography variant="body1" component="p" style={{ marginLeft: 10 }}>
                          Hi {user.first_name || user.email}
                        </Typography>
                      </div>
                    )}
                    <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  </Box>
                  <Divider />
                  <SignInSignOut />
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default AppAppBar;

function SignInSignOut({ ls }: { ls?: boolean }) {
  const user = getUser();

  const handleSignOut = () => {
    signOut();
    window.location.reload();
  };

  if (user) {
    if (ls) {
      return (
        <Button
          color="primary"
          size="small"
          variant="contained"
          component="a"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      );
    }
    return (
      <MenuItem onClick={handleSignOut}>
        <Button color="primary" variant="contained" component="a" sx={{ width: "100%" }}>
          Sign Out
        </Button>
      </MenuItem>
    );
  }
  if (ls) {
    return (
      <>
        <Button
          color="primary"
          variant="text"
          size="small"
          component="a"
          href="/sign-in"
          target="_blank"
        >
          Sign in
        </Button>
        <Button
          color="primary"
          variant="contained"
          size="small"
          component="a"
          href="/sign-up/"
          target="_blank"
        >
          Sign up
        </Button>
      </>
    );
  }
  return (
    <>
      <MenuItem>
        <Button
          color="primary"
          variant="outlined"
          component="a"
          href="/sign-in/"
          target="_blank"
          sx={{ width: "100%" }}
        >
          Sign in
        </Button>
      </MenuItem>
      <MenuItem>
        <Button
          color="primary"
          variant="contained"
          component="a"
          href="/sign-up/"
          target="_blank"
          sx={{ width: "100%" }}
        >
          Sign up
        </Button>
      </MenuItem>
    </>
  );
}
