import { Action, accountType } from "../types";
import { useStore } from ".";
import storage from "../utils/storage";
import { ethers } from "ethers";

export const useAction = () => {
  const { setStore } = useStore();
  const changeAccount = (activeAccount: accountType) => {
    setStore({
      type: Action.CHANGE_ACCOUNT,
      payload: { activeAccount },
    });
  };
  const resetAccounts = () => {
    setStore({
      type: Action.RESET_ACCOUNTS,
      payload: {},
    });
  };
  const initAccounts = (
    activeAccount: accountType,
    accounts: accountType[]
  ) => {
    setStore({
      type: Action.INIT_ACCOUNTS,
      payload: {
        activeAccount,
        accounts,
      },
    });
  };
  const readAccounts = (
    activeAccount: accountType,
    accounts: accountType[]
  ) => {
    setStore({
      type: Action.INIT_ACCOUNTS,
      payload: {
        activeAccount,
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

  return {
    changeAccount,
    initAccounts,
    resetAccounts,
    readAccounts,
    setContract,
  };
};
