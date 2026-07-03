# Sentinel AI: Autonomous Due Diligence Agent

**"Don't invest first. Investigate first."**

[![Casper AI Toolkit](https://img.shields.io/badge/Casper%20AI%20Toolkit-Powered-red?style=for-the-badge)](https://www.casper.network/ai#toolkit)
[![x402 Protocol](https://img.shields.io/badge/x402-Micropayments-blue?style=for-the-badge)](https://docs.cspr.cloud/x402-facilitator-api/reference)
[![MCP Native](https://img.shields.io/badge/MCP-Native-green?style=for-the-badge)](https://docs.cspr.cloud/agentic-tools/mcp-server)

Sentinel AI is an autonomous, agentic system built for the **Casper Agentic Buildathon**. It protects investors in the DeFi and RWA (Real World Assets) space by performing autonomous due diligence on projects before capital is deployed.

## 🧰 Casper AI Toolkit Integration

This project is built on the full **[Casper AI Toolkit](https://www.casper.network/ai#toolkit)** — the complete developer infrastructure for autonomous AI agents on Casper:

| Component | Type | Purpose |
|---|---|---|
| [x402 Facilitator](https://docs.cspr.cloud/x402-facilitator-api/reference) | Micropayments | Autonomous pay-per-request for premium data |
| [Casper x402 Examples](https://github.com/make-software/casper-x402) | Reference | JS/Go implementation of x402 on Casper |
| [Casper MCP Server](https://docs.cspr.cloud/agentic-tools/mcp-server) | MCP / Blockchain | On-chain queries via Model Context Protocol |
| [CSPR.trade MCP](https://mcp.cspr.trade/) | MCP / DEX | Token prices, swap quotes, liquidity analysis |
| [CSPR.click Agent Skill](https://docs.cspr.click/documentation/ai-agent-skills) | Skill / Integration | Wallet connection & transaction signing |
| [CSPR.cloud Agent Skill](https://cspr.cloud/skill.md) | Middleware / APIs | REST, Streaming, and Node APIs |
| [Odra Framework](https://odra.dev/llms.txt) | Smart Contracts | Contract development with AI-discoverability |
| [casper-eip-712](https://github.com/casper-ecosystem/casper-eip-712) | Signing / Typed Data | EIP-712 signatures for x402 payments |

## The Problem
When a user wants to invest in a new DeFi protocol or tokenized real-world asset, they need to verify audits, team backgrounds, liquidity, and physical assets. This takes hours. Sentinel AI automates this completely.

## The Solution
1. **Gather Free Data**: The agent queries on-chain data via **Casper MCP Server** and market data via **CSPR.trade MCP**.
2. **AI Analysis**: **Google Gemini** analyzes the collected data and evaluates confidence.
3. **Purchase Intelligence via x402**: If confidence is low, the agent autonomously pays for premium intelligence using the **x402 Facilitator** — signed with **casper-eip-712** typed-data.
4. **Final Decision**: Synthesizes all gathered intelligence and delivers a comprehensive due diligence report.

---

## 🛠️ Comprehensive Installation & Setup Guide

### Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Casper Wallet](https://www.casperwallet.io/) browser extension

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sentinel-ai.git
cd sentinel-ai
```

### 2. Smart Contracts (Odra Framework) Setup
We use the Odra framework to compile the Casper smart contracts.
```bash
cd contracts
# Install the Odra cargo tool
cargo install cargo-odra

# Build the smart contracts
cargo build

# (Optional) Run tests
cargo test
```

### 3. Backend (Agent Orchestrator) Setup
The backend runs the Gemini-powered AI agent with MCP tool integration.
```bash
cd backend

# Install dependencies
npm install

# Compile TypeScript
npm run build

# Start the Agent Server
npm start
# Server runs on http://localhost:3001
```

### 4. Frontend (Next.js & cspr.click) Setup
The frontend provides the sleek user interface and real-time "Thinking Log".
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
# App runs on http://localhost:3000
```

---

## 🚀 Usage Guide

1. Open your browser and navigate to `http://localhost:3000`.
2. Click the **[Connect cspr.click]** button to authenticate with your Casper Wallet.
3. In the "Target Specification" panel, enter a project URL (e.g., `https://rwa-finance.xyz`).
4. Select the project type (`DeFi Protocol` or `Real World Asset`).
5. Click **INITIATE DUE DILIGENCE**.
6. Watch the **Live Agent Log** as the AI autonomously evaluates the project, decides it needs more info, and makes a Casper x402 payment to purchase premium intelligence.
7. Once finished, view the **Final Score** and the immutable on-chain record in the Investigation Report panel.

## ⚙️ Configuration

Before running the project, you must set up environment variables:

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your CSPR.cloud API key and Google Gemini API key

# Frontend
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your cspr.click App ID
```

> ⚠️ **Never commit `.env` files or private keys.** The `.gitignore` is pre-configured to exclude these.

For the complete setup guide with all API keys and integrations, see **[docs/testnet_deployment_guide.md](docs/testnet_deployment_guide.md)**.

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                    │
│              CSPR.click SDK · Wallet Connect              │
└──────────────────────┬───────────────────────────────────┘
                       │ POST /api/investigate
┌──────────────────────▼───────────────────────────────────┐
│                Backend (Express + TypeScript)              │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           Gemini AI (ReAct Agent Loop)              │  │
│  │   Observe → Think → Act → Report                   │  │
│  └────────┬──────────┬─────────────┬──────────────────┘  │
│           │          │             │                      │
│  ┌────────▼──┐ ┌─────▼─────┐ ┌────▼──────┐              │
│  │ Casper    │ │ CSPR.trade│ │ x402      │              │
│  │ MCP      │ │ MCP       │ │ Facilitator│              │
│  │ Server   │ │ Server    │ │           │              │
│  └────┬─────┘ └────┬──────┘ └────┬──────┘              │
│       │             │             │                      │
└───────┼─────────────┼─────────────┼──────────────────────┘
        │             │             │
   ┌────▼─────────────▼─────────────▼────┐
   │        Casper Network (Testnet)      │
   │   Accounts · Deploys · DEX · Tokens  │
   └──────────────────────────────────────┘
```

## 🧪 Test Coverage

### Smart Contracts (Unit Tests)
```bash
cd contracts
cargo test
```

### Backend (Integration & API Tests)
```bash
cd backend
npm run test
```

### Frontend (Component & E2E Tests)
```bash
cd frontend
npm run test
```

## 📚 Documentation
- [Testnet Deployment Guide](docs/testnet_deployment_guide.md)
- [LLM Integration Guide](docs/llm_integration_guide.md)
- [Vercel Deployment Guide](docs/vercel_deployment_guide.md)
