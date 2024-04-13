// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// internal & private view & pure functions
// external & public view & pure functions
// SPDX-License-Identifier: UNLICENSED
// Pragma
pragma solidity ^0.8.19;

// Error
error BuyMeACoffe__SignedUpBefore();
error BuyMeACoffe__NotSignedUpBefore();
error BuyMeACoffe__BalanceIsZero();
error BuyMeACoffe__OnlyOwner();
error BuyMeACoffe__ValueMustBeMoreThanOneGwei();
error BuyMeACoffe__TransferFaild();

/**@title BuyMeACoffee contract
 * @author mohammad norouzi
 * @notice This contract implements the BuyMeACoffee contract and its functionality as simple as possible
 */
contract BuyMeACoffee {
    ///////////
    // types //
    ///////////

    struct User {
        address userAddress;
        uint256 userBalance;
        Memo lastMemo;
    }
    struct Memo {
        address from;
        uint256 timestamp;
        uint256 amount;
        string name;
        string message;
    }

    /////////////////////
    // State variables //
    /////////////////////

    /// @dev set a minimum amount for coffe price
    uint256 private constant MINIMUN_COFFEE_PRICE = 1e9;
    /// @dev Mapping of address to users struct
    mapping(address => User) private s_users;

    ////////////
    // events //
    ////////////

    event SingUpEvent(address indexed from, uint256 timestamp);

    event MemoEvent(
        address indexed to,
        address indexed from,
        uint256 indexed timestamp,
        uint256 amount,
        string name,
        string message
    );

    ///////////////
    // modifiers //
    ///////////////

    modifier isUserExist(address _address) {
        // read accounts address as currentAddress from storage
        address currentAddress = _getUser(_address);
        // check if the _address is already signed up
        if (currentAddress == address(0)) {
            revert BuyMeACoffe__NotSignedUpBefore();
        }
        _;
    }

    ///////////////
    // functions //
    ///////////////

    /*
     * @notice This function will sing up the new user and emit a event
     */

    function singUp() external {
        // check if the account is already signed up revert an error
        address currentAddress = _getUser(msg.sender);
        if (currentAddress != address(0)) {
            revert BuyMeACoffe__SignedUpBefore();
        }

        // create a new User and save it in the state
        User memory newUser = User(msg.sender, 0, _createMemo("", "", 0));
        s_users[msg.sender] = newUser;

        // emit the a event
        emit SingUpEvent(msg.sender, block.timestamp);
    }

    function buyACoffee(
        string memory name,
        string memory message,
        address to
    ) external payable isUserExist(to) {
        // check if msg.value is less than MINIMUN_COFFEE_PRICE revert an error
        if (msg.value < MINIMUN_COFFEE_PRICE)
            revert BuyMeACoffe__ValueMustBeMoreThanOneGwei();

        // updata user balance
        s_users[to].userBalance += msg.value;
        s_users[to].lastMemo = _createMemo(name, message, msg.value);

        // emit an event
        emit MemoEvent(
            to,
            msg.sender,
            block.timestamp,
            msg.value,
            name,
            message
        );
    }

    function withdraw() external payable isUserExist(msg.sender) {
        // check if balance of the contract is zero trwo an error
        if (s_users[msg.sender].userBalance == 0)
            revert BuyMeACoffe__BalanceIsZero();

        bool isSuccessful = payable(msg.sender).send(
            s_users[msg.sender].userBalance
        );

        if (!isSuccessful) revert BuyMeACoffe__TransferFaild();
    }

    function _getUser(address _address) internal view returns (address) {
        return s_users[_address].userAddress;
    }

    function _createMemo(
        string memory name,
        string memory message,
        uint256 amount
    ) internal view returns (Memo memory) {
        Memo memory newMemo = Memo(
            msg.sender,
            block.timestamp,
            amount,
            name,
            message
        );
        return newMemo;
    }

    function getBalance()
        external
        view
        isUserExist(msg.sender)
        returns (uint256)
    {
        return s_users[msg.sender].userBalance;
    }

    function getLastMemo()
        external
        view
        isUserExist(msg.sender)
        returns (Memo memory)
    {
        return s_users[msg.sender].lastMemo;
    }
}
