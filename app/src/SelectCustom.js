import { get } from "ol/proj";

class SelectCustom extends HTMLElement {
  #select;
  #left;
  #right;

  constructor() {
    super();

    this.innerHTML = `
        <style>
            btn-select {
                font-size: 14px;
            }
            .btn-month {
                background-color: whitesmoke;
            }

            td {
              padding: 0px 0px 0px 0px;
            }
        </style>
        <table>
            <tr>
              <td><button type="button" class="btn btn-month btn-outline-secondary btn-sm btn-left">&lt;</button></td>
              <td><select disabled class="form-control form-control-sm btn-select"></select></td>
              <td><button type="button" class="btn btn-month btn-outline-secondary btn-sm btn-right">&gt;</button></td>
            </tr>
        </table>`;
    this.#select = this.querySelector("select");
    this.#left = this.querySelector(".btn-left");
    this.#right = this.querySelector(".btn-right");

    this.#left.addEventListener("click", this.changeOption.bind(this));
    this.#right.addEventListener("click", this.changeOption.bind(this));
    // this.#select.value = currentOptions[0]
  }

  addOptions(currentOptions) {
    currentOptions.forEach((x) => {
      let option = document.createElement("option");
      option.innerHTML = x;
      this.#select.appendChild(option);
    });
  }

  changeOption(event) {
    let target = event.target;
    let step = 0;
    if (this.#left.className === target.className) {
      step = -1;
    } else if (this.#right.className === target.className) {
      step = 1;
    }
    let currIndex = this.#select.selectedIndex;
    currIndex += step;
    if (currIndex < 0) {
      currIndex = this.#select.options.length - 1;
    } else if (currIndex >= this.#select.options.length) {
      currIndex = 0;
    }
    this.#select.selectedIndex = currIndex;
    this.dispatchEvent(new Event("change"));
  }

  getValue() {
    return this.#select.value;
  }
}

customElements.define("custom-selector", SelectCustom);
export default SelectCustom;
