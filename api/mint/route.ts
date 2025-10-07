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

    // DEBUG: hardcoded for now; replace with envs later
    const endpoint = "https://neat-red-wish.solana-devnet.quiknode.pro/3b91b098dabb643aa72b4007138eb1775062d9f0/";
    const merkleTreeAddress = "zL25czKCXCAqBiDP5DS3saxL3VHo5F2ro85KqSFZ1UL";
    const signerSecret = "2nRaXRbAR1Lrjocp23bsngZ7g5trhDSwX4CxLQQ5Xeav6XirD43zarQeuJZ3PTzU157r8MTNuXe1ajEuoFg1fB2L";

    const umi = createUmi(endpoint)
      .use(mplTokenMetadata())
      .use(mplBubblegum());

    const secret = bs58.decode(signerSecret);
    const myKeypair = umi.eddsa.createKeypairFromSecretKey(secret);
    const signer = createSignerFromKeypair(umi, myKeypair);
    umi.use(keypairIdentity(signer));

    const metadata = {
      name: "QN Pixel",
      symbol: "QNPIX",
      uri: "https://qn-shared.quicknode-ipfs.com/ipfs/QmQFh6WuQaWAMLsw9paLZYvTsdL5xJESzcoSxzb6ZU3Gjx",
      sellerFeeBasisPoints: 500,
      collection: none<Collection>(),
      creators: [],
    };

    const merkleTree = { publicKey: umiPublicKey(merkleTreeAddress) };
    const leafOwner = umiPublicKey(userPublicKey);

    const result = await mintV1(umi, {
      leafOwner,
      merkleTree: merkleTree.publicKey,
      metadata,
    }).sendAndConfirm(umi);

    const signature =
      typeof result.signature === "string"
        ? result.signature
        : result.signature?.toString() ?? null;

    return res.status(200).json({ ok: true, signature });
  } catch (error: any) {
    console.error("Mint API error:", error);
    return res.status(500).json({ ok: false, error: error?.message || String(error) });
  }
}


