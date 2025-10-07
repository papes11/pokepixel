import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, Connection, TransactionInstruction } from "@solana/web3.js";

// DEBUG: hardcoded for now; replace with REACT_APP_RECIPIENT_ADDRESS later
const RECIPIENT_ADDRESS = "8FTc9SPtG9Gaxm52adTXuAWfnKqJAdyCU2yyDM1W2Aaz";

const TARGET_USD = 0.1; // $0.10

// Multiple Devnet RPC endpoints to reduce rate limit issues
const DEVNET_RPCS = [
  "https://neat-red-wish.solana-devnet.quiknode.pro/3b91b098dabb643aa72b4007138eb1775062d9f0/",
  
];

function pickRpc() {
  const i = Math.floor(Math.random() * DEVNET_RPCS.length);
  return DEVNET_RPCS[i];
}

async function confirmWithFallback(signature, commitment = "confirmed") {
  const tried = new Set();
  let lastError;
  for (let i = 0; i < DEVNET_RPCS.length; i++) {
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
    }
  }
  if (lastError) throw lastError;
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
  const recipientAddress = RECIPIENT_ADDRESS;
  if (!recipientAddress) {
    return [false, null, null, "Missing NEXT_PUBLIC_RECIPIENT_ADDRESS"];
  }

  try {
    // Always send approximately $0.10 worth of SOL at current market price
    const lamports = await getLamportsForUsd(TARGET_USD);

    // Add a memo so wallets show context (many display memos in the approval UI)
    const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
    const memoData = new TextEncoder().encode(`Approx $${TARGET_USD.toFixed(2)} USD`);
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

    const transaction = new Transaction().add(
      transferIx,
      memoIx
    );
    transaction.feePayer = publicKey;

    const signature = await sendTransaction(transaction, connection);
    // Confirm via randomized RPCs to avoid a single endpoint rate-limiting us
    await confirmWithFallback(signature, "confirmed");

    try {
      const resp = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPublicKey: publicKey.toString() }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        const msg = json?.error || `Mint failed (${resp.status})`;
        return [true, signature, null, msg];
      }
      return [true, signature, json.signature ?? null, null];
    } catch (mintErr) {
      const msg = (mintErr && (mintErr.message || String(mintErr))) || "Mint failed";
      return [true, signature, null, msg];
    }
  } catch (err) {
    return [false, null, null, err?.message || String(err) || null];
  }
};