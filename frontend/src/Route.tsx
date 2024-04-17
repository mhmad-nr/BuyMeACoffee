import { useEffect, useState, lazy, useLayoutEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";
import { useAction, useStore } from "./hooks";
import { LocalStorageEnum, stageType } from "./types";
import { toast } from "react-toastify";
import { contractProvider, sameMembers } from "./helpers";
import storage from "./utils/storage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSDK } from "@metamask/sdk-react";

const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const BuyCoffee = lazy(() => import("./pages/BuyCoffee"));

type stateType = {
  modalStage: stageType;
  currentAddress: string;
  accounts: string[];
};
const initState = {
  modalStage: stageType.STAGE_HIDE,
  accounts: [],
  currentAddress: "",
};
const AppRoute = () => {
  const { store } = useStore();
  const [state, setState] = useState<stateType>(initState);

  const { getItem } = useLocalStorage();
  const { setContract } = useAction();

  const { account } = useSDK();
  // console.log(connected);

  useEffect(() => {
    const activeAddress = getItem(LocalStorageEnum.ACTIVE_ADDRESS);
    const addresses = getItem(LocalStorageEnum.ADDRESSES);

    init();

    
    // isWalletConnected();
    // checkMetamaskHasChanged();
  }, []);
  const init = async () => {
    if (!account) return;

    const { contract } = await contractProvider({
      signerAddress: account,
    });
    setContract(contract);
  };


  const { initAccounts, resetAccounts } = useAction();
  const setWallets = (activeAccount: string, addresses: string[]) => {
    toast.success("Your Wallet has been connected");
    if (sameMembers(addresses, store.accounts)) return;
    initAccounts(activeAccount, addresses);
    setState(initState);
  };
  // const isWalletConnected = async () => {
  //   try {
  //     const { ethereum } = window;
  //     // console.log(ethereum);
  //     if (!ethereum) return;
  //     const accounts: string[] = await ethereum.request({
  //       method: "eth_accounts",
  //     });
  //     // console.log("accounts: ", accounts);
  //     if (accounts.length > 0) {
  //       setState({ ...state, accounts, modalStage: stageType.STAGE_ONE });
  //     } else {
  //       // setState({ ...state, accounts, modalStage: stageType.STAGE_FIRST_ERROR })
  //     }
  //   } catch (error) {
  //     // console.log("error: ", error);
  //   }
  // };

  // const checkMetamaskHasChanged = () => {
  //   window.ethereum.on("accountsChanged", (accounts: string[]) => {
  //     if (!sameMembers<string>(accounts, store.accounts)) {
  //       setState({ ...state, accounts, modalStage: stageType.STAGE_ONE });
  //     } else {
  //       clearAddress();
  //     }
  //   });
  // };

  // const clearAddress = () => {
  //   resetAccounts();
  //   toast.warning("Your Wallet has been disconnected");
  // };
  // console.log(store);
  // const setModal = () =>
  //   setState({ ...state, modalStage: stageType.STAGE_HIDE });
  // const setActiveAddress = () => {
  //   if (state.currentAddress == "") {
  //     toast.warn("pleasee select a address");
  //     return;
  //   }
  //   setWallets(state.currentAddress, state.accounts);
  // };
  return (
    <>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/buycoffee/:address" element={<BuyCoffee />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Router>
    </>
  );
};

export default AppRoute;

const NotFound = () => {
  return (
    <div className="h-screen flex justify-center items-center text-9xl bg-C4">
      Not Found
    </div>
  );
};
