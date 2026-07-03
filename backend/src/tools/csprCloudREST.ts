/**
 * CSPR.cloud REST API Tool
 * Queries the CSPR.cloud REST API (Testnet) for indexed on-chain data.
 * Used for: account info, deploy history, token data, validator info, CSPR rates.
 */

const CSPR_CLOUD_REST_URL = process.env.CSPR_CLOUD_REST_URL || 'https://api.testnet.cspr.cloud';
const CSPR_CLOUD_API_KEY = process.env.CSPR_CLOUD_API_KEY || '';

async function csprCloudFetch(path: string): Promise<any> {
    const url = `${CSPR_CLOUD_REST_URL}${path}`;
    const res = await fetch(url, {
        headers: {
            'Authorization': CSPR_CLOUD_API_KEY,
        },
    });
    if (!res.ok) {
        throw new Error(`CSPR.cloud REST error ${res.status}: ${await res.text()}`);
    }
    return res.json();
}

/** Get account info by public key */
export async function getAccountInfo(publicKey: string): Promise<any> {
    return csprCloudFetch(`/accounts/${publicKey}`);
}

/** Get account balance by public key */
export async function getAccountBalance(publicKey: string): Promise<any> {
    return csprCloudFetch(`/accounts/${publicKey}/balance`);
}

/** Get recent deploys for an account */
export async function getAccountDeploys(publicKey: string, page = 1, pageSize = 10): Promise<any> {
    return csprCloudFetch(`/accounts/${publicKey}/deploys?page=${page}&page_size=${pageSize}`);
}

/** Get current CSPR rate in USD */
export async function getCsprRate(): Promise<any> {
    return csprCloudFetch('/rates/1/amount?currency_id=1');
}

/** Get contract info by contract hash */
export async function getContractInfo(contractHash: string): Promise<any> {
    return csprCloudFetch(`/contracts/${contractHash}`);
}

/** Get deploy info by deploy hash */
export async function getDeployInfo(deployHash: string): Promise<any> {
    return csprCloudFetch(`/deploys/${deployHash}`);
}

/** Get validator list */
export async function getValidators(page = 1, pageSize = 10): Promise<any> {
    return csprCloudFetch(`/validators?page=${page}&page_size=${pageSize}`);
}

export const csprCloudTools = {
    getAccountInfo,
    getAccountBalance,
    getAccountDeploys,
    getCsprRate,
    getContractInfo,
    getDeployInfo,
    getValidators,
};
