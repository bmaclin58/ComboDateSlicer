import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import "./../style/visual.less";
export declare class Visual implements IVisual {
    private target;
    private startDateInput;
    private endDateInput;
    private relativeDateSelect;
    private formattingSettings;
    private formattingSettingsService;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private updateDateRange;
    private updateRelativeDate;
    private setDefaultDates;
    private updateStyles;
}
