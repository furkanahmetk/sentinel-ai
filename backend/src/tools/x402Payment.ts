/**
 * x402 Payment Tool
 * Handles autonomous micro-payments via the CSPR.cloud x402 Facilitator.
 * 
 * The x402 protocol flow:
 * 1. Agent requests a paid API endpoint
 * 2. Server responds with 402 Payment Required + PaymentRequirements
 * 3. Agent signs a PaymentPayload (EIP-712 typed-data) with its wallet
 * 4. Agent replays the request with X-Payment header
 * 5. Server forwards to facilitator for verify/settle
 * 6. Server returns premium data
 * 
 * References:
 * - https://docs.cspr.cloud/x402-facilitator-api/reference
 * - https://github.com/make-software/casper-x402
 * - https://github.com/casper-ecosystem/casper-eip-712
 */

const X402_FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://x402-facilitator.cspr.cloud';
const CSPR_CLOUD_API_KEY = process.env.CSPR_CLOUD_API_KEY || '';

/**
 * Check which payment schemes and networks the facilitator supports.
 */
export async function getSupported(): Promise<any> {
    const res = await fetch(`${X402_FACILITATOR_URL}/supported`, {
        headers: {
            'Authorization': CSPR_CLOUD_API_KEY,
        },
    });
    if (!res.ok) {
        throw new Error(`x402 /supported error ${res.status}: ${await res.text()}`);
    }
    return res.json();
}

/**
 * Verify a payment payload without submitting it on-chain.
 * Used to check if the agent's signed payment is valid before settlement.
 */
export async function verifyPayment(paymentPayload: any, paymentRequirements: any): Promise<any> {
    const res = await fetch(`${X402_FACILITATOR_URL}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': CSPR_CLOUD_API_KEY,
        },
        body: JSON.stringify({ payload: paymentPayload, requirements: paymentRequirements }),
    });
    if (!res.ok) {
        throw new Error(`x402 /verify error ${res.status}: ${await res.text()}`);
    }
    return res.json();
}

/**
 * Settle a payment — validates and submits on the Casper Network.
 * This is the final step where the payment is actually executed on-chain.
 */
export async function settlePayment(paymentPayload: any, paymentRequirements: any): Promise<any> {
    const res = await fetch(`${X402_FACILITATOR_URL}/settle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': CSPR_CLOUD_API_KEY,
        },
        body: JSON.stringify({ payload: paymentPayload, requirements: paymentRequirements }),
    });
    if (!res.ok) {
        throw new Error(`x402 /settle error ${res.status}: ${await res.text()}`);
    }
    return res.json();
}

/**
 * Simulate the full x402 payment flow for demonstration purposes.
 * In production, this would involve real EIP-712 signing with the agent's private key.
 */
export async function simulateX402Payment(
    amount: number,
    recipientPublicKey: string,
    serviceDescription: string
): Promise<{
    success: boolean;
    facilitatorUrl: string;
    amount: number;
    recipient: string;
    service: string;
    note: string;
}> {
    console.log(`[x402] Initiating payment of ${amount} CSPR to ${recipientPublicKey.substring(0, 16)}...`);
    console.log(`[x402] Service: ${serviceDescription}`);
    console.log(`[x402] Facilitator: ${X402_FACILITATOR_URL}`);

    // In a real implementation, this would:
    // 1. Build an EIP-712 TransferAuthorization using @casper-ecosystem/casper-eip-712
    // 2. Sign it with the agent's secret key
    // 3. Call /verify then /settle on the facilitator

    return {
        success: true,
        facilitatorUrl: X402_FACILITATOR_URL,
        amount,
        recipient: recipientPublicKey,
        service: serviceDescription,
        note: 'x402 payment simulated via CSPR.cloud Facilitator (EIP-712 signing pending full integration)',
    };
}

export const x402Tools = {
    getSupported,
    verifyPayment,
    settlePayment,
    simulateX402Payment,
};
