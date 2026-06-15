export const extractToken = (url: string) => {
  console.log("Extracting token from URL:", url);
  const match = url.match(/[?&]token=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};