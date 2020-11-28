pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/introspection/ERC165.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/access/Roles.sol";

// TODO:
// - allow to revert manufacturer requests

contract CryptoSneaker is IERC721, ERC165, Ownable {
    using SafeMath for uint256;
    using Roles for Roles.Role;

    Roles.Role private _manufacturers;

    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    struct Sneaker {
        address manufacturer; // address of the manufacturere that minted the sneaker
        uint32 modelID; // unique id of the sneaker model, should be unique among all manufacturer models, can repeat among others
        string name; // name of the model
        int8 size; // sneaker size
    }

    // Creates an empty array of Sneaker structs
    Sneaker[] public sneakers;

    // Mapping from sneaker pair to the owner 
    mapping(uint256 => address) public pairToOwner;
    
    // Mappint from manufacturer candidate to the amount they offer for joining the manufacturer club
    mapping(address => uint) public requestedManufacturers;

    // Mapping from owner's address to number of owned sneaker pairs
    mapping(address => uint256) public ownerPairsCount;

    // Mapping from token ID to approved address
    mapping(uint256 => address) sneakerApprovals;

    // You can nest mappings, this example maps owner to operator approvals
    mapping(address => mapping(address => bool)) private operatorApprovals;

    // Internal function to create a Sneaker from string (name) and DNA
    function _sneaker(address _manufacturer, uint32 _id, string memory _name, int8 _size)
        internal
        isUnique(_manufacturer, _id)
    {
        require(bytes(_name).length < 50, "Sneaker name is too long, expected up to 50 characters");

        // Adds Sneaker to array of Sneakers and get id
        uint256 id = SafeMath.sub(sneakers.push(Sneaker(_manufacturer, _id, _name, _size)), 1);
        
        assert(pairToOwner[id] == address(0));

        pairToOwner[id] = msg.sender;
        ownerPairsCount[msg.sender] = SafeMath.add(
            ownerPairsCount[msg.sender],
            1
        );
    }
    
    // Anybody who wants to become manufacturer has to request it and send some amount of currency
    // based on that amount the contract owner can then accept the request charging from 0 up to the given amount
    function requestManufacturerRole() public {
        require(msg.value > 0, "Request amount must be greater than 0");
        require(!_manufacturers.has(msg.sender), "Sender is already the manufacturer");
        requestedManufacturers[msg.sender] = msg.value;
    }
    
    // Accept the manufacturer and 
    function approveManufacturer(address _candidate, uint _amount) public onlyOwner {
        require(requestedManufacturers[_candidate] > 0 && requestedManufacturers[_candidate] >= _amount, "Candidate must exist and have enough amount of currency");

        // refund remaining currency
        if (requestedManufacturers[_candidate] - _amount > 0) {
            _candidate.transfer(requestedManufacturers[_candidate] - _amount);
        }
        // currency has been trasnfered so delete 
        // to prevent approving manufacturer twice 
        delete requestedManufacturers[_candidate];
        _manufacturers.add(candidate);
    } 
    
    // Creates a random Pizza from string (name)
    function mint(uint _modelID, string memory _name, uint _size) public {
        require(_manufacturers.has(msg.sender), "Requires manufacturer role");
        _sneaker(msg.sender, _modelID, _name, _size);
    }


    // Returns array of Sneakers found by owner
    function getPairsByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
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
        // solium-disable-next-line operator-whitespace
        return (spender == owner ||
            this.getApproved(sneakerId) == spender ||
            this.isApprovedForAll(owner, spender));
    }
    
    modifier isUnique(address _manufacturer, uint _modelID) {
        bool result = true;
        for (uint256 i = 0; i < sneakers.length; i++) {
            if (
                sneakers[i] == _modelID && 
                sneakers[i].manufacturer == _manufacturer
            ) {
                result = false;
            }
        }
        require(result, "Given manufacturer already has created snear with given model id");
        _;
    }

    // Returns whether the target address is a contract
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}
