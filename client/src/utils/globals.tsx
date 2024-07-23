import MDBox from "components/MDBox";
import { getUser } from "./auth";
import MDTypography from "components/MDTypography";

export const baseUrl = "http://127.0.0.1:8000/";

export const fetch_authenticated = (route, options, form = false) => {
  const { token } = getUser();
  const headers = new Headers();
  headers.append("Authorization", `Token ${token}`);
  if (!form) headers.append("Content-Type", "application/json");

  return fetch(`${baseUrl}${route}`, {
    ...options,
    headers,
  });
};

export const Course = ({ title, code }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {code}
    </MDTypography>
    <MDTypography variant="caption">{title}</MDTypography>
  </MDBox>
);
