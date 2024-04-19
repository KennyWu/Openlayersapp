export const IMAGE_TEMPLATE_URL =
  "./{yyyymm}/{datatype}_{satellite}_{variable}_{yyyymm}_{day[night]}.{fileformat}";
export const PRODUCT_LAYERS_ID_MAPPING = { "#pl-1": 1, "#pl-2": 2, "#pl-3": 3 };
export const SELECTORS = {
  MONTH: ".month-selector",
  YEAR: ".year-selector",
  DAY_NIGHT: ".day-night-selector",
  OPACITY: ".opacity",
  PRODUCT_LAYER: ".product-layer-type",
  VISIBLE: ".visible",
  DATE: "#date",
};
export const ANOMALYMAPPING = {
  LST: "lsta",
  ET: "eta",
};
export const SATELLITE = {
  JPSS: "jpss",
};
export const DATATYPE = {
  BORDERS: "detectionborders",
  IMAGE: "dataimage",
};
export const FILEFORMAT = {
  JSON: "json",
  PNG: "png",
};
export const DAYNIGHT = {
  DAY: "day",
  NIGHT: "night",
  NONE: "none",
};
export const MONTHMAP = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

export const ANOMALY_NAMES = {
  LST_ANOMALY: "LST Anomaly",
  LST_BORDER: "LST Borders",
  ET_ANOMALY: "ET Anomaly",
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

Object.freeze(SELECTORS);
Object.freeze(ANOMALYMAPPING);
Object.freeze(SATELLITE);
Object.freeze(PRODUCT_LAYERS_ID_MAPPING);
Object.freeze(DATATYPE);
Object.freeze(FILEFORMAT);
Object.freeze(MONTHMAP);
Object.freeze(ANOMALY_NAMES);
