import { Service } from "../../../src/api";
export declare class IntroAnimation extends Service {
    public elements: Array<Element>;
    public rootElement: HTMLElement;
    init(): void;
    newPage(): void;
    initEvents(): void;
    stopEvents(): void;
    stop(): void;
    prepareToShow(): void;
    show(): Promise<any>;
}
