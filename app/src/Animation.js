import * as Constants from "./Constants.js";
import { fillStringTemplate } from "./util";
import ImageLayer from "ol/layer/Image.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Static from "ol/source/ImageStatic.js";
import { Fill, Stroke, Style } from "ol/style.js";

class AnimationService {
  static #ANIMATION_MAP_LAYER = 4;
  #mapLayers;
  #dateIndex;
  #fromDate;
  #toDate;
  #enable;
  #animationSpeed;
  #animationLayer;
  #animationDateRange;
  #animationProductLayerSection;
  #animationProductLayerVar;
  #satellite;
  #dayAndNight;
  #opacity;
  #allDates;
  #intervalID;

  constructor(map) {
    this.#animationLayer = document.querySelector(
      Constants.SELECTORS.ANIMATION_LAYER
    );
    this.#fromDate = this.#animationLayer.querySelector(
      Constants.SELECTORS.ANIMATE_FROM
    );
    this.#toDate = this.#animationLayer.querySelector(
      Constants.SELECTORS.ANIMATE_TO
    );
    this.#enable = this.#animationLayer.querySelector(
      Constants.SELECTORS.ENABLE_ANIMATE
    );
    this.#animationSpeed = this.#animationLayer.querySelector(
      Constants.SELECTORS.ANIMATE_SPEED
    );
    this.#satellite = this.#animationLayer.querySelector(
      Constants.SELECTORS.SATELLITE
    );
    this.#dayAndNight = this.#animationLayer.querySelector(
      Constants.SELECTORS.DAY_NIGHT
    );
    this.#opacity = this.#animationLayer.querySelector(
      Constants.SELECTORS.OPACITY
    );
    this.#animationDateRange = this.#animationLayer.querySelector(
      Constants.SELECTORS.ANIMATION_DATE_RANGE
    );
    this.#animationProductLayerSection = this.#animationLayer.querySelector(
      Constants.SELECTORS.ANIMATION_PRODUCT_LAYER
    );
    this.#animationProductLayerVar = this.#animationLayer.querySelector(
      Constants.SELECTORS.PRODUCT_LAYER
    );
    this.#allDates = [];
    this.#dateIndex = 0;
    this.#mapLayers = map.getLayers();

    this.#updateDates();
    this.#updateProductAnimationLayer();
    this.#animationDateRange.addEventListener(
      "change",
      this.#updateDates.bind(this)
    );
    this.#animationProductLayerVar.addEventListener(
      "change",
      function () {
        this.#dateIndex = 0;
        this.#enable.dispatchEvent(new Event("change"));
        this.#updateProductAnimationLayer.bind(this);
      }.bind(this)
    );
    this.#opacity.addEventListener("input", (event) => {
      event.stopPropagation();
      let currOpacity = Number(event.target.value) / Number(event.target.max);
      this.map
        .getLayers()
        .getArray()
        [AnimationService.#ANIMATION_MAP_LAYER].setOpacity(currOpacity);
    });
    this.#registerAnimationHandler();

    //TODO - add event listener to enable and animation speed
    // enable turns on the current layer to show and starts incrementing index
    //Set create new url with the month and year showing
  }

  #registerAnimationHandler() {
    this.#enable.addEventListener(
      "change",
      function (event) {
        this.#clearAnimate();
        if (event.target.checked) {
          this.#startAnimate(this.#animationSpeed.value);
        }
      }.bind(this)
    );
    this.#animationSpeed.addEventListener(
      "input",
      function (event) {
        this.#enable.dispatchEvent(new Event("change"));
      }.bind(this)
    );
  }

  #startAnimate(time) {
    this.#turnOnVisibility();
    this.#intervalID = setInterval(
      function () {
        console.log(this.#mapLayers.getArray()[4].getSource().url_);
        this.#dateIndex =
          this.#dateIndex + 1 == this.#allDates.length
            ? 0
            : this.#dateIndex + 1;
        this.#updateProductAnimationLayer();
      }.bind(this),
      time
    );
  }

  #clearAnimate() {
    this.#turnOffVisibility();
    this.#dateIndex = 0;
    clearInterval(this.#intervalID);
  }

  #turnOnVisibility() {
    this.#mapLayers
      .getArray()
      [AnimationService.#ANIMATION_MAP_LAYER].setVisible(true);
  }

  #turnOffVisibility() {
    this.#mapLayers
      .getArray()
      [AnimationService.#ANIMATION_MAP_LAYER].setVisible(false);
  }

  #updateDates() {
    this.#fromDate.setMaxDate(this.#toDate.monthIndex, this.#toDate.getYear());
    this.#toDate.setMinDate(
      this.#fromDate.monthIndex,
      this.#fromDate.getYear()
    );
    this.#allDates = this.#constructDateArray();
    this.#updateProductAnimationLayer();
  }

  /**
   * Reset the date index to 0
   * @returns the new date array consisting of range from and to in yyyymm format
   */
  #constructDateArray() {
    this.#dateIndex = 0;
    let dates = [];
    let currMonth = this.#fromDate.monthIndex;
    let currYear = this.#fromDate.getYear();
    let maxMonth = this.#toDate.monthIndex;
    let maxYear = this.#toDate.getYear();
    while (
      currYear < maxYear ||
      (currYear == maxYear && currMonth <= maxMonth)
    ) {
      let monthString = Constants.MONTHMAP[Constants.monthNames[currMonth]];
      let yearString = String(currYear);
      dates.push({ monthString: monthString, yearString: yearString });
      currMonth += 1;
      if (currMonth >= Constants.monthNames.length) {
        currMonth = 0;
        currYear += 1;
      }
    }

    return dates;
  }

  #updateProductAnimationLayer() {
    let templateVar = this.#getTemplateVars();
    let imagePath = fillStringTemplate(
      Constants.IMAGE_TEMPLATE_URL,
      templateVar
    );
    let legendPath = fillStringTemplate(
      Constants.LEGEND_TEMPLATE_URL,
      templateVar
    );
    let layerVars = this.#getLayerSettings();
    let layer = this.#loadLayer(
      templateVar.datatype,
      layerVars,
      imagePath,
      legendPath
    );
    this.#mapLayers.setAt(AnimationService.#ANIMATION_MAP_LAYER, layer);
    //check if enabled is checked - we set to show if checked, check day and night
    //set opacity
  }

  #loadLayer(dataType, layerVars, dataURL, legendURL) {
    let layer;
    let date =
      this.#allDates[this.#dateIndex].monthString +
      "/" +
      this.#allDates[this.#dateIndex].yearString;
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
          attributions: `<div> <img class='legend' src=${legendURL}> </div>
                            <div> Now Showing ${date} </div>`,
        }),
        zIndex: layerVars.zIndex,
        visible: layerVars.visible,
        opacity: layerVars.opacity,
      });
    }

    return layer;
  }

  #getTemplateVars() {
    let yyyymm =
      this.#allDates[this.#dateIndex].yearString +
      this.#allDates[this.#dateIndex].monthString;
    let day =
      this.#dayAndNight.style.display !== Constants.DAYNIGHT.NONE
        ? this.#dayAndNight.value
        : Constants.DAYNIGHT.NONE;
    let { variable } = Object.values(Constants.ANOMALYMAPPING).find(
      ({ name }) => {
        return this.#animationProductLayerVar.value === name;
      }
    );
    let dataType = this.#animationProductLayerVar.value.includes("Borders")
      ? Constants.DATATYPE.BORDERS
      : Constants.DATATYPE.IMAGE;
    let fileformat =
      dataType === Constants.DATATYPE.BORDERS
        ? Constants.FILEFORMAT.JSON
        : Constants.FILEFORMAT.PNG;
    let satellite = this.#satellite.value;

    let template_vars = {
      yyyymm: yyyymm,
      "day[night]": day,
      satellite: satellite,
      datatype: dataType,
      variable: variable,
      fileformat: fileformat,
    };

    return template_vars;
  }

  #getLayerSettings() {
    let opacity = Number(this.#opacity.value) / Number(this.#opacity.max);
    return {
      visible: this.#enable.checked,
      opacity: opacity,
    };
  }
}

export function initAnimationService(currMap) {
  return new AnimationService(currMap);
}
