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
import { VisualFormattingSettingsModel } from "./settings";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { interactivitySelectionService } from "powerbi-visuals-utils-interactivityutils";

import "./../style/visual.less";

export class Visual implements IVisual {
    public target: HTMLElement;
    public startDateInput: HTMLInputElement;
    public endDateInput: HTMLInputElement;
    public relativeDateSelect: HTMLSelectElement;

    public formattingSettings: VisualFormattingSettingsModel;
    public formattingSettingsService: FormattingSettingsService;

    //public dateInputs : HTMLInputElement;

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

        //this.dateInputs = document.getElementById("date-inputs") as HTMLInputElement;
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
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, dataView);

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

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
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
    // Utility function to convert hex color to RGB
    private hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    // Remove the leading # if present
    hex = hex.replace(/^#/, '');
    // Parse the hex string
    const bigint = parseInt(hex, 16);
    if (hex.length === 3) {
        // If it's a shorthand hex code, expand it
        return {
            r: (bigint >> 8) & 0xF | (bigint >> 4) & 0xF0,
            g: (bigint >> 4) & 0xF | (bigint) & 0xF0,
            b: (bigint & 0xF) << 4 | (bigint & 0xF)
        };
    } else if (hex.length === 6) {
        return {
            r: (bigint >> 16) & 0xFF,
            g: (bigint >> 8) & 0xFF,
            b: bigint & 0xFF
        };
    }
    return null;
    }

    private updateStyles() {
        const slicerContainer = document.getElementById("slicer-container");

        // Start date input formatting
        const dateFontSize = `${this.formattingSettings.dateFormatting.fontSize.value}px`;
        const dateFontFamily = this.formattingSettings.dateFormatting.fontFamily.value;
        const dateColor = this.formattingSettings.dateFormatting.fontColor.value.value;
        const dateBackgroundColor = this.formattingSettings.dateFormatting.backgroundColor.value.value;

        if (dateColor) {
            this.startDateInput.style.color = dateColor;
            this.endDateInput.style.color = dateColor;
         
        }
        if (dateFontSize) {
            this.startDateInput.style.fontSize = dateFontSize;
            this.endDateInput.style.fontSize = dateFontSize;
        }
        if (dateFontFamily) {
            this.startDateInput.style.fontFamily = dateFontFamily;
            this.endDateInput.style.fontFamily = dateFontFamily;
        }
        if (dateBackgroundColor) {
            this.startDateInput.style.backgroundColor = dateBackgroundColor;
            this.endDateInput.style.backgroundColor = dateBackgroundColor;
        }

        // Relative date select formatting
        const relativeDateFontSize = `${this.formattingSettings.relativeDateFormatting.fontSize.value}px`;
        const relativeDateFontFamily = this.formattingSettings.relativeDateFormatting.fontFamily.value;
        const relativeDateColor = this.formattingSettings.relativeDateFormatting.fontColor.value.value;
        const relativeDateBackgroundColor = this.formattingSettings.relativeDateFormatting.backgroundColor.value.value;

        if (relativeDateColor) {
            this.relativeDateSelect.style.color = relativeDateColor;
        }
        if (relativeDateFontSize) {
            this.relativeDateSelect.style.fontSize = relativeDateFontSize;
        }
        if (relativeDateFontFamily) {
            this.relativeDateSelect.style.fontFamily = relativeDateFontFamily;
        }
        if (relativeDateBackgroundColor) {
            this.relativeDateSelect.style.backgroundColor = relativeDateBackgroundColor;
        }

        // Container background color
        const backgroundColor = this.formattingSettings.backgroundFormatting.backgroundColor.value.value;
        const transparency = this.formattingSettings.backgroundFormatting.transparency.value;
        if (backgroundColor && transparency !== undefined) {
            // Convert the hex color to RGB
            const rgb = this.hexToRgb(backgroundColor);
            if (rgb) {
                // Create the rgba color with transparency
                const rgbaColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - transparency / 100})`;
                slicerContainer.style.backgroundColor = rgbaColor;
            }
        }
    }
  
    
    
}