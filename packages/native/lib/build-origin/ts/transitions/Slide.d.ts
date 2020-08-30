import { Transition, ITransitionData } from "../../../src/api";
export declare class Slide extends Transition {
    protected name: string;
    protected duration: number;
    protected direction: string;
    out({ from }: ITransitionData): import("@okikio/animate").Animate;
    in({ to }: ITransitionData): import("@okikio/animate").Animate;
}
export declare class SlideLeft extends Slide {
    protected name: string;
    protected duration: number;
    protected direction: string;
}
export declare class SlideRight extends Slide {
    protected name: string;
    protected duration: number;
    protected direction: string;
}
