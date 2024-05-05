import { useEffect, lazy, useRef } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";
import { useAction, useStore } from "./hooks";
import { contractProvider } from "./helpers";
import { address } from "./utils/contracts";
import { ReactComponent as GITHUB } from "./assets/icons/github-icon.svg";
import { ScrollTop } from "./components";

const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const BuyCoffee = lazy(() => import("./pages/BuyCoffee"));

const AppRoute = () => {
  const { store } = useStore();
  const { setContract } = useAction();
  const { account } = store;

  useEffect(() => {
    init();
  }, [account]);
  const modal = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    modal.current && modal.current.showModal();
  }, []);

  const init = async () => {
    if (!account) return;

    const { contract } = await contractProvider(account);
    setContract(contract);
  };

  return (
    <>
      <dialog ref={modal} className="modal modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">💢Attention💢</h3>
          <p className="py-4">
            to use this app and interact with sepolia testnet you need to
            install{" "}
            <a
              href="https://metamask.io/"
              target="_blank"
              className="font-semibold text-[#f5841f]"
            >
              Metamast
            </a>{" "}
            if you did not
          </p>
          <p className="text-sm font-semibold">
            See Contract:{" "}
            <a
              className="text-xs text-blue font-light"
              href="https://sepolia.etherscan.io/address/0x0FD0f69bA8B5EaE9F10D63C3b151C5eEcB182523"
              target="_blank"
            >
              {address}
            </a>
          </p>
          <div className="flex gap-x-2 items-center mt-4">
            <span>See it on </span>
            <a href="https://github.com/mhmad-nr/BuyMeACoffee" target="_blank">
              <GITHUB />
            </a>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <Router>
        <MainLayout>
          <Routes>
            <Route
              path="/"
              element={
                <ScrollTop>
                  <Home />
                </ScrollTop>
              }
            />
            <Route
              path="/profile"
              element={
                <ScrollTop>
                  <Profile />
                </ScrollTop>
              }
            />
            <Route
              path="/buycoffee/:address"
              element={
                <ScrollTop>
                  <BuyCoffee />
                </ScrollTop>
              }
            />
            <Route
              path="*"
              element={
                <ScrollTop>
                  <NotFound />
                </ScrollTop>
              }
            />
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
