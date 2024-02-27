import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";

import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import NewspaperIcon from "@heroicons/react/24/solid/NewspaperIcon";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import Cog6ToothIcon from "@heroicons/react/24/solid/Cog6ToothIcon";

import { SvgIcon } from "@mui/material";
import Squares2X2Icon from "@heroicons/react/24/solid/Squares2X2Icon";
export const items = [
  {
    title: "Dashboard",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },

  {
    title: "Users ",
    path: "/users",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Categories",
    path: "/categories",
    icon: (
      <SvgIcon fontSize="small">
        <Squares2X2Icon />
      </SvgIcon>
    ),
  },
  // {
  //   title: "Blog",
  //   path: "/blog",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <PencilSquareIcon />
  //     </SvgIcon>
  //   ),
  // },
  // {
  //   title: "Support",
  //   path: "/support",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <Squares2X2Icon />
  //     </SvgIcon>
  //   ),
  // },
];
