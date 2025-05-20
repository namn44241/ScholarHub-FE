import { parse, isValid, format } from "date-fns";


/**
 * 
 * @param error - The error object to extract the message from
 * @returns A string representing the error message
 */
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

/**
 * Truncate a string to a specified length and append ellipsis if truncated
 * @param text - The string to truncate
 * @param maxLength - The maximum length of the string
 * @returns The truncated string with ellipsis if it was truncated
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

/**
 * Check if an object is null or empty
 * @param obj - The object to check
 * @returns True if the object is null, undefined, or empty; false otherwise
 */
export const isObjectNull = (obj: any): boolean => {
  return obj === null || obj === undefined || Object.keys(obj).length === 0 || Object.values(obj).every(value => value === null || value === undefined);
}


/**
 * Validate if a string is in the format dd/MM/yyyy
 * @param dateString - The date string to validate
 * @returns True if the string is in the correct format, false otherwise
 */
export function validateDateFormat(dateString?: string): boolean {
  if (!dateString) return true;

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateString)) return false;

  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
  return isValid(parsedDate);
}

/**
 * Convert a date string in dd/MM/yyyy format to ISO format (yyyy-MM-dd)
 * @param dateString - The date string to convert
 * @returns The converted date string in ISO format or undefined if invalid
 */
export function convertToISODate(dateString?: string): string | undefined {
  if (!dateString) return undefined;
  if (dateString.includes("-")) return dateString;

  try {
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, "yyyy-MM-dd");
    }
  } catch (error) {
    console.error("Error converting date to ISO:", error);
  }

  return undefined;
}

/**
 * Convert an ISO date string (yyyy-MM-dd) to dd/MM/yyyy format
 * @param isoDateString - The ISO date string to convert
 * @returns The converted date string in dd/MM/yyyy format or undefined if invalid
 */
export function formatDateFromISO(isoDateString?: string): string | undefined {
  if (!isoDateString) return undefined;

  if (isoDateString.includes("/")) return isoDateString;

  try {
    const date = new Date(isoDateString);
    if (isValid(date)) {
      return format(date, "dd/MM/yyyy");
    }
  } catch (error) {
    console.error("Error formatting date from ISO:", error);
  }

  return undefined;
}
