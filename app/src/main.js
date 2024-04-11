import "./style.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay";
import { defaults as defaultControls } from "ol/control.js";
import Attribution from "ol/control/Attribution.js";
import MousePosition from "ol/control/MousePosition.js";
import FullScreen from "ol/control/FullScreen.js";
import Download from "./Download.js";
import { loadAndRegisterLayers } from "./ProductLayers.js";
import initLayers from "./ProductLayers.js";
import { createXYDirString, fillStringTemplate } from "./util.js";

const currProj = "ESPG:4326";
const extent = [-180, -90, 180, 90];
const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");
const view = new View({
  projection: "EPSG:4326",
  extent: extent,
  center: [0, 0],
  zoom: 2.5,
  maxZoom: 8,
});
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});
let map = null;

let newAttribution = new Attribution({
  collapsible: false,
  collapsed: false,
});

function main() {
  map = new Map({
    layers: initLayers(),
    overlays: [overlay],
    controls: init_controls(),
    target: "map",
    view: view,
  });

  registerMapHandlers();
}

function init_controls() {
  let control = defaultControls();
  control.pop();
  control.push(newAttribution);
  control.push(
    new FullScreen({
      source: document.getElementById("screen"),
    })
  );
  control.push(new Download());
  control.push(
    new MousePosition({
      coordinateFormat: createXYDirString(4),
      projection: currProj,
    })
  );
  return control;
}

function registerMapHandlers() {
  map.on("singleclick", function (evt) {
    let feature = map.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layer) {
        return feature;
      }
    );

    if (feature) {
      //update for dynamic showing - use feature.getKeys() to get names
      // dynamically show the stuf next time
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

  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };
}

window.onload = main;
