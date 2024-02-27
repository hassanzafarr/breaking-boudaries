import { React } from "react";
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
} from "@mui/material";
import { Scrollbar } from "../../components/scrollbar";
import { useRouter } from "next/router";

export const SubCatTable = (props) => {
  const { items = [], onPageChange = () => {}, page = 0, count = 0 } = props;
  const router = useRouter();
  if (!items || items.length === 0) {
    return (
      <Card>
        <Typography variant="subtitle1" textAlign="center" p={2}>
          No subcategories found
        </Typography>
        {/* <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          page={page}
          labelRowsPerPage=""
          rowsPerPage={0}
          rowsPerPageOptions={[]}
          labelDisplayedRows={() => ``}
        /> */}
      </Card>
    );
  }

  const handleViewSubcatItem = (subCategoryId) => {
    router.push(`/subcat-item?subCategoryId=${subCategoryId}`);
  };
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sub Cat</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                {/* Add other columns as needed */}
                <TableCell sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((subCat) => (
                <TableRow hover key={subCat.subCategoryId}>
                  <TableCell>
                    <Avatar src={subCat?.image} alt={`Avatar for ${subCat.subCategoryName}`} />
                  </TableCell>
                  <TableCell>{subCat.subCategoryName}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {subCat?.subCategoryType?.replace("_", " ")}
                  </TableCell>
                  {/* Add other columns as needed */}
                  <TableCell sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        handleViewSubcatItem(subCat.subCategoryId, subCat.categoryName)
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      {/* <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        page={page}
        labelRowsPerPage=""
        rowsPerPage={0}
        rowsPerPageOptions={[]}
        labelDisplayedRows={({ from, to, count }) => {
          return ``;
        }}
      /> */}
    </Card>
  );
};

SubCatTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  page: PropTypes.number,
};
