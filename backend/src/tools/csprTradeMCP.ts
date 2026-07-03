/**
 * CSPR.trade MCP Tool
 * Connects to the public CSPR.trade MCP server for DEX operations.
 * No API key required — 22 public tools available.
 * 
 * Key tools: get_tokens, get_quote, analyze_trade, get_pair_price_history,
 * get_token_balance, get_portfolio_value, get_swap_history, etc.
 */

const CSPR_TRADE_MCP_URL = process.env.CSPR_TRADE_MCP_URL || 'https://mcp.cspr.trade/mcp';

/**
 * Call a tool on the CSPR.trade MCP Server via Streamable HTTP.
 */
export async function callTradeMCPTool(toolName: string, args: Record<string, any>): Promise<any> {
    const requestBody = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
            name: toolName,
            arguments: args,
        },
    };

    const res = await fetch(CSPR_TRADE_MCP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
        throw new Error(`CSPR.trade MCP error ${res.status}: ${await res.text()}`);
    }

    return res.json();
}

/** Get all available tokens on CSPR.trade with optional fiat pricing */
export async function getTokens(currency = 'USD'): Promise<any> {
    return callTradeMCPTool('get_tokens', { currency });
}

/** Get a swap quote */
export async function getQuote(tokenIn: string, tokenOut: string, amount: string, type = 'exact_in'): Promise<any> {
    return callTradeMCPTool('get_quote', { token_in: tokenIn, token_out: tokenOut, amount, type });
}

/** Analyze a trade for safety (price impact, slippage, recommendation) */
export async function analyzeTrade(tokenIn: string, tokenOut: string, amount: string): Promise<any> {
    return callTradeMCPTool('analyze_trade', { token_in: tokenIn, token_out: tokenOut, amount });
}

/** Get trading pairs with reserves and stats */
export async function getPairs(): Promise<any> {
    return callTradeMCPTool('get_pairs', {});
}

/** Get OHLCV price history for a token */
export async function getTokenPriceHistory(token: string, interval = '1d', limit = 7): Promise<any> {
    return callTradeMCPTool('get_token_price_history', { token, interval, limit });
}

/** Get token balance for an account (CEP-18 tokens, not native CSPR) */
export async function getTokenBalance(publicKey: string, token?: string): Promise<any> {
    const args: any = { account_public_key: publicKey };
    if (token) args.token = token;
    return callTradeMCPTool('get_token_balance', args);
}

/** Get portfolio value across LP positions */
export async function getPortfolioValue(publicKey: string, currency = 'USD'): Promise<any> {
    return callTradeMCPTool('get_portfolio_value', { account_public_key: publicKey, currency });
}

/** Get swap history for an account */
export async function getSwapHistory(publicKey: string, page = 1, pageSize = 20): Promise<any> {
    return callTradeMCPTool('get_swap_history', { public_key: publicKey, page, page_size: pageSize });
}

export const csprTradeTools = {
    callTradeMCPTool,
    getTokens,
    getQuote,
    analyzeTrade,
    getPairs,
    getTokenPriceHistory,
    getTokenBalance,
    getPortfolioValue,
    getSwapHistory,
};
