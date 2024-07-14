export const IMAGE_TEMPLATE_URL =
  "https://www.star.nesdis.noaa.gov/smcd/emb/land/__products/test/{yyyymm}/{datatype}_{satellite}_{variable}_{yyyymm}_{day[night]}.{fileformat}";
export const LEGEND_TEMPLATE_URL =
  "./legend/legend_{variable}_{day[night]}.png";
export const PRODUCT_LAYERS_ID_MAPPING = { "#pl-1": 1, "#pl-2": 2, "#pl-3": 3 };
export const ANIMATE_PRODUCT_LAYER_ENABLE = [
  "#animatepl-1",
  "#animatepl-2",
  "#animatepl-3",
];
export const SELECTORS = {
  DAY_NIGHT: ".day-night-selector",
  OPACITY: ".opacity",
  PRODUCT_LAYER: ".product-layer-type",
  VISIBLE: ".visible",
  DATE: "#date",
  SATELLITE: ".satellite",
  CONTINENTS: "#continents",
  ENABLE_ANIMATE: "#animate",
  ANIMATE_SPEED: "#animate-speed",
  ANIMATE_FROM: "#from-date",
  ANIMATE_TO: "#to-date",
  ANIMATION_LAYER: "#animation-layer",
  ANIMATION_DATE_RANGE: "#animation-date-range",
  ANIMATION_CONFIGURE: "#animation-configure",
  ANIMATION_PRODUCT_LAYER: "#animation-product-layer",
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

export const CONTINENTS = ["Global", "AF", "AS", "EU", "NA", "OC", "SA"];

export const CONTINENT_VIEWS = {
  Global: {
    center: [0, 0],
    zoom: 2,
  },
  NA: {
    center: [-94.17006657178112, 44.140217956349986],
    zoom: 3.3584629689815606,
  },
  SA: {
    center: [-57.33868773101648, -21.095320348067848],
    zoom: 3.856796302314895,
  },
  AF: {
    center: [28.70623446400729, 0.20404521197346392],
    zoom: 3.7534629689815597,
  },
  // AN: {
  //   center: [3.614104403963678, -8.920360151165461],
  //   zoom: 2.4084629689815586,
  // },
  EU: {
    center: [12.625158068975857, 53.316551892077825],
    zoom: 4.473462968981556,
  },
  AS: {
    center: [91.2482594184713, 50.1690698507913],
    zoom: 3.490129635648221,
  },
  OC: {
    center: [115.85804397460218, -12.292736955229955],
    zoom: 3.7067963023148898,
  },
};

function fillConstants(variable, name, satellites, hasDayNight) {
  return {
    variable: variable,
    name: name,
    satellites: satellites,
    hasDayNight: hasDayNight,
  };
}

export const MIN_YEAR_LOOKBACK = 2014;
export const LOOP_END_BEGIN_EVENT = "Loop-end-begin";
export const LOOP_BEGIN_END_EVENT = "Loop-begin-end";

Object.freeze(CONTINENT_VIEWS);
Object.freeze(SELECTORS);
Object.freeze(ANOMALYMAPPING);
Object.freeze(SATELLITE);
Object.freeze(PRODUCT_LAYERS_ID_MAPPING);
Object.freeze(DATATYPE);
Object.freeze(FILEFORMAT);
Object.freeze(MONTHMAP);
