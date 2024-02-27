import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import Link from "next/link";
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
import { getCat, getDashboardData } from "../../Services/Auth.service";
import Loader from "../../components/Loader";
import Feed from "@heroicons/react/24/solid/ChatBubbleOvalLeftEllipsisIcon";
import Squares2X2Icon from "@heroicons/react/24/solid/Squares2X2Icon";
export const OverviewTotalFeedbacks = (props) => {
  const { sx } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [cat, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();

        setData(response.data.totalCategories);
        setIsLoading(false);
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
              Total Categories
            </Typography>
            <Typography variant="h4">{isLoading ? <Loader /> : cat}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <Squares2X2Icon />
            </SvgIcon>
          </Avatar>
        </Stack>

        <Stack spacing={1}>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end", margin: 0, padding: 0 }}>
            <Link href="/categories" style={{ color: "black" }}>
              <Button
                color="inherit"
                endIcon={
                  <SvgIcon fontSize="small">
                    <ArrowRightIcon />
                  </SvgIcon>
                }
                size="small"
              >
                See all categories
              </Button>
            </Link>
          </CardActions>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalFeedbacks.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string.toString,
  sx: PropTypes.object,
};
