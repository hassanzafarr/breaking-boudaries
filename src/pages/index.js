import Head from "next/head";
import { React, useState, useEffect } from "react";
import {
  Box,
  Container,
  Unstable_Grid2 as Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";

import { useRouter } from "next/navigation";
import BaseLayout from "../layouts/BaseLayout";
import Image from "next/image";
import Logo from "../../public/assets/breaking-logo.png";
import { OverviewBudget } from "../sections/overview/overview-budget";
import { OverviewTotalFeedbacks } from "../sections/overview/overview-total-feedbacks";
const Page = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(null);

  useEffect(() => {
    const loginStatus =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("isLogin")) : null;

    setIsLogin(loginStatus);

    if (loginStatus === null) {
      router.push("/auth/login");
    }
  }, []);

  const Layout = isLogin ? DashboardLayout : BaseLayout;

  return (
    <>
      <Head>
        <title>Home | Breaking Boundries</title>
      </Head>
      <Layout>
        {isLogin ? (
          <Box component="main">
            <Container maxWidth="xl">
              <Stack spacing={1}>
                <Typography variant="h4">Dashboard</Typography>
              </Stack>
              <Grid container spacing={3} mt={2}>
                <Grid xs={12} sm={6} lg={6}>
                  <OverviewBudget sx={{ height: "90%", padding: 0 }} />
                </Grid>
                <Grid xs={12} sm={6} lg={6}>
                  <OverviewTotalFeedbacks sx={{ height: "90%", padding: 0 }} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div
              style={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image src={Logo} height={100} width={100} alt="Main" />
              <LinearProgress
                sx={{
                  width: "100%",
                  marginTop: "25px",
                  color: "neutral.75",
                }}
                color="inherit"
              />
            </div>
          </Box>
        )}
      </Layout>
    </>
  );
};

export default Page;
