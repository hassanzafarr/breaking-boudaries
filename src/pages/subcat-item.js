import { React, useState, useEffect } from "react";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";

import Head from "next/head";
import MapPinIcon from "@heroicons/react/24/solid/MapPinIcon";
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  Button,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  SvgIcon,
  MenuItem,
} from "@mui/material";
import {
  getSubCatItem,
  addSubCategoryItem,
  addJobSubCategoryItem,
  getJobSubCatItem,
} from "../Services/Auth.service";
import GoogleMapReact from "google-map-react";
import { MuiChipsInput } from "mui-chips-input";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import { SubCatItemTable } from "../sections/categories/subcat-item-table";
import { toast } from "react-toastify";
import { Scrollbar } from "../components/scrollbar";
import Upload from "../components/upload";
import { CountrySelector, StateSelector, CitySelector } from "volkeno-react-country-state-city";
import "volkeno-react-country-state-city/dist/index.css";
import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/material.css'";

import "react-phone-input-2/lib/material.css";
import { CiTrash } from "react-icons/ci";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [subCategories, setSubCategories] = useState([]);
  const [jobSubCategories, setjobSubCategories] = useState([]);
  const [jobSkill, setJobSkill] = useState([]);
  const [fac, setFac] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState();
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [country, setCountry] = useState("United States");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [imageThumbnail, setImageThumbnail] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  // const [pageData, setPageData] = useState([]);
  const [formInputs, setFormInputs] = useState({
    subCategoryItemName: "",
    subCategoryItemDescription: "",
    subCategoryItemPhone: "",
    city: "",
    // country: "",
    subCategoryItemAddress: "",
    image: null,
    openTime: "",
    closeTime: "",
    //extrass
    jobTitle: "",
    jobType: "",
    jobDescription: "",
    salary: "",
  });

  const jobTypeEnum = ["Full-Time", "Part-Time", "Contract", "Internship"];
  const jobCategory = ["IT", "Marketing", "Finance", "Sales", "Customer Service", "Other"];
  const jobEx = ["freshy", "1-3 Years", "3-5 Years", "5+ Years"];
  const { subCategoryId } = router.query;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const islogin = JSON.parse(typeof window !== "undefined" && localStorage.getItem("isLogin"));
    if (!islogin) {
      setIsLoading(true);
      return router.push("auth/login");
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);
  const AnyReactComponent = ({ text, icon }) => (
    <Stack>
      <SvgIcon fontSize="large">{icon}</SvgIcon>
    </Stack>
  );
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // if(subCategoryId === "")
      const response = await getSubCatItem(subCategoryId, page);
      const responsesec = await getJobSubCatItem(subCategoryId, page);
      console.log(JSON.stringify(response, null, 2));
      setjobSubCategories(responsesec.data.jobs);

      setSubCategories(response.data);
      if (response.data.items[0]?.categoryName === "Employment") {
        setModalType("job");
        console.log("Model Type Set JOBBBBB");
      } else {
        setModalType("default");
        console.log("Model Type Set JOBBBBB");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    subCategoryId && fetchData();
  }, [router, page]);

  // const handlePageChange = (event, newPage) => {
  //   const nextPageIndex = newPage - 1;
  //   const hasNextPageData = nextPageIndex < subCategories.pagination.totalPages;
  //   if (hasNextPageData) {
  //     setPage(newPage);
  //   }
  // };

  // const handlePageChange = (event, newPage) => {
  //   if (newPage >= 1 && newPage <= subCategories.totalPages) {
  //     setPage(newPage);
  //   }
  // };

  const handlePageChange = (event, newPage) => {
    if (
      (newPage >= 1 && newPage <= subCategories.totalPages) ||
      newPage <= subCategories.pagination.totalPages
    ) {
      setPage(newPage);
    }
  };

  const handleOpenModal = () => {
    // console.log(subCategories.items[0].categoryName, "CATERGORY NAME");
    // if (
    //   subCategories[0]?.categoryName === "Employment" ||
    //   subCategories[0]?.subCategoryId === "65c2c254ec19dfd038c11815"
    // ) {
    //   setModalType("job");
    // } else {
    //   setModalType("default");
    // }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormInputs({
      subCategoryItemName: "",
      subCategoryItemDescription: "",
      subCategoryItemPhone: "",
      city: "",
      country: "",
      subCategoryItemAddress: "",
      image: null,
      openTime: "",

      closeTime: "",
      jobTitle: "",
      jobCategory: "",
      facilities: "",
      jobExperience: "",
      jobType: "",
    });
    setJobSkill([]);
    setFac([]);
    setCountry("");
    setCity("");
    setState("");
  };

  const handleInputChange = async (event) => {
    setFormInputs({ ...formInputs, [event.target.name]: event.target.value });
  };

  const handleJobChange = (newChips) => {
    if (newChips.length === 1) {
      newChips = [newChips[0]];
    }
    setJobSkill(newChips);
  };

  const handleFacChange = (newChips) => {
    setFac(newChips);
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

  const handleCountryChange = (option) => {
    setCountry(option);
    console.log(option, "option.name");
    console.log(country, "selected country");
  };

  const handleStateSelect = (option) => {
    setState(option);
    console.log(option, "State");
  };

  const handleCitySelect = (option) => {
    setCity(option);
    console.log(option, "City");
  };

  const handlePhoneChange = (value) => {
    setFormInputs({ ...formInputs, subCategoryItemPhone: value });
    // console.log(value);
  };

  const handleApiLoaded = (map, maps) => {
    const marker = new maps.Marker({
      position: center,
      map,
      title: "My Marker",
    });

    maps.event.addListener(map, "click", function (event) {
      setCenter({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
      marker.setPosition(center);
    });
  };
  const handleSubmit = async () => {
    try {
      console.log(country, "coutry name");
      console.log(center.lat, "center");
      let payload;
      let response;
      if (modalType === "job") {
        console.log("JOB MODALLLL");
        if (
          !formInputs.jobTitle ||
          !formInputs.jobDescription ||
          !formInputs.salary ||
          !formInputs.jobType ||
          !formInputs.jobCategory ||
          // !formInputs.city ||
          !country ||
          !formInputs.contactInfo ||
          !formInputs.jobExperience ||
          !formInputs.image ||
          !formInputs.lat ||
          !formInputs.lng ||
          !center.lat ||
          !center.lng
        ) {
          // return toast.error(`${""}` ? "Please Select Your Locaion" : "Please fill in all fields");
          return toast.error("Please fill in all fields");
        }

        if (isNaN(formInputs.salary)) {
          return toast.error("Salary must be a number");
        }
        payload = {
          subCategoryId,
          jobTitle: formInputs.jobTitle,
          jobDescription: formInputs.jobDescription,
          salary: formInputs.salary,
          jobType: formInputs.jobType,
          jobCategory: formInputs.jobCategory,
          city: city.name,
          country: country.name + "," + state.name,
          contactInfo: formInputs.contactInfo,
          jobExperience: formInputs.jobExperience,
          facilities: fac,
          lat: formInputs.lat,
          lng: formInputs.lng,
          jobSkills: jobSkill.length > 0 ? jobSkill : [],
          image: formInputs.image,
        };
        console.log("payload=Data", payload);
        setIsSubmitting(true);
        response = await addJobSubCategoryItem(payload);
      } else {
        console.log("THISSS IS NOT THE JOB APIIIIIIi");
        if (
          !formInputs.subCategoryItemName
          // !formInputs.subCategoryItemDescription ||
          // !formInputs.subCategoryItemPhone ||
          // !formInputs.city ||
          // !formInputs.country ||
          // !formInputs.subCategoryItemAddress ||
          // !formInputs.image ||
          // !formInputs.openTime ||
          // !formInputs.closeTime
        ) {
          return toast.error("Please fill in all fields");
        }

        payload = {
          subCategoryId,
          ...formInputs,
          country: country.name + "," + state.name,
          city: city.name,
        };
        console.log("payload =>", payload);
        setIsSubmitting(true);
        response = await addSubCategoryItem(payload);
      }
      // setIsSubmitting(true);
      // const response = await addSubCategoryItem(payload);
      setIsSubmitting(false);
      toast.success("Sub Category Item added successfully!");
      handleCloseModal();

      setJobSkill([]);
      setIsSubmitting(false);
      // setSubCategories((prevCat) => [...prevCat, response.data]);
      fetchData();
    } catch (error) {
      console.error("Error adding sub category item:", error);

      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Head>
        <title>Categories | Breaking Boundaries</title>
      </Head>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
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
                <Typography variant="h4">Sub Categories Items</Typography>
              </Stack>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenModal}
                disabled={isLoading}
              >
                Add Sub Category Items
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
                <SubCatItemTable
                  count={subCategories.length}
                  items={subCategories}
                  jobitems={jobSubCategories}
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
        {modalType === "default" ? (
          <Box
            sx={{
              position: "absolute",
              width: 700,

              overflow: "auto",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "10px",
              maxHeight: "80vh",
              overflowY: "auto",
              p: 4,
            }}
          >
            <Typography variant="h6">Add Sub Category Item </Typography>
            <Stack spacing={2} mt={2}>
              <TextField
                label="Name"
                name="subCategoryItemName"
                value={formInputs.subCategoryItemName}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Description"
                name="subCategoryItemDescription"
                value={formInputs.subCategoryItemDescription}
                onChange={handleInputChange}
                fullWidth
              />
              {/* <TextField
                label="Phone No"
                name="subCategoryItemPhone"
                value={formInputs.subCategoryItemPhone}
                onChange={handleInputChange}
                fullWidth
              /> */}
              <PhoneInput
                disableDropdown={"true"}
                country={"us"}
                value={formInputs.subCategoryItemPhone}
                onChange={handlePhoneChange}
                inputStyle={{ width: "100%" }}
              />
              <Stack direction={"row"} padding={0} zIndex={2} marginTop={0}>
                {/* <TextField
                  label="Country"
                  name="country"
                  value={formInputs.country}
                  onChange={handleInputChange}
                  fullWidth
                /> */}
                {/* <TextField
                  label="City"
                  name="city"
                  value={formInputs.city}
                  onChange={handleInputChange}
                  fullWidth
                /> */}
                <CountrySelector
                  onChange={handleCountryChange}
                  name="country"
                  placeholder="Select a country"
                  value={country}
                  defaultCountry="US"
                  countries={[
                    { code: "US", name: "United States" },
                    { code: "CA", name: "Canada" },
                  ]}
                />
                <StateSelector
                  country={country}
                  name="state"
                  value={state}
                  countryPlaceholder="Select a country first"
                  onChange={handleStateSelect}
                />
                <CitySelector
                  state={state}
                  name="city"
                  value={city}
                  statePlaceholder="Select a state first"
                  onChange={handleCitySelect}
                />
              </Stack>

              <TextField
                label="Address"
                name="subCategoryItemAddress"
                value={formInputs.subCategoryItemAddress}
                onChange={handleInputChange}
                fullWidth
              />
              {/* <MuiChipsInput value={chips} onChange={handleChange} /> */}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction={"row"} gap={2}>
                  <TimePicker
                    label="Open Time"
                    value={formInputs.openTime}
                    onChange={(newValue) => {
                      setFormInputs({ ...formInputs, openTime: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} error={false} />}
                  />
                  <TimePicker
                    label="Close Time"
                    value={formInputs.closeTime}
                    onChange={(newValue) => {
                      setFormInputs({ ...formInputs, closeTime: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} error={false} />}
                  />
                </Stack>
              </LocalizationProvider>

              <Stack>
                <div style={{ height: "40vh", width: "100%" }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyD05lyYxpJb6DUATmIeV8bJlWnRKzNiShE" }}
                    // bootstrapURLKeys={{ key: "" }

                    defaultCenter={{ lat: 0, lng: 0 }}
                    center={center}
                    defaultZoom={11}
                    onClick={({ lat, lng }) => {
                      setCenter({ lat, lng });
                      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                      setFormInputs({ ...formInputs, lat: lat, lng: lng });
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                  >
                    <AnyReactComponent
                      key={`${center.lat},${center.lng}`}
                      lat={center.lat}
                      lng={center.lng}
                      icon={<MapPinIcon color="red" />}
                    />
                  </GoogleMapReact>
                </div>
              </Stack>
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
                    <Image src={imageThumbnail} width={300} height={300} sizes="100vw" />
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
                  selectedImage={formInputs.image}
                  handleImageChange={handleImageChange}
                  fileType="image/*"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Sub Category Item"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Box
            sx={{
              position: "absolute",
              width: 800,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "10px",
              p: 4,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6">Add Sub Job Category Job Item</Typography>
            <Stack spacing={2} mt={2}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  label="Job Title"
                  name="jobTitle"
                  value={formInputs.jobTitle}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Job Description"
                  name="jobDescription"
                  value={formInputs.jobDescription}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Stack>

              <Stack direction={"row"} gap={2}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Job Category</InputLabel>
                  <Select
                    sx={{ outline: "none", textTransform: "capitalize" }}
                    name="jobCategory"
                    value={formInputs.jobCategory}
                    onChange={handleInputChange}
                  >
                    {jobCategory.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="filled">
                  <InputLabel>Job Experience</InputLabel>
                  <Select
                    sx={{ outline: "none", textTransform: "capitalize" }}
                    name="jobExperience"
                    value={formInputs.jobExperience}
                    onChange={handleInputChange}
                  >
                    {jobEx.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="filled">
                  <InputLabel id="job-type-label">Job Type</InputLabel>
                  <Select
                    sx={{ outline: "none", textTransform: "capitalize" }}
                    labelId="job-type-label"
                    id="job-type"
                    name="jobType"
                    value={formInputs.jobType}
                    onChange={handleInputChange}
                  >
                    {jobTypeEnum.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={"row"} gap={2}>
                <TextField
                  label="Salary"
                  name="salary"
                  value={formInputs.salary}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  type="number"
                  label="Contact Info"
                  name="contactInfo"
                  value={formInputs.contactInfo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Stack>
              <Stack direction={"row"} gap={2}>
                <MuiChipsInput
                  value={fac}
                  onChange={handleFacChange}
                  helperText="Please Type Facilities Here"
                  fullWidth
                />
                <MuiChipsInput
                  value={jobSkill}
                  onChange={handleJobChange}
                  helperText="Please Type Job Skills Here"
                  fullWidth
                />
              </Stack>
              {/* <Stack direction={"row"} gap={2}>
                <TextField
                  label="City"
                  name="city"
                  value={formInputs.city}
                  onChange={handleInputChange}
                  fullWidth
                />
                <CountrySelector
                  onChange={handleCountryChange}
                  name="country"
                  placeholder="Select a country"
                  value={country}
                />
              </Stack> */}
              <Stack direction={"row"} padding={0} zIndex={2} marginTop={0}>
                {/* <TextField
                  label="Country"
                  name="country"
                  value={formInputs.country}
                  onChange={handleInputChange}
                  fullWidth
                /> */}
                {/* <TextField
                  label="City"
                  name="city"
                  value={formInputs.city}
                  onChange={handleInputChange}
                  fullWidth
                /> */}
                <CountrySelector
                  onChange={handleCountryChange}
                  name="country"
                  placeholder="Select a country"
                  value={country}
                  defaultCountry="US"
                />
                <StateSelector
                  country={country}
                  name="state"
                  value={state}
                  countryPlaceholder="Select a country first"
                  onChange={handleStateSelect}
                />
                <CitySelector
                  state={state}
                  name="city"
                  value={city}
                  statePlaceholder="Select a state first"
                  onChange={handleCitySelect}
                />
              </Stack>

              <Stack>
                <div style={{ height: "40vh", width: "100%" }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyD05lyYxpJb6DUATmIeV8bJlWnRKzNiShE" }}
                    // bootstrapURLKeys={{ key: "" }

                    defaultCenter={{ lat: 0, lng: 0 }}
                    center={center}
                    defaultZoom={11}
                    onClick={({ lat, lng }) => {
                      setCenter({ lat, lng });
                      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                      setFormInputs({ ...formInputs, lat: lat, lng: lng });
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                  >
                    <AnyReactComponent
                      key={`${center.lat},${center.lng}`}
                      lat={center.lat}
                      lng={center.lng}
                      icon={<MapPinIcon color="red" />}
                    />
                  </GoogleMapReact>
                </div>
              </Stack>
              <Stack spacing={2} direction="row" justifyContent={"space-between"}>
                <Upload
                  selectedImage={formInputs.image}
                  handleImageChange={handleImageChange}
                  fileType="image/*"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Sub Category Item"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
