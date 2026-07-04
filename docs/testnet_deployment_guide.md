# Sentinel AI - Testnet Deployment & Integration Guide

This project is built on top of the [Casper AI Toolkit](https://www.casper.network/ai#toolkit). For the project to be fully functional, it requires API keys, wallets, and connections to the Casper Network's AI infrastructure. This guide explains step-by-step what you need.

## 🟢 Step 1: Casper Wallet and Testnet Balance (For Users)
Users need a wallet to log in to the system.
1. Install the **Casper Wallet** extension in your browser.
2. Create a new account and select **Casper Testnet** as the network.
3. Go to the [Casper Testnet Faucet](https://testnet.cspr.live/tools/faucet).
4. Paste your wallet's Public Key and click "Request Tokens" to get free test CSPR coins.

## 🟢 Step 2: CSPR.cloud API Key (Core Requirement)
CSPR.cloud is the central middleware for the Casper AI Toolkit. A single API key powers:
- **REST API** — indexed on-chain data (accounts, deploys, tokens, validators)
- **Casper MCP Server** — AI agent on-chain queries via Model Context Protocol
- **x402 Facilitator** — autonomous micro-payment verification and settlement
- **Streaming API** — real-time SSE feeds for monitoring

1. Go to [cspr.cloud](https://cspr.cloud) and create a Developer account.
2. Click the **"Create New Project"** button on the dashboard.
3. Name the project `Sentinel AI Testnet`.
4. Copy the generated **API Key**.
5. Open the `backend/.env` file in your project and update:
   ```env
   CSPR_CLOUD_API_KEY=your_cspr_cloud_api_key_here
   ```

This single key is used across all CSPR.cloud services. No separate x402 or MCP keys are needed.

## 🟢 Step 2.5: CSPR.trade MCP (For Market and DEX Data)
Required for the agent to read token prices, get swap quotes, and analyze trades on the Casper DEX.
- **Public endpoint** — no API key required.
- **22 public tools** available (get_tokens, get_quote, analyze_trade, get_pair_price_history, etc.)
- Your `backend/.env` already has the correct URL:
  ```env
  CSPR_TRADE_MCP_URL=https://mcp.cspr.trade/mcp
  ```
- Full tool reference: [mcp.cspr.trade/SKILL.md](https://mcp.cspr.trade/SKILL.md)

## 🟢 Step 3: CSPR.click App ID (For User Login)
This is required to manage the wallet connection popup (UI) for users.
1. Go to [cspr.click](https://cspr.click).
2. Log in to the developer portal and register your application.
3. Copy the provided **App ID**.
4. Create (or open) the `frontend/.env.local` file in your project and add:
   ```env
   NEXT_PUBLIC_CSPR_CLICK_APP_ID=your_app_id_here
   NEXT_PUBLIC_CSPR_CLICK_APP_NAME="Sentinel AI"
   NEXT_PUBLIC_CASPER_CHAIN_NAME="casper-test"
   ```

## 🟢 Step 4: Creating the Agent Wallet
Since the AI Agent will make its own payments (x402) autonomously, it needs its own wallet (Private Key) running in the background.
1. Open your terminal and navigate to the `backend` folder of your project.
2. Generate a key pair for the agent:
   ```bash
   mkdir -p keys
   casper-client keygen keys/
   ```
3. This will create `secret_key.pem` and `public_key_hex` files inside the `keys/` folder.
4. Copy the text inside `public_key_hex`, go back to the [Casper Faucet](https://testnet.cspr.live/tools/faucet), and send free test CSPR to this wallet as well (the agent needs funds to make payments).
5. Add the following path to your `backend/.env` file:
   ```env
   AGENT_SECRET_KEY_PATH=./keys/secret_key.pem
   ```

## 🟢 Step 5: x402 Facilitator (Autonomous Payments)
The x402 protocol enables AI agents to pay for premium API data using HTTP 402 payment flows. Sentinel AI uses the **CSPR.cloud x402 Facilitator** — no separate API key is needed.

**How it works:**
1. Agent requests a paid API endpoint.
2. Server responds with `402 Payment Required` + payment requirements.
3. Agent signs a `PaymentPayload` (EIP-712 typed-data) with its wallet.
4. Server forwards the signed payload to the facilitator for verification and on-chain settlement.
5. Server returns the premium data.

**Configuration** (already set in your `.env`):
```env
X402_FACILITATOR_URL=https://x402-facilitator.cspr.cloud
```

The facilitator authenticates using your `CSPR_CLOUD_API_KEY` via the `Authorization` header. The signing uses [casper-eip-712](https://github.com/casper-ecosystem/casper-eip-712) typed-data signatures with CEP-18 tokens.

**References:**
- [x402 Facilitator API Docs](https://docs.cspr.cloud/x402-facilitator-api/reference)
- [Casper x402 Examples (JS/Go)](https://github.com/make-software/casper-x402)

## 🟢 Step 6: Deploying Smart Contracts to Testnet

The contracts are deployed using a native Rust deploy binary powered by `odra-casper-livenet-env`.

1. Navigate to the `contracts` folder.
2. Configure the livenet environment file:
   ```bash
   # contracts/casper_livenet.env (already committed)
   ODRA_CASPER_LIVENET_NODE_ADDRESS=https://node.testnet.casper.network/rpc
   ODRA_CASPER_LIVENET_EVENTS_URL=https://node.testnet.casper.network/events
   ODRA_CASPER_LIVENET_SECRET_KEY_PATH=../backend/keys/secret_key.pem
   ODRA_CASPER_LIVENET_CHAIN_NAME=casper-test
   ```
3. Build the WASM artifacts first:
   ```bash
   cd contracts

   ODRA_MODULE=Marketplace cargo build --release \
     --target wasm32-unknown-unknown \
     --bin sentinel_contracts_build_contract
   cp target/wasm32-unknown-unknown/release/sentinel_contracts_build_contract.wasm wasm/Marketplace.wasm

   ODRA_MODULE=InvestigationRegistry cargo build --release \
     --target wasm32-unknown-unknown \
     --bin sentinel_contracts_build_contract
   cp target/wasm32-unknown-unknown/release/sentinel_contracts_build_contract.wasm wasm/InvestigationRegistry.wasm
   ```
4. Deploy both contracts (upgradeable) to Testnet:
   ```bash
   cargo run --bin deploy
   ```
5. The terminal will output the deployed package hashes, for example:
   ```
   💁  INFO : Contract "contract-package-e3ec7d5..." deployed.
   Marketplace deployed at: Contract(ContractPackageHash(e3ec7d5...))
   ```
6. Update your `backend/.env` with these hashes:
   ```env
   MARKETPLACE_CONTRACT_HASH=hash-<marketplace-package-hash>
   REGISTRY_CONTRACT_HASH=hash-<registry-package-hash>
   ```

> ✅ The contracts are already deployed for this project. See the [README](../README.md#-live-deployed-contracts-casper-testnet) for the live package hashes.

## 🟢 Step 7: AI Agent (LLM) Selection
You need to define the AI model that will act as the brain of the system. Check out the [LLM Integration Guide](llm_integration_guide.md) to set up OpenAI, Gemini, Groq, or Ollama.

## 🚀 Final Step: Starting the Project
If all keys and hashes have been added to your `.env` files, the project is now ready to run live on the testnet!

**Start the Backend:**
```bash
cd backend
npm install
npm run build
npm start             # → http://localhost:3001
```

**Start the Frontend:**
```bash
cd frontend
npm install
npm run dev           # → http://localhost:3000
```

Go to `http://localhost:3000` in your browser. You can now connect your wallet, send requests to the agent, and watch the agent make payments through the x402 facilitator using its own balance on the testnet!

---

## 📚 Casper AI Toolkit References
This project integrates the following components from the [Casper AI Toolkit](https://www.casper.network/ai#toolkit):

| Component | Type | URL |
|---|---|---|
| x402 Facilitator | Micropayments | [docs.cspr.cloud/x402-facilitator-api](https://docs.cspr.cloud/x402-facilitator-api/reference) |
| Casper x402 Examples | Reference | [github.com/make-software/casper-x402](https://github.com/make-software/casper-x402) |
| Casper MCP Server | MCP / Blockchain | [mcp.testnet.cspr.cloud/mcp](https://mcp.testnet.cspr.cloud/mcp) |
| CSPR.trade MCP | MCP / DEX | [mcp.cspr.trade/mcp](https://mcp.cspr.trade/mcp) |
| CSPR.click Agent Skill | Skill / Integration | [docs.cspr.click/documentation/ai-agent-skills](https://docs.cspr.click/documentation/ai-agent-skills) |
| CSPR.cloud Agent Skill | Middleware / APIs | [cspr.cloud/skill.md](https://cspr.cloud/skill.md) |
| Odra Framework | Smart Contracts | [odra.dev/llms.txt](https://odra.dev/llms.txt) |
| casper-eip-712 | Signing / Typed Data | [github.com/casper-ecosystem/casper-eip-712](https://github.com/casper-ecosystem/casper-eip-712) |
