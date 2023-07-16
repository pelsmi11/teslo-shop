export const getUrlImage = (image: string): string => {
  return image.includes("http")
    ? image
    : `${process.env.HOST_NAME}/products/${image}`;
};
