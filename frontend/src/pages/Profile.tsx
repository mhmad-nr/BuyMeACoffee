import { useEffect, useRef, useState } from "react";
import { useAction, useStore } from "../hooks";
import { useQuery } from "@apollo/client";
import { ContractError, memo } from "../types/schema.type";
import { bigIntToInt, convertETH, rString } from "../helpers";
import { GET_MEMO } from "../graphql";
import { toast } from "react-toastify";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { Memo } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

type StateType = {
  currentTab: Tabs;
  balance: number;
  loading: boolean;
};

enum Tabs {
  GIVEN = "GIVEN",
  RECIVED = "RECIVED",
}

const Profile = () => {
  const { store } = useStore();
  const { setSingedUp } = useAction();
  const { contract, account, isSingedUp } = store;

  const [state, setState] = useState<StateType>({
    currentTab: Tabs.RECIVED,
    balance: 0,
    loading: true,
  });

  const {
    data: toMemos,
    loading: toMemosLoading,
    error: toMemosError,
  } = useQuery<{
    memos: memo[];
  }>(GET_MEMO({ to: true }), {
    variables: { to: account },
  });

  const {
    data: fromMemos,
    loading: fromMemosLoading,
    error: fromMemosError,
  } = useQuery<{
    memos: memo[];
  }>(GET_MEMO({ from: true }), {
    variables: { from: account },
  });

  useEffect(() => {
    getData();
  }, [account, contract]);

  const getData = async () => {
    if (!contract) return;
    setState({ ...state, loading: true });
    console.log(isSingedUp);

    try {
      if (isSingedUp) {
        const resBalance = await contract.getBalance();
        const balance = bigIntToInt(resBalance);

        setState({ ...state, balance, loading: false });
      } else {
        const address = await contract.getUser(account);
        if (address != ethers.ZeroAddress) return setSingedUp(true);
        setState({ ...state, loading: false });
      }
    } catch (error: any) {
      if (error.data) {
        const decodedError = contract.interface.parseError(error.data);
        if (ContractError.NotSignedUpBefore == decodedError?.name) {
          toast("Your Balance in contract is zero!");
        }
      } else {
        console.error(error);
      }
    }
  };
  const toastId = useRef<any>();

  const withdraw = async () => {
    if (contract && state.balance > 0) {
      try {
        toastId.current = toast.loading("Waiting for Metamask...", {
          autoClose: false,
        });

        const txR = await contract.withdraw();

        toast.update(toastId.current, {
          render: "Wiating for transaction to be mined",
        });
        await txR.wait(1);
        toast.update(toastId.current, {
          type: "success",
          render: "🥳 It Done",
          autoClose: 2000,
        });
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
        } else {
          console.log(`Error in widthrawContract:`, error);
        }
      }
    }
  };
  const navigate = useNavigate();

  const singup = async () => {
    if (!contract) return;

    try {
      toastId.current = toast.info("Please wait...", { autoClose: false });
      const tx = await contract.singUp();
      await tx.wait();
      setSingedUp(true);

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
          setSingedUp(true);
        }
      } else {
        toast.update(toastId.current, {
          type: "error",
          render: "Something went wrong",
          autoClose: 3000,
        });
        console.log(`Error in widthrawContract:`, error);
      }
    }
  };

  const canWithdraw = state.balance <= 0 || state.loading;
  return (
    <div className="bg-white min-h-screen">
      <div className="flex w-full px-10 xl_px-5 sm_px-0 pt-10 lg_flex-col gap-y-4">
        <div className="flex-1">
          <div className="w-full flex justify-between items-center gap-x-6 bg-base-300 rounded-xl p-6 sm_flex-col sm_gap-2">
            <div className="flex gap-x-8 items-center md_flex-col md_gap-2">
              <MetaMaskAvatar address={account} size={80} />
              <div>
                <div className="flex items-center gap-x-4">
                  {!state.loading && !isSingedUp ? (
                    <h2>
                      Lets <span className="font-semibold ">Sign up</span> Now
                    </h2>
                  ) : (
                    <>
                      <p className="text-lg font-semibold">Balance:</p>
                      {state.loading ? (
                        <div className="skeleton bg-black w-[53px] h-[28px]"></div>
                      ) : (
                        <p className="text-xl  font-bold">
                          {convertETH(state.balance.toString())} ETH
                        </p>
                      )}
                    </>
                  )}
                </div>
                {!(!state.loading && !isSingedUp) && (
                  <span className="text-xs font-semibold">
                    {rString(account, 12)}
                  </span>
                )}
              </div>
            </div>
            {!isSingedUp ? (
              <button
                onClick={singup}
                className={`btn btn-wide ${
                  state.loading ? "btn-disabled" : ""
                } btn-info`}
              >
                Sign Up
              </button>
            ) : (
              <button
                disabled={canWithdraw}
                onClick={withdraw}
                className="btn btn-active  btn-accent"
              >
                Withdraw {convertETH(state.balance.toString())} ETH
              </button>
            )}
          </div>
        </div>
        <div className="divider divider-horizontal lg_divider-vertical  "></div>
        <div className="flex-1 p-2 rounded-2xl bg-base-300">
          <h2 className="text-xl font-bold mt-2">Your Memos</h2>
          <div
            role="tablist"
            className=" 
          tabs tabs-lifted  mt-2"
          >
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Received"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div className="grid grid-y-2">
                {toMemosError && (
                  <p className="text-center">Something went wrong</p>
                )}

                {toMemosLoading && !toMemosError ? (
                  <div className="grid gap-y-2">
                    <div className="skeleton w-full h-32"></div>
                    <div className="skeleton w-full h-32"></div>
                    <div className="skeleton w-full h-32"></div>
                  </div>
                ) : toMemos?.memos.length == 0 ? (
                  <div className="w-full flex items-center justify-center">
                    <p className="text-2xl font-bold">Nothing</p>
                    <span className="text-4xl">🥲</span>
                  </div>
                ) : (
                  toMemos?.memos.map((memo) => (
                    <Memo
                      key={memo.id}
                      address={memo.to}
                      mode="start"
                      {...memo}
                    />
                  ))
                )}
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Given"
              readOnly={true}
              checked
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div className="grid grid-y-2">
                {fromMemosError && (
                  <p className="text-center">Something went wrong</p>
                )}
                {fromMemosLoading && !toMemosError ? (
                  <div className="grid gap-y-2">
                    <div className="skeleton w-full h-32"></div>
                    <div className="skeleton w-full h-32"></div>
                    <div className="skeleton w-full h-32"></div>
                  </div>
                ) : fromMemos?.memos.length == 0 ? (
                  <div className="w-full flex items-center justify-center">
                    <p className="text-2xl font-bold">Nothing</p>
                    <span className="text-4xl">🥲</span>
                  </div>
                ) : (
                  fromMemos?.memos.map((memo) => (
                    <Memo
                      key={memo.id}
                      address={memo.to}
                      mode="end"
                      {...memo}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
