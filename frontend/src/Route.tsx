import { useEffect, useState, lazy, useLayoutEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { MainLayout } from './layouts';
import { useAction, useStore } from './hooks';
import { stageType } from './types';
import { toast } from "react-toastify"
import { sameMembers } from './helpers';
import { Button, Modal } from './components';
import { AuthPage } from './pages';
import storage from './utils/storage';

const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const BuyCoffee = lazy(() => import('./pages/BuyCoffee'));

type stateType = {
    modalStage: stageType,
    currentAddress: string,
    accounts: string[]
}
const initState = {
    modalStage: stageType.STAGE_HIDE,
    accounts: [],
    currentAddress: ""
}
const AppRoute = () => {
    const { store } = useStore()
    const [state, setState] = useState<stateType>(initState)
    useEffect(() => {
        if (window.ethereum) {
            isWalletConnected()
            checkMetamaskHasChanged()
        } else {
            setState({ ...state, modalStage: stageType.STAGE_FIRST_ERROR });
        }
    }, [])

    const { readAccounts } = useAction()
    useLayoutEffect(() => {
        const { getAccount, getAccounts } = storage
        const account = getAccount()
        const accounts = getAccounts()

        console.log(account);
        if (account && accounts) {
            readAccounts(account, JSON.parse(accounts))
            console.log("useLayoutEffect");
        }

    }, [])


    const { initAccounts, resetAccounts } = useAction()
    const setWallets = (activeAccount: string, addresses: string[]) => {
        toast.success("Your Wallet has been connected")
        if (sameMembers(addresses, store.accounts)) return
        initAccounts(activeAccount, addresses)
        setState(initState)
    }
    const isWalletConnected = async () => {
        try {
            const { ethereum } = window;
            // console.log(ethereum);
            if (!ethereum) return
            const accounts: string[] = await ethereum.request({ method: 'eth_accounts' })
            // console.log("accounts: ", accounts);
            if (accounts.length > 0) {
                setState({ ...state, accounts, modalStage: stageType.STAGE_ONE })
            } else {
                // setState({ ...state, accounts, modalStage: stageType.STAGE_FIRST_ERROR })
            }
        } catch (error) {
            // console.log("error: ", error);
        }
    }

    const checkMetamaskHasChanged = () => {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {

            if (!sameMembers<string>(accounts, store.accounts)) {
                setState({ ...state, accounts, modalStage: stageType.STAGE_ONE })

            } else {
                clearAddress()
            }
        })
    }
    const clearAddress = () => {
        resetAccounts()
        toast.warning("Your Wallet has been disconnected")
    }
    // console.log(store);
    const setModal = () => setState({ ...state, modalStage: stageType.STAGE_HIDE })
    const setActiveAddress = () => {
        if (state.currentAddress == "") {
            toast.warn("pleasee select a address")
            return
        }
        setWallets(state.currentAddress, state.accounts)
    }
    return (
        <>
            <Modal visable={state.modalStage != stageType.STAGE_HIDE} onClose={setModal}>
                {state.modalStage == stageType.STAGE_FIRST_ERROR && <>
                    <h2>To use this app, you need to <a href="https://metamask.io/" target="_blank" className="font-semibold text-Blue cursor-pointer">install MetaMask</a> on your browser.</h2></>}
                {state.modalStage == stageType.STAGE_ONE && <>
                    <div className='flex flex-col h-16 gap-y-2 overflow-y-scroll'>
                        {state.accounts.map((address) => {
                            return <div key={address}
                                onClick={() => setState({ ...state, currentAddress: address })}
                                className={`px-1 mx-4 flex items-center h-8 border-2 cursor-pointer  rounded-md ${state.currentAddress == address ? "bg-Blue bg-opacity-30 border-Blue" : "border-C4"}`}>
                                <p className='text-xs'>{address}</p>
                            </div>
                        })}
                    </div>
                    <div className='mt-4'>
                        <Button disable={false} type='colored' buttonStyle='normal' buttonText='Black' color='bg-Cye' text='Set as Active' onClick={setActiveAddress} />
                    </div>
                </>}
            </Modal>
            <Router>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile/:address" element={<Profile />} />
                        <Route path="/buycoffee/:address" element={<BuyCoffee />} />
                        <Route path="/authpage" element={<AuthPage />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </MainLayout>
            </Router>
        </>
    )
}

export default AppRoute;


const NotFound = () => {
    return (
        <div className='h-screen flex justify-center items-center text-9xl bg-C4'>Not Found</div>
    )
}
