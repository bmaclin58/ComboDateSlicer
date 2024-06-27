import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * Text Formatting Card
 */
declare class TextFormattingCardSettings extends FormattingSettingsCard {
    fontSize: formattingSettings.NumUpDown;
    fontFamily: formattingSettings.FontPicker;
    fontColor: formattingSettings.ColorPicker;
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
/**
* Visual settings model class
*
*/
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    textFormattingCard: TextFormattingCardSettings;
    backgroundFormattingCard: BackgroundFormattingCardSettings;
    cards: (TextFormattingCardSettings | BackgroundFormattingCardSettings)[];
}
export {};
