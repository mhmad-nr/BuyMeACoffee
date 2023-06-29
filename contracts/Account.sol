// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import {Struct} from "./lib/Struct.sol";

/**
 *@title Account structure and actions
 * @author mhmadnr
 */
contract Account {
    error Account__BalanceIsZero();

    address public immutable i_address;
    uint256 public s_balance;
    Struct.Memo[] public s_memos;

    constructor(address _address) {
        i_address = _address;
        s_balance = 0;
    }

    function addNewMemo(
        address _from,
        uint256 _timestamp,
        uint256 _amount,
        string memory _name,
        string memory _message
    ) public {
        Struct.Memo memory newMemo = Struct.Memo(
            _from,
            _timestamp,
            _amount,
            _name,
            _message
        );
        s_memos.push(newMemo);
    }

    // all actions for balance account
    function inBalance(uint256 _amount) public returns (uint256) {
        uint256 newBalance = _amount + s_balance;
        s_balance = newBalance;
        return newBalance;
    }

    function withdraw() public returns (uint256) {
        uint256 currentBalance = s_balance;
        if (currentBalance == 0) revert Account__BalanceIsZero();
        s_balance = 0;
        return currentBalance;
    }
}
