import { ethers } from "ethers";

export type accountType = string;

export type storeType = {
  contract: ethers.Contract | null;
  accounts: accountType[];
  activeAccount: string;
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
  FIND = "FIND",
  LOGIN = "DECREASE",
}

type Payload = {
  [Action.INIT_ACCOUNTS]: {
    activeAccount: string;
    accounts: string[];
  };
  [Action.CHANGE_ACCOUNT]: {
    activeAccount: string;
  };
  [Action.CONTRACT]: {
    contract: ethers.Contract;
  };
  [Action.RESET_ACCOUNTS]: {};
};

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

export type constextType = {
  store: storeType;
  setStore: React.Dispatch<Actions>;
};
