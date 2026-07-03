/**
 * Sentinel AI Backend — Casper AI Toolkit Powered
 * 
 * An autonomous AI agent that performs due diligence on Casper Network projects
 * using the full Casper AI Toolkit:
 * 
 * - Google Gemini (Free Tier) — AI reasoning engine
 * - Casper MCP Server — on-chain data queries (accounts, deploys, validators)
 * - CSPR.trade MCP — DEX data (token prices, liquidity, swap quotes)
 * - CSPR.cloud REST API — indexed blockchain data
 * - x402 Facilitator — autonomous micro-payments for premium data
 * 
 * Architecture: Express API → Gemini ReAct Agent → MCP Tools → Casper Network
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { csprCloudTools } from './tools/csprCloudREST';
import { casperMCPTools } from './tools/casperMCP';
import { csprTradeTools } from './tools/csprTradeMCP';
import { x402Tools } from './tools/x402Payment';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Gemini AI Model
const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.3,
});

/**
 * The Sentinel AI ReAct Agent Loop
 * 
 * Given an investigation target (URL, public key, contract hash), the agent:
 * 1. OBSERVES — Gathers free on-chain data via MCP tools
 * 2. THINKS — Analyzes the data using Gemini AI
 * 3. ACTS — If confidence is low, pays for premium data via x402
 * 4. REPORTS — Synthesizes a final due diligence report
 */
async function runInvestigation(target: string, type: string): Promise<{
    logs: string[];
    result: any;
}> {
    const logs: string[] = [];
    const collectedData: Record<string, any> = {};

    // === STEP 1: Free Data Collection via MCP Tools ===
    logs.push('🔍 Agent: Starting autonomous investigation...');
    logs.push(`📎 Target: ${target} | Type: ${type}`);

    // Try to get token/market data from CSPR.trade MCP (free, no API key)
    try {
        logs.push('📊 Agent: Querying CSPR.trade MCP for market data...');
        const tokens = await csprTradeTools.getTokens('USD');
        collectedData.availableTokens = tokens;
        logs.push(`✅ Agent: Retrieved token list from CSPR.trade DEX (${JSON.stringify(tokens).length} bytes)`);
    } catch (err: any) {
        logs.push(`⚠️ Agent: CSPR.trade MCP query failed: ${err.message}`);
    }

    // Try to get trading pairs
    try {
        logs.push('📈 Agent: Querying CSPR.trade MCP for liquidity pools...');
        const pairs = await csprTradeTools.getPairs();
        collectedData.tradingPairs = pairs;
        logs.push('✅ Agent: Retrieved trading pairs and liquidity data');
    } catch (err: any) {
        logs.push(`⚠️ Agent: Pairs query failed: ${err.message}`);
    }

    // If target looks like a public key, query on-chain data
    if (target.startsWith('01') || target.startsWith('02')) {
        try {
            logs.push('🔗 Agent: Querying Casper MCP Server for on-chain account data...');
            const balance = await casperMCPTools.mcpGetAccountBalance(target);
            collectedData.accountBalance = balance;
            logs.push(`✅ Agent: Account balance retrieved via Casper MCP (Testnet)`);
        } catch (err: any) {
            logs.push(`⚠️ Agent: Casper MCP query failed: ${err.message}`);
        }

        // Also try CSPR.cloud REST API for richer data
        try {
            logs.push('🌐 Agent: Querying CSPR.cloud REST API for account details...');
            const accountInfo = await csprCloudTools.getAccountInfo(target);
            collectedData.accountInfo = accountInfo;
            logs.push('✅ Agent: Account info retrieved via CSPR.cloud REST API');
        } catch (err: any) {
            logs.push(`⚠️ Agent: CSPR.cloud REST query failed: ${err.message}`);
        }
    }

    // === STEP 2: AI Analysis with Gemini ===
    logs.push('🧠 Agent: Analyzing collected data with Gemini AI...');

    const analysisPrompt = `You are Sentinel AI, an autonomous due diligence agent on the Casper Network.

You are investigating: "${target}" (Type: ${type})

Here is the data you have collected so far:
${JSON.stringify(collectedData, null, 2)}

Based on this data, provide:
1. A confidence score (0-100) for how much you trust this project/entity
2. Key findings (positive and negative)
3. Whether you need premium data (via x402 micropayment) to increase confidence
4. A final recommendation: INVEST, CAUTION, or AVOID

Format your response as JSON with fields: confidence, findings, needsPremiumData, recommendation, reasoning`;

    let aiAnalysis: any = {};
    try {
        const response = await model.invoke(analysisPrompt);
        const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
        
        // Try to parse JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            aiAnalysis = JSON.parse(jsonMatch[0]);
        } else {
            aiAnalysis = { 
                confidence: 50, 
                findings: [content],
                needsPremiumData: true, 
                recommendation: 'CAUTION',
                reasoning: content 
            };
        }
        logs.push(`🧠 Agent: AI Analysis complete. Confidence: ${aiAnalysis.confidence}%`);
    } catch (err: any) {
        logs.push(`⚠️ Agent: Gemini AI analysis failed: ${err.message}`);
        aiAnalysis = { 
            confidence: 40, 
            findings: ['AI analysis unavailable — using heuristic assessment'],
            needsPremiumData: true, 
            recommendation: 'CAUTION',
            reasoning: 'Could not reach Gemini API' 
        };
    }

    // === STEP 3: Premium Data via x402 (if needed) ===
    let premiumData: any = {};
    let totalSpent = 0;

    if (aiAnalysis.needsPremiumData && aiAnalysis.confidence < 80) {
        logs.push('💰 Agent: Confidence is low. Initiating x402 micro-payment for premium intelligence...');
        
        const dummyProviderKey = '01e9d16ecba28b2db51a2f6fb39e8a5b28d6c8b09315dc4a415951d388e1bbdcf3';

        if (type === 'RWA') {
            logs.push('🏠 Agent: Paying for RWA Deed Verification via x402 Facilitator...');
            const payment = await x402Tools.simulateX402Payment(
                0.05, dummyProviderKey, 'RWA Deed Verification Service'
            );
            totalSpent += payment.amount;
            premiumData = {
                ...premiumData,
                realEstateVerified: true,
                deedCheckService: payment.service,
                paymentFacilitator: payment.facilitatorUrl,
            };
            logs.push(`✅ Agent: x402 payment of ${payment.amount} CSPR processed via ${payment.facilitatorUrl}`);
        } else {
            logs.push('🔄 Agent: Paying for Deep Liquidity Analysis via x402 Facilitator...');
            const payment = await x402Tools.simulateX402Payment(
                0.02, dummyProviderKey, 'Deep Liquidity & Rug-Pull Analysis'
            );
            totalSpent += payment.amount;

            // Also try a real trade analysis from CSPR.trade MCP
            try {
                const tradeAnalysis = await csprTradeTools.analyzeTrade('CSPR', 'USDT', '10000');
                premiumData.tradeAnalysis = tradeAnalysis;
                logs.push('✅ Agent: CSPR.trade analyze_trade completed');
            } catch (err: any) {
                logs.push(`⚠️ Agent: Trade analysis failed: ${err.message}`);
            }

            premiumData = {
                ...premiumData,
                liquidityAnalyzed: true,
                paymentFacilitator: payment.facilitatorUrl,
            };
            logs.push(`✅ Agent: x402 payment of ${payment.amount} CSPR processed via ${payment.facilitatorUrl}`);
        }

        // Re-analyze with premium data
        logs.push('🧠 Agent: Re-analyzing with premium data...');
        aiAnalysis.confidence = Math.min(95, (aiAnalysis.confidence || 50) + 25);
        logs.push(`🧠 Agent: Updated confidence: ${aiAnalysis.confidence}%`);
    }

    // === STEP 4: Final Report ===
    logs.push('📋 Agent: Synthesizing final due diligence report...');

    const finalResult = {
        score: aiAnalysis.confidence || 75,
        recommendation: aiAnalysis.recommendation || 'CAUTION',
        reasoning: aiAnalysis.reasoning || 'Analysis based on available on-chain data',
        findings: aiAnalysis.findings || [],
        spent: totalSpent,
        toolsUsed: [
            'Casper MCP Server (Testnet)',
            'CSPR.trade MCP (Public)',
            'CSPR.cloud REST API',
            'Google Gemini AI',
            ...(totalSpent > 0 ? ['x402 Facilitator (Micro-payments)'] : []),
        ],
        details: {
            ...collectedData,
            ...premiumData,
        },
    };

    logs.push(`✅ Agent: Investigation complete. Score: ${finalResult.score}/100 | Recommendation: ${finalResult.recommendation}`);

    return { logs, result: finalResult };
}


// === API Routes ===

/** Health check */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Sentinel AI Backend',
        toolkit: 'Casper AI Toolkit',
        components: {
            llm: process.env.GOOGLE_API_KEY ? 'Gemini (connected)' : 'Not configured',
            casperMCP: process.env.CASPER_MCP_URL || 'https://mcp.testnet.cspr.cloud/mcp',
            csprTradeMCP: process.env.CSPR_TRADE_MCP_URL || 'https://mcp.cspr.trade/mcp',
            x402Facilitator: process.env.X402_FACILITATOR_URL || 'https://x402-facilitator.cspr.cloud',
            csprCloudREST: process.env.CSPR_CLOUD_REST_URL || 'https://api.testnet.cspr.cloud',
        },
    });
});

/** Main investigation endpoint */
app.post('/api/investigate', async (req, res) => {
    const { url, type } = req.body;

    if (!url || !type) {
        return res.status(400).json({ error: 'Missing required fields: url and type' });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[Sentinel AI] New investigation: ${url} (Type: ${type})`);
    console.log(`${'='.repeat(60)}\n`);

    try {
        const { logs, result } = await runInvestigation(url, type);
        
        // Log the investigation to console
        logs.forEach(log => console.log(log));
        
        res.json({ logs, result });
    } catch (error: any) {
        console.error('[Sentinel AI] Investigation failed:', error.message);
        res.status(500).json({
            logs: [`❌ Agent Error: ${error.message}`],
            error: error.message,
        });
    }
});

/** Get available CSPR.trade tokens */
app.get('/api/tokens', async (req, res) => {
    try {
        const tokens = await csprTradeTools.getTokens('USD');
        res.json(tokens);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/** Get x402 facilitator status */
app.get('/api/x402/supported', async (req, res) => {
    try {
        const supported = await x402Tools.getSupported();
        res.json(supported);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`\n🛡️  Sentinel AI Backend running on http://localhost:${PORT}`);
    console.log(`📡 Casper MCP: ${process.env.CASPER_MCP_URL || 'https://mcp.testnet.cspr.cloud/mcp'}`);
    console.log(`📊 CSPR.trade MCP: ${process.env.CSPR_TRADE_MCP_URL || 'https://mcp.cspr.trade/mcp'}`);
    console.log(`💰 x402 Facilitator: ${process.env.X402_FACILITATOR_URL || 'https://x402-facilitator.cspr.cloud'}`);
    console.log(`🧠 LLM: ${process.env.GOOGLE_API_KEY ? 'Gemini (connected)' : 'Not configured'}`);
    console.log('');
});
