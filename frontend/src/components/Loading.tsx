import { ReactComponent as LoadingSvg } from '../assets/icons/loading.svg'
import { TypeSize } from '../types'
const Loading = ({ size }: { size: TypeSize }) => {
    const style = {
        small: "w-8 h-8",
        normal: "w-14 h-14",
        big: "w-24 h-24",
    }
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <LoadingSvg className={style[size]} />
        </div>
    )
}
export default Loading
