import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import { VisualFormattingSettingsModel } from "./settings";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
export declare class Visual implements IVisual {
    target: HTMLElement;
    startDateInput: HTMLInputElement;
    endDateInput: HTMLInputElement;
    relativeDateSelect: HTMLSelectElement;
    formattingSettings: VisualFormattingSettingsModel;
    formattingSettingsService: FormattingSettingsService;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    getFormattingModel(): powerbi.visuals.FormattingModel;
    private updateDateRange;
    private updateRelativeDate;
    private setDefaultDates;
    private updateStyles;
}
