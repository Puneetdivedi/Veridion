from langgraph.graph import StateGraph, END
from agents.state import AgentState
from agents.nodes import ESGNodes

def create_esg_graph():
    nodes = ESGNodes()
    workflow = StateGraph(AgentState)

    # Add Nodes
    workflow.add_node("researcher", nodes.researcher)
    workflow.add_node("auditor", nodes.auditor)
    workflow.add_node("verifier", nodes.verifier)

    # Define Edges
    workflow.set_entry_point("researcher")
    workflow.add_edge("researcher", "auditor")
    workflow.add_edge("auditor", "verifier")
    workflow.add_edge("verifier", END)

    return workflow.compile()

# Initialize the graph
esg_graph = create_esg_graph()
