import { ethers, network } from "hardhat";
import { address, abi } from "../deployments/sepolia/BuyMeACoffee.json";
import {
  ContractDeployTransaction,
  ContractTransactionReceipt,
  ContractTransactionResponse,
} from "ethers";
import { developmentChains } from "../helper-hardhat-config";

const PRICE = ethers.parseEther("0.0000015");

async function boughtNFT() {
  let MarketplaceAddress = address;

  if (developmentChains.includes(network.name)) {
    MarketplaceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  }

  const buyMeACoffee = await ethers.getContractAt(abi, address);

  buyMeACoffee.

  await tx.wait(1);

  console.log("NFT has bought...");
}

boughtNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
