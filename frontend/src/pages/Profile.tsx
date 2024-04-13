import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import { concat, personContractFactory, saveToClipboard } from '../helpers'
import { TypeForm, stageType } from '../types'
import { IPFS } from '../service'
import Loading from '../components/Loading'
import { toast } from 'react-toastify'
import { useStore } from '../hooks'
type TypeMemo = {
  from: string,
  timestamp: string,
  amount: string,
  name: string,
  message: string,
  blockHash?: string
}
type TypeMemos = TypeMemo[]
type TypeState = {
  balance: BigInt,
  memos: TypeMemos,
  stage: stageType
} & TypeForm<string>

const getEth = (amout: ethers.BigNumberish) => ethers.utils.formatEther(amout)



const Profile = () => {
  const { store } = useStore()
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
    contract.on("MemoEvent", onNewMemo);

    const ipfsUrl = await contract.getIPFSUrl()
    const memosResponse = await contract.getMemos()
    const memos = memosResponse.map((m: TypeMemo) => m)

    const res = await IPFS().getData(ipfsUrl)

    if (res.success) {
      const data = {
        ...res.data,
        img: res.data.img as string
      }
      setState({ ...state, ...data, memos })
    }


  }
  const getDate = (timestamp: number) => new Date(parseInt(timestamp.toString())).toLocaleDateString("en-US")
  const onNewMemo = (address: string, timestamp: ethers.BigNumberish, amount: ethers.BigNumberish, name: string, message: string,) => {
    const memo: TypeMemo = {
      from: address,
      amount: amount.toString(),
      timestamp: timestamp.toString(),
      name,
      message
    }
    addMemo([memo])
  }
  const addMemo = (newMemo: TypeMemo[]) => {
    const currentMemos = state.memos
    const memos = concat<TypeMemo>(currentMemos, newMemo)
    const amount = ethers.utils.formatEther(newMemo[0].amount)
    toast.success(`${newMemo[0].name} bought A ${amount} Coffee for you`)
    setState({ ...state, memos })
  }

  return (
    <div className='bg-White min-h-screen'>
      <div className='w-full flex flex-col items-center gap-y-4'>
        <div className='w-[140px] h-[140px] rounded-full border-2 border-Cf4 shadow-2xl overflow-hidden' >
          {state.stage == stageType.STAGE_LOADING ? <Loading size='small' /> : <img className='w-full h-full' src={state.img} />}
        </div>
        <h2 className='text-3xl text-C22 font-semibold'>{state.stage == stageType.STAGE_LOADING ? <Loading size='small' /> : state.fullName}</h2>
      </div>
      <div className='w-full flex mt-12'>
        <div className='mx-auto w-[1128px]  flex gap-x-6'>
          <div className="flex-2">
            <div className=' border border-Cf4 p-8 rounded-xl '>
              {state.stage == stageType.STAGE_LOADING ? <div className='w-full h-20'>
                <Loading size='normal' />
              </div> : <>
                <p className='text-justify text-C4c text-sm'>{state.discription}</p>
              </>}
            </div>
          </div>
          <div className="flex-1 flex flex-col max-h-[390px] overflow-y-auto gap-y-4 border border-Cf4 p-8 rounded-xl">
            {state.stage == stageType.STAGE_LOADING ? <div className='w-full h-20'><Loading size='normal' /></div>
              : state.memos.length == 0 ? <div className='w-full h-full flex items-center justify-center'>
                <div className='bg-Cf4 px-4 py-2 rounded-3xl'>
                  <h2 className='text-sm'>Unfortunately, no one has bought coffee for you.</h2>
                </div>
              </div>
                : state.memos.map((memo, i) => (
                  <div key={i} className='w-full border-b-4 radius border-Blue border-opacity-50 pb-4'>
                    <div className='w-full flex justify-between items-center'>
                      <span className='text-xs'>From: <span className='text-Blue text-sm font-semibold'>{memo.name}</span></span>
                      <span className='text-sm text-C4c font-semibold'>{memo.timestamp}</span>
                    </div>
                    <div className='my-2'>
                      <p className='text-justify text-C4c leading-5 text-xs'>{memo.message}</p>
                    </div>
                    <div className=' w-full flex justify-center my-2'>
                      {
                        (() => {
                          console.log(memo.amount);

                          return <></>
                        })()

                      }
                      {/* <h2 className='text-xl text-Cye font-bold'>{getEth(memo.amount)} <span className='text-xs text-Black'>Eth</span></h2> */}
                    </div>
                    <div className=' w-full flex justify-center'>
                      <div onClick={() => saveToClipboard(memo.from)} className="bg-Cf4 cursor-pointer py-1 px-2 rounded-3xl">
                        <p className='text-xs'>{memo.from}</p>
                      </div>
                    </div>
                  </div>

                ))}
          </div>
        </div>
      </div>
    </div >
  )
}

export default Profile

