import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { formatDate } from "../../utils/dateUtils";

import {
  Box,
  Card,
  Table,
  Modal,
  Stack,
  TableBody,
  TableCell,
  Button,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  TablePagination,
} from "@mui/material";
import { Scrollbar } from "../../components/scrollbar";
import { toast } from "react-toastify";

export const BlogTable = (props) => {
  const { items = [], onPageChange = () => {}, page = 0, count = 0 } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [person, setPerson] = useState(items);
  console.log(person, "person");

  useEffect(() => {
    setPerson(items);
  }, [items]);

  const handlePageChange = (event, newPage) => {
    if (newPage >= items.totalPages || newPage < 0) {
      return;
    }
    onPageChange(event, newPage);
  };

  if (!items || items.length === 0) {
    return (
      <Card>
        <Typography variant="subtitle1" textAlign="center" p={2}>
          No data found
        </Typography>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          page={page}
          labelRowsPerPage=""
          rowsPerPage={0}
          rowsPerPageOptions={[]}
          labelDisplayedRows={() => ``}
        />
      </Card>
    );
  }

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                {items.some((user) => !["miscellaneous", "meals"].includes(user.categoryType)) && (
                  <TableCell>Link</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {person?.map((user, index) => (
                <TableRow hover key={index}>
                  <TableCell>
                    <Avatar src={user.blogImageUrl} alt={`Avatar for ${user.name}`} />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user?.description || "N/A"}</TableCell>
                  {user.categoryType !== "miscellaneous" && user.categoryType !== "meals" && (
                    <TableCell>
                      <a href={user.link} target="_blank" rel="noreferrer">
                        {user?.link}
                      </a>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      {/* <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        page={page}
        labelRowsPerPage=""
        rowsPerPage={0}
        rowsPerPageOptions={[]}
        labelDisplayedRows={({ from, to, count }) => `${items.currentPage} of ${items.totalPages}`}
        
        nextIconButtonProps={{
          disabled: page >= items.totalPages - 1,
        }}
        backIconButtonProps={{
          disabled: page === 0,
        }}
      /> */}
    </Card>
  );
};

BlogTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onPageChange: PropTypes.func,
  page: PropTypes.number,
};
