import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { adminLogin } from "../../Services/Auth.service";
import { Box, Button, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";

import { Layout as AuthLayout } from "../../layouts/auth/layout";

const Page = () => {
  const router = useRouter();
  // const auth = useAuth();
  const [method, setMethod] = useState("email");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      const data = {
        email: email,
        password: password,
        deviceType: "postman",
        deviceToken: "abc",
      };
      const response = await adminLogin(data);

      if (response.data) {
        localStorage.setItem("isLogin", JSON.stringify(true));
        localStorage.setItem("user", JSON.stringify(response.data.Admin));
        localStorage.setItem("token", JSON.stringify(response.data.accessToken));
        toast.success(response.message);
        return router.push("/"); // Redirect to users page
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "admin@admin.com",
      password: "123456",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await handleLogin(values.email, values.password);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  return (
    <>
      <Head>
        <title>Login | Breaking Boundries</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            {/* <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
            </Stack> */}
            {/* <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="Email" value="email" />
            </Tabs> */}
            {method === "email" && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>

                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{
                    mt: 3,
                    bgcolor: "#3B3A3F",
                    ":hover": {
                      bgcolor: "#232227",
                      color: "white",
                    },
                  }}
                  type="submit"
                  variant="contained"
                  onClick={formik.handleSubmit}
                >
                  {isLoading ? "Please Wait" : "Login"}
                </Button>
              </form>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
