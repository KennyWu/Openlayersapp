export const IMAGE_TEMPLATE_URL =
  "https://www.star.nesdis.noaa.gov/smcd/emb/land/__products/test/{yyyymm}/{datatype}_{satellite}_{variable}_{yyyymm}_{day[night]}.{fileformat}";
export const LEGEND_TEMPLATE_URL =
  "./legend/legend_{variable}_{day[night]}.png";
export const PRODUCT_LAYERS_ID_MAPPING = { "#pl-1": 1, "#pl-2": 2, "#pl-3": 3 };
export const SELECTORS = {
  MONTH: ".month-selector",
  YEAR: ".year-selector",
  DAY_NIGHT: ".day-night-selector",
  OPACITY: ".opacity",
  PRODUCT_LAYER: ".product-layer-type",
  VISIBLE: ".visible",
  DATE: "#date",
  SATELLITE: ".satellite",
  Month_SELECT_RIGHT: "#month-right",
  Month_SELECT_LEFT: "#month-left",
};

export const SATELLITE = {
  JPSS: "jpss",
  MODIS: "modis",
  GPM: "gpm",
};

export const ANOMALYMAPPING = {
  LSTA: fillConstants(
    "lsta",
    "LST Anomaly",
    [SATELLITE.JPSS, SATELLITE.MODIS],
    true
  ),
  LST: fillConstants("lst", "LST", [SATELLITE.JPSS, SATELLITE.MODIS], true),
  LST_BORDERS: fillConstants("lsta", "LST Borders", [SATELLITE.JPSS], true),
  LAIA: fillConstants("laia", "LAI Anomaly", [SATELLITE.MODIS], false),
  LAI: fillConstants("lai", "LAI", [SATELLITE.MODIS], false),
  NDVIA: fillConstants("ndvia", "NDVI Anomaly", [SATELLITE.MODIS], false),
  NDVI: fillConstants("ndvi", "NDVI", [SATELLITE.MODIS], false),
  ETA: fillConstants("eta", "ET Anomaly", [SATELLITE.MODIS], false),
  ET: fillConstants("et", "ET", [SATELLITE.MODIS], false),
  ALBEDOA: fillConstants("albedoa", "ALBEDO Anomaly", [SATELLITE.MODIS], false),
  ALBEDO: fillConstants("albedo", "ALBEDO", [SATELLITE.MODIS], false),
  ALBEDO_SFA: fillConstants(
    "albedo-sfa",
    "ALBEDO-SF Anomaly",
    [SATELLITE.MODIS],
    false
  ),
  ALBEDO_SF: fillConstants("albedo-sf", "ALBEDO-SF", [SATELLITE.MODIS], false),
  PRCP_GPMA: fillConstants(
    "prcp-gpma",
    "PRCP GPM Anomaly",
    [SATELLITE.GPM],
    false
  ),
  PRCP_GPMA: fillConstants("prcp-gpm", "PRCP GPM", [SATELLITE.GPM], false),
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

function fillConstants(variable, name, satellites, hasDayNight) {
  return {
    variable: variable,
    name: name,
    satellites: satellites,
    hasDayNight: hasDayNight,
  };
}

Object.freeze(SELECTORS);
Object.freeze(ANOMALYMAPPING);
Object.freeze(SATELLITE);
Object.freeze(PRODUCT_LAYERS_ID_MAPPING);
Object.freeze(DATATYPE);
Object.freeze(FILEFORMAT);
Object.freeze(MONTHMAP);
