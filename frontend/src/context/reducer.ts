import { ActionKind, storeType } from "../types";

export function reducer(store: storeType, action: any): storeType {
    const { type, payload } = action;
    switch (type) {

        case ActionKind.INIT_ACCOUNTS:
            return {
                ...store,
                activeAccount: payload.activeAccount,
                accounts: payload.accounts
            };
        case ActionKind.CHANGE_ACCOUNT:
            return {
                ...store,
                activeAccount: payload.activeAccount,
            };
        default:
            return store;
    }
}