import { Action, Actions, storeType } from "../types";

export function reducer(store: storeType, action: Actions): storeType {
  const { type, payload } = action;
  switch (type) {
    case Action.INIT_ACCOUNTS:
      return {
        ...store,
        activeAccount: payload.activeAccount,
        accounts: payload.accounts,
      };

    case Action.CHANGE_ACCOUNT:
      return {
        ...store,
        activeAccount: payload.activeAccount,
      };
    case Action.CONTRACT:
      return {
        ...store,
        contract: payload.contract,
      };

    default:
      return store;
  }
}
