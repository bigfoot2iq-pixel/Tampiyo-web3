// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TampiyoClaim is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Category {
        uint128 amount;
        uint64 cooldown;
        uint128 fee;
        bool enabled;
    }

    IERC20 public immutable tampiyo;
    IERC20 public feeToken;
    address public feeRecipient;
    Category[3] public categories;
    mapping(address => mapping(uint8 => uint64)) public lastClaimAt;
    bool public paused;

    event CategoryUpdated(uint8 indexed id, uint128 amount, uint64 cooldown, uint128 fee, bool enabled);
    event FeeTokenUpdated(address indexed token);
    event FeeRecipientUpdated(address indexed recipient);
    event Claimed(address indexed user, uint8 indexed category, uint128 amount, uint128 fee);
    event PausedSet(bool paused);
    event PoolWithdrawn(address indexed to, uint256 amount);

    error InvalidCategory();
    error CategoryDisabled();
    error CooldownActive(uint64 nextClaimAt);
    error InsufficientPool();
    error ContractPaused();
    error ZeroAddress();

    constructor(
        address tampiyoToken_,
        address feeToken_,
        address feeRecipient_,
        address initialOwner_,
        Category[3] memory cats_
    ) Ownable(initialOwner_) {
        if (tampiyoToken_ == address(0)) revert ZeroAddress();
        if (feeRecipient_ == address(0)) revert ZeroAddress();
        tampiyo = IERC20(tampiyoToken_);
        feeToken = IERC20(feeToken_);
        feeRecipient = feeRecipient_;

        for (uint8 i; i < 3; ++i) {
            categories[i] = cats_[i];
            emit CategoryUpdated(i, cats_[i].amount, cats_[i].cooldown, cats_[i].fee, cats_[i].enabled);
        }
    }

    function setCategory(uint8 id, uint128 amount, uint64 cooldown, uint128 fee, bool enabled) external onlyOwner {
        if (id >= 3) revert InvalidCategory();
        categories[id] = Category(amount, cooldown, fee, enabled);
        emit CategoryUpdated(id, amount, cooldown, fee, enabled);
    }

    function setFeeToken(address token) external onlyOwner {
        if (token == address(0)) revert ZeroAddress();
        feeToken = IERC20(token);
        emit FeeTokenUpdated(token);
    }

    function setFeeRecipient(address r) external onlyOwner {
        if (r == address(0)) revert ZeroAddress();
        feeRecipient = r;
        emit FeeRecipientUpdated(r);
    }

    function setPaused(bool p) external onlyOwner {
        paused = p;
        emit PausedSet(p);
    }

    function withdrawPool(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        tampiyo.safeTransfer(to, amount);
        emit PoolWithdrawn(to, amount);
    }

    function claim(uint8 categoryId) external nonReentrant {
        if (paused) revert ContractPaused();
        if (categoryId >= 3) revert InvalidCategory();

        Category memory c = categories[categoryId];
        if (!c.enabled) revert CategoryDisabled();

        uint64 last = lastClaimAt[msg.sender][categoryId];
        uint64 nowTs = uint64(block.timestamp);
        if (last != 0 && nowTs < last + c.cooldown) {
            revert CooldownActive(last + c.cooldown);
        }

        if (tampiyo.balanceOf(address(this)) < c.amount) revert InsufficientPool();

        lastClaimAt[msg.sender][categoryId] = nowTs;

        if (c.fee > 0) {
            feeToken.safeTransferFrom(msg.sender, feeRecipient, c.fee);
        }
        tampiyo.safeTransfer(msg.sender, c.amount);

        emit Claimed(msg.sender, categoryId, c.amount, c.fee);
    }

    function nextClaimAt(address user, uint8 categoryId) external view returns (uint64) {
        if (categoryId >= 3) revert InvalidCategory();
        uint64 last = lastClaimAt[user][categoryId];
        if (last == 0) return 0;
        return last + categories[categoryId].cooldown;
    }

    function canClaim(address user, uint8 categoryId) external view returns (bool, uint64) {
        if (categoryId >= 3) revert InvalidCategory();
        if (paused) return (false, 0);
        Category memory c = categories[categoryId];
        if (!c.enabled) return (false, 0);
        uint64 last = lastClaimAt[user][categoryId];
        uint64 nowTs = uint64(block.timestamp);
        if (last != 0 && nowTs < last + c.cooldown) {
            return (false, last + c.cooldown);
        }
        if (tampiyo.balanceOf(address(this)) < c.amount) return (false, 0);
        return (true, 0);
    }

    function getCategory(uint8 id) external view returns (Category memory) {
        if (id >= 3) revert InvalidCategory();
        return categories[id];
    }

    function poolBalance() external view returns (uint256) {
        return tampiyo.balanceOf(address(this));
    }
}
