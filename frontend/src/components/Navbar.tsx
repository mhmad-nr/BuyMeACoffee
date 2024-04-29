import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as BMC } from "../assets/icons/bmc-icon.svg";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { rString } from "../helpers";
import { ReactComponent as ProfileSvg } from "../assets/icons/profile.svg";
import { toast } from "react-toastify";
import { useAction, useStore } from "../hooks";
import { useEffect, useRef } from "react";
import { scroller } from "react-scroll";
import { ReactComponent as DownSvg } from "../assets/icons/down.svg";
import { ContractError } from "../types";

export const Navbar = () => {
  const { store } = useStore();
  const { contract, account, accounts } = store;

  const { initAccounts, changeAccount } = useAction();
  const navigate = useNavigate();

  const setAccount = async (method: string) => {
    const accounts = await window.ethereum.request({
      method,
    });
    initAccounts(accounts);
  };
  useEffect(() => {
    setAccount("eth_accounts");
  }, []);

  const connect = async () => {
    if (window.ethereum) {
      try {
        await setAccount("eth_requestAccounts");
      } catch (error) {
        if (-32002) {
          toast.error("Connect Request is already pending");
        }
        console.warn("failed to connect..", error);
      }
    } else {
    }
  };
  const toastId = useRef<any>();

  // const goToProfile = async () => {
  //   if (!contract) return;

  //   try {
  //     toastId.current = toast.info("Please wait...", { autoClose: false });
  //     await contract.getBalance();
  //     toast.update(toastId.current, {
  //       type: "success",
  //       autoClose: 500,
  //     });
  //     singedUp();
  //     navigate("/profile");
  //   } catch (error: any) {
  //     console.error(error);
  //     if (error.data) {
  //       const decodedError = contract.interface.parseError(error.data);

  //       if (ContractError.NotSignedUpBefore == decodedError?.name) {
  //         toast.update(toastId.current, {
  //           type: "error",
  //           render: "you must sign up before",
  //           autoClose: 5000,
  //         });
  //         scroller.scrollTo("#scroll", {});
  //       }
  //     } else {
  //       console.log(`Error in widthrawContract:`, error);
  //     }
  //   }
  // };

  const onChange = (account: string) => {
    changeAccount(account);
    toast.info("Account changed successfully");
  };
  return (
    <>
      <div className="xs:px-0 w-full z-10 absolute pt-5">
        <div className="flex justify-between items-center bg-white mx-auto py-4 px-8 rounded-full shadow-md max-w-[1023px] lg_max-w-[767px] ">
          <div className="flex items-center gap-x-8">
            <Link to="/">
              <BMC id="icon" />
            </Link>
          </div>
          <div className="flex">
            {!account ? (
              <button onClick={connect} className="btn btn-info">
                Connect
              </button>
            ) : (
              <>
                <div className="dropdown dropdown-bottom dropdown-end">
                  <button
                    tabIndex={0}
                    className={`btn rounded-full transition-all delay-200 btn-active justify-between`}
                  >
                    <MetaMaskAvatar address={account} size={30} />
                    <div
                      className={`inline text-xs transition-all delay-200 overflow-hidden w-[132px]`}
                    >
                      {rString(account, 8)}
                    </div>

                    <DownSvg className="" />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content w-full z-[1] menu p-2 shadow bg-base-100 rounded-box"
                  >
                    {accounts.map((item) => {
                      if (item == account) return;

                      return (
                        <li key={item} onClick={() => onChange(item)}>
                          <span className="text-xs">{rString(item, 12)}</span>
                        </li>
                      );
                    })}

                    <li>
                      <Link to={"profile"} className="">
                        <ProfileSvg />
                        <span className="text-sm text-black dark:text-white font-semibold">
                          Profile
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
