import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import axios from "axios";
import { useRouter } from "next/navigation";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    axios.get("/api/auth/getUser").then((res) => {
      if (res.data.success && res.data.success === true) {
        const user = res.data.user;
        if (user.isAdmin === true) router.push("/");
      }
    });
  }, [router]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios.post("/api/auth/login/", loginData).then((res) => {
      if (res.data.success && res.data.success === true) router.push("/");
      else alert("Credentials are wrong!");
    });
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1} textAlign={"center"}>
          {title}
        </Typography>
      ) : null}

      {/* {subtext} */}
      <form onSubmit={onSubmit}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="username"
              mb="5px"
            >
              Username
            </Typography>
            <CustomTextField
              variant="outlined"
              fullWidth
              value={loginData.username}
              onChange={(e: any) => setLoginData({ ...loginData, username: e.target.value })}
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <CustomTextField
              type="password"
              variant="outlined"
              fullWidth
              value={loginData.password}
              onChange={(e: any) => setLoginData({ ...loginData, password: e.target.value })}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            {/* <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Remeber this Device"
          />
        </FormGroup>
        <Typography
          component={Link}
          href="/"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "primary.main",
          }}
        >
          Forgot Password ?
        </Typography> */}
          </Stack>
        </Stack>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          // component={Link}
          // href="/"
          type="submit"
        >
          Sign In
        </Button>
        <Box></Box>
      </form>
      {/* {subtitle} */}
    </>
  );
};

export default AuthLogin;
