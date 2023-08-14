// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.9;

// Errors
error Account__BalanceIsZero();
error Account__OnlyOwner();
error Account__ValueMustBeMoreThanOneGwei();

/**@title Account contract
 * @author mohammad norouzi
 * @notice This contract deploy only by BuyMeACoffee contract
 */
contract Account {
    //Type declaration
    struct Memo {
        address from;
        uint256 timestamp;
        uint256 amount;
        string name;
        string message;
    }

    //State variables
    uint256 private constant MINIMUN_COFFEE_PRICE = 1e9;
    address payable public immutable i_owner;
    Memo[] private s_memos;

    //Events
    event MemoEvent(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Modifiers section
    modifier onlyOwner() {
        // check if msg.sender is owner of contract
        require(msg.sender == i_owner);
        _;
    }

    //Functions section
    constructor(address _address) {
        // assign _address to the owner of the contract
        i_owner = payable(_address);
    }

    function getMemos() public view onlyOwner returns (Memo[] memory) {
        // return all of memos
        return s_memos;
    }

    function buyACoffee(
        string memory _name,
        string memory _message
    ) public payable {
        // check if msg.value is less than MINIMUN_COFFEE_PRICE trow an error
        if (msg.value < MINIMUN_COFFEE_PRICE)
            revert Account__ValueMustBeMoreThanOneGwei();
        // create a new Memo
        Memo memory newMemo = Memo(
            msg.sender,
            block.timestamp,
            msg.value,
            _name,
            _message
        );
        // push the new Memo to memos
        s_memos.push(newMemo);

        // emit an event
        emit MemoEvent(msg.sender, block.timestamp, _name, _message);
    }

    function withdraw() public payable onlyOwner returns (bool isSuccessful) {
        // check if balance of the contract is zero trwo an error
        if (address(this).balance == 0) revert Account__BalanceIsZero();
        isSuccessful = i_owner.send(address(this).balance);
    }
}
