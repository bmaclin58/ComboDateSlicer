import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
export declare class Visual implements IVisual {
    private target;
    private startDateInput;
    private endDateInput;
    private dateRangeSlider;
    private relativeDateSelect;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private updateDateRange;
    private updateRelativeDate;
}
