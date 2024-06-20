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

import * as d3 from "d3";
import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import DataViewObjects = powerbi.DataViewObjects;
import DataViewObject = powerbi.DataViewObject;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import { VisualFormattingSettingsModel } from "./settings";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { interactivitySelectionService } from "powerbi-visuals-utils-interactivityutils";

import "./../style/visual.less";

export class Visual implements IVisual {
    private target: HTMLElement;
    private startDateInput: HTMLInputElement;
    private endDateInput: HTMLInputElement;
    private relativeDateSelect: HTMLSelectElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.formattingSettingsService = new FormattingSettingsService();

        this.target.innerHTML = `
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
    }

    public update(options: VisualUpdateOptions) {
        if (!options || !options.dataViews || options.dataViews.length === 0) {
            return;
        }

        const dataView = options.dataViews[0];
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);
        
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

        this.updateStyles();
    }

    private updateDateRange() {
        const startDate = new Date(this.startDateInput.value);
        const endDate = new Date(this.endDateInput.value);

        if (endDate < startDate) {
            this.endDateInput.value = this.startDateInput.value;
        }

        console.log(`Date Range: ${this.startDateInput.value} - ${this.endDateInput.value}`);
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

    private updateStyles() {
        const slicerContainer = document.getElementById("slicer-container");

        const textColor = this.formattingSettings.textFormattingCard.fontColor.value.value;
        const fontSize = `${this.formattingSettings.textFormattingCard.fontSize.value}px`;
        const fontFamily = this.formattingSettings.textFormattingCard.fontFamily.value;
        const backgroundColor = this.formattingSettings.backgroundFormattingCard.backgroundColor.value.value;

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
        if (fontFamily) {
            this.startDateInput.style.fontFamily = fontFamily;
            this.endDateInput.style.fontFamily = fontFamily;
            this.relativeDateSelect.style.fontFamily = fontFamily;
        }
        if (backgroundColor) {
            slicerContainer.style.backgroundColor = backgroundColor;
        }
    }
}
