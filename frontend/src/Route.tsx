import { useEffect, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";
import { useAction, useStore } from "./hooks";
import { contractProvider } from "./helpers";

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

  const init = async () => {
    if (!account) return;

    const { contract } = await contractProvider(account);
    setContract(contract);
  };

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
