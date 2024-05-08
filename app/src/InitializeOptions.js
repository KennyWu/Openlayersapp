import * as Constants from "./Constants.js";
//TODO intialize current date with months lookbook for current year
let date = new Date();
let currMonth = date.getMonth();
let currYear = date.getFullYear();

function main() {
  let yearObj = document.querySelector(Constants.SELECTORS.YEAR);
  yearObj.min = "2014";
  yearObj.max = currYear;
  yearObj.value = currYear;
  yearObj.addEventListener("change", refillMonth);
  yearObj.dispatchEvent(new Event("change"));

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
  monthSelectionObj.innerHTML = "";
  if (yearObj.value == currYear) {
    Constants.monthNames
      .filter((value, i) => i <= currMonth)
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
  // monthSelectionObj.value = Constants.monthNames[currMonth];
  monthSelectionObj.value = "January";
}

main();
