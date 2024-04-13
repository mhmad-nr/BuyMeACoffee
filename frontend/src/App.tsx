import { Suspense } from 'react';
import AppRoute from './Route'
import { StoreProvider } from './context'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
declare global {
  interface Window {
    ethereum: any
  }
}
function App() {

  return (
    <Suspense fallback={<Loading />}>
      <StoreProvider>
        <AppRoute />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </StoreProvider>
    </Suspense>

  )
}

export default App

const Loading = () => {
  return (
    <div>Loading...</div>
  )
}