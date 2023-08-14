// SPDX-License-Identifier: UNLICENSED
// Pragma
pragma solidity ^0.8.9;

// Import
import {Account} from "./Account.sol";

// Error
error BuyMeACoffe__SignedUpBefore();

/**@title BuyMeACoffee contract
 * @author mohammad norouzi
 * @notice This contract manages the client contract address
 */
contract BuyMeACoffee {
    // State variables
    mapping(address => address) private s_accounts;

    // Funcntions section
    function SingUp() public {
        // check if the account is already signed up
        if (SearchAccount(msg.sender) != address(0))
            revert BuyMeACoffe__SignedUpBefore();

        //create a new account for new client
        Account newAccount = new Account(msg.sender);

        //add new account to other accounts
        s_accounts[msg.sender] = address(newAccount);
    }

    function SearchAccount(address _address) public view returns (address) {
        
        // read accounts address as currentAddress from storage
        address currentAddress = s_accounts[_address];

        // check if the _address is already signed up
        if (currentAddress == address(0)) {
            return address(0);
        }
        return currentAddress;
    }
}
