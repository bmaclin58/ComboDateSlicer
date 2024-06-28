/*
 *  Power BI Visualizations
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

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";


import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsGroup = formattingSettings.Group;
import FormattingSettingsModel = formattingSettings.Model;

<<<<<<< Updated upstream
=======
//import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";

export interface IDateTextFormattingSettings {
    fontSize: number;
    fontFamily: string;
    fontColor: string;
    backgroundColor: string;
}

export interface IRelativeDateDropdownFormattingSettings {
    fontSize: number;
    fontFamily: string;
    fontColor: string;
    backgroundColor: string;
}

>>>>>>> Stashed changes
/**
 * Text Formatting Card
 */
class TextFormattingCardSettings extends FormattingSettingsCard {
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 12
    });

    fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font Family",
        value: "Arial"
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font Color",
        value: { value: "#000000" }
    });

    name: string = "textFormatting";
    displayName: string = "Text Formatting";
    slices: Array<FormattingSettingsSlice> = [this.fontSize, this.fontFamily, this.fontColor];
}

/**
 * Background Formatting Card
 */
class BackgroundFormattingCardSettings extends FormattingSettingsCard {
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" }
    });

    name: string = "backgroundFormatting";
    displayName: string = "Background Formatting";
    slices: Array<FormattingSettingsSlice> = [this.backgroundColor];
}
export class VisualSettingsModel extends FormattingSettingsModel {
    // Building my visual formatting settings card
    dateTextFormatting: FormattingSettingsCard = new myVisualCardSettings();

    // Add formatting settings card to cards list in model
    cards: Array<FormattingSettingsCard> = [this.dateTextFormatting];
}


/**
* Visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    textFormattingCard = new TextFormattingCardSettings();
    backgroundFormattingCard = new BackgroundFormattingCardSettings();

    cards = [this.textFormattingCard, this.backgroundFormattingCard];
}


