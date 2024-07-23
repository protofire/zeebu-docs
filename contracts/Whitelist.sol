// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    address public owner;
    mapping(address => bool) public whitelistedAddresses;

    event WhitelistedAddressAdded(address addr);
    event WhitelistedAddressRemoved(address addr);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyWhitelisted(address addr) {
        require(whitelistedAddresses[addr], "Address is not whitelisted");
        _;
    }

    constructor() {
        owner = msg.sender;
        whitelistedAddresses[owner] = true;
        emit OwnershipTransferred(address(0), owner);
        emit WhitelistedAddressAdded(owner);
    }

    function addAddressToWhitelist(address addr) public onlyOwner {
        whitelistedAddresses[addr] = true;
        emit WhitelistedAddressAdded(addr);
    }

    function removeAddressFromWhitelist(address addr) public onlyOwner {
        whitelistedAddresses[addr] = false;
        emit WhitelistedAddressRemoved(addr);
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return whitelistedAddresses[addr];
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        whitelistedAddresses[owner] = false;
        whitelistedAddresses[newOwner] = true;
        owner = newOwner;
        emit WhitelistedAddressRemoved(owner);
        emit WhitelistedAddressAdded(newOwner);
    }

    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(owner, address(0));
        whitelistedAddresses[owner] = false;
        emit WhitelistedAddressRemoved(owner);
        owner = address(0);
    }
}
