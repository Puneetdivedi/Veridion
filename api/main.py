from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import uuid
from agents.graph import esg_graph
from core.blockchain import ESGBlockchain, AuditBlock

app = FastAPI(title="Veridion ESG API", version="1.0.0")
blockchain = ESGBlockchain()

class AuditRequest(BaseModel):
    company_name: str
    claims: List[str]

class AuditResponse(BaseModel):
    audit_id: str
    status: str
    truth_score: Optional[float] = None
    summary: Optional[str] = None

# In-memory store for audit results (simulating a database)
audit_results = {}

@app.post("/audit", response_model=AuditResponse)
async def start_audit(request: AuditRequest, background_tasks: BackgroundTasks):
    audit_id = str(uuid.uuid4())
    
    # Initialize state
    initial_state = {
        "company_name": request.company_name,
        "claims": request.claims,
        "evidence_found": [],
        "truth_score": 0.0,
        "audit_summary": "",
        "status": "started",
        "messages": []
    }
    
    audit_results[audit_id] = initial_state
    
    # Run graph in background
    background_tasks.add_task(run_audit_pipeline, audit_id, initial_state)
    
    return AuditResponse(audit_id=audit_id, status="started")

async def run_audit_pipeline(audit_id: str, state: dict):
    # Execute LangGraph
    result = esg_graph.invoke(state)
    audit_results[audit_id] = result
    
    # Log to Blockchain
    blockchain.add_audit_record(
        audit_id=audit_id,
        company=result["company_name"],
        truth_score=result["truth_score"],
        evidence_summary=result["audit_summary"]
    )

@app.get("/audit/{audit_id}")
async def get_audit_status(audit_id: str):
    if audit_id not in audit_results:
        raise HTTPException(status_code=404, detail="Audit not found")
    return audit_results[audit_id]

@app.get("/blockchain/trail", response_model=List[AuditBlock])
async def get_audit_trail():
    return blockchain.get_audit_trail()

@app.get("/blockchain/verify")
async def verify_ledger():
    is_valid = blockchain.verify_chain()
    return {"is_valid": is_valid}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
