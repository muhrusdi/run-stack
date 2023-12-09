import type { RecordType } from "~/types";

export const wait = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const generateQueries = (query?: RecordType) => {
  if (query) {
    const obj = new URLSearchParams(query);
    return "?" + obj.toString();
  }

  return "";
};

export const generateParams = (params?: RecordType) => {
  let paramsString = "";
  if (params) {
    if (Array.isArray(params)) {
      params.forEach((item) => {
        paramsString += `/${item}`;
      });
    } else {
      Object.keys(params).forEach((key) => {
        paramsString += `/${(params as RecordType)[key]}`;
      });
    }
  }

  return paramsString;
};
