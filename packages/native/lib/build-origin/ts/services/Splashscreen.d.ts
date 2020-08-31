import { Service } from "../../../src/api";
export declare class Splashscreen extends Service {
    public rootElement: HTMLElement;
    public innerEl: HTMLElement;
    public bgEl: HTMLElement;
    public minimalDuration: number;
    init(): void;
    boot(): void;
    hide(): Promise<void>;
    show(): Promise<void>;
}
