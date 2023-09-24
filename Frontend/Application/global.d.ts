import SpyObj = jasmine.SpyObj;

type throwsErrorOrReturn<E extends Error, T> = T;
type throwsError<E extends Error> = void;
type Callback<Function = () => Promise<void>> = Function;
type AdapterCallback<Function = () => Promise<void>> = Function;
type BusCallback<Function = () => Promise<void>> = Function;
type MockedObject<T = any> = SpyObj<T>;
type Json = any;

type Factorizable<T> = {
    factory(...args: any[]): T
}

declare namespace JSX {
    type Element = any;

    interface IntrinsicElements {
        [tag: string]: Element;
    }
}

declare module '*.css' {
    const content: any;
    export default content;
}

declare class SpeechRecognition implements EventTarget {
    // recognition parameters
    grammars;
    lang;
    continuous;
    interimResults;
    maxAlternatives;

    constructor();

    // methods to drive the speech interaction
    start();

    stop();

    abort();

    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;

    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;

}

declare interface webkitSpeechRecognition extends SpeechRecognition {
}