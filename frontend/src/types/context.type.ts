export type accountType = string

export type storeType = {
    accounts: accountType[],
    activeAccount: string
}
type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
    }
    : {
        type: Key;
        payload: M[Key];
    }
};
export enum ActionKind {
    INIT_ACCOUNTS = 'INIT_ACCOUNTS',
    CHANGE_ACCOUNT = 'CHANGE_ACCOUNT',
    RESET_ACCOUNTS = 'RESET_ACCOUNTS',
    FIND = 'FIND',
    LOGIN = 'DECREASE',
}

type Payload = {
    [ActionKind.INIT_ACCOUNTS]: {
        activeAccount: string,
        accounts: string[]
    };
    [ActionKind.CHANGE_ACCOUNT]: {
        activeAccount: string,
    };
    [ActionKind.RESET_ACCOUNTS]: {}


}

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

export type constextType = {
    store: storeType,
    setStore: React.Dispatch<Actions>
}