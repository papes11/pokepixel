import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  keypairIdentity,
  publicKey as umiPublicKey,
  none,
} from "@metaplex-foundation/umi";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplBubblegum, mintV1 } from "@metaplex-foundation/mpl-bubblegum";
import type { Collection } from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userPublicKey } = req.body as { userPublicKey?: string };
    if (!userPublicKey) {
      return res.status(400).json({ error: "Missing userPublicKey" });
    }

    const DEVNET_RPCS = [
      "https://neat-red-wish.solana-devnet.quiknode.pro/3b91b098dabb643aa72b4007138eb1775062d9f0/",
    ];
    const pickRpc = () => DEVNET_RPCS[Math.floor(Math.random() * DEVNET_RPCS.length)];
    let endpoint = pickRpc();
    const merkleTreeAddress = "5kXGnT7kKjutRJL8dQTLBAPq8jKzDZsg8MB2reHNJiA8";
    const signerSecret =
      "2nRaXRbAR1Lrjocp23bsngZ7g5trhDSwX4CxLQQ5Xeav6XirD43zarQeuJZ3PTzU157r8MTNuXe1ajEuoFg1fB2L";

    let umi = createUmi(endpoint).use(mplTokenMetadata()).use(mplBubblegum());

    const secret = bs58.decode(signerSecret);
    const myKeypair = umi.eddsa.createKeypairFromSecretKey(secret);
    const signer = createSignerFromKeypair(umi, myKeypair);
    umi.use(keypairIdentity(signer));

    // ✅ Create a web3 connection for balance logging
    // const connection = new Connection(endpoint, "confirmed");
    // const signerPubkey = new PublicKey(signer.publicKey);

    // // ✅ Log balance before
    // const balanceBefore = await connection.getBalance(signerPubkey);
    // console.log("💰 Signer balance before mint:", balanceBefore / LAMPORTS_PER_SOL, "SOL");

    const metadata = {
      name: "QN Pixel",
      symbol: "QNPIX",
      uri: "https://qn-shared.quicknode-ipfs.com/ipfs/QmQFh6WuQaWAMLsw9paLZYvTsdL5xJESzcoSxzb6ZU3Gjx",
      sellerFeeBasisPoints: 0,
      collection: none<Collection>(),
      creators: [],
    };

    const merkleTree = { publicKey: umiPublicKey(merkleTreeAddress) };
    const leafOwner = umiPublicKey(userPublicKey);

    let result;
    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await mintV1(umi, {
          leafOwner,
          merkleTree: merkleTree.publicKey,
          metadata,
        }).sendAndConfirm(umi);
        break;
      } catch (e: any) {
        lastError = e;
        endpoint = pickRpc();
        umi = createUmi(endpoint).use(mplTokenMetadata()).use(mplBubblegum());
        const secret2 = bs58.decode(signerSecret);
        const myKeypair2 = umi.eddsa.createKeypairFromSecretKey(secret2);
        const signer2 = createSignerFromKeypair(umi, myKeypair2);
        umi.use(keypairIdentity(signer2));
      }
    }
    if (!result) throw lastError || new Error("Mint failed after retries");

    // ✅ Log balance after
    // const balanceAfter = await connection.getBalance(signerPubkey);
    // console.log("💸 Signer balance after mint:", balanceAfter / LAMPORTS_PER_SOL, "SOL");
    // console.log("📉 Fee spent:", (balanceBefore - balanceAfter) / LAMPORTS_PER_SOL, "SOL");

    const rawSig: any = (result as any)?.signature;
    let signature: string | null = null;
    if (typeof rawSig === "string") {
      signature = rawSig;
    } else if (rawSig instanceof Uint8Array) {
      signature = bs58.encode(rawSig);
    } else if (Array.isArray(rawSig) && typeof rawSig[0] === "number") {
      signature = bs58.encode(Uint8Array.from(rawSig));
    }

    return res.status(200).json({ ok: true, signature });
  } catch (error: any) {
    console.error("Mint API error:", error);
    return res.status(500).json({ ok: false, error: error?.message || String(error) });
  }
}


