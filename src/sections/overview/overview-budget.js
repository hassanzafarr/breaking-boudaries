import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import Link from "next/link";

import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import {
  CardActions,
  Divider,
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
  Button,
} from "@mui/material";
import { getDashboardData, getUsers } from "../../Services/Auth.service";
import Loader from "../../components/Loader";
export const OverviewBudget = (props) => {
  const { sx } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setUsers(response.data.totalUsers);
        setIsLoading(false);
        // console.log(users.totalUsers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card sx={{ ...sx, padding: 0, margin: 0 }}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
          mb={2}
        >
          <Stack spacing={2}>
            <Typography color="text.secondary" variant="overline">
              Total Users
            </Typography>
            <Typography variant="h4">{isLoading ? <Loader /> : users}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <UsersIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Stack spacing={1}>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end", margin: 0, padding: 0 }}>
            <Link href="/users" style={{ color: "black" }}>
              <Button
                color="inherit"
                endIcon={
                  <SvgIcon fontSize="small">
                    <ArrowRightIcon />
                  </SvgIcon>
                }
                size="small"
              >
                See all users
              </Button>
            </Link>
          </CardActions>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBudget.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
