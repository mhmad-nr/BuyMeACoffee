import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useStore } from "../hooks";
import { useQuery } from "@apollo/client";
import { memo } from "../types/schema.type";
import { Avatar } from "../components";
import { bigIntToInt, contractProvider, convertETH } from "../helpers";
import { GET_MEMO_BY_TO } from "../graphql";
import { Memo } from "../components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSDK } from "@metamask/sdk-react";

type StateType = {
  balance: number;
  contract: ethers.Contract | null;
  loading: boolean;
  isSignedIn: boolean;
};

const Profile = () => {
  const { store } = useStore();
  const { contract } = store;
  const { account } = useSDK();

  const [state, setState] = useState<StateType>({
    balance: 0,
    contract: null,
    loading: false,
    isSignedIn: false,
  });

  const { data, loading } = useQuery<{ memos: memo[] }>(GET_MEMO_BY_TO, {
    variables: { address: account },
  });

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    if (!account) return;
    setState({ ...state, loading: true });

    const { contract } = await contractProvider({
      signerAddress: account,
    });
    try {
      const resBalance = await contract.getBalance();
      const balance = bigIntToInt(resBalance);

      setState({ ...state, contract, balance, loading: false });
    } catch (error: any) {
      if (error.data && contract) {
        const decodedError = contract.interface.parseError(error.data);

        if ("BuyMeACoffe__NotSignedUpBefore" == decodedError?.name) {
          toast("you must sign up before");
          setState({ ...state, contract, loading: false, isSignedIn: true });
          // navigate("/");
        }
      } else {
        console.log(`Error in widthrawContract:`, error);
      }
    }
  };

  const withdraw = async () => {
    if (state.contract && state.balance > 0) {
      try {
        const tx = await state.contract.withdraw();
        await tx.wait(1);
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(state);

  const canWithdraw = state.balance <= 0 || state.loading;
  return (
    <div className="bg-white min-h-screen">
      <div className="flex w-full px-10 pt-10">
        <div className="flex-grow">
          <div className="w-full flex justify-between items-center bg-base-300 rounded-xl p-6 ">
            <div className="flex gap-x-8 ">
              <Avatar address={account ? account : ""} size={120} />
              <div className="flex items-center gap-x-4">
                <p className="text-xl">Your Balance:</p>
                {state.loading ? (
                  <div className="skeleton bg-black w-[53px] h-[28px]"></div>
                ) : (
                  <p className="text-xl">
                    {convertETH(state.balance.toString())} ETH
                  </p>
                )}
              </div>
            </div>
            <button
              disabled={canWithdraw}
              onClick={withdraw}
              className="btn btn-active  btn-wide btn-accent"
            >
              Withdraw
            </button>
          </div>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="w-96 grid gap-y-4 rounded-xl bg-base-300 p-2 place-items-center ">
          {loading ? (
            <>
              <div className="skeleton bg-base-200 w-full h-40"></div>
              <div className="skeleton bg-base-200 w-full h-40"></div>
              <div className="skeleton bg-base-200 w-full h-40"></div>
            </>
          ) : data?.memos.length == 0 ? (
            <h2>Your not have somthing</h2>
          ) : (
            data?.memos.map((item) => {
              return (
                <div key={item.timestamp} className="w-full">
                  <Memo mode="end" {...item} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
