import { Block, IBlockInit } from "../../../src/api";
export declare class InViewBlock extends Block {
    protected observer: IntersectionObserver;
    protected observerOptions: {
        root: any;
        rootMargin: string;
        threshold?: number;
        thresholds?: Array<number>;
    };
    protected imgs: HTMLElement[];
    protected direction: string;
    protected xPercent: number;
    protected inView: boolean;
    init(value: IBlockInit): void;
    protected observe(): void;
    protected unobserve(): void;
    protected onScreen(): void;
    protected offScreen(): void;
    onIntersectionCallback(entries: IntersectionObserverEntry[]): void;
    stopEvents(): void;
}
