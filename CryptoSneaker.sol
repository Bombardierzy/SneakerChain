pragma solidity ^0.5.10;

// Imports symbols from other files into the current contract.
// In this case, a series of helper contracts from OpenZeppelin.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/layout-of-source-files.html#importing-other-source-files
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../node_modules/@openzeppelin/contracts/introspection/ERC165.sol";
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

// The `is` keyword is used to inherit functions and keywords from external contracts.
// In this case, `CryptoSneaker` inherits from the `IERC721` and `ERC165` contracts.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/contracts.html#inheritance
contract CryptoSneaker is IERC721, ERC165 {
    // Uses OpenZeppelin's SafeMath library to perform arithmetic operations safely.
    // Learn more: https://docs.openzeppelin.com/contracts/2.x/api/math#SafeMath
    using SafeMath for uint256;

    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    // Struct types let you define your own type
    // Learn more: https://solidity.readthedocs.io/en/v0.5.10/types.html#structs
    struct Sneaker {
        address manufacturer;
        uint256 id;
        string name;
        int8 size;
    }

    // Creates an empty array of Sneaker structs
    Sneaker[] public sneakers;

    // Mapping from owner's address to id of sneaker pair
    mapping(uint256 => address) public pairToOwner;

    // Mapping from owner's address to number of owned sneaker pairs
    mapping(address => uint256) public ownerPairsCount;

    // Mapping from token ID to approved address
    mapping(uint256 => address) sneakerApprovals;

    // You can nest mappings, this example maps owner to operator approvals
    mapping(address => mapping(address => bool)) private operatorApprovals;

    // Internal function to create a Sneaker from string (name) and DNA
    function _sneaker(address _manufacturer, uint128 _id, string memory _name, int8 _size)
        internal
    {
        // Adds Sneaker to array of Sneakers and get id
        uint256 id = SafeMath.sub(sneakers.push(Sneaker(_manufacturer, _id, _name, _size)), 1);

        assert(pairToOwner[id] == address(0));

        pairToOwner[id] = msg.sender;
        ownerPairsCount[msg.sender] = SafeMath.add(
            ownerPairsCount[msg.sender],
            1
        );
    }


    // Returns array of Sneakers found by owner
    function getPairsByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        // Learn more: https://solidity.readthedocs.io/en/v0.5.10/introduction-to-smart-contracts.html#storage-memory-and-the-stack
        uint256[] memory result = new uint256[](ownerPairsCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < sneakers.length; i++) {
            if (pairToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    // Transfers Sneaker and ownership to other address
    function transferFrom(address _from, address _to, uint256 _sneakerId) public {
        require(_from != address(0) && _to != address(0), "Invalid address.");
        require(_exists(_sneakerId), "Sneaker does not exist.");
        require(_from != _to, "Cannot transfer to the same address.");
        require(_isApprovedOrOwner(msg.sender, _sneakerId), "Address is not approved.");

        ownerPairsCount[_to] = SafeMath.add(ownerPairsCount[_to], 1);
        ownerPairsCount[_from] = SafeMath.sub(ownerPairsCount[_from], 1);
        pairToOwner[_sneakerId] = _to;

        // Emits event defined in the imported IERC721 contract
        emit Transfer(_from, _to, _sneakerId);
        _clearApproval(_to, _sneakerId);
    }

    /**
     * Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`;
     * otherwise, the transfer is reverted.
    */
    function safeTransferFrom(address from, address to, uint256 sneakerId)
        public
    {
        // solium-disable-next-line arg-overflow
        this.safeTransferFrom(from, to, sneakerId, "");
    }

    /**
     * Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`;
     * otherwise, the transfer is reverted.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 sneakerId,
        bytes memory _data
    ) public {
        this.transferFrom(from, to, sneakerId);
        require(_checkOnERC721Received(from, to, sneakerId, _data), "Must implmement onERC721Received.");
    }

    /**
     * Internal function to invoke `onERC721Received` on a target address
     * The call is not executed if the target address is not a contract
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 sneakerId,
        bytes memory _data
    ) internal returns (bool) {
        if (!isContract(to)) {
            return true;
        }

        bytes4 retval = IERC721Receiver(to).onERC721Received(
            msg.sender,
            from,
            sneakerId,
            _data
        );
        return (retval == _ERC721_RECEIVED);
    }

    // Burns the Sneaker - destroys Token completely
    // The `external` function modifier means this function is
    // part of the contract interface and other contracts can call it
    function burn(uint256 _sneakerId) external {
        require(msg.sender != address(0), "Invalid address.");
        require(_exists(_sneakerId), "Sneaker does not exist.");
        require(_isApprovedOrOwner(msg.sender, _sneakerId), "Address is not approved.");

        ownerPairsCount[msg.sender] = SafeMath.sub(
            ownerPairsCount[msg.sender],
            1
        );
        pairToOwner[_sneakerId] = address(0);
    }

    // Returns count of Sneakers by address
    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerPairsCount[_owner];
    }

    // Returns owner of the Sneaker found by id
    function ownerOf(uint256 _sneakerId) public view returns (address _owner) {
        address owner = pairToOwner[_sneakerId];
        require(owner != address(0), "Invalid Sneaker ID.");
        return owner;
    }

    // Approves other address to transfer ownership of Sneaker
    function approve(address _to, uint256 _sneakerId) public {
        require(msg.sender == pairToOwner[_sneakerId], "Must be the Sneaker owner.");
        sneakerApprovals[_sneakerId] = _to;
        emit Approval(msg.sender, _to, _sneakerId);
    }

    // Returns approved address for specific Sneaker
    function getApproved(uint256 _sneakerId)
        public
        view
        returns (address operator)
    {
        require(_exists(_sneakerId), "Sneaker does not exist.");
        return sneakerApprovals[_sneakerId];
    }

    /**
     * Private function to clear current approval of a given token ID
     * Reverts if the given address is not indeed the owner of the token
     */
    function _clearApproval(address owner, uint256 _sneakerId) private {
        require(pairToOwner[_sneakerId] == owner, "Must be sneaker owner.");
        require(_exists(_sneakerId), "Sneaker does not exist.");
        if (sneakerApprovals[_sneakerId] != address(0)) {
            sneakerApprovals[_sneakerId] = address(0);
        }
    }

    /*
     * Sets or unsets the approval of a given operator
     * An operator is allowed to transfer all tokens of the sender on their behalf
     */
    function setApprovalForAll(address to, bool approved) public {
        require(to != msg.sender, "Cannot approve own address");
        operatorApprovals[msg.sender][to] = approved;
        emit ApprovalForAll(msg.sender, to, approved);
    }

    // Tells whether an operator is approved by a given owner
    function isApprovedForAll(address owner, address operator)
        public
        view
        returns (bool)
    {
        return operatorApprovals[owner][operator];
    }

    // Takes ownership of Sneaker - only for approved users
    function takeOwnership(uint256 _sneakerId) public {
        require(_isApprovedOrOwner(msg.sender, _sneakerId), "Address is not approved.");
        address owner = this.ownerOf(_sneakerId);
        this.transferFrom(owner, msg.sender, _sneakerId);
    }

    // Checks if Sneaker exists
    function _exists(uint256 _sneakerId) internal view returns (bool) {
        address owner = pairToOwner[_sneakerId];
        return owner != address(0);
    }

    // Checks if address is owner or is approved to transfer Sneaker
    function _isApprovedOrOwner(address spender, uint256 sneakerId)
        internal
        view
        returns (bool)
    {
        address owner = pairToOwner[sneakerId];
        // Disable solium check because of
        // https://github.com/duaraghav8/Solium/issues/175
        // solium-disable-next-line operator-whitespace
        return (spender == owner ||
            this.getApproved(sneakerId) == spender ||
            this.isApprovedForAll(owner, spender));
    }

    // Returns whether the target address is a contract
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        // Currently there is no better way to check if there is a contract in an address
        // than to check the size of the code at that address.
        // See https://ethereum.stackexchange.com/a/14016/36603
        // for more details about how this works.
        // TODO Check this again before the Serenity release, because all addresses will be
        // contracts then.
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}
