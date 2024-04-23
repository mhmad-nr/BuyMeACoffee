import { memo } from "../types/schema.type";
import { convertETH, getTime } from "../helpers";
import { MetaMaskAvatar } from "react-metamask-avatar";

type Props = {
  mode: "end" | "start";
} & memo;

export const Memo = ({
  name,
  timestamp,
  message,
  amount,
  from,
  mode,
}: Props) => {
  return (
    <div className="w-full flex items-center gap-x-2">
      {mode === "start" && <MetaMaskAvatar address={from} size={40} />}
      <div className="grid gap-1">
        <p className="text-xs font-light">
          Supported: {convertETH(amount)} ETH
        </p>
        <div className="p-2 bg-mid-gray bg-opacity-40 rounded-md">
          <p className="text-sm text-gray">{message}</p>
        </div>
        <time className="text-xs opacity-50">{getTime(timestamp)}</time>
      </div>
      {mode === "end" && <MetaMaskAvatar address={from} size={40} />}
    </div>
  );
};
