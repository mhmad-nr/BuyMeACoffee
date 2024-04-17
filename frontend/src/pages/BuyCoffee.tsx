import React, { useEffect, useState } from "react";
import { Button, Memo } from "../components";
import { useParams } from "react-router-dom";
import { useStore } from "../hooks";
import { contractProvider } from "../helpers";
import { ethers } from "ethers";
import { useQuery } from "@apollo/client";
import { GET_MEMO_BY_FROM } from "../graphql";
import { memo } from "../types/schema.type";
type State = {
  contract: ethers.Contract | null;
  value: number;
  ethPrice: number;
  name: string;
  text: string;
};
const BuyCoffee = () => {
  const { store } = useStore();

  const [state, setState] = useState<State>({
    contract: null,
    value: 1,
    ethPrice: 0,
    name: "",
    text: "",
  });

  const { address } = useParams();
  const { data, loading } = useQuery<{ memos: memo[] }>(GET_MEMO_BY_FROM, {
    variables: { address },
  });
  console.log(data);

  useEffect(() => {
    get();
  }, []);
  const get = async () => {
    if (!address) return;
    const { contract } = await contractProvider({
      signerAddress: store.activeAccount,
    });

    const res = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    );
    const ethPrice = (await res.json()).USD;
    console.log(ethPrice);

    setState({ ...state, ethPrice, contract });
  };

  const setValue = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const newValue = parseInt(value);
    if (newValue <= 9) {
      setState({ ...state, value: newValue });
    }
  };
  const setInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setState({ ...state, name: value });
  };

  const setTextarea = (e: any) => {
    const { value } = e.currentTarget;
    setState({ ...state, text: value });
  };
  const onBuy = async () => {
    const value = ethers.parseEther(
      ethAmount(state.value).toFixed(6).toString()
    );
    console.log(value);

    if (!state.contract) return;

    const res = await state.contract.buyACoffee(
      state.name,
      state.text,
      address,
      {
        value,
      }
    );
    // const r = await listenForTransactionMine(res, provider);
  };
  const ethAmount = (value: number) => {
    return value / state.ethPrice;
  };
  return (
    <div className="bg-white min-h-screen">
      <div className="w-full flex flex-col items-center gap-y-4"></div>
      <div className="w-full flex mt-12">
        <div className="mx-auto w-[1128px]  flex gap-x-6">
          <div className="flex-2">
            <div className=" border border-Cf4 p-8 rounded-xl ">
              <p className="text-justify text-C4c text-sm">
                your last memos to this address
              </p>
              <div>
                {data?.memos.map((memo) => {
                  return (
                    <>
                      <Memo mode="start" {...memo} />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-y-4 border border-Cf4 p-8 rounded-xl">
            <h2 className="text-C4c text-2xl font-semibold"></h2>
            <input
              value={state.name}
              onChange={setInput}
              className="w-full  outline-none p-2  font-light border border-C4 rounded-md resize-none"
              placeholder="Your name"
            />
            <div className="w-full flex justify-between items-center gap-x-2 rounded-md border border-Blue border-opacity-40 bg-C5f p-4">
              <div className="flex items-center gap-x-2">
                <div className="text-[40px]">☕</div>
                <div className="text-xl text-C4c">X</div>
              </div>
              <div className="flex gap-x-2">
                <button
                  value={1}
                  onClick={() => setState({ ...state, value: 1 })}
                  className={`w-10 h-10 font-semibold text-lg text-Blue flex justify-center items-center border border-Blue border-opacity-40 rounded-full ${
                    state.value == 1 ? "bg-Blue text-white" : "bg-white"
                  }`}
                >
                  1
                </button>
                <button
                  value={3}
                  onClick={() => setState({ ...state, value: 3 })}
                  className={`w-10 h-10 font-semibold text-lg text-Blue flex justify-center items-center border border-Blue border-opacity-40 rounded-full ${
                    state.value == 3 ? "bg-Blue text-white" : "bg-white"
                  }`}
                >
                  3
                </button>
                <button
                  value={5}
                  onClick={() => setState({ ...state, value: 5 })}
                  className={`w-10 h-10 font-semibold text-lg text-Blue flex justify-center items-center border border-Blue border-opacity-40 rounded-full ${
                    state.value == 5 ? "bg-Blue text-white" : "bg-white"
                  }`}
                >
                  5
                </button>
                <input
                  value={state.value}
                  onChange={setValue}
                  className="bg-white outline-none w-10 h-10 font-normal text-lg text-C4c text-center border border-C4 rounded-md"
                  type="text"
                />
              </div>
            </div>
            <textarea
              value={state.text}
              onChange={setTextarea}
              className="w-full  outline-none p-2 bg-Cf4 font-light border border-C4 rounded-md resize-none"
              placeholder="Say something nice.. (optional)"
            ></textarea>
            <Button
              disable={false}
              type="colored"
              buttonStyle="full"
              buttonText="white"
              color="bg-Blue"
              text={`Support ${ethAmount(state.value)} ETH`}
              onClick={onBuy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCoffee;

// {
//   "code": -32000,
//   "message": "failed with 500000000 gas: insufficient funds for gas * price + value: address 0x6bEDAb3A759245A16ABeb16e2142629828C8c782 have 229297415862466858 want 5000000000000000000"
// }
