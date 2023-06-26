// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**@title A sample Raffle Contract
 * @author Patrick Collins
 * @notice This contract is for creating a sample raffle contract
 * @dev This implements the Chainlink VRF Version 2
 */

contract BuyMeACoffe {
    // ----------------------------------------------------------------
    error FundMe__NotOwner();

    error FundMe__NotExist(address AccountAddress);

    event MemoEvent(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    struct Account {
        address Address;
        uint256 Balance;
        Memo[] memos;
    }

    address payable private immutable i_owner;
    mapping(address => Account) private s_accounts;

    //     event Withdrawal(uint amount, uint when);

    constructor() {
        i_owner = payable(msg.sender);
    }

    function getOwner() public view onlyOwner returns (address) {
        return i_owner;
    }

    // function isExist() private returns (bool _isExist) {
    //     if (s_accounts[msg.sender]) throw; // duplicate key
    // }

    function SingUp() public {
        Account memory newAccount = Account(msg.sender, 0, new Memo[](0));
        s_accounts[msg.sender].newAccount;
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }
}
