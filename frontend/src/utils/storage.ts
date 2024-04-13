import { accountType } from "../types";

enum ActionKind {
    ACCOUNT = "ACCOUNT",
    ACCOUNTS = "ACCOUNTS",
}
// save the account information
const saveAccount = (activeAccount: accountType) => localStorage.setItem(ActionKind.ACCOUNT, activeAccount);
const saveAccounts = (accounts: accountType[]) => localStorage.setItem(ActionKind.ACCOUNTS, JSON.stringify(accounts));

// save the account information
const getAccount = () => localStorage.getItem(ActionKind.ACCOUNT);
const getAccounts = () => localStorage.getItem(ActionKind.ACCOUNTS);
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
