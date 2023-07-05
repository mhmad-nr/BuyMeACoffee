// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import {Account} from "./Account.sol";
import {Struct} from "./lib/Struct.sol";

contract BuyMeACoffe {
    // ----------------------------------------------------------------
    error BuyMeACoffe__NotOwner();
    error BuyMeACoffe__SignedUp();
    error BuyMeACoffe__NotSignedUp();
    error BuyMeACoffe__ValueShouldBeMoreThanZero();

    struct AccountStruct {
        Account account;
        bool isValue;
    }
    address immutable i_owner;
    mapping(address => AccountStruct) private s_accounts;

    constructor() {
        i_owner = msg.sender;
    }

    function SingUp() public {
        if (isExist(msg.sender)) revert BuyMeACoffe__SignedUp();

        Account newAccount = new Account(msg.sender);
        s_accounts[msg.sender] = AccountStruct(newAccount, true);
    }

    function getAddressBalance() public view returns (uint256) {
        if (!isExist(msg.sender)) revert BuyMeACoffe__NotSignedUp();

        return s_accounts[msg.sender].account.getBalance();
    }

    function getAddressMemos() public view returns (Struct.Memo[] memory) {
        if (!isExist(msg.sender)) revert BuyMeACoffe__NotSignedUp();

        return s_accounts[msg.sender].account.getMemos();
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function buyCoffee(
        address _address,
        string memory _name,
        string memory _message
    ) public payable {
        // Must accept more than 0 ETH for a coffee.
        if (msg.value <= 0) revert BuyMeACoffe__ValueShouldBeMoreThanZero();

        if (!isExist(_address)) revert BuyMeACoffe__NotSignedUp();

        s_accounts[_address].account.buyACoffee(
            msg.sender,
            msg.value,
            _name,
            _message
        );
    }

    function withdraw() public {
        if (!isExist(msg.sender)) revert BuyMeACoffe__NotSignedUp();
        uint256 balance = s_accounts[msg.sender].account.withdraw();
        payable(msg.sender).transfer(balance);
    }

    function isExist(address id) private view returns (bool) {
        if (s_accounts[id].isValue) {
            return true;
        }
        return false;
    }
}
