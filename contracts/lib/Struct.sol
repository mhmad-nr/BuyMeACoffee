// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library Struct {
    struct Memo {
        address from;
        uint256 timestamp;
        uint256 amount;
        string name;
        string message;
    }
}
