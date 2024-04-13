import { useState } from "react"
import { Button } from "../components"
import landingImage from "../assets/images/landing-image.png"
import { toast } from "react-toastify";
import { ethers } from "ethers"
import { useNavigate } from 'react-router-dom';
import { buyMeACoffeeContractFactory } from "../helpers";
import { useStore } from "../hooks";



const Home = () => {
  const { store } = useStore()
  const navigate = useNavigate();

  const [state, setState] = useState({
    searchDisabled: false,
    searchText: ""
  })

  const searchAddress = async () => {
    if (state.searchDisabled) return
    if (!ethers.utils.isAddress(state.searchText)) {
      toast.warn("The Address is not correct")
      return
    }
    const { contract } = await buyMeACoffeeContractFactory(store.activeAccount)
    const res = await contract.SearchAccount(state.searchText)
    if (res == ethers.constants.AddressZero) {
      toast.warn("This Address is not signed up before")
      return
    }
    navigate("/buycoffee/" + res)
  }

  return (
    <>
      <div className='w-full h-[calc(100vh-180px)] flex justify-center items-center'>
        <div className='w-[600px]'>
          <h1 className='text-6xl text-center font-medium text-C22 mb-4'>A supporter is worth a thousand followers.</h1>
          <h2 className='text-xl text-center text-C22'>Accept donations. In a secure way. It’s decentralized and anonymously.</h2>
          <div className='w-full p-2 mt-4 flex justify-between bg-White rounded-full border-2 border-Cf4'>
            <input onChange={(e) => setState({ ...state, searchText: e.target.value })} className='py-2 px-4 outline-none text-lg flex-1' type="text" placeholder='Enter Address' />
            <Button disable={state.searchDisabled} type='colored' buttonStyle='big' color='bg-Cye' text='Search' onClick={searchAddress} />
          </div>
          <div className="mt-4">
            <p className="text-base text-center font-normal text-C4c">It’s not free, but secure and decentralized.</p>
          </div>

        </div>
      </div>
      <div className='w-full bg-CfC6 py-14'>
        <h2 className="text-base text-center font-semibold text- text-C4 tracking-widest">DONATIONS</h2>
        <div className="w-[700px] mx-auto">
          <div className="w-[550px] mx-auto mt-6">
            <h1 className="text-4xl text-center font-bold text-C4c">Give your audience an easy way to say thanks.</h1>
          </div>
          <h2 className="mx-auto text-lg text-center font-normal text-C4c mt-6">Buy Me a Coffee makes supporting fun and easy. In just a couple of taps, your fans can make the payment (buy you a coffee) and leave a message. They don’t even have to create an account!</h2>
          <div className="mt-6">
            <img src={landingImage} alt="image" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home