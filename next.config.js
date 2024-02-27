module.exports = {
  exportPathMap: async function (defaultPathMap) {
    return {
      "/users/index": { page: "/users" },
      "/categories/index": { page: "/categories" },
      "/blog/index": { page: "/blog" },
      "/subcat-item/index": { page: "/subcat-item" },
      "/sub-catergories/index": { page: "/sub-catergories" },
      "/": { page: "/" },
      "/404": { page: "/404" },
    };
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};
