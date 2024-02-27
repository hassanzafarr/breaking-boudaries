import { React, useState, useEffect } from "react";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { getSubCat, addSubCategory, addJobSubCategory } from "../Services/Auth.service";

import { useRouter } from "next/router";
import Loader from "../components/Loader";
import { SubCatTable } from "../sections/categories/subcat-table";
import { toast } from "react-toastify";

import { categoryTypes } from "../utils/category-type";
import Upload from "../components/upload";
import { CiTrash } from "react-icons/ci";
import Image from "next/image";
const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categoryId } = router.query;
  const [subCategoryName, setSubName] = useState("");
  const [subCategoryType, setSubCategoryType] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageThumbnail, setImageThumbnail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [link, setLink] = useState("");
  const [subCategoryDescription, setSubCategoryDescription] = useState("");

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
      if (categoryId == "655b4e2a3ead95030abc7f8c") {
        const response = await getSubCat(categoryId);
        setSubCategories(response.data.subCategories);
      } else {
        const response = await getSubCat(categoryId);
        setSubCategories(response.data.subCategories);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching cat:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    categoryId && fetchData();
  }, [router, page]);

  const handlePageChange = (event, newPage) => {
    const nextPageIndex = newPage - 1;
    const hasNextPageData = nextPageIndex < subCategories.totalPages;
    if (hasNextPageData) {
      setPage(newPage);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubName("");
    setSubCategoryType("");
    setSelectedImage(null);
  };
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    const selectedImage = event.target.files[0];

    // Generate a thumbnail preview for the new image
    if (selectedImage) {
      setImageFile(selectedImage);
      const reader = new FileReader();
      reader.onload = (e) => setImageThumbnail(e.target.result);
      reader.readAsDataURL(selectedImage);
    }
  };
  const handleDeselectImage = () => {
    setImageThumbnail(null);
    setImageFile(null);
  };

  const handleNameChange = (event) => {
    setSubName(event.target.value);
  };
  const handleTypeChange = (event) => {
    setSubCategoryType(event.target.value);
  };

  const reqFields = [categoryId, selectedImage, subCategoryName, subCategoryType];

  const handleSubmit = async () => {
    try {
      if (!selectedImage) {
        return toast.error("Please upload picture");
      }
      if (reqFields.includes("")) {
        return toast.error("Please fill in all fields");
      }

      let payload = {
        categoryId,
        subCategoryName,
        image: selectedImage,
        subCategoryType,
      };

      if (subCategories[0].categoryName === "Employment") {
        if (!subCategoryDescription) {
          return toast.error("Please write description");
        }
        const linkPattern = /^(http|https):\/\//;

        if (link && !linkPattern.test(link)) {
          return toast.error("Please enter a valid link starting with 'http://' or 'https://'");
        }
        if (link) {
          payload.link = link || "";
          console.log(payload.link);
        }
        payload = {
          ...payload,
          // link: link || "",
          subCategoryDescription,
        };
      }

      setIsSubmitting(true);

      let response;
      if (subCategories[0].categoryName === "Employment") {
        response = await addJobSubCategory(payload);
      } else {
        response = await addSubCategory(payload);
      }
      setIsSubmitting(true);

      console.log("Sub Category added successfully:", response);
      toast.success("Sub Category added successfully!");
      setIsModalOpen(false);
      setSubName("");
      setSubCategoryType("");
      setSelectedImage(null);
      setSubCategoryDescription("");
      setLink("");
      setIsSubmitting(false);

      setSubCategories((prevCat) => [...prevCat, response.data]);

      fetchData();
    } catch (error) {
      console.error("Error adding sub category:", error);

      toast.error("Failed to add sub category");
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };
  // console.log(subCategories[0]?.categoryType);
  // console.log(subCategories[0]);
  return (
    <>
      <Head>
        <title>Sub Categories | Breaking Boundaries</title>
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
                <Typography variant="h4">Sub Categories</Typography>
              </Stack>
              <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Add Sub Category
              </Button>
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
                <SubCatTable
                  count={subCategories.length}
                  items={subCategories}
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
            width: 600,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "10px",
            maxHeight: "90vh",
            overflowY: "auto",
            p: 4,
          }}
        >
          <Typography variant="h6">Add Sub Category</Typography>
          <Stack spacing={2} mt={2}>
            <Stack direction={"row"} gap={2}>
              <TextField
                name="Sub CategoryName"
                label="Sub CategoryName"
                value={subCategoryName}
                onChange={handleNameChange}
                fullWidth
              />

              <FormControl fullWidth variant="filled">
                <InputLabel id="demo-simple-select-label">Category Type</InputLabel>
                <Select
                  sx={{ outline: "none", textTransform: "capitalize" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={subCategoryType}
                  label="subCategoryType"
                  onChange={handleTypeChange}
                >
                  {categoryTypes.map((category) =>
                    category.categoryName.toLowerCase() ===
                    subCategories[0]?.categoryName.toLowerCase()
                      ? category.types.map((type) => (
                          <MenuItem key={type} value={type} sx={{ textTransform: "capitalize" }}>
                            {type.replace("_", " ")}
                          </MenuItem>
                        ))
                      : null
                  )}
                </Select>
              </FormControl>

              {subCategories.length > 0 && subCategories[0].categoryName === "Employment" && (
                <>
                  <TextField
                    name="link"
                    label="Link"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    fullWidth
                  />
                  <TextField
                    name="subCategoryDescription"
                    label="Sub Category Description"
                    value={subCategoryDescription}
                    onChange={(event) => setSubCategoryDescription(event.target.value)}
                    fullWidth
                  />
                </>
              )}
            </Stack>
            {imageThumbnail && (
              <Box sx={{ position: "relative" }}>
                <Stack gap={2} alignItems={"center"}>
                  <Image src={imageThumbnail} width={200} height={200} alt="Image" sizes="100vw" />
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CiTrash />}
                    onClick={handleDeselectImage}
                    fullWidth
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            )}

            <Stack spacing={1} direction="row" justifyContent={"space-between"}>
              <Upload
                selectedImage={selectedImage}
                handleImageChange={handleImageChange}
                fileType="image/*"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Sub Category"}
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
