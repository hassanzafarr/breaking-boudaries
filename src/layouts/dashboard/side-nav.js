import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/solid/ArrowLeftOnRectangleIcon";

import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { Scrollbar } from "../../components/scrollbar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const router = useRouter();
  const handleSignOut = useCallback(() => {
    localStorage.clear();
    onClose?.();
    router.push("/auth/login");
  }, [onClose, router]);

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderRadius: 1,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              p: "18px 12px 12px 12px",
            }}
          >
            <div>
              <Typography color="inherit" variant="subtitle1">
                Breaking Boundries
              </Typography>
            </div>

            <img
              alt="Under development"
              src="/assets/breaking-logo.png"
              style={{
                display: "inline-block",
                maxWidth: "100%",
                width: 50,
                // height: 50,
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ borderColor: "neutral.90" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              // const active = item.path ? pathname === item.path : false;
              // const hasPath = Boolean(item.path);
              // const active = hasPath ? pathname === item.path : item;
              const active = item.path
                ? pathname === item.path || pathname === `${item.path}/`
                : false;
              // console.log(hasPath, active, "router");
              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: "neutral.90" }} />
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          <Stack direction="row" alignItems="flex-end" width="100%" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleSignOut}
              sx={{
                color: "neutral.400",
                borderColor: "neutral.90",
                "&:hover": {
                  borderColor: "neutral.90",
                  backgroundColor: "common.white",
                  color: "neutral.90",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <SvgIcon
                  component={ArrowLeftOnRectangleIcon}
                  fontSize="small"
                  sx={{ marginRight: "10px" }}
                />
                Log out
              </Stack>
            </Button>
          </Stack>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            // backgroundColor: "neutral.800",
            backgroundColor: "neutral.125",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.125",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
