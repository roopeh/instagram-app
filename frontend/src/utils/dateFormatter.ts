/* eslint-disable no-nested-ternary */
export const formatDateForProfile = (unixDate: number): string => {
  const date = new Date(Number(unixDate));
  const options: Intl.DateTimeFormatOptions = {
    month: "long", year: "numeric",
  };

  const formattedDate = date.toLocaleDateString("en-GB", options);
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).toLowerCase();
};

export const formatDateForPhoto = (unixDate: number, shortened: boolean): [string, string] => {
  const rawDetailedDate = new Date(Number(unixDate)).toLocaleDateString("en-GB", {
    month: "short", day: "2-digit", year: "numeric",
  });
  const detailedDate = rawDetailedDate.charAt(0).toUpperCase()
    + rawDetailedDate.slice(1).toLowerCase();

  const diffSeconds = Math.abs(Date.now() - unixDate) / 1000;
  if (diffSeconds < 10) {
    const seconds: string = shortened ? "s" : " seconds ago";
    return [`0${seconds}`, detailedDate];
  }
  if (diffSeconds < 60) {
    const seconds: string = shortened ? "s" : " seconds ago";
    return [`${Math.round(diffSeconds / 10) * 10}${seconds}`, detailedDate];
  }
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) {
    const minutes: string = shortened
      ? "m"
      : diffMinutes === 1 ? " minute ago" : " minutes ago";
    return [`${diffMinutes}${minutes}`, detailedDate];
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    const hours: string = shortened
      ? "h"
      : diffHours === 1 ? " hour ago" : " hours ago";
    return [`${diffHours}${hours}`, detailedDate];
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    const days: string = shortened
      ? "d"
      : diffDays === 1 ? " day ago" : " days ago";
    return [`${diffDays}${days}`, detailedDate];
  }
  const diffWeeks = Math.round(diffDays / 7);
  if (diffWeeks < 51) {
    const weeks: string = shortened
      ? "w"
      : diffWeeks === 1 ? " week ago" : " weeks ago";
    return [`${diffWeeks}${weeks}`, detailedDate];
  }

  // Return years
  const diffYears = Math.round(diffWeeks / 51);
  const years: string = shortened
    ? "y"
    : diffYears === 1 ? " year ago" : " years ago";
  return [`${diffYears}${years}`, detailedDate];
};

export const formatDateForMessage = (unixDate: number): string => {
  const diffSeconds = Math.abs(Date.now() - unixDate) / 1000;
  const date = new Date(Number(unixDate));
  if (diffSeconds >= (24 * 60 * 60)) {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    };

    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  }

  const hours: string = String(date.getHours()).padStart(2, "0");
  const minutes: string = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
