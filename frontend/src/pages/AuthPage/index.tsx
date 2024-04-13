import { useEffect, useState } from 'react'
import Login from './Login'
import SingUp from './SingUp'
import { useStore } from '../../hooks'

export const AuthPage = () => {
    const { store } = useStore()
    const [isSigned, setIsSigned] = useState(true)

    const onChange = (chnage?: boolean) => setIsSigned(chnage ? chnage : !isSigned)
    return (
        <>
            <div className='w-full h-screen flex justify-center items-center'>
                <div className='flex-1 '>
                    <div className='mx-auto w-[400px]'>
                        <div className='mt-6 border-2 border-Cf4 rounded-xl overflow-hidden'>
                            <div className="w-full h-16  relative">
                                <div className='w-full h-full flex absolute top-0 left-0 bg-Red'>
                                    <div
                                        onClick={() => onChange(false)}
                                        className={`flex-1 flex justify-center items-center h-full ${isSigned ? "bg-C4c cursor-pointer shadow-lg" : "bg-White"}`}>
                                        <h2 className={`text-2xl font-semibold ${isSigned ? "text-White" : "text-C4c"}`}>Sign up</h2>
                                    </div>
                                    <div
                                        onClick={() => onChange(true)}
                                        className={`flex-1 flex justify-center items-center h-full ${isSigned ? "bg-White" : "bg-C4c cursor-pointer shadow-lg"}`}>
                                        <h2 className={`text-2xl font-semibold ${isSigned ? "text-C4c" : "text-White"}`}>Log in</h2>
                                    </div>
                                </div>
                            </div>
                            <div className=' px-8 py-6'>
                                {isSigned ? <Login change={onChange} /> : <SingUp change={onChange} />}
                            </div>

                        </div>
                    </div>
                </div >

            </div >
        </>

    )
}

