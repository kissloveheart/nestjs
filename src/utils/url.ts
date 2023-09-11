export const formatUrlBucket = (path: string) => {
  if (path) {
    return `${process.env.GOOGLE_BUCKET_DOMAIN}/${path}`;
  }
  return path;
};
