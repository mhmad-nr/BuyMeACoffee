import { memo } from "../types/schema.type";
import { convertETH, getTime } from "../helpers";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { forwardRef, PropsWithRef } from "react";
import { Avatar } from "./Avatar";
import { ReactComponent as ArrowRight } from "../assets/icons/arrow.svg";
import { useNavigate } from "react-router-dom";
import { useStore } from "../hooks";

type Props = {
  address: string;
  mode: "end" | "start" | "both";
} & memo;

export const Memo = forwardRef<HTMLDivElement, Props>(
  (
    { name, timestamp, message, address, amount, from, to, mode }: Props,
    ref
  ) => {
    const navigate = useNavigate();
    const { store } = useStore();
    const { account } = store;
    return (
      <div ref={ref} className="w-full flex items-center gap-x-2">
        {(mode === "start" || mode === "both") && <Avatar address={address} />}
        <div className="grid gap-1">
          <p className="text-xs font-light">
            <span className="font-bold">@{name}</span> Supported:{" "}
            {convertETH(amount)}
            <span className="text-[10px]"> ETH</span>
          </p>
          {message.length != 0 && (
            <div className="p-2 bg-mid-gray bg-opacity-40 rounded-md">
              <p className="text-sm text-gray">{message}</p>
            </div>
          )}
          <time className="text-xs opacity-50">{getTime(timestamp)}</time>
        </div>
        {(mode === "end" || mode === "both") && (
          <>
            <ArrowRight />
            <span
              onClick={() => to != account && navigate("/buycoffee/" + to)}
              className={`ml-4 ${to != account ? "cursor-pointer" : ""}`}
            >
              <Avatar address={to} />
            </span>
          </>
        )}
      </div>
    );
  }
);
