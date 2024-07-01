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

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

export class dateFormattingCard extends FormattingSettingsCard{

/**
 * Date Formatting Card
 */
    public fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Date Font Family",
        value: "Arial",
        visible: true
    });

    public fontSize = new formattingSettings.NumUpDown({ 
        name: "fontSize",
        displayName: "Date Font Size",
        value: 18,
        visible: true
    });    
        
    public fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Date Font Color",
        value: { value: "#000000" },
        visible: true
    });

    public backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Date Background Color",
        value: { value: "#FFFFFF" },
        visible: true
    });

    public name: string = "dateFormatting";
    public displayName: string = "Date Formatting";
    public visible: boolean = true;
    public slices:  FormattingSettingsSlice[] = [
      this.fontSize, 
      this.fontFamily, 
      this.fontColor,
      this.backgroundColor
    ];

}
/**
 * Relative Date Formatting Card
 */

export class relativeDateFormattingCardSettings extends FormattingSettingsCard{

    /**
     * Text Formatting Card
     */
        public fontFamily = new formattingSettings.FontPicker({
            name: "fontFamily",
            displayName: "Date Font Family",
            value: "Arial",
            visible: true
        });
    
        public fontSize = new formattingSettings.NumUpDown({ 
            name: "fontSize",
            displayName: "Date Font Size",
            value: 16,
            visible: true
        });    
            
        public fontColor = new formattingSettings.ColorPicker({
            name: "fontColor",
            displayName: "Date Font Color",
            value: { value: "#000000" },
            visible: true
        });
    
        public backgroundColor = new formattingSettings.ColorPicker({
            name: "backgroundColor",
            displayName: "Background Color",
            value: { value: "#FFFFFF" },
            visible: true
        });
    
        public name: string = "relativeDateFormatting";
        public displayName: string = "Relative Date Formatting";
        public visible: boolean = true;
        public slices:  FormattingSettingsSlice[] = [
          this.fontSize, 
          this.fontFamily, 
          this.fontColor,
          this.backgroundColor
        ];
    
    
    }

/**
 * Background Formatting Card
 */
export class backgroundFormattingCard extends FormattingSettingsCard {
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" }
    });

    transparency = new formattingSettings.NumUpDown({
        name: "Transparency",
        displayName: "Transparency",
        value: 0
    });

    public name: string = "backgroundFormatting";
    public displayName: string = "Background Formatting";
    public visible: boolean = true;
    public slices:  FormattingSettingsSlice[] = [this.backgroundColor, this.transparency];
}

/**
* Visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    public backgroundFormatting: backgroundFormattingCard = new backgroundFormattingCard();
    public dateFormatting: dateFormattingCard = new dateFormattingCard();
    public relativeDateFormatting: relativeDateFormattingCardSettings = new relativeDateFormattingCardSettings();

    public cards  = [
        this.backgroundFormatting,
        this.dateFormatting,
        this.relativeDateFormatting  
      ];
}

