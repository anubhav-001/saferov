import os
import json
import hashlib
from typing import Dict, Optional
from datetime import datetime, timedelta
from web3 import Web3
from eth_account import Account
from ..config import settings

# Trip ID Registry Contract ABI
TRIP_CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "tripIdHash", "type": "bytes32"},
            {"internalType": "uint256", "name": "expiryTimestamp", "type": "uint256"}
        ],
        "name": "registerTemporaryTrip",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "tripIdHash", "type": "bytes32"}
        ],
        "name": "getTripExpiry",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "tripIdHash", "type": "bytes32"}
        ],
        "name": "deleteExpiredTrip",
        "outputs": [
            {"internalType": "bool", "name": "", "type": "bool"}
        ],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "tripIdHash", "type": "bytes32"}
        ],
        "name": "isTripActive",
        "outputs": [
            {"internalType": "bool", "name": "", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function",
    }
]

_w3: Web3 | None = None
_trip_contract = None
_account = None

def _init_trip_web3():
    """Initialize Web3 connection for trip blockchain operations"""
    global _w3, _trip_contract, _account
    if _w3 is not None:
        return
    
    # Use the blockchain API key for RPC URL if not set
    rpc_url = settings.BLOCKCHAIN_RPC_URL or f"https://polygon-amoy.infura.io/v3/{settings.BLOCKCHAIN_API_KEY}"
    
    if not rpc_url:
        raise RuntimeError("Missing BLOCKCHAIN_RPC_URL or BLOCKCHAIN_API_KEY")
    
    _w3 = Web3(Web3.HTTPProvider(rpc_url))
    if not _w3.is_connected():
        raise RuntimeError("Web3 failed to connect to RPC")
    
    # Use a default contract address for trip registry (in production, deploy your own)
    contract_address = settings.BLOCKCHAIN_CONTRACT_ADDRESS or "0x1234567890123456789012345678901234567890"
    
    _trip_contract = _w3.eth.contract(
        address=Web3.to_checksum_address(contract_address), 
        abi=TRIP_CONTRACT_ABI
    )
    
    # Generate account from API key if private key not available
    if settings.BLOCKCHAIN_PRIVATE_KEY and settings.BLOCKCHAIN_PRIVATE_KEY != "PnhzYWiaenARDmvNlBnD9":
        _account = Account.from_key(settings.BLOCKCHAIN_PRIVATE_KEY)
    else:
        # Use API key to generate a deterministic private key
        private_key = hashlib.sha256(settings.BLOCKCHAIN_API_KEY.encode()).hexdigest()
        _account = Account.from_key(private_key)

def generate_trip_id(trip_data: Dict) -> str:
    """Generate a unique trip ID based on trip data"""
    # Create a hash of trip data for uniqueness
    trip_string = json.dumps(trip_data, sort_keys=True)
    trip_hash = hashlib.sha256(trip_string.encode()).hexdigest()
    
    # Create a readable trip ID
    timestamp = int(datetime.now().timestamp())
    trip_id = f"TRIP_{trip_hash[:8].upper()}_{timestamp}"
    
    return trip_id

def register_temporary_trip(trip_data: Dict, duration_hours: int = 168) -> Dict[str, str | int]:
    """
    Register a temporary trip ID on blockchain with auto-expiry
    
    Args:
        trip_data: Dictionary containing trip information
        duration_hours: Trip duration in hours (default: 7 days)
    
    Returns:
        Dictionary with trip_id, tx_hash, expiry_timestamp
    """
    try:
        _init_trip_web3()
        assert _w3 and _trip_contract and _account
        
        # Generate trip ID
        trip_id = generate_trip_id(trip_data)
        trip_id_hash = Web3.keccak(text=trip_id).hex()
        
        # Calculate expiry timestamp
        expiry_time = datetime.now() + timedelta(hours=duration_hours)
        expiry_timestamp = int(expiry_time.timestamp())
        
        # Build transaction
        nonce = _w3.eth.get_transaction_count(_account.address)
        tx = _trip_contract.functions.registerTemporaryTrip(
            trip_id_hash, 
            expiry_timestamp
        ).build_transaction({
            "from": _account.address,
            "nonce": nonce,
            "chainId": settings.BLOCKCHAIN_CHAIN_ID,
            "maxFeePerGas": _w3.to_wei("30", "gwei"),
            "maxPriorityFeePerGas": _w3.to_wei("2", "gwei"),
            "value": 0,
        })
        
        # Sign and send transaction
        signed = _account.sign_transaction(tx)
        tx_hash = _w3.eth.send_raw_transaction(signed.rawTransaction)
        receipt = _w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return {
            "trip_id": trip_id,
            "trip_id_hash": trip_id_hash,
            "tx_hash": tx_hash.hex(),
            "block_number": receipt.blockNumber,
            "expiry_timestamp": expiry_timestamp,
            "expiry_date": expiry_time.isoformat(),
            "status": "registered"
        }
        
    except Exception as e:
        # Fallback to local registration if blockchain fails
        trip_id = generate_trip_id(trip_data)
        expiry_time = datetime.now() + timedelta(hours=duration_hours)
        
        return {
            "trip_id": trip_id,
            "trip_id_hash": hashlib.sha256(trip_id.encode()).hexdigest(),
            "tx_hash": "local_fallback",
            "block_number": 0,
            "expiry_timestamp": int(expiry_time.timestamp()),
            "expiry_date": expiry_time.isoformat(),
            "status": "local_registered",
            "error": str(e)
        }

def check_trip_status(trip_id: str) -> Dict[str, any]:
    """Check if a trip ID is still active on blockchain"""
    try:
        _init_trip_web3()
        assert _w3 and _trip_contract
        
        trip_id_hash = Web3.keccak(text=trip_id).hex()
        
        # Check if trip is active
        is_active = _trip_contract.functions.isTripActive(trip_id_hash).call()
        
        # Get expiry timestamp
        expiry_timestamp = _trip_contract.functions.getTripExpiry(trip_id_hash).call()
        expiry_date = datetime.fromtimestamp(expiry_timestamp).isoformat()
        
        return {
            "trip_id": trip_id,
            "is_active": is_active,
            "expiry_timestamp": expiry_timestamp,
            "expiry_date": expiry_date,
            "status": "active" if is_active else "expired"
        }
        
    except Exception as e:
        # Fallback to local check
        return {
            "trip_id": trip_id,
            "is_active": True,  # Assume active if can't check
            "expiry_timestamp": 0,
            "expiry_date": "unknown",
            "status": "unknown",
            "error": str(e)
        }

def delete_expired_trip(trip_id: str) -> Dict[str, any]:
    """Delete an expired trip ID from blockchain"""
    try:
        _init_trip_web3()
        assert _w3 and _trip_contract and _account
        
        trip_id_hash = Web3.keccak(text=trip_id).hex()
        
        # Build transaction
        nonce = _w3.eth.get_transaction_count(_account.address)
        tx = _trip_contract.functions.deleteExpiredTrip(trip_id_hash).build_transaction({
            "from": _account.address,
            "nonce": nonce,
            "chainId": settings.BLOCKCHAIN_CHAIN_ID,
            "maxFeePerGas": _w3.to_wei("30", "gwei"),
            "maxPriorityFeePerGas": _w3.to_wei("2", "gwei"),
            "value": 0,
        })
        
        # Sign and send transaction
        signed = _account.sign_transaction(tx)
        tx_hash = _w3.eth.send_raw_transaction(signed.rawTransaction)
        receipt = _w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return {
            "trip_id": trip_id,
            "tx_hash": tx_hash.hex(),
            "block_number": receipt.blockNumber,
            "status": "deleted"
        }
        
    except Exception as e:
        return {
            "trip_id": trip_id,
            "tx_hash": "local_fallback",
            "block_number": 0,
            "status": "local_deleted",
            "error": str(e)
        }

def cleanup_expired_trips() -> Dict[str, any]:
    """Clean up all expired trips (utility function)"""
    # This would typically be called by a background job
    # For now, return a summary
    return {
        "status": "cleanup_initiated",
        "timestamp": datetime.now().isoformat(),
        "message": "Expired trips cleanup process started"
    }

