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
import { deleteUsers, getUsers } from "../../Services/Auth.service";
import { CiTrash } from "react-icons/ci";

export const UsersTable = (props) => {
  const { items = [], onPageChange = () => {}, page = 0, count = 0 } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [person, setPerson] = useState(items.users);

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfileID, setUserProfileId] = useState(null);

  const handleDelete = (userID, profileId) => {
    console.log(userID, profileId);
    console.log("handleDelete");
    setIsDeleteConfirmationOpen(true);
    setSelectedUser(userID);
    setUserProfileId(profileId);
  };
  const handleConfirmDelete = async (userID) => {
    if (selectedUser && userProfileID) {
      try {
        setIsSubmitting(true);
        await deleteUsers(selectedUser, userProfileID);
        const response = await getUsers(page);
        setIsSubmitting(false);
        setIsDeleteConfirmationOpen(false);
        toast.success("User deleted successfully");
        setPerson(response.data.users);
      } catch (error) {
        console.error("Error deleting User:", error);
        setIsSubmitting(false);
        toast.error("Failed to delete User");

        setIsModalOpen(false);
      }
      setSelectedUser(null); // Reset the selected image ID for deletion
    }
  };

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
                <TableCell>Image</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {person.map((user, index) => (
                <TableRow hover key={user._id || index}>
                  <TableCell>
                    <Avatar src={user.image} alt={`Avatar for ${user.email}`} />
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user?.userName || "N/A"}</TableCell>
                  <TableCell>{user?.createdAt}</TableCell>

                  <TableCell sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CiTrash />}
                      onClick={() => handleDelete(user.userId, user.profileId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        page={page}
        labelRowsPerPage=""
        rowsPerPage={0}
        rowsPerPageOptions={[]}
        labelDisplayedRows={({ from, to, count }) => `${items.currentPage} of ${items.totalPages}`}
        nextIconButtonProps={{
          disabled: page >= items.totalPages,
        }}
        backIconButtonProps={{
          disabled: page === 1,
        }}
      />

      {/* Delete Modal */}
      <Modal open={isDeleteConfirmationOpen} onClose={() => setIsDeleteConfirmationOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 1,
            p: 4,
            maxWidth: "450px",
          }}
        >
          <Typography variant="h6" gutterBottom paragraph>
            Are you sure you want to delete this user?
          </Typography>

          <Stack direction={"row"} justifyContent={"flex-end"} gap={1} mt={5}>
            <Button color="inherit" onClick={() => setIsDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={isSubmitting}
              onClick={() => {
                // Perform the delete operation here
                handleConfirmDelete();
                // setIsDeleteConfirmationOpen(false);
              }}
            >
              {isSubmitting ? "Please Wait.." : "Delete"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Card>
  );
};

UsersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onPageChange: PropTypes.func,
  page: PropTypes.number,
};
