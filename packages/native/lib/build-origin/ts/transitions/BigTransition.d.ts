import { Transition, ITransitionData } from "../../../src/api";
export declare class BigTransition extends Transition {
    protected name: string;
    protected delay: number;
    protected durationPerAnimation: number;
    protected mainElement: HTMLElement;
    protected verticalElements: HTMLDivElement[];
    protected horizontalElements: HTMLDivElement[];
    protected maxLength: number;
    protected spinnerElement: HTMLElement;
    boot(): void;
    out({ from }: ITransitionData): Promise<unknown>;
    in({ to }: ITransitionData): Promise<unknown>;
}
