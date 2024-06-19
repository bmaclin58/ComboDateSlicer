var comboDateSlicer821CCC76721D44A48063DFEA0FA72849_DEBUG;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 423:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   b: () => (/* binding */ Visual)
/* harmony export */ });
/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/

class Visual {
    target;
    startDateInput;
    endDateInput;
    dateRangeSlider;
    relativeDateSelect;
    constructor(options) {
        this.target = options.element;
        this.target.innerHTML = `
            <div id="slicer-container">
                <input type="date" id="startDate" />
                <input type="date" id="endDate" />
                <select id="relativeDate">
                    <option value="thisWeek">This Week</option>
                    <option value="last7Days">Last 7 Days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="last30Days">Last 30 Days</option>
                    <option value="thisYear">This Year</option>
                    <option value="last365Days">Last 365 Days</option>
                </select>
            </div>
        `;
        this.startDateInput = document.getElementById("startDate");
        this.endDateInput = document.getElementById("endDate");
        this.relativeDateSelect = document.getElementById("relativeDate");
        this.startDateInput.addEventListener("change", this.updateDateRange.bind(this));
        this.endDateInput.addEventListener("change", this.updateDateRange.bind(this));
        this.relativeDateSelect.addEventListener("change", this.updateRelativeDate.bind(this));
        /*
        Throwing out the slider.  I don't think it's necessary or helpful. But ill keep the code here in case we want it back.
        this.dateRangeSlider = document.getElementById("dateRangeSlider") as HTMLInputElement;
                      <div id="slider-container">
        <input type="range" id="dateRangeSlider" min="1" max="365" value="30" />
        </div>
        this.dateRangeSlider.addEventListener("input", this.updateSlider.bind(this));

        private updateSlider() {
        const sliderValue = parseInt(this.dateRangeSlider.value, 10);
        const startDateTimestamp = parseInt(this.dateRangeSlider.min, 10);
        const endDateTimestamp = parseInt(this.dateRangeSlider.max, 10);

        const range = endDateTimestamp - startDateTimestamp;
        const newEndDateTimestamp = startDateTimestamp + (range * (sliderValue / 100));
        const newEndDate = new Date(newEndDateTimestamp);

        this.endDateInput.value = newEndDate.toISOString().split('T')[0];
        console.log(`Slider Value: ${sliderValue}`);
        this.updateDateRange();
    }
        */
    }
    update(options) {
        if (!options || !options.dataViews || options.dataViews.length === 0) {
            return;
        }
        const dataView = options.dataViews[0];
        const categories = dataView.categorical.categories[0];
        const dateValues = categories.values.map(value => new Date(value));
        const dateTimestamps = dateValues.map(value => value.getTime());
        const minDate = new Date(Math.min(...dateTimestamps));
        const maxDate = new Date(Math.max(...dateTimestamps));
        this.startDateInput.value = minDate.toISOString().split('T')[0];
        this.endDateInput.value = maxDate.toISOString().split('T')[0];
        this.dateRangeSlider.min = minDate.getTime().toString();
        this.dateRangeSlider.max = maxDate.getTime().toString();
        this.dateRangeSlider.value = maxDate.getTime().toString();
        const settings = dataView.metadata.objects || {};
        const slicerContainer = document.getElementById("slicer-container");
        const getColor = (fill) => (fill && fill.solid ? fill.solid.color : null);
        const textColor = settings.general && settings.general.textColor ? getColor(settings.general.textColor) : null;
        const fontSize = settings.general && settings.general.fontSize ? `${settings.general.fontSize}px` : null;
        const backgroundColor = settings.general && settings.general.backgroundColor ? getColor(settings.general.backgroundColor) : null;
        const transparency = settings.general && settings.general.transparency && typeof settings.general.transparency === "number" ? settings.general.transparency : 0;
        if (textColor) {
            this.startDateInput.style.color = textColor;
            this.endDateInput.style.color = textColor;
            this.relativeDateSelect.style.color = textColor;
        }
        if (fontSize) {
            this.startDateInput.style.fontSize = fontSize;
            this.endDateInput.style.fontSize = fontSize;
            this.relativeDateSelect.style.fontSize = fontSize;
        }
        if (backgroundColor) {
            slicerContainer.style.backgroundColor = backgroundColor;
            slicerContainer.style.opacity = ((100 - transparency) / 100).toString();
        }
    }
    updateDateRange() {
        const startDate = new Date(this.startDateInput.value);
        const endDate = new Date(this.endDateInput.value);
        if (endDate < startDate) {
            // If the end date is before the start date, set the end date to the start date
            this.endDateInput.value = this.startDateInput.value;
        }
        console.log(`Date Range: ${this.startDateInput.value} - ${this.endDateInput.value}`);
        // Update visual with new date range logic
    }
    updateRelativeDate() {
        const relativeDate = this.relativeDateSelect.value;
        const today = new Date();
        let startDate;
        switch (relativeDate) {
            case "thisWeek":
                startDate = new Date(today);
                startDate.setDate(today.getDate() - today.getDay() + 1);
                break;
            case "last7Days":
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                break;
            case "thisMonth":
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case "last30Days":
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 30);
                break;
            case "thisYear":
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
            case "last365Days":
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 365);
                break;
            default:
                startDate = new Date(today);
        }
        this.startDateInput.value = startDate.toISOString().split('T')[0];
        this.endDateInput.value = today.toISOString().split('T')[0];
        this.updateDateRange();
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it declares 'comboDateSlicer821CCC76721D44A48063DFEA0FA72849_DEBUG' on top-level, which conflicts with the current library output.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_visual__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(423);

var powerbiKey = "powerbi";
var powerbi = window[powerbiKey];
var comboDateSlicer821CCC76721D44A48063DFEA0FA72849_DEBUG = {
    name: 'comboDateSlicer821CCC76721D44A48063DFEA0FA72849_DEBUG',
    displayName: 'ComboDateSlicer',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options) => {
        if (_src_visual__WEBPACK_IMPORTED_MODULE_0__/* .Visual */ .b) {
            return new _src_visual__WEBPACK_IMPORTED_MODULE_0__/* .Visual */ .b(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId, options, initialState) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["comboDateSlicer821CCC76721D44A48063DFEA0FA72849_DEBUG"] = comboDateSlicer821CCC76721D44A48063DFEA0FA72849_DEBUG;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (comboDateSlicer821CCC76721D44A48063DFEA0FA72849_DEBUG);

})();

comboDateSlicer821CCC76721D44A48063DFEA0FA72849_DEBUG = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=https://localhost:8080/assets/visual.js.map