import { useEffect } from 'react'
import { PropsWithChildren } from 'react'
import { createPortal } from "react-dom"
import { ReactComponent as Close } from '../assets/icons/close.svg'
type props = {
    visable: boolean,
    onClose: () => void,
    disableClose?: boolean
}
export const Modal = ({ children, visable, onClose, disableClose }: PropsWithChildren<props>) => {
    useEffect(() => {
        if (visable) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [visable])

    if (!visable) return

    return <>
        {
            createPortal(
                <div className='w-full h-screen fixed top-0 left-0 z-50 flex items-center'>
                    <div className={`w-full h-full ${disableClose ? "cursor-pointer" : ""}  absolute top-0 left-0 bg-Black bg-opacity-25 z-10`} onClick={onClose}></div>
                    <div className=' mx-auto bg-White relative z-50 py-10 px-6 rounded-2xl'>
                        {disableClose && <Close onClick={onClose} className='absolute top-[5px] left-[5px] cursor-pointer' />}
                        <div className='modal-divider'></div>
                        <div className='px-4 pt-5 '>
                            {children}
                        </div>
                    </div>
                </div>,
                document.body
            )
        }
    </>
}
