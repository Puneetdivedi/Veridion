# Veridion: Autonomous ESG Auditing & Traceability

Veridion is an industrial-grade platform designed to verify corporate sustainability claims using multi-source AI agents and immutable audit logs.

## 🚀 Key Features
- **Multi-Source Verification**: AI agents cross-reference supply chain invoices, energy bills, and satellite data.
- **RAG-Powered Auditing**: Genuine Retrieval-Augmented Generation using sustainability reports for evidence extraction.
- **Truth Score Engine**: A weighted algorithmic scoring system to quantify corporate "green" claims.
- **Persistent Audit Trail**: Secure local database of audit results to maintain history across sessions.
- **Immutable Traceability**: Every audit result is hashed and stored in a simulated blockchain ledger for zero-trust verification.
- **Premium Dashboard**: A state-of-the-art UI for visualizing supply chain transparency and ESG health.

## 🛠️ Tech Stack
- **Backend**: FastAPI (Python)
- **AI Orchestration**: LangGraph + Gemini (Google AI)
- **Vector DB**: ChromaDB (RAG)
- **Blockchain**: SHA-256 Hash-chain Ledger
- **Frontend**: Next.js + Tailwind (Glassmorphism design)

## 📁 Project Structure
- `api/`: REST endpoints and server logic.
- `agents/`: LangGraph definitions for verification workflows.
- `core/`: Scoring algorithms and blockchain ledger logic.
- `data/`: Document processing and vector storage.
- `ui/`: Frontend application.
