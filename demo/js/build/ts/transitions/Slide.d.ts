import { Transition, ITransitionData, ITransition } from "../../../src/api";
export declare class Slide extends Transition {
    name: string;
    duration: number;
    direction: string;
    init(value: ITransition): void;
    out({ from }: ITransitionData): import("@okikio/animate").Animate;
    in({ to }: ITransitionData): import("@okikio/animate").Animate;
}
export declare class SlideLeft extends Slide {
    name: string;
    duration: number;
    direction: string;
}
export declare class SlideRight extends Slide {
    name: string;
    duration: number;
    direction: string;
}
