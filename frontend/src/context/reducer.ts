import { Action, Actions, storeType } from "../types";

export function reducer(store: storeType, action: Actions): storeType {
  const { type, payload } = action;
  switch (type) {
    case Action.INIT_ACCOUNTS:
      return {
        ...store,
        account: payload.account,
        accounts: payload.accounts,
      };

    case Action.CHANGE_ACCOUNT:
      return {
        ...store,
        account: payload.account,
      };
    case Action.CONTRACT:
      return {
        ...store,
        contract: payload.contract,
      };
    case Action.SIGN_UP:
      return {
        ...store,
        isSingedUp: true,
      };

    default:
      return store;
  }
}
