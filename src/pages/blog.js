import { React, useState, useEffect } from "react";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import dynamic from "next/dynamic";

import Head from "next/head";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { createBlogSub, getBlog, getBlogByID, getCat } from "../Services/Auth.service";

import { useRouter } from "next/router";
import Loader from "../components/Loader";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { BlogTable } from "../sections/blog/blog-table";
import Upload from "../components/upload";
import { MuiChipsInput } from "mui-chips-input";
import Image from "next/image";
import { CiTrash } from "react-icons/ci";

const Page = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("categoryType");
  const searchID = searchParams.get("categoryId");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  // const [categoryId, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fac, setFac] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [imageThumbnail, setImageThumbnail] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formInputs, setFormInputs] = useState({
    name: "",
    description: "",
    image: null,
    link: "",
  });
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await getBlogByID(searchID);
      setBlogs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchID && fetchData();
  }, [page, searchID]);
  useEffect(() => {
    setIsClient(true);
    // fetchData();
  }, []);
  useEffect(() => {
    const islogin = JSON.parse(typeof window !== "undefined" && localStorage.getItem("isLogin"));
    if (!islogin) {
      setIsLoading(true);
      return router.push("auth/login");
    }
  }, []);
  const { categoryType, categoryId } = router.query;

  const handlePageChange = (event, newPage) => {
    if (newPage >= 1 && newPage <= blogs.totalPages) {
      setPage(newPage);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormInputs({
      name: "",
      description: "",
      image: null,
      facilities: "",
      link: "",
    });
    setFac([]);
    setImageThumbnail(null);
    setImageFile(null);
    // setCategory("");
  };

  const handleFacChange = (newChips) => {
    setFac(newChips);
  };

  const handleInputChange = async (event) => {
    setFormInputs({ ...formInputs, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event) => {
    setFormInputs({ ...formInputs, image: event.target.files[0] });
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
    setFormInputs({ image: null });
    const input = document.getElementById("imageInput");
    if (input) {
      input.value = "";
    }
  };
  const setBlogCategories = ["personal_development", "miscellaneous", "finance", "meals"];

  const filterBlogCategories = categories.categories?.filter((cat) =>
    setBlogCategories.includes(cat.categoryType)
  );

  // console.log(filterBlogCategories, "filterBlogCategories");

  // const handleCategoryChange = (event) => {
  //   setCategory(event.target.value);
  // };

  const reqFields = [categoryId, formInputs.name, formInputs.description];
  const handleSubmit = async () => {
    try {
      if (reqFields.includes("")) {
        return toast.error("Please fill in all fields");
      }

      let payload = {
        categoryId: categoryId,
        name: formInputs.name,
        description: formInputs.description,
        image: formInputs.image,
        link: formInputs.link,
        facilities: fac,
      };

      // if (subCategories[0].categoryId === "Employment") {
      //   if (!subCategoryDescription) {
      //     return toast.error("Please write description");
      //   }
      //   const linkPattern = /^(http|https):\/\//;

      //   if (link && !linkPattern.test(link)) {
      //     return toast.error("Please enter a valid link starting with 'http://' or 'https://'");
      //   }
      //   if (link) {
      //     payload.link = link || "";
      //     console.log(payload.link);
      //   }
      //   payload = {
      //     ...payload,
      //     // link: link || "",
      //     subCategoryDescription,
      //   };
      // }

      setIsSubmitting(true);

      let response;

      response = await createBlogSub(payload);

      setIsSubmitting(true);

      toast.success("Blog Category added successfully!");

      handleCloseModal();

      setIsSubmitting(false);
      fetchData();
    } catch (error) {
      console.error("Error adding blog:", error);

      toast.error("Failed to add blog");
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  const isCategoriesAvailable = filterBlogCategories && filterBlogCategories.length > 0;

  // Find the category that matches the categoryType from the URL query parameter
  const selectedCategory = isCategoriesAvailable
    ? filterBlogCategories.find((category) => category.categoryType === router.query.categoryType)
    : null;

  return (
    <>
      <Head>
        <title>Blogs | Breaking Boundries</title>
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
              {isClient && (
                <Typography variant="h4">
                  {categoryType
                    ? categoryType
                        .replace(/_/g, " ")
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ") + " Blogs"
                    : ""}
                </Typography>
              )}
              <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Add Blog
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
                <BlogTable
                  count={blogs.length}
                  items={blogs}
                  page={page}
                  onPageChange={handlePageChange}
                />
              </Card>
            )}
          </Stack>
        </Container>
      </Box>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            width: 700,
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
          <Typography variant="h6">Add Blog</Typography>
          <Stack spacing={2} mt={2}>
            {/* <FormControl fullWidth variant="filled">
              <InputLabel id="category-select-label">Category</InputLabel>

              <Select
                labelId="category-select-label"
                id="category-select"
                name="categoryId"
                // value={selectedCategory ? selectedCategory.categoryId : ""}
                value={categoryId || ""}
                onChange={handleCategoryChange}
                disabled={!router.query.categoryType || !filterBlogCategories}
              >
                {filterBlogCategories &&
                  filterBlogCategories
                    .filter((category) => category.categoryType === router.query.categoryType)
                    .map((category) => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl> */}
            <Stack gap={2} direction={"row"}>
              <TextField
                required
                name="name"
                label="Name"
                value={formInputs.name}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="description"
                label="Description"
                value={formInputs.description}
                onChange={handleInputChange}
                fullWidth
              />
            </Stack>

            {categoryType === "finance" || categoryType === "personal_development" ? (
              <TextField
                name="link"
                label="Link"
                value={formInputs.link}
                onChange={handleInputChange}
                fullWidth
              />
            ) : null}
            {categoryType === "miscellaneous" ? (
              <MuiChipsInput
                value={fac}
                onChange={handleFacChange}
                helperText="Please Type Facilities Here"
                fullWidth
              />
            ) : null}
            {imageThumbnail && (
              <Box sx={{ position: "relative" }}>
                <Stack gap={2} alignItems={"center"}>
                  {/* <Image
                    src={imageThumbnail}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }} // optional
                  /> */}
                  <Image src={imageThumbnail} width={300} height={300} sizes="100vw" alt="Image" />
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
            <Stack spacing={2} direction="row" justifyContent={"space-between"}>
              <Upload
                selectedImage={imageFile}
                handleImageChange={handleImageChange}
                fileType="image/*"
                id="imageInput"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Blog"}
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
