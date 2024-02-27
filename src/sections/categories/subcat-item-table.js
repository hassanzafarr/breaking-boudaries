import { React, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  Button,
  TableHead,
  Avatar,
  TableRow,
  Typography,
  TablePagination,
  Modal,
} from "@mui/material";
import { Scrollbar } from "../../components/scrollbar";
import { formatToAMPM } from "../../utils/dateUtils";
import { deleteSubCatItems } from "../../Services/Auth.service";
import { CiTrash } from "react-icons/ci";
import { Stack } from "@mui/system";
import { toast } from "react-toastify";

export const SubCatItemTable = (props) => {
  const { items = [], onPageChange = () => {}, page = 0, count = 0, jobitems = [] } = props;
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subItemId, setSubItemId] = useState(null);
  if (!items || items.length === 0) {
    return (
      <Card>
        <Typography variant="subtitle1" textAlign="center" p={2}>
          No subcategories found
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

  const handleDelete = (subCategoryItemId) => {
    setIsDeleteConfirmationOpen(true);
    setSubItemId(subCategoryItemId);
  };
  const handleConfirmDelete = async (userID) => {
    if (subItemId) {
      try {
        setIsSubmitting(true);
        await deleteSubCatItems(subItemId);
        // const response = await getUsers(page);
        setIsSubmitting(false);
        setIsDeleteConfirmationOpen(false);
        toast.success("Sub Category Item deleted successfully");
        // setPerson(response.data.users);
      } catch (error) {
        console.error("Error deleting Sub Category Item:", error);
        setIsSubmitting(false);
        toast.error("Failed to delete Sub Category Item");

        setIsDeleteConfirmationOpen(false);
      }
    }
  };
  console.log(jobitems, "dsdsdsdsdsdhshdhshd");
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          {jobitems[0]?.categoryName === "Employment" ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Job Type</TableCell>
                  <TableCell>Job Category</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Skills</TableCell>
                  <TableCell>Job Experience</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Job Description</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobitems.map((subCat, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Avatar
                        src={subCat?.imageUrl}
                        alt={`Avatar for ${subCat.subCategoryItemName}`}
                      />
                    </TableCell>
                    <TableCell>{subCat.jobType}</TableCell>
                    <TableCell>{subCat?.jobCategory}</TableCell>
                    <TableCell>{subCat?.city}</TableCell>
                    <TableCell>{subCat?.country}</TableCell>
                    <TableCell>{subCat?.contactInfo}</TableCell>
                    <TableCell>{subCat?.salary}</TableCell>
                    <TableCell>{subCat?.jobSkills}</TableCell>
                    <TableCell>{subCat?.jobExperience}</TableCell>
                    <TableCell>{subCat?.jobTitle}</TableCell>
                    <TableCell>{subCat?.jobDescription}</TableCell>
                    <TableCell sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CiTrash />}
                        onClick={() => handleDelete(subCat.subCategoryItemId)}
                      >
                        Delete
                      </Button>
                    </TableCell>

                    {/* Add other columns as needed */}
                    {/* <TableCell sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                 <Button variant="outlined" color="error">
                   View
                 </Button>
               </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sub Cat</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Close Time</TableCell>
                  <TableCell>Average Rating</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items &&
                  items?.items.map((subCat, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Avatar
                          src={subCat?.subCategoryItemImage}
                          alt={`Avatar for ${subCat.subCategoryItemName}`}
                        />
                      </TableCell>
                      <TableCell>{subCat.subCategoryItemName}</TableCell>
                      <TableCell>{subCat?.subCategoryItemDescription}</TableCell>
                      <TableCell>{subCat?.subCategoryItemPhone}</TableCell>
                      <TableCell>{subCat?.city}</TableCell>
                      <TableCell>{subCat?.country}</TableCell>
                      <TableCell>{subCat?.subCategoryOpenTime}</TableCell>
                      <TableCell>{subCat.subCategoryCloseTime || "N/A"}</TableCell>

                      <TableCell>{subCat?.averageRating}</TableCell>
                      <TableCell sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CiTrash />}
                          onClick={() => handleDelete(subCat.subCategoryItemId)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        page={page}
        labelRowsPerPage=""
        rowsPerPage={0}
        rowsPerPageOptions={[]}
        labelDisplayedRows={({ from, to, count }) =>
          `${items.pagination.currentPage} of ${items.pagination.totalPages}`
        }
        nextIconButtonProps={{
          disabled: page >= items.totalPages - 1,
        }}
        backIconButtonProps={{
          disabled: page === 1,
        }}
      />
      {/* 
      Delete Modal  */}
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
            Are you sure you want to delete this Subcategory Item?
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

SubCatItemTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  page: PropTypes.number,
};
