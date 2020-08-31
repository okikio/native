import { Block, IBlockInit } from "../../../src/api";
export declare class InViewBlock extends Block {
    public observer: IntersectionObserver;
    public observerOptions: {
        root: any;
        rootMargin: string;
        threshold?: number;
        thresholds?: Array<number>;
    };
    public imgs: HTMLElement[];
    public direction: string;
    public xPercent: number;
    public inView: boolean;
    init(value: IBlockInit): void;
    public observe(): void;
    public unobserve(): void;
    public onScreen(): void;
    public offScreen(): void;
    onIntersectionCallback(entries: IntersectionObserverEntry[]): void;
    stopEvents(): void;
}
