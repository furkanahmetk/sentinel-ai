# 🛡️ Sentinel AI: Autonomous Due Diligence Agent

> **"Don't invest first. Investigate first."**

[![Casper AI Toolkit](https://img.shields.io/badge/Casper%20AI%20Toolkit-Powered-red?style=for-the-badge)](https://www.casper.network/ai#toolkit)
[![x402 Protocol](https://img.shields.io/badge/x402-Micropayments-blue?style=for-the-badge)](https://docs.cspr.cloud/x402-facilitator-api/reference)
[![MCP Native](https://img.shields.io/badge/MCP-Native-green?style=for-the-badge)](https://docs.cspr.cloud/agentic-tools/mcp-server)
[![Odra Framework](https://img.shields.io/badge/Odra-Smart%20Contracts-orange?style=for-the-badge)](https://odra.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

Sentinel AI is an **autonomous, agentic due diligence system** built for the **Casper Agentic Buildathon**. It protects DeFi and RWA (Real World Assets) investors by autonomously researching projects before capital is deployed — no human oversight required.

---

## 📋 Table of Contents

- [How It Works](#-how-it-works)
- [Casper AI Toolkit Integration](#-casper-ai-toolkit-integration)
- [Live Deployed Contracts](#-live-deployed-contracts-casper-testnet)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

---

## 🤖 How It Works

When you submit a target (Casper public key, contract hash, or project URL), the agent runs a **ReAct loop**:

```
OBSERVE → THINK → ACT → REPORT
```

1. **OBSERVE** — Collects free on-chain data via Casper MCP Server and market data via CSPR.trade MCP
2. **THINK** — Google Gemini AI analyzes the data and calculates a confidence score (0–100)
3. **ACT** — If confidence is below 80%, the agent **autonomously pays** for premium intelligence using the x402 Facilitator (no human intervention)
4. **REPORT** — Synthesizes all data into a final due diligence report with score and recommendation

---

## 🧰 Casper AI Toolkit Integration

Built on the full **[Casper AI Toolkit](https://www.casper.network/ai#toolkit)**:

| Component | Type | Purpose |
|-----------|------|---------|
| [x402 Facilitator](https://docs.cspr.cloud/x402-facilitator-api/reference) | Micropayments | Autonomous pay-per-request for premium data |
| [Casper MCP Server](https://docs.cspr.cloud/agentic-tools/mcp-server) | MCP / Blockchain | On-chain queries via Model Context Protocol |
| [CSPR.trade MCP](https://mcp.cspr.trade/) | MCP / DEX | Token prices, swap quotes, liquidity analysis |
| [CSPR.click Agent Skill](https://docs.cspr.click/documentation/ai-agent-skills) | Wallet | Wallet connection & transaction signing |
| [CSPR.cloud REST API](https://cspr.cloud/skill.md) | Middleware | Indexed blockchain data, accounts, deploys |
| [Odra Framework](https://odra.dev/llms.txt) | Smart Contracts | Upgradeable on-chain contracts (Rust/WASM) |
| [casper-eip-712](https://github.com/casper-ecosystem/casper-eip-712) | Signing | EIP-712 typed-data signatures for x402 |

---

## ⛓️ Live Deployed Contracts (Casper Testnet)

Both contracts are deployed as **upgradeable** via Odra Framework 2.8.x — new versions can be published under the same package hash without changing the contract address.

| Contract | Package Hash |
|----------|-------------|
| **Marketplace** | `hash-e3ec7d595fb6ce93e74cefb97e7996ad517311104693f0d4a85401adedf318fd` |
| **InvestigationRegistry** | `hash-dbe7911c5d1885d8663973753bd3d427b4e3c57f41d47b195075d2224843c918` |

🔗 [Marketplace TX on cspr.live](https://testnet.cspr.live/transaction/c4fe0bcd30c90a9b59071cb6237fa486c8d65cb443fecf53cb1ed3f31251f24b)  
🔗 [InvestigationRegistry TX on cspr.live](https://testnet.cspr.live/transaction/a0dd9749c12fb4856116111e224ebd79bfd04d82b6a17d1b4cbe5788f233210f)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/en/) v18+
- [Rust](https://www.rust-lang.org/tools/install) (stable) with `wasm32-unknown-unknown` target
- [Casper Wallet](https://www.casperwallet.io/) browser extension

### 1. Clone
```bash
git clone https://github.com/your-username/sentinel-ai.git
cd sentinel-ai
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env      # Fill in your API keys — see Configuration below
npm run build
npm start                  # → http://localhost:3001
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                # → http://localhost:3000
```

### 4. Run Your First Investigation
```bash
# Via API
curl -X POST http://localhost:3001/api/investigate \
  -H "Content-Type: application/json" \
  -d '{"url": "<casper-public-key-or-contract-hash>", "type": "DeFi"}'

# Or open http://localhost:3000 and use the UI
```

### ⚙️ Configuration

> ⚠️ **Never commit `.env` files or private keys.** `.gitignore` is pre-configured to exclude these.

**Backend (`backend/.env`):**
```env
GOOGLE_API_KEY=your_gemini_api_key
CSPR_CLOUD_API_KEY=your_cspr_cloud_api_key
CASPER_MCP_URL=https://mcp.testnet.cspr.cloud/mcp
CSPR_TRADE_MCP_URL=https://mcp.cspr.trade/mcp
X402_FACILITATOR_URL=https://x402-facilitator.cspr.cloud
CASPER_NODE_URL=https://node.testnet.casper.network/rpc
CASPER_CHAIN_NAME=casper-test
MARKETPLACE_CONTRACT_HASH=hash-e3ec7d595fb6ce93e74cefb97e7996ad517311104693f0d4a85401adedf318fd
REGISTRY_CONTRACT_HASH=hash-dbe7911c5d1885d8663973753bd3d427b4e3c57f41d47b195075d2224843c918
AGENT_SECRET_KEY_PATH=./keys/secret_key.pem
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_CSPR_CLICK_APP_ID=your_app_id
NEXT_PUBLIC_CSPR_CLICK_APP_NAME="Sentinel AI"
NEXT_PUBLIC_CASPER_CHAIN_NAME="casper-test"
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

For a full walkthrough of every API key and integration, see the **[Testnet Deployment Guide](docs/testnet_deployment_guide.md)**.

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                      │
│          CSPR.click SDK · Casper Wallet Connect            │
└──────────────────────┬────────────────────────────────────┘
                       │ POST /api/investigate
┌──────────────────────▼────────────────────────────────────┐
│               Backend (Express + TypeScript)               │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Gemini AI  —  ReAct Agent Loop              │  │
│  │        Observe → Think → Act → Report                │  │
│  └───────┬─────────────┬──────────────┬─────────────────┘  │
│          │             │              │                     │
│  ┌───────▼──┐  ┌───────▼──┐  ┌───────▼──────┐             │
│  │ Casper   │  │CSPR.trade│  │ x402         │             │
│  │ MCP      │  │ MCP      │  │ Facilitator  │             │
│  └───────┬──┘  └───────┬──┘  └───────┬──────┘             │
│          │             │              │                     │
└──────────┼─────────────┼──────────────┼─────────────────────┘
           │             │              │
    ┌──────▼─────────────▼──────────────▼──────┐
    │          Casper Network (Testnet)          │
    │  Accounts · Deploys · DEX · Smart Contracts│
    └──────────────────────────────────────────-─┘
```

For detailed component design, data flow diagrams, and module descriptions, see **[docs/architecture.md](docs/architecture.md)**.

---

## 🧪 Testing

```bash
# Smart contract unit tests
cd contracts && cargo test

# Backend integration & API tests
cd backend && npm test

# Frontend component tests
cd frontend && npm test
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [**Usage Guide**](docs/usage_guide.md) | Full API reference, environment variables, examples |
| [**Live Demo Walkthrough**](docs/demo_walkthrough.md) | Real end-to-end investigation on Casper Testnet |
| [**Architecture**](docs/architecture.md) | Component design, data flow, module descriptions |
| [**Testnet Deployment Guide**](docs/testnet_deployment_guide.md) | How to get API keys, fund the agent, deploy contracts |
| [**LLM Integration Guide**](docs/llm_integration_guide.md) | Gemini, Groq, OpenAI, Ollama setup |
| [**Vercel Deployment Guide**](docs/vercel_deployment_guide.md) | Production deployment to Vercel |

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Open a Pull Request

For bug reports and feature requests, please open a [GitHub Issue](https://github.com/your-username/sentinel-ai/issues).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Built with ❤️ for the [Casper Agentic Buildathon 2026](https://dorahacks.io/hackathon/casper-agentic-buildathon).
