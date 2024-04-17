import { Link } from "react-router-dom";
import { ReactComponent as BMC } from "../assets/icons/bmc-icon.svg";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { bigIntToInt, rString } from "../helpers";
import { ReactComponent as ProfileSvg } from "../assets/icons/profile.svg";
import { useSDK } from "@metamask/sdk-react";
import { Id, toast, TypeOptions } from "react-toastify";
import { useStore } from "../hooks";
import { useRef } from "react";
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy } from 'react-scroll';

export const Navbar = () => {
  const { store } = useStore();
  const { contract } = store;

  const { accounts } = store;

  const { sdk, connected, account } = useSDK();

  const connect = async () => {
    console.log("connect request");

    try {
      const accounts = await sdk?.connect();
      console.log(accounts);

      // initAccounts(accounts?.[0], accounts);
    } catch (err) {
      if (-32002) {
        toast.error("Connect Request is already pending");
      }
      console.warn("failed to connect..", err);
    }
  };
  const toastId = useRef<any>();

  const notify = () => {};

  const update = () =>
    toast.update(toastId.current, { type: "info", autoClose: 5000 });

  const goToProfile = async () => {
    if (!contract) return;

    try {
      toastId.current = toast.info("Please wait...", { autoClose: false });
      await contract.getBalance();
    } catch (error: any) {
      if (error.data && contract) {
        const decodedError = contract.interface.parseError(error.data);

        if ("BuyMeACoffe__NotSignedUpBefore" == decodedError?.name) {
          toast.update(toastId.current, {
            type: "error",
            render: "you must sign up before",
            autoClose: 5000,
          });
        }
      } else {
        console.log(`Error in widthrawContract:`, error);
      }
    }
    // toast.update(toastId, {
    //   render: "New Content",
    //   type: toast.TYPE.INFO,
    //   //Here the magic
    //   transition: Rotate
    // })
  };
  const activeAccount = account ? account : "";
  return (
    <>
      <div className="xs:px-0 w-full z-10 absolute pt-5">
        <div className="flex justify-between items-center bg-white mx-auto py-4 px-8 rounded-full shadow-md xl_w-[1128px] lg:w-11/12 xs:px-16 xs:w-full x-xss:px-8 xs:shadow-none">
          <div className="flex items-center gap-x-8">
            <Link to="/">
              <BMC />
            </Link>
          </div>
          <button onClick={notify}>Notify</button>
          <button onClick={update}>Update</button>
          <div className="flex">
            {!connected ? (
              <button onClick={connect} className="btn btn-info">
                Connect
              </button>
            ) : (
              <>
                <div className="dropdown dropdown-bottom dropdown-end">
                  <button
                    tabIndex={0}
                    className={`btn rounded-full transition-all delay-200 btn-active w-52 justify-between`}
                  >
                    <MetaMaskAvatar address={activeAccount} size={30} />
                    <div
                      className={`inline text-xs transition-all delay-200 overflow-hidden w-[132px]`}
                    >
                      {rString(activeAccount, 8)}
                    </div>
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content w-full z-[1] menu p-2 shadow bg-base-100 rounded-box"
                  >
                    <li onClick={goToProfile}>
                      <button className="">
                        <ProfileSvg />
                        <span className="text-sm text-black dark:text-white font-semibold">
                          Profile
                        </span>
                      </button>
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
