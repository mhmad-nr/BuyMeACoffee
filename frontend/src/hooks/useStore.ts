import { useContext } from "react"
import { Context } from '../context'
export const useStore = () => useContext(Context);
