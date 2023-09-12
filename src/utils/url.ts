export const formatUrlBucket = (path: string) => {
  if (path && !/\b(http|https)/.test(path)) {
    return `${process.env.GOOGLE_BUCKET_DOMAIN}${path}`;
  }
  return path;
};
