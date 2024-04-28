import { ethers } from "ethers";

export type accountType = string;

export type storeType = {
  contract: ethers.Contract | null;
  accounts: accountType[];
  account: accountType;
  isSingedUp: boolean;
};

export enum LocalStorageEnum {
  ACTIVE_ADDRESS = "ACTIVE_ADDRESS",
  ADDRESSES = "ADDRESSES",
  THEME = "THEME",
}
type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};
export enum Action {
  CONTRACT = "CONTRACT",
  INIT_ACCOUNTS = "INIT_ACCOUNTS",
  CHANGE_ACCOUNT = "CHANGE_ACCOUNT",
  RESET_ACCOUNTS = "RESET_ACCOUNTS",
  SIGN_UP = "SIGN_UP",
}

type Payload = {
  [Action.INIT_ACCOUNTS]: {
    account: string;
    accounts: string[];
  };
  [Action.CHANGE_ACCOUNT]: {
    account: string;
  };
  [Action.CONTRACT]: {
    contract: ethers.Contract;
  };
  [Action.RESET_ACCOUNTS]: {};
  [Action.SIGN_UP]: {
    isSignup: boolean;
  };
};

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

export type constextType = {
  store: storeType;
  setStore: React.Dispatch<Actions>;
};
