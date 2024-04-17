import { PropsWithChildren } from 'react'
import { Navbar, Footer } from '../components'


export const MainLayout = ({ children }: PropsWithChildren) => (
    <>
        <Navbar />
        <div className=' pt-[91px]'>
            {children}
        </div>
        <Footer />
    </>

)
