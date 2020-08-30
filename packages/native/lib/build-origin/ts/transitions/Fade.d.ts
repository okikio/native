import { Transition, ITransitionData } from "../../../src/api";
export declare class Fade extends Transition {
    protected name: string;
    protected duration: number;
    out({ from }: ITransitionData): Promise<unknown>;
    in({ to }: ITransitionData): import("@okikio/animate").Animate;
}
