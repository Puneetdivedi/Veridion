from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
import json
from loguru import logger
from agents.graph import esg_graph
from core.blockchain import ESGBlockchain, AuditBlock

# Configure Logger
logger.add("logs/audit.log", rotation="10 MB", level="INFO")

app = FastAPI(title="Veridion ESG API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

blockchain = ESGBlockchain()

class AuditRequest(BaseModel):
    company_name: str
    claims: List[str]

class AuditResponse(BaseModel):
    audit_id: str
    status: str
    truth_score: Optional[float] = None
    summary: Optional[str] = None

# Persistent storage for audit results
AUDIT_DB_PATH = "data/audit_db.json"

def load_audits():
    if os.path.exists(AUDIT_DB_PATH):
        with open(AUDIT_DB_PATH, "r") as f:
            return json.load(f)
    return {}

def save_audit(audit_id, data):
    audits = load_audits()
    audits[audit_id] = data
    os.makedirs("data", exist_ok=True)
    with open(AUDIT_DB_PATH, "w") as f:
        json.dump(audits, f, indent=4)

audit_results = load_audits()

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
    save_audit(audit_id, initial_state)
    
    # Run graph in background
    background_tasks.add_task(run_audit_pipeline, audit_id, initial_state)
    
    return AuditResponse(audit_id=audit_id, status="started")

async def run_audit_pipeline(audit_id: str, state: dict):
    logger.info(f"Starting audit pipeline for {state['company_name']} (ID: {audit_id})")
    try:
        # Execute LangGraph
        result = esg_graph.invoke(state)
        audit_results[audit_id] = result
        save_audit(audit_id, result)
        
        # Log to Blockchain
        blockchain.add_audit_record(
            audit_id=audit_id,
            company=result["company_name"],
            truth_score=result["truth_score"],
            evidence_summary=result["audit_summary"]
        )
        logger.success(f"Audit {audit_id} complete. Truth Score: {result['truth_score']}")
    except Exception as e:
        logger.error(f"Audit {audit_id} failed: {str(e)}")
        audit_results[audit_id]["status"] = "failed"

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
