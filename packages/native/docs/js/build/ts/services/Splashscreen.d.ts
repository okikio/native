import { Service } from "../../../src/api";
export declare class Splashscreen extends Service {
    rootElement: HTMLElement;
    innerEl: HTMLElement;
    bgEl: HTMLElement;
    minimalDuration: number;
    init(): void;
    boot(): void;
    hide(): Promise<void>;
    show(): Promise<void>;
}
