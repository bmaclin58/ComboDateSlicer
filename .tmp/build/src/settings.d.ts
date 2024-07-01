import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
export declare class dateFormattingCard extends FormattingSettingsCard {
    /**
     * Date Formatting Card
     */
    fontFamily: formattingSettings.FontPicker;
    fontSize: formattingSettings.NumUpDown;
    fontColor: formattingSettings.ColorPicker;
    backgroundColor: formattingSettings.ColorPicker;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
/**
 * Relative Date Formatting Card
 */
export declare class relativeDateFormattingCardSettings extends FormattingSettingsCard {
    /**
     * Text Formatting Card
     */
    fontFamily: formattingSettings.FontPicker;
    fontSize: formattingSettings.NumUpDown;
    fontColor: formattingSettings.ColorPicker;
    backgroundColor: formattingSettings.ColorPicker;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
/**
 * Background Formatting Card
 */
export declare class backgroundFormattingCard extends FormattingSettingsCard {
    backgroundColor: formattingSettings.ColorPicker;
    transparency: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    visible: boolean;
    slices: FormattingSettingsSlice[];
}
/**
* Visual settings model class
*
*/
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    backgroundFormatting: backgroundFormattingCard;
    dateFormatting: dateFormattingCard;
    relativeDateFormatting: relativeDateFormattingCardSettings;
    cards: (backgroundFormattingCard | dateFormattingCard | relativeDateFormattingCardSettings)[];
}
