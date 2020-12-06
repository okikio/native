import { Transition, ITransitionData } from "../../../src/api";
export declare class BigTransition extends Transition {
    name: string;
    delay: number;
    durationPerAnimation: number;
    mainElement: HTMLElement;
    verticalElements: HTMLDivElement[];
    horizontalElements: HTMLDivElement[];
    maxLength: number;
    spinnerElement: HTMLElement;
    boot(): void;
    out({ from }: ITransitionData): Promise<unknown>;
    in({ to }: ITransitionData): Promise<unknown>;
}
