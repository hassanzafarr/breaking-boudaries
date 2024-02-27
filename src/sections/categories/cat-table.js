import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Card,
  Table,
  Stack,
  TableBody,
  TableCell,
  Button,
  TableHead,
  TableRow,
  Modal,
  TextField,
  Typography,
  Avatar,
  TablePagination,
} from "@mui/material";
import { Scrollbar } from "../../components/scrollbar";
import { useRouter } from "next/router";
import { addCategoryVideo, updateVideo } from "../../Services/Auth.service";
import Upload from "../../components/upload";
import SearchBar from "../../components/topBar";
import { toast } from "react-toastify";
import { CiTrash } from "react-icons/ci";

export const CatTable = (props) => {
  const { items = [], onPageChange = () => {}, page = 0, count = 0 } = props;
  const router = useRouter();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoDescription, setVideoDescription] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoHai, setVideoHai] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const categoriesToHide = ["personal_development", "meals", "finance"];
  // const filteredCategories = items.categories.filter(
  //   (category) => !categoriesToHide.includes(category.categoryType)
  // );

  const [filteredData, setFilteredData] = useState(items.categories);
  // Function to handle clicking on "View" button
  const handleViewSubcategories = (categoryId, categoryType) => {
    const redirectToBlogPage =
      categoryType === "personal_development" ||
      categoryType === "meals" ||
      categoryType === "finance" ||
      categoryType === "miscellaneous";

    // Redirect to the blog page if the condition is met
    if (redirectToBlogPage) {
      // router.push(`/blog?categoryType=${categoryType}`);
      router.push(`/blog?categoryType=${categoryType}&categoryId=${categoryId}`);
    } else {
      // Redirect to the sub-categories page for other category types
      router.push(`/sub-catergories?categoryId=${categoryId}`);
    }
  };

  // console.log(videoDescription, "videoDescription");
  const handleOpenVideoModal = (categoryId, hasVideo) => {
    console.log(hasVideo, "Has Video");
    console.log(categoryId, "categoryId");
    setIsVideoModalOpen(true);

    setCategoryId(categoryId);
    if (hasVideo) {
      setVideoHai(true);
    } else {
      setVideoHai(false);
    }
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    // setVideoDescription("");
    setVideoFile(null);
    setCategoryId(null);
    setVideoThumbnail(null);
  };

  const handleAddVideo = async () => {
    // if (videoHai) {
    //   console.log("Video");
    // } else {
    //   console.log("Video Nhi hain");
    // }
    if (!videoDescription || !videoFile || !categoryId) {
      toast.error("Please provide video description and select a video file.");
      return;
    }
    console.log("Selected Category ID for Video:", categoryId);
    try {
      const payload = {
        categoryId,
        videoDescription,
        video: videoFile,
      };
      setIsSubmitting(true);

      if (videoHai) {
        await updateVideo(payload);
        toast.success("Video added successfully!");
      } else {
        await addCategoryVideo(payload);
        toast.success("Video added successfully!");
      }

      setIsSubmitting(false);
      handleCloseVideoModal();
    } catch (error) {
      console.error("Error adding video:", error);
      toast.error("Failed to add video. Please try again.");
    }
  };

  const handleVideoChange = (event) => {
    setVideoFile(event.target.files[0]);
    setVideoThumbnail(null);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoThumbnail(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const handleDeselectVideo = () => {
    setVideoThumbnail(null);
    setVideoFile(null);
  };

  const handleDataFiltered = (filtered) => {
    console.log(filtered, "filtered");
    setFilteredData(filtered);
  };

  if (!items || items.length === 0) {
    return (
      <Card>
        <Typography variant="subtitle1" textAlign="center" p={2}>
          No data found
        </Typography>
        {/* <TablePagination
          component="div"
          count={count}
          onPageChange={"onPageChange"}
          page={page}
          labelRowsPerPage=""
          rowsPerPage={0}
          rowsPerPageOptions={[]}
          labelDisplayedRows={() => ``}
        /> */}
      </Card>
    );
  }

  return (
    <>
      <SearchBar dataArray={items.categories} onDataFiltered={handleDataFiltered} />
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>CATEGORY Name</TableCell>
                  {/* <TableCell>Type</TableCell> */}
                  <TableCell sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((cate) => (
                    <TableRow hover key={cate.categoryId}>
                      <TableCell>
                        <Avatar src={cate.image} alt={`Avatar for ${cate.email}`} />
                      </TableCell>
                      <TableCell>{cate.categoryName}</TableCell>
                      {/* <TableCell>{cate?.categoryType}</TableCell> */}
                      <TableCell sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleViewSubcategories(cate.categoryId, cate.categoryType)
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleOpenVideoModal(cate.categoryId, cate?.hasVideo)}
                        >
                          {cate?.hasVideo ? "Edit Video" : "Add Video"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      <strong>No categories found</strong>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        {/* <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          page={"page"}
          labelRowsPerPage=""
          rowsPerPage={0}
          rowsPerPageOptions={[]}
          labelDisplayedRows={({ from, to, count }) => {
            return ``;
          }}
        /> */}
        <Modal open={isVideoModalOpen} onClose={handleCloseVideoModal}>
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
              minWidth: "700px",
            }}
          >
            <Stack gap={2}>
              <Typography variant="h6" gutterBottom>
                {/* {items?.hasVideo ? "Edit" : "Add"} */}
                {videoHai ? "Edit Video" : "Add Video"}
              </Typography>

              <TextField
                label="Video Description"
                fullWidth
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
              />
              <Stack gap={2} direction={"column"}>
                {videoThumbnail && (
                  <Box sx={{ position: "relative" }}>
                    <Stack gap={2}>
                      <video width="100%" height="240" controls>
                        <source src={videoThumbnail} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CiTrash />}
                        onClick={handleDeselectVideo}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Box>
                )}

                <Stack direction={"row"} justifyContent={"space-between"} gap={2}>
                  <Upload
                    selectedImage={videoFile}
                    handleImageChange={handleVideoChange}
                    fileType="video/*"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddVideo}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Video"}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      </Card>
    </>
  );
};

CatTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onPageChange: PropTypes.func,
  page: PropTypes.number,
};
