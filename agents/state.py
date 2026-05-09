from typing import Annotated, List, Dict, Any, TypedDict
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[List[Any], add_messages]
    company_name: str
    claims: List[str]
    evidence_found: List[Dict[str, Any]]
    truth_score: float
    audit_summary: str
    status: str # e.g., "researching", "auditing", "verifying", "complete"
