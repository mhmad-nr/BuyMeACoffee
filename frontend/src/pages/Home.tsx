import { useRef, useState } from "react";
import landingImage from "../assets/images/landing-image.png";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useNavigate, Link } from "react-router-dom";
import { isValidAddress } from "../helpers";
import { useAction, useStore } from "../hooks";
import { ContractError, memo, singup } from "../types";
import Signup from "../assets/images/signup.jpg";
import { useQuery } from "@apollo/client";
import { Avatar, Memo, MemoSkeleton } from "../components";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ReactComponent as ArrowRight } from "../assets/icons/arrow.svg";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { GET_SING_UP, GET_MEMO_LAST } from "../graphql";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { store } = useStore();

  const navigate = useNavigate();
  const { contract, isSingedUp, account } = store;
  const [state, setState] = useState({
    searchDisabled: false,
    searchText: "",
  });
  const { setSingedUp } = useAction();

  const { data, loading } = useQuery<{
    memos: memo[];
  }>(GET_MEMO_LAST, {
    variables: {
      first: 5,
    },
  });
  const { data: signUpData, loading: signUpLoading } = useQuery<{
    singUps: singup[];
  }>(GET_SING_UP);

  console.log(signUpData);

  const trigger = useRef<HTMLDivElement>(null);
  const pices = useRef<HTMLDivElement[]>([]);

  const toastId = useRef<any>();
  const isSearchAddressValid = isValidAddress(state.searchText);
  useGSAP(
    (context, contextSafe) => {
      // <-- there it is
      // ---------------------------------------------------------------------

      let tl_pices = gsap.timeline({
        scrollTrigger: {
          trigger: trigger.current,
          start: "top 60%",
          end: "bottom 40%",
          markers: false,
          scrub: false,
        },
      });
      pices.current.map((pice) => {
        tl_pices.from(pice, {
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.4)",
          transform: "translate3d(0, 3vw, 0)",
        });
      });
      return () => {
        // <-- cleanup (remove listeners here)
      };
    },
    { dependencies: [data] }
  );
  const searchAddress = async () => {
    if (!isSearchAddressValid) {
      return toast.error("Please enter an valid address", {
        autoClose: 3000,
      });
    }

    if (state.searchText == account) {
      return toast.error("Search address should not be your address", {
        autoClose: 3000,
      });
    }

    if (!contract) return toast.error("please first connect to your wallet");

    try {
      toastId.current = toast.info("Please wait...", { autoClose: false });

      const res = await contract.getUser(state.searchText);
      if (res == ethers.ZeroAddress) {
        toast.update(toastId.current, {
          type: "error",

          render: (
            <span className="text-xs">
              {state.searchText} <br /> is not Signed up yet
            </span>
          ),
          autoClose: 2000,
        });
        return;
      }
      toast.update(toastId.current, {
        type: "success",

        render: (
          <span className="text-xs">
            🥳{state.searchText} <br /> found
          </span>
        ),
        autoClose: 2000,
      });
      navigate("buycoffee/" + state.searchText);
    } catch (error) {
      console.log(error);
    } finally {
      setState({ ...state, searchText: "" });
    }
  };

  const singup = async () => {
    if (!contract) return;

    try {
      toastId.current = toast.info("Please wait...", { autoClose: false });
      const tx = await contract.singUp();
      toast.update(toastId.current, {
        render: "Wiating for transaction to be mined",
      });
      await tx.wait(1);

      setSingedUp(true);

      toast.update(toastId.current, {
        type: "info",
        render: "You have signed up successfully 🥳",
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
          setSingedUp(true);
        }
      } else {
        if (error.code == 4001) {
          toast.update(toastId.current, {
            type: "error",
            render: <span className="text-xs">{error.message}</span>,
            autoClose: 2000,
          });
        }
        console.log(`Error in widthrawContract:`, error.code);
      }
    } finally {
    }
  };

  return (
    <>
      <div
        onClick={() => {
          console.log(pices);
        }}
        className="w-full h-[calc(100vh-91px)] overflow-x-hidden relative  flex justify-center items-center"
      >
        <div className="absolute top-0 left-0 z-0"></div>
        <div className="relative z-50 w-[600px]">
          <h2 className="text-2xl font-bold text-yellow text-center text-C22">
            Buy Me A Coffee
          </h2>
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
              value={state.searchText}
              onKeyDown={(e) => e.key == "Enter" && searchAddress()}
              onChange={(e) =>
                setState({ ...state, searchText: e.target.value })
              }
              className="py-2 rounded-2xl px-4 outline-none text-lg flex-1"
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
      <div className="w-full relative z-50 md_flex-col justify-evenly">
        <div className="w-[1000px] mx-auto flex items-center h-screen md_flex-col md_items-center">
          <div className="w-1/2">
            <h2 className="w-[350px] text-3xl font-bold">
              Join & Receive Support Today!
            </h2>
            <p className="w-[450px] mt-6 text-justify  font-semibold">
              Sign up for free and pay only the gas fee for your first
              transaction. Start receiving support from our community of
              contributors—whether you're a creator, artist, or entrepreneur,
              we're here to back you up!
            </p>
            <div className="mt-4">
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
          </div>
          <img src={Signup} className="w-96 rounded-lg" alt="" />
        </div>
      </div>
      <div ref={trigger} className="w-full ">
        <h2 className="text-3xl font-semibold text-center">
          The latest support
        </h2>
        <div className="w-full flex flex-col items-center gap-y-4 mt-8">
          {data?.memos.length == 0 && (
            <>
              <div className="flex items-center">
                <MemoSkeleton bubbleMode="start" />
                <ArrowRight />
                <span className="ml-4">
                  <div className="skeleton w-[40px] h-[40px] rounded-full"></div>
                </span>
              </div>
              <div className="flex items-center">
                <MemoSkeleton bubbleMode="start" />
                <ArrowRight />
                <span className="ml-4">
                  <div className="skeleton w-[40px] h-[40px] rounded-full"></div>
                </span>
              </div>
              <div className="flex items-center">
                <MemoSkeleton bubbleMode="start" />
                <ArrowRight />
                <span className="ml-4">
                  <div className="skeleton w-[40px] h-[40px] rounded-full"></div>
                </span>
              </div>
              <div className="flex items-center">
                <MemoSkeleton bubbleMode="start" />
                <ArrowRight />
                <span className="ml-4">
                  <div className="skeleton w-[40px] h-[40px] rounded-full"></div>
                </span>
              </div>
              <div className="flex items-center">
                <MemoSkeleton bubbleMode="start" />
                <ArrowRight />
                <span className="ml-4">
                  <div className="skeleton w-[40px] h-[40px] rounded-full"></div>
                </span>
              </div>
            </>
          )}
          {data?.memos.map((memo, i) => {
            return (
              <div
                key={memo.id}
                ref={(el) => el && (pices.current[i] = el)}
                className="flex items-center"
              >
                <Memo key={memo.id} mode="start" {...memo} />
                <ArrowRight />
                <span
                  onClick={() =>
                    memo.to != account && navigate("buycoffee/" + memo.to)
                  }
                  className={`ml-4 ${
                    memo.to != account ? "cursor-pointer" : ""
                  }`}
                >
                  <Avatar address={memo.to} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full relative z-50 bg-CfC6 py-14">
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
