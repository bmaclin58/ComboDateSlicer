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
"use strict";

import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import DataViewObjects = powerbi.DataViewObjects;

export class Visual implements IVisual {
    private target: HTMLElement;
    private startDateInput: HTMLInputElement;
    private endDateInput: HTMLInputElement;
    private dateRangeSlider: HTMLInputElement;
    private relativeDateSelect: HTMLSelectElement;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.target.innerHTML = `
            <style>
                #slicer-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }
                #date-inputs {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 10px;
                }
                #date-inputs input {
                    margin: 0 5px;
                }
            </style>
            <div id="slicer-container">
                <div id="date-inputs">
                    <input type="date" id="startDate" />
                    <input type="date" id="endDate" />
                </div>
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
    
        this.startDateInput = document.getElementById("startDate") as HTMLInputElement;
        this.endDateInput = document.getElementById("endDate") as HTMLInputElement;
        this.relativeDateSelect = document.getElementById("relativeDate") as HTMLSelectElement;
    
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

    public update(options: VisualUpdateOptions): void {
        if (!options || !options.dataViews || options.dataViews.length === 0) {
            return;
        }
    
        const dataView = options.dataViews[0];
        const categories = dataView.categorical.categories[0];
    
        if (categories && categories.values && categories.values.length > 0) {
            const dateValues = categories.values
                .map(value => new Date(value as string))
                .filter(date => !isNaN(date.getTime()));
    
            if (dateValues.length > 0) {
                const dateTimestamps = dateValues.map(value => value.getTime());
                const minDate = new Date(Math.min(...dateTimestamps));
                const maxDate = new Date(Math.max(...dateTimestamps));
    
                this.startDateInput.value = minDate.toISOString().split('T')[0];
                this.endDateInput.value = maxDate.toISOString().split('T')[0];
            } else {
                this.setDefaultDates();
            }
        } else {
            this.setDefaultDates();
        }
        const settings = dataView.metadata.objects || {};
        const slicerContainer = document.getElementById("slicer-container");
    
        const getColor = (fill: powerbi.Fill) => (fill && fill.solid ? fill.solid.color : null);
    
        const textColor = settings.general && settings.general.textColor ? getColor(settings.general.textColor as powerbi.Fill) : null;
        const fontSize = settings.general && settings.general.fontSize ? `${settings.general.fontSize}px` : null;
        const backgroundColor = settings.general && settings.general.backgroundColor ? getColor(settings.general.backgroundColor as powerbi.Fill) : null;
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

    private updateDateRange() {
        const startDate = new Date(this.startDateInput.value);
        const endDate = new Date(this.endDateInput.value);
    
        if (endDate < startDate) {
            // If the end date is before the start date, set the end date to the start date
            this.endDateInput.value = this.startDateInput.value;
        }
    
        console.log(`Date Range: ${this.startDateInput.value} - ${this.endDateInput.value}`);
        // Update visual with new date range logic
    }

    private updateRelativeDate() {
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
    
    private setDefaultDates() {
        const today = new Date();
        this.startDateInput.value = today.toISOString().split('T')[0];
        this.endDateInput.value = today.toISOString().split('T')[0];
    }

    
}
