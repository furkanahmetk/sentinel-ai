/**
 * Casper MCP Server Tool
 * Connects to the hosted CSPR.cloud MCP server (Testnet) for AI-native on-chain queries.
 * Uses Streamable HTTP transport with X-CSPR-Cloud-Api-Key header for authentication.
 * 
 * Available tools include: GetAccountBalance, GetBlock, GetDeploy, GetValidator,
 * GetContract, GetTransfers, GetTokens, GetNFTs, and more.
 */

const CASPER_MCP_URL = process.env.CASPER_MCP_URL || 'https://mcp.testnet.cspr.cloud/mcp';
const CSPR_CLOUD_API_KEY = process.env.CSPR_CLOUD_API_KEY || '';

/**
 * Call a tool on the Casper MCP Server via Streamable HTTP.
 * This sends a JSON-RPC style request to the MCP endpoint.
 */
export async function callCasperMCPTool(toolName: string, args: Record<string, any>): Promise<any> {
    const requestBody = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
            name: toolName,
            arguments: args,
        },
    };

    const res = await fetch(CASPER_MCP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSPR-Cloud-Api-Key': CSPR_CLOUD_API_KEY,
        },
        body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
        throw new Error(`Casper MCP error ${res.status}: ${await res.text()}`);
    }

    return res.json();
}

/** Query account balance via MCP */
export async function mcpGetAccountBalance(publicKey: string): Promise<any> {
    return callCasperMCPTool('GetAccountBalance', { public_key: publicKey });
}

/** Query deploy info via MCP */
export async function mcpGetDeploy(deployHash: string): Promise<any> {
    return callCasperMCPTool('GetDeploy', { deploy_hash: deployHash });
}

/** Query latest block via MCP */
export async function mcpGetLatestBlock(): Promise<any> {
    return callCasperMCPTool('GetBlock', {});
}

/** Query transfers for an account via MCP */
export async function mcpGetTransfers(publicKey: string): Promise<any> {
    return callCasperMCPTool('GetTransfers', { public_key: publicKey });
}

export const casperMCPTools = {
    callCasperMCPTool,
    mcpGetAccountBalance,
    mcpGetDeploy,
    mcpGetLatestBlock,
    mcpGetTransfers,
};
