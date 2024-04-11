import { Fill, Stroke, Style } from "ol/style.js";
import ImageLayer from "ol/layer/Image.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Static from "ol/source/ImageStatic.js";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fillStringTemplate } from "./util";
import * as Constants from "./Constants.js";

const featureCollection = "./geo_json/feature_collection.json";
const dataImgPath = "./data_images/1_dataimage(1).png";
const CURRPROJ = "ESPG:4326";
const EXTENT = [-180, -90, 180, 90];
const LST_BORDER_STYLE = function (feature) {
  return new Style({
    stroke: new Stroke({
      color: feature.get("border_color") == "red" ? "red" : "blue",
    }),
    fill: new Fill({
      color: "rgba(255,255, 255, 0.2)",
    }),
  });
};

const mapImage = new TileLayer({
  source: new OSM({
    attributions:
      "<div> &#169; " +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> ' +
      "contributors. </div>" +
      "<div> <img class='legend' src=./legends/colorbar.png> </div>",
  }),
  zIndex: 0,
});

function initLayers() {
  let layers = [mapImage];
  Object.keys(Constants.PRODUCT_LAYERS_ID_MAPPING).forEach((id) => {
    console.log(id);
    let currLayer = loadAndRegisterLayers(id);
    layers.push(currLayer);
  });

  return layers;
}

export function loadAndRegisterLayers(pl) {
  let plElements = {};
  Object.values(Constants.SELECTORS).forEach((selector) => {
    if (
      selector === Constants.SELECTORS.OPACITY ||
      selector === Constants.SELECTORS.PRODUCT_LAYER ||
      selector === Constants.SELECTORS.VISIBLE
    ) {
      plElements[selector] = document.querySelector(pl + " " + selector);
    } else {
      plElements[selector] = document.querySelector(selector);
    }
  });

  const [templateVars, layerVars] = getElementValues(plElements);
  layerVars.zIndex = Constants.PRODUCT_LAYERS_ID_MAPPING[pl];
  let dataURL = fillStringTemplate(Constants.IMAGE_TEMPLATE_URL, templateVars);
  let layer = loadLayer(templateVars.datatype, layerVars, dataURL);
  registerLayer(pl, layer);
  return layer;
}

function registerLayer(pl, layer) {
  let visible = document.querySelector(pl + " " + Constants.SELECTORS.VISIBLE);
  let opacity = document.querySelector(pl + " " + Constants.SELECTORS.OPACITY);
  visible.addEventListener("change", function (event) {
    event.stopPropagation();
    layer.setVisible(event.target.checked);
  });
  opacity.addEventListener("input", function (event) {
    event.stopPropagation();
    let currOpacity = Number(event.target.value) / Number(event.target.max);
    layer.setOpacity(currOpacity);
  });
}

function loadLayer(dataType, layerVars, dataURL) {
  let layer;
  if (dataType === Constants.DATATYPE.BORDERS) {
    layer = new VectorLayer({
      source: new VectorSource({
        url: dataURL,
        format: new GeoJSON(),
      }),
      style: LST_BORDER_STYLE,
      zIndex: layerVars.zIndex,
      visible: layerVars.visible,
      opacity: layerVars.opacity,
    });
  } else {
    layer = new ImageLayer({
      source: new Static({
        url: dataURL,
        projection: CURRPROJ,
        imageExtent: EXTENT,
      }),
      zIndex: layerVars.zIndex,
      visible: layerVars.visible,
      opacity: layerVars.opacity,
    });
  }

  return layer;
}

function getElementValues(plElements) {
  let month = Constants.MONTHMAP[plElements[Constants.SELECTORS.MONTH].value];
  let year = plElements[Constants.SELECTORS.YEAR].value;
  let day = plElements[Constants.SELECTORS.DAY_NIGHT].value;
  let opacity =
    Number(plElements[Constants.SELECTORS.OPACITY].value) /
    Number(plElements[Constants.SELECTORS.OPACITY].max);
  let visible = plElements[Constants.SELECTORS.VISIBLE].checked;
  let dataType = plElements[Constants.SELECTORS.PRODUCT_LAYER].value.includes(
    "Borders"
  )
    ? Constants.DATATYPE.BORDERS
    : Constants.DATATYPE.IMAGE;
  let key = Object.keys(Constants.ANOMALYMAPPING).find((keyVal) => {
    return plElements[Constants.SELECTORS.PRODUCT_LAYER].value.includes(keyVal);
  });
  let variable = Constants.ANOMALYMAPPING[key];
  let yyyymm = year + month;
  let fileformat =
    dataType === Constants.DATATYPE.BORDERS
      ? Constants.FILEFORMAT.JSON
      : Constants.FILEFORMAT.PNG;
  let satellite = Constants.SATELLITE.JPSS;
  return [
    {
      yyyymm: yyyymm,
      "day[night]": day,
      satellite: satellite,
      datatype: dataType,
      variable: variable,
      fileformat: fileformat,
    },
    { opacity: opacity, visible: visible },
  ];
}

document
  .querySelector("#pl-1 .product-layer-type")
  .addEventListener("change", function (event) {
    console.log("Selected value:", event.target.value);
  });

export default initLayers;
