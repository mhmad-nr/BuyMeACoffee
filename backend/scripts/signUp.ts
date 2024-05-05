import { ethers, network } from "hardhat";
import { address, abi } from "../deployments/sepolia/BuyMeACoffee.json";
import { developmentChains } from "../helper-hardhat-config";
import { BuyMeACoffee__factory } from "../typechain-types";
const PRICE = ethers.parseEther("0.0000015");

async function boughtNFT() {
  let MarketplaceAddress = address;

  console.log(network.name);

  if (developmentChains.includes(network.name)) {
    MarketplaceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  }

  const buyMeACoffee = await ethers.getContractAt(abi, address);

  try {
    console.log("Signing up...");

    const tx = await buyMeACoffee.singUp();
    console.log("Waiting to be mined...");

    await tx.wait(1);

    console.log("Successfully signed up...");
  } catch (error) {
    console.log(error);
  }
}

boughtNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
