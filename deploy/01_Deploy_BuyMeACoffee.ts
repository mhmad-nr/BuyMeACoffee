import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import fs from "fs"
import { VERIFICATION_BLOCK_CONFIRMATIONS, developmentChains } from "../helper-hardhat-config"


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();


  log("----------------------------------------------------------------")

  const waitConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS
  const args: any[] = []

  const buyMeACoffee = await deploy('BuyMeACoffee', {
    from: deployer,
    log: true,
    args,
    waitConfirmations,
  });

  log("----------------------------------------------------------------")

  // create a json file containing the address for BuyMeACoffee 
  const buyMeACoffeeAddress = buyMeACoffee.address
  fs.writeFileSync('./src/utils/contracts/buyMeACoffee.sol/buyMeACoffeeAddress.json', JSON.stringify(buyMeACoffeeAddress))

};
func.tags = ["all", 'BuyMeACoffee'];
export default func;