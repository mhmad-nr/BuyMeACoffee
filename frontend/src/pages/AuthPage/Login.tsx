import { Button } from "../../components"
import { useStore } from "../../hooks"
import { buyMeACoffeeContractFactory, isValidAddress } from "../../helpers"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

type TypePorp = {
    change: () => void
}

const Login = ({ change }: TypePorp) => {
    const { store } = useStore()
    const navigate = useNavigate()
    const [state, setState] = useState({
        loading: false,
    })
    const onLogin = async () => {
        if (state.loading) return
        setState({ ...state, loading: true })
        const { contract: buyMeACoffee } = await buyMeACoffeeContractFactory(store.activeAccount)
        const res = await buyMeACoffee.SearchAccount(store.activeAccount)
        console.log(isValidAddress(res));

        if (!isValidAddress(res)) {
            setState({ ...state, loading: false })
            toast.error("This Address is not signed up before pleasee change your address or sign up")
            change()
            return
        }
        toast.success("You are loging in please wait...")
        setTimeout(() => {
            console.log("address is not signed up");
            navigate("/profile/" + res)
        }, 2000)
    }

    return (
        <div className="grid gap-y-4">
            <h2>Log in as:</h2>
            <div className=' w-full flex justify-center'>
                <div className="bg-Cf4 cursor-pointer py-1 px-2 rounded-3xl">
                    <p className="text-xs font-semibold">{store.activeAccount}</p>
                </div>
            </div>
            <Button disable={state.loading} type='colored' buttonStyle='normal' buttonText='Black' color='bg-Cye' text='Log in' onClick={onLogin} />
        </div>
    )
}
export default Login
