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
