import os
from typing import Dict
from web3 import Web3
from eth_account import Account
from ..config import settings

# Minimal ABI for SafeRoveIdRegistry
CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "idHash", "type": "bytes32"}
        ],
        "name": "anchorId",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "idHash", "type": "bytes32"}
        ],
        "name": "getFirstSeenAt",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function",
    },
]

_w3: Web3 | None = None
_contract = None
_account = None


def _init_web3():
    global _w3, _contract, _account
    if _w3 is not None:
        return
    if not settings.BLOCKCHAIN_RPC_URL:
        raise RuntimeError("Missing BLOCKCHAIN_RPC_URL env")
    if not settings.BLOCKCHAIN_PRIVATE_KEY:
        raise RuntimeError("Missing BLOCKCHAIN_PRIVATE_KEY env")
    if not settings.BLOCKCHAIN_CONTRACT_ADDRESS:
        raise RuntimeError("Missing BLOCKCHAIN_CONTRACT_ADDRESS env")

    _w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_RPC_URL))
    if not _w3.is_connected():
        raise RuntimeError("Web3 failed to connect to RPC")
    addr = Web3.to_checksum_address(settings.BLOCKCHAIN_CONTRACT_ADDRESS)
    _contract = _w3.eth.contract(address=addr, abi=CONTRACT_ABI)
    _account = Account.from_key(settings.BLOCKCHAIN_PRIVATE_KEY)


def anchor_id_hash(id_hash_hex: str) -> Dict[str, str | int]:
    """
    Anchor a 32-byte hex hash on-chain via anchorId.
    Returns { tx_hash, block_number, first_seen_at }.
    """
    _init_web3()
    assert _w3 and _contract and _account

    nonce = _w3.eth.get_transaction_count(_account.address)
    tx = _contract.functions.anchorId(id_hash_hex).build_transaction(
        {
            "from": _account.address,
            "nonce": nonce,
            "chainId": settings.BLOCKCHAIN_CHAIN_ID,
            # Reasonable defaults; user may tweak on RPC side
            "maxFeePerGas": _w3.to_wei("30", "gwei"),
            "maxPriorityFeePerGas": _w3.to_wei("2", "gwei"),
            "value": 0,
        }
    )
    signed = _account.sign_transaction(tx)
    tx_hash = _w3.eth.send_raw_transaction(signed.rawTransaction)
    receipt = _w3.eth.wait_for_transaction_receipt(tx_hash)

    # Query mapping after success
    first_seen = _contract.functions.getFirstSeenAt(id_hash_hex).call()

    return {
        "tx_hash": tx_hash.hex(),
        "block_number": receipt.blockNumber,
        "first_seen_at": int(first_seen),
    }
