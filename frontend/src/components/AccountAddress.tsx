import { useState, useEffect } from 'react'
import { saveToClipboard, rString } from '../helpers/general-helper'
import { ReactComponent as Copy } from '../assets/icons/copy.svg'

import { Modal } from '.';
import { Button } from '.';
import { useAction, useStore } from '../hooks';

type typePorps = {
    address: string
}

type typeState = {
    showAddress: boolean,
    showModal: boolean,
    activeAddress: string
}
const initState = {
    showAddress: false,
    showModal: false,
    activeAddress: ""
}
export const AccountAddress = ({ address }: typePorps) => {
    const { store } = useStore()
    const { changeAccount } = useAction()
    const [state, setState] = useState<typeState>(initState)
    const setModal = () => setState({ ...state, showModal: !state.showModal })

    useEffect(() => {
        setState({ ...state, activeAddress: store.activeAccount })
    }, [])

    const changeWallet = () => {
        changeAccount(state.activeAddress)
        setState(initState)
    }

    return (
        <>
            <Modal visable={state.showModal} onClose={setModal} >
                <div className="flex flex-col justify-center gap-y-4">
                    <div className='flex flex-col h-20 gap-y-2 overflow-y-scroll'>
                        {store.accounts.map((address) => {
                            return <div key={address} className='w-[350px] flex justify-between items-center' >
                                <div onClick={() => setState({ ...state, activeAddress: address })}
                                    className={`flex-3 pl-2 flex items-center h-8 border-2 cursor-pointer  rounded-md ${state.activeAddress == address ? "bg-Blue bg-opacity-30 border-Blue" : "border-C4"}`}>
                                    <p className='text-xs'>{address}</p>
                                </div>
                                <div className='w-5'></div>

                                <Button onClick={() => saveToClipboard(address)} disable={false} type='default' buttonStyle='normal' buttonText='Black' color='bg-Cye' text=''>
                                    <Copy />
                                </Button>
                            </div>
                        })}
                    </div>
                    <Button disable={false} type='colored' buttonStyle='normal' buttonText='Black' color='bg-Cye' text='Change Account' onClick={changeWallet} />
                </div>
            </Modal>
            <div onClick={setModal} className='relative '>

                <Button disable={false} type='default' buttonStyle='normal' buttonText='Black' color='bg-Cye' text={rString(address, 6)} />
            </div>
        </>
    )
}