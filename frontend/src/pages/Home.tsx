import { useState } from "react";
import landingImage from "../assets/images/landing-image.png";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { isValidAddress } from "../helpers";
import { useStore } from "../hooks";
import { useSDK } from "@metamask/sdk-react";

const Home = () => {
  const { store } = useStore();
  const { account, connected } = useSDK();

  const navigate = useNavigate();
  const { contract } = store;
  const [state, setState] = useState({
    searchDisabled: false,
    searchText: "",
  });
  const isSearchAddressValid = isValidAddress(state.searchText);

  const searchAddress = async () => {
    if (!contract) return;
    if (!isSearchAddressValid) {
      return toast.error("Please enter an valid address");
    }
    console.log(state.searchText);

    try {
      const res = await contract.getUser(state.searchText);
      console.log(res);

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
      const tx = await contract.singUp();
      await tx.wait();
      navigate("profile");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="w-full h-[calc(100vh-180px)] flex justify-center items-center">
        <div className="w-[600px]">
          <h1 className="text-6xl text-center font-medium text-C22 mb-4">
            A supporter is worth a thousand followers.
          </h1>
          <h2 className="text-xl text-center text-C22">
            Accept donations. In a secure way. It’s decentralized and
            anonymously.
          </h2>
          <div className="w-full p-2 mt-4 flex justify-between bg-white rounded-full border-2 border-Cf4">
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
              disabled={!isSearchAddressValid && !connected}
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
      <div className="w-full border-y-2 h-[50vh] flex items-center justify-evenly">
        <div className="">
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
        <button
          disabled={!connected}
          onClick={singup}
          className="btn btn-wide btn-outline btn-primary"
        >
          Sing up
        </button>
      </div>
      <div className="w-full bg-CfC6 py-14">
        <h2 className="text-base text-center font-semibold text- text-C4 tracking-widest">
          DONATIONS
        </h2>
        <div className="w-[700px] mx-auto">
          <div className="w-[550px] mx-auto mt-6">
            <h1 className="text-4xl text-center font-bold text-C4c">
              Give your audience an easy way to say thanks.
            </h1>
          </div>
          <h2 className="mx-auto text-lg text-center font-normal text-C4c mt-6">
            Buy Me a Coffee makes supporting fun and easy. In just a couple of
            taps, your fans can make the payment (buy you a coffee) and leave a
            message. They don’t even have to create an account!
          </h2>
          <div className="mt-6">
            <img src={landingImage} alt="image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
