import "./style.css";
import ImageLayer from "ol/layer/Image.js";
import Map from "ol/Map.js";
import Projection from "ol/proj/Projection.js";
import Static from "ol/source/ImageStatic.js";
import View from "ol/View.js";

// Map views always need a projection.  Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
const extent = [-180, -90, 180, 90];

const map = new Map({
  layers: [
    new ImageLayer({
      source: new Static({
        url: "http://localhost:5173/0_background.png",
        projection: "ESPG:4326",
        imageExtent: extent,
      }),
    }),
  ],
  target: "map",
  view: new View({
    projection: "EPSG:4326",
    extent: extent,
    center: [0, 0],
    zoom: 2,
    maxZoom: 6,
  }),
});
