pragma solidity ^0.6.2;

import "./CustomERC721.sol";
// import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

// TODO:
// - allow to revert manufacturer requests

contract CryptoSneaker is CustomERC721, AccessControl {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;
    Counters.Counter internal _tokenIds;
    
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PENDING_MANUFACTURER = keccak256("PENDING_MANUFACTURER");
    
    event ManufacturerApproved(address manufacturer, uint256 amount);
    event ManufacturerDisapproved(address manufacturer, uint256 amount);
    event ManufacturerRequest(address manufacturer, uint256 amount);

   // Mappint from manufacturer candidate to the amount they offer for joining the manufacturer club
    mapping(address => uint256) public requestedManufacturers;

    constructor() public CustomERC721("CryptoSneaker", "CS") {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(PENDING_MANUFACTURER, ADMIN_ROLE);
    }


    struct Sneaker {
        address manufacturer; // address of the manufacturere that minted the sneaker
        string modelId; // unique id of the sneaker model, should be unique among all manufacturer models, can repeat among others
        uint8 size; // sneaker size
        string name; // name of the model
    }

    mapping (uint256 => Sneaker) public sneakers;
    mapping (bytes32 => uint256) private _sneakerHashes;

    // Internal function to create a Sneaker from string (name) and DNA
    function _sneaker(address _manufacturer, string memory _modelId, string memory _name, uint8 _size) internal {
        require(bytes(_modelId).length <= 15, "Sneaker's model id is too long, expected up to 15 characters");
        require(bytes(_name).length <= 50, "Sneaker's name is too long, expected up to 50 characters");

        Counters.increment(_tokenIds);
        uint256 newTokenId = Counters.current(_tokenIds);
        
        _mint(_manufacturer, newTokenId);
        _setTokenURI(newTokenId, _name);
        
        _sneakerHashes[keccak256(abi.encodePacked(_manufacturer, _modelId))] = newTokenId;

        sneakers[newTokenId] = Sneaker(_manufacturer, _modelId, _size, _name);
    }
    
    // Anybody who wants to become manufacturer has to request it and send some amount of currency
    // based on that amount the contract owner can then accept the request charging from 0 up to the given amount
    function requestManufacturerRole() public payable {
        require(msg.value > 0, "Request amount must be greater than 0");
        require(!hasRole(MANUFACTURER_ROLE, msg.sender), "Sender is already the manufacturer");
        require(requestedManufacturers[msg.sender] == 0, "Already pending request");
        requestedManufacturers[msg.sender] = msg.value;
        _setupRole(PENDING_MANUFACTURER, msg.sender);
        emit ManufacturerRequest(msg.sender, msg.value);
    }
    
    // Accept the manufacturer and 
    function approveManufacturer(address payable _candidate, uint256 _amount) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Requires admin role");
        require(requestedManufacturers[_candidate] > 0 && requestedManufacturers[_candidate] >= _amount, "Candidate must exist and have enough amount of currency");

        // refund remaining currency
        if (requestedManufacturers[_candidate] - _amount > 0) {
            _candidate.transfer(requestedManufacturers[_candidate] - _amount);
        }

        emit ManufacturerApproved(_candidate, _amount);
        revokeRole(PENDING_MANUFACTURER, msg.sender);
        _setupRole(MANUFACTURER_ROLE, _candidate);
    } 
    
    function disapproveManufacturer(address payable _candidate) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Requires admin role");
        require(requestedManufacturers[_candidate] > 0, "Candidate must exist to disapprove him");
        
        // refund all money to the candidate
        _candidate.transfer(requestedManufacturers[_candidate]);

        emit ManufacturerDisapproved(_candidate, requestedManufacturers[_candidate]);
        requestedManufacturers[_candidate] = 0;
        revokeRole(PENDING_MANUFACTURER, _candidate);
    }
    
    // Creates a random Pizza from string (name)
    function mint(string memory _modelID, string memory _name, uint8 _size) public {
        require(hasRole(MANUFACTURER_ROLE, msg.sender),"Requires manufacturer role");
        require(_sneakerHashes[keccak256(abi.encodePacked(msg.sender, _modelID))] == 0,  "Given manufacturer already has created a sneaker with given model id");
        _sneaker(msg.sender, _modelID, _name, _size);
    }


    // Returns array of Sneakers found by owner
    function getSneakersByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](_holderTokens[_owner].length());
        for (uint256 i = 0; i < result.length; i++) {
            result[i] = _holderTokens[_owner].at(i);
        }
        return result;
    }
}
