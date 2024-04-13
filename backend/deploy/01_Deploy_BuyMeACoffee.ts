import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import fs from "fs";
import { verify } from "../utils/verify";
import {
  VERIFICATION_BLOCK_CONFIRMATIONS,
  developmentChains,
} from "../helper-hardhat-config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------------------");

  const waitConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;
  const args: any[] = [];

  const buyMeACoffee = await deploy("BuyMeACoffee", {
    from: deployer,
    log: true,
    args,
    waitConfirmations,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(buyMeACoffee.address, args);
  }

  log("----------------------------------------------------------------");

  // create a json file containing the address and abi for BuyMeACoffee
  const { abi, address } = buyMeACoffee;
  fs.writeFile(
    "./ABIs/buyMeACoffee.json",
    JSON.stringify({ abi, address }),
    () => log("Contract ABI updated successfully")
  );
};
func.tags = ["all", "BuyMeACoffee"];
export default func;
