// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useMyState(initialState: any): any {
    const state = ref(initialState);
    const setState = (newState: any) => {
        state.value = newState;
    };
    
    return [readonly(state), setState];
}
    