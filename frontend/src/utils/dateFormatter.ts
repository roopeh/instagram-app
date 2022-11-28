export const formatDateForProfile = (unixDate: number): string => {
  const date = new Date(Number(unixDate));
  const options: Intl.DateTimeFormatOptions = {
    month: "long", year: "numeric",
  };

  const formattedDate = date.toLocaleDateString("en-GB", options);
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).toLowerCase();
};

export const formatDateForPhoto = (unixDate: number): [string, string] => {
  const rawDetailedDate = new Date(Number(unixDate)).toLocaleDateString("en-GB", {
    month: "short", day: "2-digit", year: "numeric",
  });
  const detailedDate = rawDetailedDate.charAt(0).toUpperCase()
    + rawDetailedDate.slice(1).toLowerCase();

  const diffSeconds = Math.abs(Date.now() - unixDate) / 1000;
  if (diffSeconds < 10) {
    return ["0s", detailedDate];
  }
  if (diffSeconds < 60) {
    return [`${Math.round(diffSeconds / 10) * 10}s`, detailedDate];
  }
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) {
    return [`${diffMinutes}m`, detailedDate];
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return [`${diffHours}h`, detailedDate];
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return [`${diffDays}d`, detailedDate];
  }
  const diffWeeks = Math.round(diffDays / 7);
  if (diffWeeks < 51) {
    return [`${diffWeeks}w`, detailedDate];
  }

  // Return years
  return [`${Math.round(diffWeeks / 51)}y`, detailedDate];
};
