import { createAction as NgrxCreateAction } from '@ngrx/store';
import { FunctionWithParametersType, TypedAction, Creator, ActionCreator, DisallowTypeProperty } from '@ngrx/store/src/models';

export function createAction<T extends string>(type: T): ActionCreator<T, () => TypedAction<T>>;
export function createAction<T extends string, P extends object>(type: T, config: {
    _as: 'props';
    _p: P;
}): ActionCreator<T, (props: P) => P & TypedAction<T>>;
export function createAction<
    T extends string,
    P extends any[],
    R extends object
>(
    type: T,
    creator: Creator<P, DisallowTypeProperty<R>>,
): FunctionWithParametersType<P, R & TypedAction<T>> & TypedAction<T>;
export function createAction<T extends string, C extends Creator>(
    type: T,
    config?: { _as: 'props' } | C,
  ): ActionCreator<T> {
    let newConfig: { _as: 'props' } | C;
    if (typeof config === 'function') {
        // @ts-ignore
        newConfig = (...args: any[]) => {
            const stack = parseStack(new Error().stack);
            return {
                ...config(...args),
                __stack: stack,
            };
        };
    } else if (config && config._as) {
        // @ts-ignore
        newConfig = (props: object) => {
            const stack = parseStack(new Error().stack);
            return {
                ...props,
                __stack: stack,
            };
        };
    } else {
        // @ts-ignore
        newConfig = () => {
            const stack = parseStack(new Error().stack);
            return {
                __stack: stack,
            };
        };
    }
    // @ts-ignore
    return NgrxCreateAction(type, newConfig);
}

function parseStack(stack: string) {
    const arr = stack.split('\n'); // create an array with all lines
    arr.splice(1, 1); // remove the second line (first line after 'ERROR')
    return arr.slice(1, 26).join('\n'); // join array back to a string
}
