// eslint-disable-next-line import/prefer-default-export
export const formatDateForProfile = (unixDate: number): string => {
  const date = new Date(Number(unixDate));
  const options: Intl.DateTimeFormatOptions = {
    // month: "long", year: "numeric",
    month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  };

  const formattedDate = date.toLocaleDateString(undefined, options);
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).toLowerCase();
};
