import { Transition, ITransitionData } from "../../../src/api";
export declare class BigTransition extends Transition {
    public name: string;
    public delay: number;
    public durationPerAnimation: number;
    public mainElement: HTMLElement;
    public verticalElements: HTMLDivElement[];
    public horizontalElements: HTMLDivElement[];
    public maxLength: number;
    public spinnerElement: HTMLElement;
    boot(): void;
    out({ from }: ITransitionData): Promise<unknown>;
    in({ to }: ITransitionData): Promise<unknown>;
}
