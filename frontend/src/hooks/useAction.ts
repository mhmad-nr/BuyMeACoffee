import { ActionKind, accountType } from "../types"
import { useStore } from ".";
import storage from "../utils/storage";

export const useAction = () => {
    const { setStore } = useStore()
    const { clearAll, saveAccount, saveAccounts } = storage
    const changeAccount = (activeAccount: accountType) => {

        saveAccount(activeAccount)

        setStore({
            type: ActionKind.CHANGE_ACCOUNT,
            payload: { activeAccount }
        })
    }
    const resetAccounts = () => {
        clearAll()
        setStore({
            type: ActionKind.RESET_ACCOUNTS,
            payload: {}
        })
    }
    const initAccounts = (activeAccount: accountType, accounts: accountType[]) => {

        saveAccount(activeAccount)
        saveAccounts(accounts)

        setStore({
            type: ActionKind.INIT_ACCOUNTS,
            payload: {
                activeAccount,
                accounts
            }
        })
    }
    const readAccounts = (activeAccount: accountType, accounts: accountType[]) => {
        setStore({
            type: ActionKind.INIT_ACCOUNTS,
            payload: {
                activeAccount,
                accounts
            }
        })
    }
    return {
        changeAccount,
        initAccounts,
        resetAccounts,
        readAccounts
    }
}