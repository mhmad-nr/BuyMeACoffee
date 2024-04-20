import { ethers } from "ethers";
import { abi, address } from "../utils/contracts";

export const isValidAddress = (address: string): boolean => {
  const isAddress = ethers.isAddress(address);
  if (!isAddress) return false;
  const isZero = ethers.ZeroAddress == address;
  if (isZero) return false;
  return true;
};

export const contractProvider = async (account: string) => {
  const { ethereum } = window;
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner(account);
  const contract = new ethers.Contract(address, abi, signer);
  return { signer, contract, provider };
};
export const convertETH = (value: string) => {
  return ethers.formatEther(ethers.parseUnits(value, "wei"));
};

export const listenForEmitEvent = async (
  contract: ethers.Contract,
  eventName: string
): Promise<any> => {
  return new Promise<any>((resolve) => {
    contract.on(eventName, resolve);
  });
};
