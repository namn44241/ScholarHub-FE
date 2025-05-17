export const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";

  // Case 1: Error with response data in format {detail: "message"}
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  // Case 2: Direct error object with detail property
  if (error.detail) {
    return error.detail;
  }

  // Case 3: Error with message property
  if (error.message) {
    return error.message;
  }

  // Case 4: Error is a string
  if (typeof error === "string") {
    return error;
  }

  // Default fallback
  return "An error occurred";
};
