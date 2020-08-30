import { Service } from "../../../src/api";
export declare class Splashscreen extends Service {
    protected rootElement: HTMLElement;
    protected innerEl: HTMLElement;
    protected bgEl: HTMLElement;
    protected minimalDuration: number;
    init(): void;
    boot(): void;
    hide(): Promise<void>;
    show(): Promise<void>;
}
