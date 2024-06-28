import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * Data Point Formatting Card
 */
declare class DataPointCardSettings extends FormattingSettingsCard {
    defaultColor: formattingSettings.ColorPicker;
    showAllDataPoints: formattingSettings.ToggleSwitch;
    fill: formattingSettings.ColorPicker;
    fillRule: formattingSettings.ColorPicker;
    fontSize: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
<<<<<<< Updated upstream
* visual settings model class
=======
 * Date 1 Formatting Card
 */
declare class dateFormattingCardSettings extends FormattingSettingsCard {
    fontSize: formattingSettings.NumUpDown;
    fontFamily: formattingSettings.FontPicker;
    fontColor: formattingSettings.ColorPicker;
    backgroundColor: formattingSettings.ColorPicker;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Relative Date Formatting Card
 */
declare class RelativeDateFormattingCardSettings extends FormattingSettingsCard {
    fontSize: formattingSettings.NumUpDown;
    fontFamily: formattingSettings.FontPicker;
    fontColor: formattingSettings.ColorPicker;
    backgroundColor: formattingSettings.ColorPicker;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Background Formatting Card
 */
declare class BackgroundFormattingCardSettings extends FormattingSettingsCard {
    backgroundColor: formattingSettings.ColorPicker;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
export declare class VisualSettingsModel extends FormattingSettingsModel {
    myVisualCard: FormattingSettingsCard;
    cards: Array<FormattingSettingsCard>;
}
/**
* Visual settings model class
>>>>>>> Stashed changes
*
*/
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    dataPointCard: DataPointCardSettings;
    cards: DataPointCardSettings[];
}
export {};
