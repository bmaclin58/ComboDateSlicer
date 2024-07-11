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

import { AdvancedFilter } from "powerbi-models";
import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
//import DataView = powerbi.DataView;
//import * as models from "powerbi-models";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;


import { VisualFormattingSettingsModel } from "./settings";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
//import { interactivitySelectionService } from "powerbi-visuals-utils-interactivityutils";

import "./../style/visual.less";

export class Visual implements IVisual {
    public target: HTMLElement;
    public startDateInput: HTMLInputElement;
    public endDateInput: HTMLInputElement;
    public relativeDateSelect: HTMLSelectElement;

    public slicerContainer: HTMLElement;
    public host: IVisualHost;

    public formattingSettings: VisualFormattingSettingsModel;
    public formattingSettingsService: FormattingSettingsService;
    public options: VisualUpdateOptions;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.host = options.host;

        this.formattingSettingsService = new FormattingSettingsService();
        this.formattingSettings = new VisualFormattingSettingsModel();

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
    
        // Add an event listener for slicer changes
        this.startDateInput.addEventListener("change", () => this.onSlicerChange());
        this.endDateInput.addEventListener("change", () => this.onSlicerChange());
        this.relativeDateSelect.addEventListener("change", () => this.updateRelativeDate());
    }

    public update(options: VisualUpdateOptions) {
        if (!options || !options.dataViews || options.dataViews.length === 0) {
          return;
        }
    
        this.options = options;
        const dataView = options.dataViews[0];
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, dataView);
    
        const categories = dataView.categorical.categories[0];
        const jsonFilters = options?.jsonFilters || []; //Applied Filters get saved here
        const filterApplied = jsonFilters.length !== 0;
        if (categories && categories.values && categories.values.length > 0) {
          const dateValues = categories.values.map((value) => new Date(value as string)).filter((date) => !isNaN(date.getTime()));
    
          //If filters applied, then fetch the relevant dates
          if (filterApplied) {
            const appliedFilters = jsonFilters[0];
            const minDate = new Date(appliedFilters["conditions"][0].value);
            const maxDate = new Date(appliedFilters["conditions"][1].value);
            console.log(`Filter Applied between ${minDate.toDateString()} & ${maxDate.toDateString()}`);
    
            this.startDateInput.value = minDate.toISOString().split("T")[0];
            this.endDateInput.value = maxDate.toISOString().split("T")[0];
          } else if (dateValues.length > 0) {
            const dateTimestamps = dateValues.map((value) => value.getTime());
            const minDate = new Date(Math.min(...dateTimestamps));
            const maxDate = new Date(Math.max(...dateTimestamps));
    
            this.startDateInput.value = minDate.toISOString().split("T")[0];
            this.endDateInput.value = maxDate.toISOString().split("T")[0];
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
        this.onSlicerChange();
    }

    private setDefaultDates() {
        const today = new Date();
        this.startDateInput.value = today.toISOString().split('T')[0];
        this.endDateInput.value = today.toISOString().split('T')[0];
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
        if (backgroundColor) {
            slicerContainer.style.backgroundColor = backgroundColor;
        }
    }

  private onSlicerChange() {
    const startDateValue = this.startDateInput.value;
    const endDateValue = this.endDateInput.value;

    if (!startDateValue || !endDateValue) {
      return;
    }

    const dateCategory = this.options.dataViews[0].categorical.categories[0];
    const table = dateCategory.source.queryName.substr(0, dateCategory.source.queryName.indexOf("."));
    const column = dateCategory.source.queryName.split(".").pop();

    const target = {
      table,
      column,
    };
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const filter = {
      $schema: "https://powerbi.com/product/schema#advanced",
      target: target,
      logicalOperator: "And",
      conditions: [
        {
          operator: "GreaterThanOrEqual",
          value: startDate,
        },
        {
          operator: "LessThanOrEqual",
          value: endDate,
        },
      ],
      filterType: AdvancedFilter,
    };

    this.host.applyJsonFilter(filter, "general", "filter", powerbi.FilterAction.merge);
  }
}
