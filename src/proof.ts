import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";

const chainId = "qorechain-diana";
const receiptPrefix = "delivery-proof:v1:sha256:";
export const isTxHash = (value: string) => /^[a-f0-9]{64}$/i.test(value);

type Wallet = {
  enable(chain: string): Promise<void>;
  getKey(chain: string): Promise<{ bech32Address: string }>;
  signAndBroadcast(input: {
    chainId: string;
    messages: { typeUrl: string; value: number[] }[];
    memo: string;
  }): Promise<{ txHash: string; code: number; shield?: string }>;
};

export async function fingerprint(file: File) {
  if (file.size > 50 * 1024 * 1024) throw new Error("Choose a file of 50 MB or less.");
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function anchor(hash: string) {
  const wallet = (window as Window & { qorex?: { native?: Wallet } }).qorex?.native;
  if (!wallet?.signAndBroadcast) throw new Error("Open this app with a current QoreX wallet and select the Diana testnet.");
  await wallet.enable(chainId);
  const { bech32Address } = await wallet.getKey(chainId);
  const message = MsgSend.encode({
    fromAddress: bech32Address,
    toAddress: bech32Address,
    amount: [{ denom: "uqor", amount: "1" }],
  }).finish();
  const result = await wallet.signAndBroadcast({
    chainId,
    messages: [{ typeUrl: "/cosmos.bank.v1beta1.MsgSend", value: Array.from(message) }],
    memo: receiptPrefix + hash,
  });
  if (result.code !== 0 || !isTxHash(result.txHash)) throw new Error("QoreX did not return a successful transaction. Check your wallet activity before retrying.");
  return result;
}

export async function verify(txHash: string, hash: string) {
  if (!isTxHash(txHash)) throw new Error("Enter a 64-character transaction hash.");
  const response = await fetch(`/lcd/cosmos/tx/v1beta1/txs/${txHash.toUpperCase()}`);
  if (response.status === 404) throw new Error("Transaction not found on Diana. If it was just sent, wait briefly and retry.");
  if (!response.ok) throw new Error("The Diana testnet API is unavailable. Try again shortly.");
  const { tx, tx_response: receipt } = await response.json();
  if (!receipt || receipt.code !== 0) throw new Error("This transaction did not succeed.");
  if (typeof tx?.body?.memo !== "string" || !tx.body.memo.startsWith(receiptPrefix) ||
      !isTxHash(tx.body.memo.slice(receiptPrefix.length))) {
    throw new Error("This transaction does not contain a Delivery Proof receipt.");
  }
  return { matches: tx.body.memo === receiptPrefix + hash, timestamp: receipt.timestamp as string | undefined };
}
