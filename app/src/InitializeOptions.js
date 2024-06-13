import * as Constants from "./Constants.js";
import SelectCustom from "./SelectCustom.js";
//TODO intialize current date with months lookbook for current year
let date = new Date();
let currMonth = date.getMonth();
let currYear = date.getFullYear();

function main() {
  let yearObj = document.querySelector(Constants.SELECTORS.YEAR);
  yearObj.min = "2014";
  yearObj.max = currMonth == 0 ? currYear - 1 : currYear;
  yearObj.value = yearObj.max;
  yearObj.addEventListener("change", refillMonth);
  yearObj.dispatchEvent(new Event("change"));

  let continents = document.querySelector("#continents");
  continents.addOptions(Constants.CONTINENTS);

  //Add day and night selectors
  document.querySelectorAll(Constants.SELECTORS.DAY_NIGHT).forEach((x) => {
    let optionday = document.createElement("option");
    optionday.innerHTML = "day";
    x.appendChild(optionday);
    let optionnight = document.createElement("option");
    optionnight.innerHTML = "night";
    x.appendChild(optionnight);
  });
  //Add anomaly options
  document.querySelectorAll(Constants.SELECTORS.PRODUCT_LAYER).forEach((x) => {
    Object.values(Constants.ANOMALYMAPPING).forEach(({ name, satellites }) => {
      let option = document.createElement("option");
      option.innerHTML = name;
      x.appendChild(option);
    });
    x.addEventListener("change", displayDayNight);
    x.addEventListener("change", displaySat);
    let event = new Event("change");
    x.dispatchEvent(event);
  });
  document.querySelector(Constants.SELECTORS.ENABLE_ANIMATE).checked = false;
  document.querySelectorAll(Constants.SELECTORS.VISIBLE).forEach((x) => {
    x.checked = false;
  });
}

function displaySat(event) {
  let anomalyObj = event.target;
  let parentNode = anomalyObj.parentNode;
  let satelliteObj = parentNode.querySelector(Constants.SELECTORS.SATELLITE);
  let { satellites } = Object.values(Constants.ANOMALYMAPPING).find(
    ({ name }) => {
      return name === anomalyObj.value;
    }
  );
  satelliteObj.innerHTML = "";
  satellites.forEach((satellite) => {
    let element = document.createElement("option");
    element.innerHTML = satellite;
    satelliteObj.appendChild(element);
  });
  if (satellites.length === 1) {
    satelliteObj.style.display = "none";
  } else {
    satelliteObj.style.display = "block";
  }
}

function displayDayNight(event) {
  let anomalyObj = event.target;
  let parentNode = anomalyObj.parentNode;
  let daynightObj = parentNode.querySelector(Constants.SELECTORS.DAY_NIGHT);
  if (hasDayNightFeature(anomalyObj.value)) {
    daynightObj.style.display = "block";
  } else {
    daynightObj.style.display = "none";
  }
}

function hasDayNightFeature(value) {
  let { hasDayNight } = Object.values(Constants.ANOMALYMAPPING).find(
    ({ name }) => {
      return name === value;
    }
  );
  if (hasDayNight) {
    return true;
  }

  return false;
}
function refillMonth(event) {
  let yearObj = event.target;
  let monthSelectionObj = document.querySelector(Constants.SELECTORS.MONTH);
  let monthIndex = currMonth == 0 ? 11 : currMonth - 1;
  monthSelectionObj.innerHTML = "";
  if (yearObj.value == yearObj.max) {
    Constants.monthNames
      .filter((value, i) => i <= monthIndex)
      .forEach((month) => {
        let option = document.createElement("option");
        option.innerHTML = month;
        monthSelectionObj.appendChild(option);
      });
  } else {
    Constants.monthNames.forEach((month) => {
      let option = document.createElement("option");
      option.innerHTML = month;
      monthSelectionObj.appendChild(option);
    });
  }
  //Hard code for now, i dont have data for april
  //Move to somewhere in the if blocks

  monthSelectionObj.value = Constants.monthNames[monthIndex];
  // monthSelectionObj.value = "January";
}

main();
