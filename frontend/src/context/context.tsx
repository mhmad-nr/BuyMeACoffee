import React, { ReactNode, useReducer } from "react";
import {
    Actions,
    constextType, storeType
} from "../types";
import { reducer } from "./reducer";

const initStore: storeType = {
    accounts: [],
    activeAccount: ""
}

type propsType = {
    children: ReactNode
};



export const Context = React.createContext({} as constextType);

export const StoreProvider: React.FC<propsType> = ({ children }) => {
    const [store, setStore] = useReducer<(store: storeType, action: Actions) => storeType>(reducer, initStore);
    return (
        <Context.Provider value={{ store, setStore }}>
            {children}
        </Context.Provider>
    );
};


