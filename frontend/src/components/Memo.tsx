import { memo } from "../types/schema.type";
import { convertETH, getTime } from "../helpers";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { forwardRef, PropsWithRef } from "react";
import { Avatar } from "./Avatar";

type Props = {
  mode: "end" | "start";
} & memo;

export const Memo = forwardRef<HTMLDivElement, Props>(
  ({ name, timestamp, message, amount, from, mode }: Props, ref) => {
    return (
      <div ref={ref} className="w-full flex items-center gap-x-2">
        {mode === "start" && <Avatar address={from} />}
        <div className="grid gap-1">
          <p className="text-xs font-light">
            <span className="font-bold">@{name}</span> Supported: {convertETH(amount)}<span className="text-[10px]"> ETH</span>
          </p>
          {message.length != 0 && (
            <div className="p-2 bg-mid-gray bg-opacity-40 rounded-md">
              <p className="text-sm text-gray">{message}</p>
            </div>
          )}
          <time className="text-xs opacity-50">{getTime(timestamp)}</time>
        </div>
        {mode === "end" && <Avatar address={from} />}
      </div>
    );
  }
);
