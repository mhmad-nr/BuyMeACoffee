import { accountType } from "../types";

enum Action {
    ACCOUNT = "ACCOUNT",
    ACCOUNTS = "ACCOUNTS",
}
// save the account instateation
const saveAccount = (account: accountType) => localStorage.setItem(Action.ACCOUNT, account);
const saveAccounts = (accounts: accountType[]) => localStorage.setItem(Action.ACCOUNTS, JSON.stringify(accounts));

// save the account instateation
const getAccount = () => localStorage.getItem(Action.ACCOUNT);
const getAccounts = () => localStorage.getItem(Action.ACCOUNTS);
//
const clearAll = () => localStorage.clear()
const storage = {
    saveAccount,
    saveAccounts,
    getAccount,
    getAccounts,
    clearAll
}
export default storage
