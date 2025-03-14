import OLCesium from "olcs";
import Overlay from "ol/Overlay";
import * as Constants from "./Constants.js";

class MapOverlay {
  constructor(ol2d, ol3d, scene) {
    this.ol2d = ol2d;
    this.ol3d = ol3d;
    this.scene = scene;
    this.contentInfo = document.getElementById("popup-content");
    let containerInfo = document.getElementById("popup");
    let closerInfo = document.getElementById("popup-closer");
    this.closerInfo = closerInfo;
    this.overlayInfo = new Overlay({
      element: containerInfo,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    this.closerInfo.onclick = () => {
      this.overlayInfo.setPosition(undefined);
      this.closerInfo.blur();
      return false;
    };
    this.ol2d.addOverlay(this.overlayInfo);

    this.ol2d.on("click", this.onOl2dClick.bind(this));
    const eventHandler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
    eventHandler.setInputAction(
      this.onClickHandlerCS.bind(this),
      Cesium.ScreenSpaceEventType["LEFT_CLICK"]
    );
  }

  onOl2dClick(evt) {
    let feature = this.ol2d.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layer) {
        return feature;
      }
    );

    this.drawOverlay(evt.coordinate, feature);
  }

  onClickHandlerCS(event) {
    if (event.position.x === 0 && event.position.y === 0) {
      return;
    }

    const ray = this.scene.camera.getPickRay(event.position);
    const cartesian = this.scene.globe.pick(ray, this.scene);
    if (!cartesian) {
      return;
    }
    const cartographic =
      this.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    let coords = [
      Cesium.Math.toDegrees(cartographic.longitude),
      Cesium.Math.toDegrees(cartographic.latitude),
    ];

    const height = this.scene.globe.getHeight(cartographic);
    if (height) {
      coords = coords.concat([height]);
    }

    let feature = this.ol2d.forEachFeatureAtPixel(
      this.ol2d.getPixelFromCoordinate(coords),
      function (feature, layer) {
        return feature;
      }
    );

    this.drawOverlay(coords, feature);
  }

  drawOverlay(coordinate, feature) {
    if (feature) {
      let information = '<p class="pop-info">';
      Object.keys(feature.getProperties()).forEach((key, i) => {
        if (!Constants.NON_PROPERTIES.has(key)) {
          information += `<p class="pop-info"><strong>${key}</strong>: ${feature.get(
            key
          )}</p>`;
        }
      });
      information += "</p>";
      this.contentInfo.innerHTML = information;
      this.overlayInfo.setPosition(coordinate);
    } else {
      this.overlayInfo.setPosition(undefined);
    }
  }
}

export default MapOverlay;
