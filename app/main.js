import "./style.css";
import { Fill, Stroke, Style } from "ol/style.js";
import ImageLayer from "ol/layer/Image.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Map from "ol/Map.js";
import Static from "ol/source/ImageStatic.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay";
import { defaults as defaultControls } from "ol/control.js";
import Attribution from "ol/control/Attribution";
import TileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import OSM from "ol/source/OSM";

const extent = [-180, -90, 180, 90];
const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

//Add closer button
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

//Add function for border style depending on feature of geometry
function styleBorder(feature) {
  return new Style({
    stroke: new Stroke({
      color: feature.get("border_color") == "red" ? "red" : "blue",
    }),
    fill: new Fill({
      color: "rgba(255,255, 255, 0.2)",
    }),
  });
}

let borderDrawings = new VectorLayer({
  source: new VectorSource({
    url: "http://localhost:5173/feature_collection.json",
    format: new GeoJSON(),
  }),
  style: styleBorder,
});

let mapImage = new ImageLayer({
  source: new Static({
    url: "http://localhost:5173/0_background.png",
    projection: "ESPG:4326",
    imageExtent: extent,
  }),
});

let dataImage = new ImageLayer({
  source: new Static({
    url: "http://localhost:5173/1_dataimage(1).png",
    projection: "ESPG:4326",
    imageExtent: extent,
    attributions: "<img class='legend' src=/colorbar.png>",
  }),
  opacity: 1,
});

let newAttribution = new Attribution({
  collapsible: false,
  collapsed: false,
});

// let mapImage = new TileLayer({
//   source: new OSM(),
// });

const map = new Map({
  layers: [mapImage, dataImage, borderDrawings],
  overlays: [overlay],
  controls: (() => {
    let control = defaultControls();
    control.pop();
    control.push(newAttribution);
    return control;
  })(),
  target: "map",
  view: new View({
    projection: "EPSG:4326",
    extent: extent,
    center: [0, 0],
    zoom: 2,
    maxZoom: 6,
  }),
});

map.on("singleclick", function (evt) {
  let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    return feature;
  });

  if (feature) {
    let information = `<p class="pop-info"><strong> Temperature</strong>: ${feature.get(
      "temperature"
    )}</p>
    <p class="pop-info"><strong>Geopotential Height</strong>: ${feature.get(
      "geopotential_height"
    )}</p>
    <p class="pop-info"><strong>Precipitation</strong>: ${feature.get(
      "precipitation"
    )}</p>`;
    content.innerHTML = information;
    overlay.setPosition(evt.coordinate);
  } else {
    overlay.setPosition(undefined);
  }
});
