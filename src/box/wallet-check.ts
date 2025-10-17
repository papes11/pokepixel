import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";

/**
 * Check if a wallet holds any tokens from a specific SPL token contract
 * @param connection - Solana connection object
 * @param walletAddress - Public key of the wallet to check
 * @param tokenMintAddress - Mint address of the SPL token to check for
 * @returns Promise<boolean> - True if wallet holds tokens from the contract, false otherwise
 */
export async function hasSPLToken(
  connection: Connection,
  walletAddress: PublicKey,
  tokenMintAddress: string
): Promise<boolean> {
  try {
    // Get all token accounts owned by the wallet
    const tokenAccounts = await connection.getTokenAccountsByOwner(walletAddress, {
      programId: TOKEN_PROGRAM_ID,
    });

    // Check each token account to see if it matches our target token
    for (const { account } of tokenAccounts.value) {
      // Convert Buffer to Uint8Array for AccountLayout.decode
      const accountData = new Uint8Array(account.data);
      const tokenInfo = AccountLayout.decode(accountData);
      
      // Convert the mint address to string for comparison
      const accountMintAddress = new PublicKey(tokenInfo.mint).toBase58();
      
      // If this account holds tokens from our target contract and has a balance
      if (accountMintAddress === tokenMintAddress && tokenInfo.amount > BigInt(0)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking SPL token balance:", error);
    // Re-throw network errors so they can be handled upstream
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw error;
    }
    return false;
  }
}

/**
 * Check if a wallet holds tokens from any of the specified SPL token contracts
 * @param connection - Solana connection object
 * @param walletAddress - Public key of the wallet to check
 * @param tokenMintAddresses - Array of mint addresses of SPL tokens to check for
 * @returns Promise<boolean> - True if wallet holds tokens from any of the contracts, false otherwise
 */
export async function hasAnySPLToken(
  connection: Connection,
  walletAddress: PublicKey,
  tokenMintAddresses: string[]
): Promise<boolean> {
  try {
    // Get all token accounts owned by the wallet
    const tokenAccounts = await connection.getTokenAccountsByOwner(walletAddress, {
      programId: TOKEN_PROGRAM_ID,
    });

    // Create a set for faster lookup
    const mintAddressesSet = new Set(tokenMintAddresses);

    // Check each token account to see if it matches any of our target tokens
    for (const { account } of tokenAccounts.value) {
      // Convert Buffer to Uint8Array for AccountLayout.decode
      const accountData = new Uint8Array(account.data);
      const tokenInfo = AccountLayout.decode(accountData);
      
      // Convert the mint address to string for comparison
      const accountMintAddress = new PublicKey(tokenInfo.mint).toBase58();
      
      // If this account holds tokens from any of our target contracts and has a balance
      if (mintAddressesSet.has(accountMintAddress) && tokenInfo.amount > BigInt(0)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking SPL token balances:", error);
    // Re-throw network errors so they can be handled upstream
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw error;
    }
    return false;
  }
}