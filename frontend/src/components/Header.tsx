import { Link } from 'react-router-dom'
import { ReactComponent as BMC } from '../assets/icons/bmc-icon.svg'
import { AccountAddress, Button } from '.'
import { useNavigate } from "react-router-dom"
import { useStore } from '../hooks'
export const Header = () => {
    const navigate = useNavigate()
    const { store } = useStore()
    const { activeAccount, accounts } = store
    const connectWallet = async () => {

        // console.log("connect");
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log("pleasee install MetaMask");
            }
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });
            console.log(accounts);

            // setStore({ address: accounts[0], showMetamaskModal: false });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>

            <div className='xs:px-0 w-full z-10 absolute pt-5'>
                <div className='flex justify-between items-center bg-White mx-auto py-4 px-8 rounded-full shadow-md xl_w-[1128px] lg:w-11/12 xs:px-16 xs:w-full x-xss:px-8 xs:shadow-none'>
                    <div className='flex items-center gap-x-8'>
                        <Link to="/">
                            <BMC />
                        </Link>
                    </div>
                    <div className="flex">
                        {accounts.length == 0 ? <Button disable={false} type='colored' buttonStyle='normal' buttonText='Black' color='bg-Cye' text='Connect' onClick={connectWallet} />
                            : <div className='flex items-center'><span >Account: </span>

                                < AccountAddress address={activeAccount} />

                                <Button disable={false} type='colored' buttonStyle='normal' buttonText='Black' color='bg-Cye' text='Sign Up / Log in' onClick={() => navigate("/authpage")} />

                            </div>
                        }

                    </div>
                </div>
            </div>
        </>

    )
}
