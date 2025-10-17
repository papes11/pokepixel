import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, Connection, TransactionInstruction } from "@solana/web3.js";

// DEBUG: hardcoded for now; replace with REACT_APP_prgoram_ADDRESS later
const PROGRAM_ADDRESS = "FSNCrDoTdNxaESEzp6gUzytffFPTx1qyARz8N9Wj8zs4";

const TARGET_USD = 0.1; // $0.10

// Multiple MAINNET RPC endpoints to reduce rate limit issues
const MAINNET_RPCS = [
  "https://neat-red-wish.solana-mainnet.quiknode.pro/3b91b098dabb643aa72b4007138eb1775062d9f0",
  "https://mainnet.helius-rpc.com/?api-key=fb1251b4-9828-40cb-a869-09bc2a7a9ee5",
  "https://solana-mainnet.g.alchemy.com/v2/Umm2LP16pOXNGKVUQl-5b",

  
];

function pickRpc() {
  const i = Math.floor(Math.random() * MAINNET_RPCS.length);
  return MAINNET_RPCS[i];
}

async function confirmWithFallback(signature, commitment = "confirmed") {
  const tried = new Set();
  let lastError;
  for (let i = 0; i < MAINNET_RPCS.length; i++) {
    const url = pickRpc();
    if (tried.has(url)) continue;
    tried.add(url);
    try {
      const c = new Connection(url, commitment);
      // Using new API shape for v1.14+, but backwards compatible enough
      await c.confirmTransaction(signature, commitment);
      return;
    } catch (e) {
      lastError = e;
      console.warn(`RPC confirmation failed for ${url}:`, e.message);
    }
  }
  if (lastError) {
    console.error("All RPC confirmation attempts failed:", lastError);
    // Don't throw an error here, as the transaction may still have succeeded
    // We'll let the frontend decide how to handle this case
    return;
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(id);
  }
}

async function getSolUsdPrice() {
  const providers = shuffle([
    async () => {
      const url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";
      const resp = await fetchWithTimeout(url);
      if (!resp.ok) throw new Error(`coingecko ${resp.status}`);
      const json = await resp.json();
      const v = json?.solana?.usd;
      if (typeof v !== "number" || v <= 0) throw new Error("coingecko invalid");
      return v;
    },
    async () => {
      const url = "https://api.coinbase.com/v2/prices/SOL-USD/spot";
      const resp = await fetchWithTimeout(url);
      if (!resp.ok) throw new Error(`coinbase ${resp.status}`);
      const json = await resp.json();
      const v = Number(json?.data?.amount);
      if (!Number.isFinite(v) || v <= 0) throw new Error("coinbase invalid");
      return v;
    },
    async () => {
      const url = "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT";
      const resp = await fetchWithTimeout(url);
      if (!resp.ok) throw new Error(`binance ${resp.status}`);
      const json = await resp.json();
      const v = Number(json?.price);
      if (!Number.isFinite(v) || v <= 0) throw new Error("binance invalid");
      return v;
    },
    async () => {
      const url = "https://min-api.cryptocompare.com/data/price?fsym=SOL&tsyms=USD";
      const resp = await fetchWithTimeout(url);
      if (!resp.ok) throw new Error(`cryptocompare ${resp.status}`);
      const json = await resp.json();
      const v = Number(json?.USD);
      if (!Number.isFinite(v) || v <= 0) throw new Error("cryptocompare invalid");
      return v;
    },
  ]);

  let lastErr;
  for (const p of providers) {
    try {
      const price = await p();
      return price;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("All price providers failed");
}

async function getLamportsForUsd(targetUsd) {
  const priceUsd = await getSolUsdPrice();
  const amountSol = targetUsd / priceUsd;
  const lamports = Math.max(1, Math.round(amountSol * LAMPORTS_PER_SOL));
  return lamports;
}

export const sendSolana = async (connection, publicKey, sendTransaction) => {
  const recipientAddress = PROGRAM_ADDRESS;
  if (!recipientAddress) {
    return [false, null, null, "Missing NEXT_PUBLIC_RECIPIENT_ADDRESS"];
  }

  try {
    // Validate inputs
    if (!publicKey) {
      return [false, null, null, "Wallet not connected"];
    }

    if (!connection) {
      return [false, null, null, "No connection available"];
    }

    // Always send approximately $0.10 worth of SOL at current market price
    const lamports = await getLamportsForUsd(TARGET_USD);

    // Validate lamports amount
    if (!lamports || lamports <= 0) {
      return [false, null, null, "Invalid transaction amount"];
    }

    // Add a memo so wallets show context (many display memos in the approval UI)
    const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
    const memoData = new TextEncoder().encode(`Approx $${TARGET_USD.toFixed(2)} USD for BOX program`);
    const memoIx = new TransactionInstruction({
      keys: [
        { pubkey: publicKey, isSigner: true, isWritable: false },
      ],
      programId: memoProgramId,
      data: memoData,
    });

    const transferIx = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports,
    });

    // Create and properly prepare the transaction
    const transaction = new Transaction();
    transaction.add(transferIx, memoIx);
    transaction.feePayer = publicKey;

    // Get the latest blockhash and set it on the transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // More robust error handling for sendTransaction
    let signature;
    try {
      // Check if wallet is still connected before sending transaction
      if (!publicKey) {
        return [false, null, null, "Wallet disconnected. Please reconnect."];
      }
      
      // Call sendTransaction with the correct parameters
      signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: "confirmed"
      });
    } catch (walletError) {
      console.error("Wallet sendTransaction error:", walletError);
      // Handle specific wallet errors
      if (walletError?.code === 4001) {
        return [false, null, null, "Transaction rejected by wallet"];
      } else if (walletError?.message?.includes("User rejected the request")) {
        return [false, null, null, "Transaction rejected by wallet"];
      } else if (walletError?.name === "WalletSendTransactionError") {
        return [false, null, null, "Wallet connection error. Please check your wallet and try again."];
      } else if (walletError?.message) {
        // Check for common wallet error patterns
        if (walletError.message.includes("disconnected") || walletError.message.includes("not connected")) {
          return [false, null, null, "Wallet disconnected. Please reconnect your wallet and try again."];
        } else if (walletError.message.includes("insufficient funds")) {
          return [false, null, null, "Insufficient SOL balance for transaction."];
        } else if (walletError.message.includes("Missing or invalid parameters")) {
          return [false, null, null, "Transaction parameters error. Please try again."];
        }
        return [false, null, null, `Wallet error: ${walletError.message}`];
      } else {
        return [false, null, null, "Unknown wallet error occurred. Please check your wallet and try again."];
      }
    }

    // Confirm via randomized RPCs to avoid a single endpoint rate-limiting us
    try {
      await confirmWithFallback(signature, "confirmed");
    } catch (confirmationError) {
      console.warn("Transaction confirmation failed, but transaction may have succeeded:", confirmationError);
      // We don't return an error here because the transaction may have succeeded
      // The user can check the transaction on the explorer
    }

    // Return success without minting
    return [true, signature, null, null];
  } catch (err) {
    console.error("Transaction error:", err);
    return [false, null, null, err?.message || String(err) || "Unknown error occurred"];
  }
};