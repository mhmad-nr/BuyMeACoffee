import { useRef, useState } from "react";
import landingImage from "../assets/images/landing-image.png";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useNavigate, Link } from "react-router-dom";
import { isValidAddress } from "../helpers";
import { useAction, useStore } from "../hooks";
import { ContractError } from "../types";

const Home = () => {
  const { store } = useStore();

  const navigate = useNavigate();
  const { contract, isSingedUp, account } = store;
  const [state, setState] = useState({
    searchDisabled: false,
    searchText: "",
  });
  const { setSingedUp } = useAction();

  const toastId = useRef<any>();
  const isSearchAddressValid = isValidAddress(state.searchText);

  const searchAddress = async () => {
    if (!isSearchAddressValid) {
      return toast.error("Please enter an valid address");
    }
    console.log(state.searchText, account);

    if (state.searchText == account) {
      return toast.error("Search address should not be your address");
    }

    if (!contract) return;

    try {
      const res = await contract.getUser(state.searchText);

      if (res == ethers.ZeroAddress) {
        return toast.error(`${state.searchText} is not Signed up yet`);
      }
      navigate("buycoffee/" + state.searchText);
    } catch (error) {
      console.log(error);
    }
  };

  const singup = async () => {
    if (!contract) return;

    try {
      toastId.current = toast.info("Please wait...", { autoClose: false });
      const tx = await contract.singUp();
      await tx.wait();
      setSingedUp();

      toast.update(toastId.current, {
        type: "info",
        render: "You have signed up successfully",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error: any) {
      if (error.data) {
        const decodedError = contract.interface.parseError(error.data);

        if (ContractError.SignedUpBefore == decodedError?.name) {
          toast.update(toastId.current, {
            type: "info",
            render: "you have signed up already",
            autoClose: 2000,
          });
          setTimeout(() => navigate("/profile"), 1000);
          setSingedUp();
        }
      } else {
        console.log(`Error in widthrawContract:`, error);
      }
    }
  };
  return (
    <>
      <div className="w-full h-[calc(100vh-180px)] flex justify-center items-center">
        <div className="w-[600px]">
          <h1 className="text-6xl sm_text-3xl text-center font-medium text-C22 mb-4">
            A supporter is worth a thousand followers.
          </h1>
          <h2 className="text-xl text-center text-C22">
            Accept donations. In a secure way. It’s decentralized and
            anonymously.
          </h2>
          <div
            id="scroll"
            className="w-full p-2 mt-4 flex justify-between bg-white rounded-full border-2 border-Cf4"
          >
            <input
              onChange={(e) =>
                setState({ ...state, searchText: e.target.value })
              }
              className="py-2 px-4 outline-none text-lg flex-1"
              type="text"
              placeholder="Enter Address"
            />
            <button
              onClick={searchAddress}
              disabled={!isSearchAddressValid && !true}
              className="btn btn-active btn-ghost rounded-3xl"
            >
              Search
            </button>
          </div>
          <div className="mt-4">
            <p className="text-base text-center font-normal text-C4c">
              It’s not free, but secure and decentralized.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full border-y-2 h-[50vh] flex items-center md_flex-col justify-evenly">
        <div>
          <h2 className="w-[350px] text-3xl font-bold">
            Join & Receive Support Today!
          </h2>
          <p className="w-[450px] mt-6 text-justify  font-semibold">
            Sign up for free and pay only the gas fee for your first
            transaction. Start receiving support from our community of
            contributors—whether you're a creator, artist, or entrepreneur,
            we're here to back you up!
          </p>
        </div>
        {isSingedUp ? (
          <div className="grid gap-y-4">
            <p className="font-semibold text-center bg-gradient-to-r from-red to-blue bg-clip-text text-transparent ">
              See {"  "}
              <span className="font-bold text-2xl">Receives</span>
            </p>
            <Link
              className="btn btn-wide btn-outline btn-primary"
              to={"profile"}
            >
              Go Profile
            </Link>
          </div>
        ) : (
          <button
            disabled={!true}
            onClick={singup}
            className="btn btn-wide btn-outline btn-primary"
          >
            Sing up
          </button>
        )}
      </div>
      <div className="w-full bg-CfC6 py-14">
        <h2 className="text-base text-center font-semibold text- text-C4 tracking-widest">
          DONATIONS
        </h2>
        <div className="w-full mt-10 flex items-center gap-x-10 md_flex-col px-10 mx-auto">
          <div className="flex-1">
            <div className="max-w-[600px] sm_w-full">
              <h1 className="text-4xl text-left font-bold text-C4c">
                Easy Thanks with Coffee
              </h1>
              <h2 className="mx-auto text-lg text-left font-normal text-C4c mt-6">
                Buy Me a Coffee makes supporting fun and easy. In just a couple
                of taps, your fans can make the payment (buy you a coffee) and
                leave a message. They don’t even have to create an account!
              </h2>
            </div>
          </div>
          <div className=" flex-1 mt-6">
            <img src={landingImage} alt="image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
