import { React, useState, useEffect } from "react";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import Head from "next/head";
import Link from "next/link";
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
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { getCat, addCategory } from "../Services/Auth.service"; // Import the addCategory function
import { CiCirclePlus } from "react-icons/ci";
import { useRouter } from "next/router";
import Loader from "../components/Loader";

import { toast } from "react-toastify";
import { CatTable } from "../sections/categories/cat-table";
import Upload from "../components/upload";
const Page = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cat, setCat] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const categoryTypes = [
    "food",
    "housing",
    "utilities",
    "schools",
    "meals",
    "finance",
    "child_care",
    "employment",
    "support_program",
    "personal_development",
    "entertainment",
    "miscellaneous",
    "under_18",
  ];
  const router = useRouter();

  useEffect(() => {
    const islogin = JSON.parse(typeof window !== "undefined" && localStorage.getItem("isLogin"));
    if (!islogin) {
      setIsLoading(true);
      return router.push("auth/login");
    }
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getCat(page);
      // console.log(JSON.stringify(response.data, null, 2));
      setCat(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching cat:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    const nextPageIndex = newPage - 1; // Assuming page numbers start from 1

    // Check if there are items on the next page (page + 1)
    const hasNextPageData = nextPageIndex < cat.totalPages;

    if (hasNextPageData) {
      setPage(newPage);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setCategoryType("");
    setSelectedImage(null);
  };
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleNameChange = (event) => {
    setCategoryName(event.target.value);
  };
  const handleTypeChange = (event) => {
    setCategoryType(event.target.value);
  };

  const reqFields = [selectedImage, categoryName, categoryType];
  const handleSubmit = async () => {
    try {
      if (reqFields.includes("")) {
        return toast.error("Please fill in all fields");
      }
      setIsSubmitting(true);
      const response = await addCategory(selectedImage, categoryName, categoryType);

      console.log("Category added successfully:", response);
      toast.success("Category added successfully!");

      setIsModalOpen(false);
      setCategoryName("");
      setCategoryType("");
      setSelectedImage(null);
      setIsSubmitting(false);
      setCat((prevCat) => [...prevCat, response.data]);

      fetchData();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Head>
        <title>Categories | Breaking Boundaries</title>
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
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">Categories</Typography>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleOpenModal}
                startIcon={<CiCirclePlus size={22} />}
              >
                Add Category
              </Button> */}
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
                <CatTable
                  count={cat.length}
                  items={cat}
                  page={page}
                  onPageChange={handlePageChange}
                />
              </Card>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Add Category Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            width: 400,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "10px",
            p: 4,
          }}
        >
          <Typography variant="h6">Add Category</Typography>
          <Stack spacing={2} mt={2}>
            <TextField
              name="categoryName"
              label="Category Name"
              value={categoryName}
              onChange={handleNameChange}
              fullWidth
            />

            <FormControl fullWidth variant="filled">
              <InputLabel id="demo-simple-select-label">Category Type</InputLabel>
              <Select
                sx={{ outline: "none", textTransform: "capitalize" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryType}
                label="categoryType"
                onChange={handleTypeChange}
              >
                {categoryTypes.map((type) => (
                  <MenuItem key={type} value={type} sx={{ textTransform: "capitalize" }}>
                    {type.replace("_", " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack spacing={2} direction="row" justifyContent={"space-between"}>
              <Upload selectedImage={selectedImage} handleImageChange={handleImageChange} />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Category"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
