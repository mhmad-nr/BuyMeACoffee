// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import {Struct} from "./lib/Struct.sol";

/**
 *@title Account structure and actions
 * @author mhmadnr
 */
contract Account {
    error Account__BalanceIsZero();
    event MemoEvent(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    address public immutable i_address;
    uint256 private s_balance;
    Struct.Memo[] private s_memos;

    constructor(address _address) {
        i_address = _address;
        s_balance = 0;
    }

    function getBalance() public view  returns (uint256) {
        return s_balance;
    }
    function getMemos() public view  returns (Struct.Memo[] memory) {
        return s_memos;
    }

    function buyACoffee(address _sender,uint256 _value, string memory _name, string memory _message)
        public
        payable
    {
        Struct.Memo memory newMemo = Struct.Memo(
            _sender,
            block.timestamp,
            _value,
            _name,
            _message
        );
        s_memos.push(newMemo);

    // all actions for balance account
       uint256 newBalance = _value + s_balance;
        s_balance = newBalance;

        emit MemoEvent(msg.sender, block.timestamp, _name, _message);
    }


    function withdraw() public  returns (uint256) {
        uint256 currentBalance = s_balance;
        if (currentBalance == 0) revert Account__BalanceIsZero();
        s_balance = 0;
        return currentBalance;
    }

    
}
