import { Action, accountType } from "../types";
import { useStore } from ".";
import { ethers } from "ethers";

export const useAction = () => {
  const { setStore } = useStore();
  const changeAccount = (account: accountType) => {
    setStore({
      type: Action.CHANGE_ACCOUNT,
      payload: { account },
    });
  };
  const resetAccounts = () => {
    setStore({
      type: Action.RESET_ACCOUNTS,
      payload: {},
    });
  };
  const initAccounts = (accounts: accountType[]) => {
    setStore({
      type: Action.INIT_ACCOUNTS,
      payload: {
        account: accounts[0],
        accounts,
      },
    });
  };
  const readAccounts = (account: accountType, accounts: accountType[]) => {
    setStore({
      type: Action.INIT_ACCOUNTS,
      payload: {
        account,
        accounts,
      },
    });
  };

  const setContract = (contract: ethers.Contract) => {
    setStore({
      type: Action.CONTRACT,
      payload: {
        contract,
      },
    });
  };
  const setSingedUp = (isSignup: boolean) => {
    setStore({
      type: Action.SIGN_UP,
      payload: { isSignup },
    });
  };

  return {
    changeAccount,
    initAccounts,
    resetAccounts,
    readAccounts,
    setContract,
    setSingedUp,
  };
};
