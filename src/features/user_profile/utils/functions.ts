import { format } from "date-fns";

export const formatDate = (date: Date | string | undefined) => {
  if (!date) return "";
  return format(new Date(date), "PPP");
};

export const toCapitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};