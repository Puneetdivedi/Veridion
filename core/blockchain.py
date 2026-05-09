import hashlib
import json
import time
from typing import List, Dict, Any
from pydantic import BaseModel

class AuditBlock(BaseModel):
    index: int
    timestamp: float
    data: Dict[str, Any]
    previous_hash: str
    hash: str

class ESGBlockchain:
    def __init__(self):
        self.chain: List[AuditBlock] = []
        # Create genesis block
        self._create_block(data={"message": "Veridion Genesis Block"}, previous_hash="0")

    def _create_block(self, data: Dict[str, Any], previous_hash: str) -> AuditBlock:
        block = {
            "index": len(self.chain) + 1,
            "timestamp": time.time(),
            "data": data,
            "previous_hash": previous_hash
        }
        block["hash"] = self._hash_block(block)
        audit_block = AuditBlock(**block)
        self.chain.append(audit_block)
        return audit_block

    def _hash_block(self, block: Dict[str, Any]) -> str:
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def add_audit_record(self, audit_id: str, company: str, truth_score: float, evidence_summary: str):
        data = {
            "audit_id": audit_id,
            "company": company,
            "truth_score": truth_score,
            "evidence": evidence_summary,
            "verified_at": time.ctime()
        }
        previous_hash = self.chain[-1].hash if self.chain else "0"
        return self._create_block(data, previous_hash)

    def verify_chain(self) -> bool:
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            
            # Check hash integrity
            block_data = current.dict(exclude={"hash"})
            if current.hash != self._hash_block(block_data):
                return False
            
            # Check chain link
            if current.previous_hash != previous.hash:
                return False
        return True

    def get_audit_trail(self) -> List[AuditBlock]:
        return self.chain
