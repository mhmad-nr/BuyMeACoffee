import { PropsWithChildren } from 'react'
import { Header, Footer } from '../components'


export const MainLayout = ({ children }: PropsWithChildren) => (
    <>
        <Header />
        <div className=' pt-[91px]'>
            {children}
        </div>
        <Footer />
    </>

)
