import { Transition, ITransitionData } from "../../../src/api";
export declare class Fade extends Transition {
    public name: string;
    public duration: number;
    out({ from }: ITransitionData): Promise<unknown>;
    in({ to }: ITransitionData): import("@okikio/animate").Animate;
}
