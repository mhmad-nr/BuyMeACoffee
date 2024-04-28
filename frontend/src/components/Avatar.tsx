import { MetaMaskAvatar } from "react-metamask-avatar";

export const Avatar = ({ address }: { address: string }) => {
  return (
    <div className="relative group">
      <span className="opacity-0 absolute top-1/2 left-1/2 bg-white rounded p-1 border-gray -translate-x-1/2 -translate-y-1/2 text-[10px] transition-all group-hover_opacity-100">{address}</span>
      <MetaMaskAvatar address={address} size={40} />
    </div>
  );
};
