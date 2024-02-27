import { Action } from "../config/action";

export const getUsers = async (page, limit = 10) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const response = await Action.get(`auth/get_users?page=${page}&&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};
export const getDashboardData = async () => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const response = await Action.get(`admin/dashboard_data`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const getBlog = async (page, limit = 10) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const response = await Action.get(`blog/get_all_blogs?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const getBlogByID = async (id) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const response = await Action.get(`blog/get_blogs_by_category_id?id=${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const deleteUsers = async (userId, profileId) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const reqData = {
      userId,
      profileId,
    };
    const response = await Action.delete(`auth/delete_user`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: reqData,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};
export const deleteSubCatItems = async (subcategoryId) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));

    const response = await Action.delete(`admin/delete_subcategory_item?id=${subcategoryId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const getCat = async (page, limit = 3) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const response = await Action.get(`admin/get_all_categories`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const getSubCat = async (categoryId) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const response = await Action.get(`admin/get_category?id=${categoryId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const getSubCatItem = async (subcategoryId, page = 1, limit = 40) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const response = await Action.get(
      `admin/get_subcategory?id=${subcategoryId}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};
export const getJobSubCatItem = async (subcategoryId, page = 1, limit = 40) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const response = await Action.get(
      `admin/get_job_subcategory?id=${subcategoryId}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const addCategory = async (image, categoryName, categoryType) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));

    const formData = new FormData();
    formData.append("image", image);
    formData.append("categoryName", categoryName);
    formData.append("categoryType", categoryType);

    const response = await Action.post("category/create_category", formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw new error(error.response.data.message);
  }
};

export const addSubCategory = async (payload) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));

    const formData = new FormData();
    formData.append("categoryId", payload.categoryId);
    formData.append("subCategoryName", payload.subCategoryName);
    formData.append("image", payload.image);
    formData.append("subCategoryType", payload.subCategoryType);

    const response = await Action.post("sub_category/create_sub_category", formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw new Error(error);
  }
};
export const addJobSubCategory = async (payload) => {
  console.log("Payload =>", payload);
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));

    const formData = new FormData();
    formData.append("categoryId", payload.categoryId);
    formData.append("subCategoryName", payload.subCategoryName);
    formData.append("image", payload.image);
    formData.append("subCategoryType", payload.subCategoryType);
    formData.append("subCategoryDescription", payload.subCategoryDescription);
    formData.append("link", payload.link);

    const response = await Action.post("job/create_job_sub_category", formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw new Error(error);
  }
};

export const addJobSubCategoryItem = async (payload) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));

    const formData = new FormData();
    formData.append("subCategoryId", payload.subCategoryId);
    formData.append("jobTitle", payload.jobTitle);
    formData.append("jobDescription", payload.jobDescription);
    formData.append("salary", payload.salary);

    formData.append("jobType", payload.jobType);
    formData.append("jobCategory", payload.jobCategory);
    formData.append("city", payload.city);
    formData.append("country", payload.country);
    formData.append("contactInfo", payload.contactInfo);
    formData.append("jobExperience", payload.jobExperience);
    formData.append("lat", payload.lat);
    formData.append("long", payload.lng);

    formData.append("image", payload.image);
    if (payload.jobSkills && payload.jobSkills.length > 0) {
      payload.jobSkills.forEach((jobSkill) => {
        formData.append("jobSkills", jobSkill);
      });
    } else if (payload.jobSkills) {
      formData.append("jobSkills", payload.jobSkills[0]);
    }
    if (payload.facilities && payload.facilities.length > 0) {
      payload.facilities.forEach((facility) => {
        formData.append("facilities", facility);
      });
    }

    const response = await Action.post("job/create_job_subcategory_item", formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const addSubCategoryItem = async (payload) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));

    const formData = new FormData();
    formData.append("subCategoryId", payload.subCategoryId);
    formData.append("subCategoryItemName", payload.subCategoryItemName);
    formData.append("subCategoryItemDescription", payload.subCategoryItemDescription);
    formData.append("subCategoryItemPhone", payload.subCategoryItemPhone);

    formData.append("city", payload.city);
    formData.append("country", payload.country);
    formData.append("lat", payload.lat);
    formData.append("long", payload.lng);
    formData.append("subCategoryItemAddress", payload.subCategoryItemAddress);

    formData.append("image", payload.image);
    formData.append("subCategoryOpenTime", payload.openTime);
    formData.append("subCategoryCloseTime", payload.closeTime);
    const response = await Action.post("subcategory_item/create_subcategory_item", formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};
export const createBlogSub = async (payload) => {
  console.log(payload, "Payload is here");
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));

    const formData = new FormData();
    formData.append("categoryId", payload.categoryId);
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("image", payload.image);
    if (payload.link && payload.link.length > 0) {
      formData.append("link", payload.link);
    }
    if (payload.facilities && payload.facilities.length > 0) {
      payload.facilities.forEach((facility) => {
        formData.append("facilities", facility);
      });
    }

    const response = await Action.post("blog/create_blog_subcategory", formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};
export const addCategoryVideo = async (payload) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));

    const formData = new FormData();
    formData.append("categoryId", payload.categoryId);
    formData.append("videoDescription", payload.videoDescription);
    formData.append("categoryMedia", payload.video);
    formData.append("categoryFileType", "video");

    const response = await Action.post("category/add_video", formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const updateVideo = async (payload) => {
  // console.log("updatedData : ", updatedData);
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const formData = new FormData();
    formData.append("categoryId", payload.categoryId);
    formData.append("videoDescription", payload.videoDescription);
    formData.append("categoryMedia", payload.video);

    const response = await Action.put(`category/update_video`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
      console.error("Erroeeeeeeeeeer:", error.message);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const addUser = async (email, password, name) => {
  try {
    const authToken = JSON.parse(localStorage.getItem("token"));
    const response = await Action.post(
      `admin/createUser`,
      {
        email,
        password,
        name,
      },
      {
        headers: {
          Authorization: `Bearer  ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }
    throw error;
  }
};

export const adminLogin = async (payload) => {
  try {
    const response = await Action.post("/auth/admin_login", payload);
    return response.data;
  } catch (error) {
    throw new Error(`Error in adminLogin ${error}`, { cause: error });
  }
};
