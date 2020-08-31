import { Transition, ITransitionData } from "../../../src/api";
export declare class Slide extends Transition {
    public name: string;
    public duration: number;
    public direction: string;
    out({ from }: ITransitionData): import("@okikio/animate").Animate;
    in({ to }: ITransitionData): import("@okikio/animate").Animate;
}
export declare class SlideLeft extends Slide {
    public name: string;
    public duration: number;
    public direction: string;
}
export declare class SlideRight extends Slide {
    public name: string;
    public duration: number;
    public direction: string;
}
