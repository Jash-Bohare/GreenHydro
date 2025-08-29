// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SubsidyPool is Ownable(msg.sender) {
    IERC20 public token;
    uint256 public nextClaimId;

    enum ClaimState { Submitted, Certified, Paid, Rejected }

    struct Claim {
        address producer;
        uint256 amount;       // GST amount in token base units (18 decimals)
        string docHash;       // IPFS / evidence hash
        ClaimState state;
        address certifier;
    }

    mapping(uint256 => Claim) public claims;
    mapping(address => bool) public certifiers;

    event ClaimSubmitted(uint256 indexed claimId, address indexed producer, uint256 amount, string docHash);
    event ClaimCertified(uint256 indexed claimId, address indexed certifier);
    event PaymentReleased(uint256 indexed claimId, address indexed producer, uint256 amount);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
        nextClaimId = 1;
    }

    function addCertifier(address certifier) external onlyOwner {
        certifiers[certifier] = true;
    }

    function removeCertifier(address certifier) external onlyOwner {
        certifiers[certifier] = false;
    }

    function submitClaim(address producer, uint256 amount, string calldata docHash) external returns (uint256) {
        uint256 cid = nextClaimId++;
        claims[cid] = Claim({
            producer: producer,
            amount: amount,
            docHash: docHash,
            state: ClaimState.Submitted,
            certifier: address(0)
        });
        emit ClaimSubmitted(cid, producer, amount, docHash);
        return cid;
    }

    function certifyClaim(uint256 claimId) external {
        require(certifiers[msg.sender], "Not a certifier");
        Claim storage c = claims[claimId];
        require(c.state == ClaimState.Submitted, "Claim not in Submitted state");
        c.state = ClaimState.Certified;
        c.certifier = msg.sender;
        emit ClaimCertified(claimId, msg.sender);
    }

    function releasePayment(uint256 claimId) external {
        Claim storage c = claims[claimId];
        require(c.state == ClaimState.Certified, "Claim not certified");
        require(token.balanceOf(address(this)) >= c.amount, "Insufficient pool balance");
        c.state = ClaimState.Paid;
        token.transfer(c.producer, c.amount);
        emit PaymentReleased(claimId, c.producer, c.amount);
    }

    // Admin or admin-approved wallet should approve pool to pull tokens, OR transfer directly
    function deposit(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }
}
