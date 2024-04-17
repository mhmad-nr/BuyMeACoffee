import React, { useEffect, useState } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
type props = {
  address: string;
  size: number;
};
export const Avatar = ({ address, size }: props) => {
  const [show, setShow] = useState(false);
  //   useEffect(() => {
  //     document.addEventListener("onmousemove", handleClick);
  //     return () => {
  //       document.removeEventListener("onmousemove", handleClick);
  //     };
  //   }, []);

  //   const handleClick = () => {
  //     console.log("Clicked!");
  //   };

  return (
    <>
      <div
        onMouseEnter={() => {
          setShow(true);
        }}
        onMouseLeave={() => {
          setShow(false);
        }}
        className="relative"
      >
        {show && (
          <div className="absolute top-0 bg-white p-1 rounded-xl bg-opacity-80 text-black -left-1/2 text-xs">{address}</div>
        )}
        <MetaMaskAvatar address={address} size={size} />
      </div>
    </>
  );
};
