import { React, useState, useEffect } from "react";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Table,
  Modal,
  TextField,
  Button,
  Card,
} from "@mui/material";
import { getUsers } from "../Services/Auth.service";

import { useRouter } from "next/router";
import Loader from "../components/Loader";
import { UsersTable } from "../sections/users/users-table";
import { toast } from "react-toastify";

const Page = () => {
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const islogin = JSON.parse(typeof window !== "undefined" && localStorage.getItem("isLogin"));
    if (!islogin) {
      setIsLoading(true);
      return router.push("auth/login");
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getUsers(page);

      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    if (newPage >= 1 && newPage <= users.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <Head>
        <title>Users | Breaking Boundries</title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography variant="h4">Users</Typography>
              </Stack>
            </Stack>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader />
              </Box>
            ) : (
              <Card>
                <UsersTable
                  count={users.length}
                  items={users}
                  page={page}
                  onPageChange={handlePageChange}
                />
              </Card>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
