import dayjs from "dayjs";
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatToAMPM = (dateString) => {
  const date = dayjs(dateString);
  const formattedTime = date.format("h:mm A");
  return formattedTime;
};
