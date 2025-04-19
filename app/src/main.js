import "./css/style.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "@fontsource/source-sans-pro";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay";
import { defaults as defaultControls } from "ol/control.js";
import Attribution from "ol/control/Attribution.js";
import MousePosition from "ol/control/MousePosition.js";
import FullScreen from "ol/control/FullScreen.js";
import Download from "./Download.js";
import * as Constants from "./Constants.js";
import * as ProductLayers from "./ProductLayers.js";
import { createXYDirString, fillStringTemplate } from "./util.js";
import { initAnimationService } from "./Animation.js";
import OLCesium from "olcs";
import { VectorSynchronizer } from "olcs";
import { Viewer } from "cesium";
import MapOverlay from "./Overlay.js";
import { renderLegend } from "./Layers.js";
import "./Draggable.js";

const currProj = "ESPG:4326";
const extent = [-180, -125, 180, 125];
const containerInfo = document.getElementById("popup");
const contentInfo = document.getElementById("popup-content");
const closerInfo = document.getElementById("popup-closer");
const containerPlt = document.getElementById("popup-barplt");
const contentPlt = document.getElementById("popup-content-barplt");
const closerPlt = document.getElementById("popup-closer-barplt");
closerPlt.onclick = () => {
  containerPlt.style.display = "none";
};

let newAttribution = new Attribution({
  className: "ol-attribution",
  collapsible: false,
  collapsed: false,
});

const view = new View({
  projection: "EPSG:4326",
  extent: extent,
  center: [0, 0],
  zoom: 2,
  maxZoom: 8,
});

let map = null;

function main() {
  map = new Map({
    // interactions: interactionDefaults().extend([dragAndDropInteraction])
    // overlays: [overlayInfo],
    controls: init_controls(),
    target: "map",
    view: view,
  });
  map.setLayers(ProductLayers.initLayers());
  renderLegend(map.getLayers().getArray());
  // const viewer = new Viewer("map", {});
  const ol3d = new OLCesium({ map: map, target: "map" });
  const overlay = new MapOverlay(map, ol3d, ol3d.getCesiumScene());
  ProductLayers.regLayerChanges(map);
  changeContinentSelectMode();
  // registerMapHandlers();
  ProductLayers.registerOverlayHandlers(onDisplayPlt);
  registerViewHandlers(map, ol3d);
  initAnimationService(map);
}

function init_controls() {
  let control = defaultControls({ attribution: false });
  // control.pop();
  // control.push(newAttribution);
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

function onDisplayPlt(posUrl, negUrl) {
  contentPlt.innerHTML = `<img class="plt-img" src="${posUrl}"></img> <img class="plt-img" src="${negUrl}"></img>`;
  containerPlt.style.display = "block";
}

function changeContinentSelectMode() {
  document.querySelector(Constants.SELECTORS.CONTINENTS).regularSelectMode();
}

function registerViewHandlers(map, ol3d) {
  document
    .querySelector(Constants.SELECTORS.CONTINENTS)
    .addEventListener("change", (event) => {
      let view = map.getView();
      let newCenter = Constants.CONTINENT_VIEWS[event.target.getValue()].center;
      let newZoom = Constants.CONTINENT_VIEWS[event.target.getValue()].zoom;
      view.setCenter(newCenter);
      view.setZoom(newZoom);
    });

  document
    .querySelector(Constants.SELECTORS.VIEW_3D)
    .addEventListener("change", (event) => {
      let view = map.getView();
      if (event.target.checked && view.getZoom() < 2.7) {
        view.setZoom(view.getZoom() * 1.6);
      } else if (!event.target.checked) {
        view.setZoom(view.getZoom() * (1 / 1.6));
      }
      ol3d.setEnabled(event.target.checked);
    });
  const e = new Event("change");
  document.querySelector(Constants.SELECTORS.VIEW_3D).dispatchEvent(e);
}

window.onload = main;
