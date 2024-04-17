import React from "react";
import { memo } from "../types/schema.type";
import { convertETH, getTime } from "../helpers";
import { Avatar } from "./Avatar";
type Props = {
  mode: "end" | "start";
} & memo;
export const Memo = ({ message, timestamp, amount, from, mode }: Props) => {
  return (
    <>
      <div className={`chat chat-${mode}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Avatar address={from} size={40} />
          </div>
        </div>
        <div className="chat-header">
          <time className="text-xs opacity-50">
            {getTime(parseInt(timestamp))}
          </time>
        </div>
        <div className="chat-bubble ">
          <p>{message}</p>
        </div>
        <div className="chat-footer opacity-50">
          Send: {convertETH(amount)} ETH
        </div>
      </div>
    </>
  );
};
