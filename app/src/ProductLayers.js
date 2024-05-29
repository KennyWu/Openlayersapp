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
      "contributors. </div>",
  }),
  zIndex: 0,
});

export function initLayers() {
  let layers = [mapImage];
  Object.keys(Constants.PRODUCT_LAYERS_ID_MAPPING).forEach((id) => {
    let currLayer = loadAndRegisterLayers(id);
    layers.push(currLayer);
  });

  return layers;
}

export function regLayerChanges(map) {
  Object.keys(Constants.PRODUCT_LAYERS_ID_MAPPING).forEach((id, i) => {
    let productType = document.querySelector(
      id + " " + Constants.SELECTORS.PRODUCT_LAYER
    );
    let dayNight = document.querySelector(
      id + " " + Constants.SELECTORS.DAY_NIGHT
    );

    let satellite = document.querySelector(
      id + " " + Constants.SELECTORS.SATELLITE
    );

    let changeLayers = function (event) {
      let newLayer = loadAndRegisterLayers(id);
      map.getLayers().setAt(i + 1, newLayer);
    };

    productType.addEventListener("change", changeLayers);
    dayNight.addEventListener("change", changeLayers);
    satellite.addEventListener("change", changeLayers);
  });

  let changeAllLayers = function (event) {
    let layers = initLayers();
    map.setLayers(layers);
  };


  let dateTime = document.querySelector(Constants.SELECTORS.DATE);
  dateTime.addEventListener("click", changeMonth)
  dateTime.addEventListener("change", changeAllLayers);
}

/**
 * Load and register event handlers to each layer of product layer 1, 2, and 3
 * @param {*} pl - the product layer id of the html element
 * @returns layer object
 */
export function loadAndRegisterLayers(pl) {
  let plElements = {};
  Object.values(Constants.SELECTORS).forEach((selector) => {
    if (
      selector === Constants.SELECTORS.OPACITY ||
      selector === Constants.SELECTORS.PRODUCT_LAYER ||
      selector === Constants.SELECTORS.VISIBLE ||
      selector === Constants.SELECTORS.DAY_NIGHT ||
      selector === Constants.SELECTORS.SATELLITE
    ) {
      plElements[selector] = document.querySelector(pl + " " + selector);
    } else {
      plElements[selector] = document.querySelector(selector);
    }
  });

  const [templateVars, layerVars] = getElementValues(plElements);
  layerVars.zIndex = Constants.PRODUCT_LAYERS_ID_MAPPING[pl];
  let dataURL = fillStringTemplate(Constants.IMAGE_TEMPLATE_URL, templateVars);
  let legendURL = fillStringTemplate(
    Constants.LEGEND_TEMPLATE_URL,
    templateVars
  );
  console.log(dataURL);
  console.log(legendURL);
  let layer = loadLayer(templateVars.datatype, layerVars, dataURL, legendURL);
  registerLayer(pl, layer);
  return layer;
}

function registerLayer(pl, layer) {
  //We are reregistering event listeners to new
  let visible = document.querySelector(pl + " " + Constants.SELECTORS.VISIBLE);
  let opacity = document.querySelector(pl + " " + Constants.SELECTORS.OPACITY);
  const newVisible = visible.cloneNode(true);
  const newOpacity = opacity.cloneNode(true);
  visible.parentNode.replaceChild(newVisible, visible);
  opacity.parentNode.replaceChild(newOpacity, opacity);
  newVisible.addEventListener("change", function (event) {
    event.stopPropagation();
    layer.setVisible(event.target.checked);
  });
  newOpacity.addEventListener("input", function (event) {
    event.stopPropagation();
    let currOpacity = Number(event.target.value) / Number(event.target.max);
    layer.setOpacity(currOpacity);
  });
}

function loadLayer(dataType, layerVars, dataURL, legendURL) {
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
        attributions: `<div> <img class='legend' src=${legendURL}> </div>`,
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
  let day =
    plElements[Constants.SELECTORS.DAY_NIGHT].style.display !==
    Constants.DAYNIGHT.NONE
      ? plElements[Constants.SELECTORS.DAY_NIGHT].value
      : Constants.DAYNIGHT.NONE;
  let opacity =
    Number(plElements[Constants.SELECTORS.OPACITY].value) /
    Number(plElements[Constants.SELECTORS.OPACITY].max);
  let visible = plElements[Constants.SELECTORS.VISIBLE].checked;
  let dataType = plElements[Constants.SELECTORS.PRODUCT_LAYER].value.includes(
    "Borders"
  )
    ? Constants.DATATYPE.BORDERS
    : Constants.DATATYPE.IMAGE;
  let { variable } = Object.values(Constants.ANOMALYMAPPING).find(
    ({ name }) => {
      return plElements[Constants.SELECTORS.PRODUCT_LAYER].value === name;
    }
  );
  let yyyymm = year + month;
  let fileformat =
    dataType === Constants.DATATYPE.BORDERS
      ? Constants.FILEFORMAT.JSON
      : Constants.FILEFORMAT.PNG;
  let satellite = plElements[Constants.SELECTORS.SATELLITE].value;
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

function changeMonth(event) {
  let target = event.target; 
  let left = document.querySelector(Constants.SELECTORS.Month_SELECT_LEFT);
  let right = document.querySelector(Constants.SELECTORS.Month_SELECT_RIGHT);
  let month = document.querySelector(Constants.SELECTORS.MONTH);
  let dateTime = document.querySelector(Constants.SELECTORS.DATE);
  let step = 0;
  if (left.id === target.id) {
    step = -1; 
  } else if (right.id === target.id) {
    step = 1;
  }
  let currIndex = month.selectedIndex;
  currIndex += step;
  if (currIndex < 0) {
    currIndex = month.options.length-1
  } else if (currIndex >= month.options.length) {
    currIndex = 0;
  }
  month.selectedIndex = currIndex;
  dateTime.dispatchEvent(new Event("change"));
}

