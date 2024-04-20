import { memo } from "../types/schema.type";
import { convertETH, getTime } from "../helpers";
import { MetaMaskAvatar } from "react-metamask-avatar";

type Props = {
  mode: "end" | "start";
} & memo;

export const Memo = ({ message, timestamp, amount, from, mode }: Props) => {
  return (
    <>
      <div className={`chat chat-${mode}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <MetaMaskAvatar address={from} size={40} />
          </div>
        </div>
        <div className="chat-header">
          <time className="text-xs opacity-50">
            {getTime(parseInt(timestamp))}
          </time>
        </div>
        <div className="chat-bubble ">{message}</div>
        <div className="chat-footer opacity-50">
          Send: {convertETH(amount)} ETH
        </div>
      </div>
    </>
  );
};
