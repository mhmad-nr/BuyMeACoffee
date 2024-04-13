import { PropsWithChildren } from 'react'
import { TypeBTNProps } from '../types'

export const Button = ({ type, text, onClick, children, buttonStyle, buttonText, color, disable }: PropsWithChildren<TypeBTNProps>) => {
    const style = {
        small: "text-xs font-light px-2 py-1",
        normal: "text-base font-normal p-3 py-1",
        big: "text-1xl font-semibold p-6 py-2",
        full: "text-1xl font-semibold flex-1 py-2",
    }
    return (
        <div className={`relative ${disable ? "cursor-default" : "cursor-pointer"}  group ${style[buttonStyle]}`} onClick={onClick}>
            {disable ? <div className=' w-full h-full absolute top-1/2 left-1/2 translate-x-[-50%] bg-Cf4 translate-y-[-50%] rounded-3xl ' ></div>
                : <>
                    {type == "default" && <div className=' w-1/2 h-1/2 absolute top-1/2 left-1/2 invisible group-hover_visible group-hover_w-full group-hover_h-full group-hover_bg-Cf4 transition-all delay-100 translate-x-[-50%] translate-y-[-50%] rounded-3xl ' ></div>}
                    {type == "colored" && <div className={`w-full h-full group-hover_scale-105 absolute top-1/2 left-1/2 ${color} transition-all delay-200 translate-x-[-50%] translate-y-[-50%] rounded-3xl`} ></div>}
                </>}
            <div className={`w-full h-full flex justify-center items-center relative z-50 ${buttonStyle == "full" ? "justify-center" : ""}  ${disable ? "text-C4" : ""} ${!disable && (buttonText == "Black") ? "text-Black" : "text-White"}`}>
                {children ? children : <button type="button" className={disable ? "cursor-default" : ""}>{text}</button>}
            </div>
        </div>
    )
}

const defaultProps = {
    type: 'default',
    buttonStyle: "normal",
    buttonText: "Black",
    onClick: () => { }
}
Button.defaultProps = defaultProps
