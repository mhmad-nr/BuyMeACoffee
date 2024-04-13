import React, { useLayoutEffect, useEffect, useState } from 'react'
import { Button } from '../components'
import { useParams } from 'react-router-dom'
import { useStore } from '../hooks'
import { IPFS } from '../service'
import { listenForTransactionMine, personContractFactory } from '../helpers'
import { TypeForm, stageType } from '../types'
import { ethers, providers } from 'ethers'



type memo = {
  address: string,
  timestamp: number,
  amount: BigInt,
  name: string,
  massage: string
}
type memos = memo[]
type TypeState = {
  balance: BigInt,
  memos: memos,
  stage: stageType
} & TypeForm<string>


const BuyCoffee = () => {

  const { store } = useStore()

  const [form, setForm] = useState({
    value: 1,
    name: "",
    text: ''
  })
  const [contract, setContract] = useState<any>(null)
  const [state, setState] = useState<TypeState>({
    img: '',
    balance: BigInt(0),
    discription: "",
    memos: [],
    fullName: "",
    stage: stageType.STAGE_ONE
  })
  const { address } = useParams()

  useEffect(() => {
    get()
  }, [])
  const get = async () => {
    setState({ ...state, stage: stageType.STAGE_LOADING })
    if (!address) return
    const { contract } = await personContractFactory(store.activeAccount, address)
    const ipfsUrl = await contract.getIPFSUrl()

    setContract(contract)
    const res = await IPFS().getData(ipfsUrl)

    if (res.success) {
      const data = {
        ...res.data,
        img: res.data.img as string
      }
      setState({ ...state, ...data })
    }


  }


  const setValue = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    const newValue = parseInt(value)
    if (newValue <= 9) {
      setForm({ ...form, value: newValue })
    }
  }
  const setInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setForm({ ...form, name: value })
  }

  const setTextarea = (e: any) => {
    const { value } = e.currentTarget
    setForm({ ...form, text: value })
  }
  const onBuy = async () => {
    const value = ethers.utils.parseEther(form.value.toString())
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const res = await contract.buyACoffee(form.name, form.text, { value })
    const r = await listenForTransactionMine(res, provider)

  }
  return (
    <div className='bg-White min-h-screen'>
      <div className='w-full flex flex-col items-center gap-y-4'>
        <img className='w-[140px] h-[140px] rounded-full' src={state.img} />
        <h2 className='text-3xl text-C22 font-semibold'>{state.fullName}</h2>
      </div>
      <div className='w-full flex mt-12'>
        <div className='mx-auto w-[1128px]  flex gap-x-6'>
          <div className="flex-2">
            <div className=' border border-Cf4 p-8 rounded-xl '>

              <p className='text-justify text-C4c text-sm'>{state.discription}</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-y-4 border border-Cf4 p-8 rounded-xl">
            <h2 className='text-C4c text-2xl font-semibold'>Buy <span className='text-C4'>{state.fullName}</span> a coffee</h2>
            <input value={form.name} onChange={setInput} className='w-full  outline-none p-2  font-light border border-C4 rounded-md resize-none' placeholder='Your name' />
            <div className='w-full flex justify-between items-center gap-x-2 rounded-md border border-Blue border-opacity-40 bg-C5f p-4'>
              <div className='flex items-center gap-x-2'>
                <div className='text-[40px]'>☕</div>
                <div className='text-xl text-C4c'>X</div>
              </div>
              <div className='flex gap-x-2'>
                <button value={1} onClick={() => setForm({ ...form, value: 1 })}
                  className={`w-10 h-10 font-semibold text-lg text-Blue flex justify-center items-center border border-Blue border-opacity-40 rounded-full ${form.value == 1 ? "bg-Blue text-White" : "bg-White"}`}>1</button>
                <button value={3} onClick={() => setForm({ ...form, value: 3 })}
                  className={`w-10 h-10 font-semibold text-lg text-Blue flex justify-center items-center border border-Blue border-opacity-40 rounded-full ${form.value == 3 ? "bg-Blue text-White" : "bg-White"}`}>3</button>
                <button value={5} onClick={() => setForm({ ...form, value: 5 })}
                  className={`w-10 h-10 font-semibold text-lg text-Blue flex justify-center items-center border border-Blue border-opacity-40 rounded-full ${form.value == 5 ? "bg-Blue text-White" : "bg-White"}`}>5</button>
                <input value={form.value} onChange={setValue} className='bg-White outline-none w-10 h-10 font-normal text-lg text-C4c text-center border border-C4 rounded-md' type="text" />
              </div>
            </div>
            <textarea value={form.text}
              onChange={setTextarea}
              className='w-full  outline-none p-2 bg-Cf4 font-light border border-C4 rounded-md resize-none' placeholder='Say something nice.. (optional)'></textarea>
            <Button disable={false} type='colored' buttonStyle='full' buttonText='White' color='bg-Blue' text={`Support $ ${form.value * 5}`} onClick={onBuy} />
          </div>

        </div>
      </div>
    </div >
  )
}

export default BuyCoffee