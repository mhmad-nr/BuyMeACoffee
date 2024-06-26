import React, { useEffect, useRef, useState } from "react";
import { Memo, MemoSkeleton } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../hooks";
import { ethers } from "ethers";
import { useQuery } from "@apollo/client";
import { GET_MEMO } from "../graphql";
import { ContractError, memo } from "../types/schema.type";
import { toast } from "react-toastify";
import { roundDecimal } from "../helpers";

type State = {
  loading: boolean;
  isAddress: boolean;
  value: number;
  ethPrice: number;
  name: string;
  text: string;
};
const initState = {
  isAddress: false,
  loading: false,
  value: 1,
  ethPrice: 1,
  name: "",
  text: "",
};
const BuyCoffee = () => {
  const { store } = useStore();
  const { contract, account } = store;
  const [state, setState] = useState<State>(initState);
  const navigate = useNavigate();

  const { address } = useParams();
  const { data, loading } = useQuery<{ memos: memo[] }>(
    GET_MEMO({ to: true }),
    {
      variables: { to: address },
    }
  );

  useEffect(() => {
    get();
  }, [contract]);
  const get = async () => {
    if (!contract)
      return toast.error("please first connect to your wallet", {
        autoClose: 2000,
      });

    if (!state.isAddress) {
      try {
        toastId.current = toast.info("Please wait...");

        const res = await contract.getUser(address);
        if (res == ethers.ZeroAddress) {
          toast.update(toastId.current, {
            type: "error",

            render: (
              <span className="text-xs">
                {address} <br /> is not Signed up yet
              </span>
            ),
            autoClose: 4000,
          });
          navigate("/");
          return;
        }

        toast.update(toastId.current, {
          autoClose: 500,
        });
        setState({ ...state, isAddress: true });
      } catch (error) {
        console.log(error);
      }
    }

    const res = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    );
    const ethPrice = (await res.json()).USD;

    setState({ ...state, ethPrice });
  };

  const setInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setState({ ...state, name: value });
  };
  const toastId = useRef<any>();

  const setTextarea = (e: any) => {
    const { value } = e.currentTarget;
    setState({ ...state, text: value });
  };
  const onBuy = async () => {
    if (!contract) return toast.error("please first connect to your wallet");

    if (state.name == "")
      return toast.error("Please enter a name", {
        autoClose: 2000,
      });

    if (address == account)
      return toast.error("You cannot send memo to yourself", {
        autoClose: 2000,
      });

    const value = ethers.parseEther(
      ethAmount(state.value).toFixed(6).toString()
    );

    try {
      setState({ ...state, loading: true });
      toastId.current = toast.info("Waiting for metamask...");

      const txR = await contract.buyACoffee(state.name, state.text, address, {
        value,
      });

      toast.update(toastId.current, {
        render: "Wiating for transaction to be mined",
      });

      await txR.wait(1);
      toast.update(toastId.current, {
        type: "success",
        render: "🥳 It Done",
        autoClose: 2000,
      });
      setState({ ...initState });
    } catch (error: any) {
      if (error.data) {
        const decodedError = contract.interface.parseError(error.data);

        if (ContractError.SignedUpBefore == decodedError?.name) {
          toast.update(toastId.current, {
            type: "info",
            render: "you have signed up already",
            autoClose: 2000,
          });
        }
        if (ContractError.SenderShouldBeAnotherAddress == decodedError?.name) {
          toast.update(toastId.current, {
            type: "error",
            render: "You cannot send memo to yourself",
            autoClose: 2000,
          });
        }
      } else {
        toast.update(toastId.current, {
          type: "error",
          render: "Something went wrong please try again",
          autoClose: 2000,
        });
        console.error(`Error in widthrawContract:`, error);
      }
    } finally {
      setState({ ...state, loading: false });
    }
  };
  const ethAmount = (value: number) => {
    return roundDecimal(value / state.ethPrice);
  };
  return (
    <div className="bg-white min-h-screen">
      <div className="w-full flex flex-col items-center gap-y-4"></div>
      <div className="w-full flex mt-12">
        <div className="mx-auto w-[1128px]  flex gap-x-6">
          <div className="flex-1  border border-mid-gray shadow-xl p-8 rounded-xl">
            <h2 className="text-lgfont-semibold text-center bg-gradient-to-r from-red to-blue bg-clip-text text-transparent  text-gray font-semibold">
              Memos given to{" "}
              <span className="font-semibold text-center bg-gradient-to-r from-red to-blue bg-clip-text text-transparent ">
                {address}
              </span>
            </h2>
            <div className="w-full bg-mid-gray bg-opacity-30 pt-0.5 mt-4"></div>
            <div className="mt-4">
              {loading ? (
                <div className="grid gap-y-2">
                  <MemoSkeleton bubbleMode="start" />
                  <MemoSkeleton bubbleMode="start" />
                  <MemoSkeleton bubbleMode="start" />
                </div>
              ) : data?.memos.length == 0 ? (
                <div className="w-full grid place-items-center">
                  <p className="text-2xl">Still Nothing 😢</p>
                  <p className="text-base mt-4">Be First 🤔</p>
                </div>
              ) : (
                data?.memos.map((memo, i) => {
                  return (
                    <Memo
                      address={memo.from}
                      key={memo.name + i}
                      mode="start"
                      {...memo}
                    />
                  );
                })
              )}
            </div>
          </div>
          <div className="w-96 h-fit flex flex-col gap-y-4 border border-mid-gray shadow-xl p-8 pt-6 rounded-xl">
            <h2 className="text-C4c text-2xl font-semibold"></h2>

            <div className="w-full relative overflow-hidden flex justify-between items-center gap-x-2 rounded-md border border-blue border-opacity-40 bg-C5f p-4">
              {state.loading && (
                <div className="w-full h-full bg-black bg-opacity-20 absolute top-0 left-0"></div>
              )}
              <div className="flex items-center gap-x-2">
                <div className="text-[40px]">☕</div>
                <div className="text-xl text-C4c">X</div>
              </div>
              <div className="flex gap-x-2">
                <button
                  value={1}
                  onClick={() => setState({ ...state, value: 1 })}
                  className={`w-10 h-10 font-semibold text-lg text-blue flex justify-center items-center border border-blue border-opacity-40 rounded-full ${
                    state.value == 1 ? "bg-blue text-white" : "bg-white"
                  }`}
                >
                  1
                </button>
                <button
                  value={3}
                  onClick={() => setState({ ...state, value: 3 })}
                  className={`w-10 h-10 font-semibold text-lg text-blue flex justify-center items-center border border-blue border-opacity-40 rounded-full ${
                    state.value == 3 ? "bg-blue text-white" : "bg-white"
                  }`}
                >
                  3
                </button>
                <button
                  value={5}
                  onClick={() => setState({ ...state, value: 5 })}
                  className={`w-10 h-10 font-semibold text-lg text-blue flex justify-center items-center border border-blue border-opacity-40 rounded-full ${
                    state.value == 5 ? "bg-blue text-white" : "bg-white"
                  }`}
                >
                  5
                </button>
                <button
                  value={10}
                  onClick={() => setState({ ...state, value: 10 })}
                  className={`w-10 h-10 font-semibold text-lg text-blue flex justify-center items-center border border-blue border-opacity-40 rounded-full ${
                    state.value == 10 ? "bg-blue text-white" : "bg-white"
                  }`}
                >
                  10
                </button>
              </div>
            </div>
            <label className="block">
              <input
                value={state.name}
                onChange={setInput}
                placeholder="Name of @yoursocial"
                disabled={state.loading}
                className="mt-1 block w-full p-3 text-lg bg-mid-gray bg-opacity-30  border-2 border-mid-gray border-opacity-30 rounded-lg text-sm shadow-sm placeholder-gray
                focus_outline-none focus_border-blue focus:ring-1 focus_ring-blue focus_bg-white"
              />
            </label>
            <label className="block">
              <textarea
                value={state.text}
                onChange={setTextarea}
                className=" mt-1 block w-full px-3 py-2 bg-mid-gray bg-opacity-30  border-2 border-mid-gray border-opacity-30 rounded-lg text-sm shadow-sm placeholder-gray
              focus_outline-none focus_border-blue focus:ring-1 focus_ring-blue focus_bg-white"
                placeholder="Say something nice"
              ></textarea>
            </label>
            <button onClick={onBuy} className="btn btn-outline btn-info">
              Support ${ethAmount(state.value)} ETH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCoffee;
