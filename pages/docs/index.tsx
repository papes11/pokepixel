import React from "react";

type DocKey =
  | "overview"
  | "getting-started"
  | "gameplay"
  | "mystery-boxes"
  | "swap"
  | "roadmap"
  | "contract"
  | "faq"
  | "license"
  | "credit";
  

const SECTIONS: { key: DocKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "getting-started", label: "Getting Started" },
  { key: "gameplay", label: "Gameplay" },
  { key: "mystery-boxes", label: "Mystery Boxes" },
  { key: "swap", label: "Token Swap" },
  { key: "roadmap", label: "Roadmap" },
  { key: "contract", label: "Official Contract" },
  { key: "faq", label: "FAQ" },
  { key: "license", label: "License" },
  { key: "credit", label: "Credits" },
];

export default function DocsPage() {
  const [active, setActive] = React.useState<DocKey>("overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const contractAddress = "coming soon";
  const [copied, setCopied] = React.useState(false);

  const copyContract = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(contractAddress);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = contractAddress;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  React.useEffect(() => {
    const hash = (typeof window !== "undefined" && window.location.hash.replace("#", "")) as DocKey;
    if (hash && (SECTIONS as any).some((s: any) => s.key === hash)) {
      setActive(hash);
    }
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "") as DocKey;
      if (h && (SECTIONS as any).some((s: any) => s.key === h)) setActive(h);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const goto = (key: DocKey) => {
    setActive(key);
    if (typeof window !== "undefined") window.location.hash = key;
    setSidebarOpen(false);
  };

  return (
    <div className="docs-root">
      <nav className="docs-nav">
        <div className="nav-container">
          <div className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo512.png" alt="Pokepixel Logo" />
            <span>Pokepixel Docs</span>
            <button className="menu-btn" aria-label="Toggle navigation" onClick={() => setSidebarOpen((v) => !v)}>
              ☰
            </button>
          </div>
        </div>
      </nav>
      
      <div className="docs-main">
        <aside className={`docs-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-content">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                className={`nav-item ${active === s.key ? "active" : ""}`}
                onClick={() => goto(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </aside>
        
        <article className="docs-content">
          <div className="content-container">
            {active === "overview" && (
              <section>
                <h1>🎮 About the Game</h1>
                <p>
                  PokéPixel is a free-to-play pixel adventure game built on Solana, where you can explore, earn rewards, and level up — no tokens required to start!
                </p>
                <p>
                  During the <strong>BetaNet v1</strong>, everyone can play for free. In future updates, some features may require holding a small amount of PokéPixel tokens to unlock special gameplay options.
                </p>
                <p>
                  <strong>Your main mission?</strong><br />
                  Find hidden boxes, open them directly on Solana using your wallet, and immediately receive rewards.
                </p>

                <h2>📦 Quest Box & Reward Box</h2>
                <div className="box-types">
                  <div className="box-type-card">
                    <h3>Quest Box</h3>
                    <p>Unlocks as you complete in-game quests and gain experience (EXP). These boxes are tied to your progression and achievements in the game.</p>
                  </div>
                  <div className="box-type-card">
                    <h3>Reward Box</h3>
                    <p>Randomly appears across the map; open these on-chain using your Solana wallet for exclusive rewards. These boxes respawn periodically as you explore.</p>
                  </div>
                </div>
                <p>
                  The more you play and level up, the more opportunities you'll have to find boxes.<br />
                  Each box you open increases your chances of earning airdrops, NFTs, and other rewards.
                </p>

                <h2>🚀 Gameplay Highlights</h2>
                <div className="feature-grid">
                  <div className="feature-card">
                    <h3>⛓️ Built on Solana</h3>
                    <p>Built entirely on Solana blockchain for fast, secure transactions.</p>
                  </div>
                  <div className="feature-card">
                    <h3>👛 Multi-Wallet Support</h3>
                    <p>Works with popular browser wallets: Phantom, Solflare, Trust, and others.</p>
                  </div>
                  <div className="feature-card">
                    <h3>📈 Level Up & Earn</h3>
                    <p>Gain EXP and level up as you play. The more boxes you open, the higher your airdrops and bonus chances.</p>
                  </div>
                  <div className="feature-card">
                    <h3>🎁 Hidden Rewards</h3>
                    <p>Hidden boxes spawn over time — open them instantly using your connected wallet.</p>
                  </div>
                  <div className="feature-card">
                    <h3>✨ UI/UX Improvements</h3>
                    <p>BetaNet v1 features updated UI with enhanced visual elements and improved user experience.</p>
                  </div>
                  <div className="feature-card">
                    <h3>🔄 Box to Token Swap</h3>
                    <p>Exchange your mystery boxes for SOL or Pokepixel tokens directly in-game.</p>
                  </div>
                  <div className="feature-card">
                    <h3>🏆 Three-Tier Box System</h3>
                    <p>Silver, Gold, and Diamond boxes with increasing rewards and rarity.</p>
                  </div>
                </div>

                <div className="info-box">
                  <h3>🚀 BetaNet v1 Now Live!</h3>
                  <p>Everything is free and experimental. In <strong>BetaNet v1</strong>, players can look forward to:</p>
                  <ul>
                    <li>Enhanced three-tier box system (Silver, Gold, Diamond)</li>
                    <li>New Swap Page feature for trading</li>
                    <li>UI/UX improvements and bug fixes</li>
                    <li>Optimized gameplay performance</li>
                    <li>Reward NFTs</li>
                    <li>Solana-based collectibles</li>
                    <li>Enhanced play-to-earn systems</li>
                  </ul>
                  <p>If you missed the earlier Jupiter, Pixel, and other airdrops, this is your chance to join the early beta and be part of the next wave.</p>
                </div>
                
                <div className="tip-box">
                  <h3>🔧 BetaNet v1 Optimizations & Bug Fixes</h3>
                  <p>We've implemented several performance improvements and bug fixes in this update:</p>
                  <ul>
                    <li>Optimized box spawning algorithm for better distribution</li>
                    <li>Fixed transaction confirmation issues on mobile devices</li>
                    <li>Improved wallet connection stability</li>
                    <li>Enhanced game performance on lower-end devices</li>
                    <li>Resolved issues with box respawning timers</li>
                    <li>Fixed UI rendering bugs on various screen sizes</li>
                    <li>Improved error handling for network interruptions</li>
                  </ul>
                </div>
              </section>
            )}

            {active === "getting-started" && (
              <section>
                <h1>Getting Started</h1>
                
                <h2>💻 Desktop Users</h2>
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Install a Solana Wallet</h3>
                      <p>Download Phantom, Solflare, or any compatible Solana wallet extension for your browser.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Connect Your Wallet</h3>
                      <p>Open the game and click the "Connect Wallet" button to link your wallet securely.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Acquire Required SPL Tokens</h3>
                      <p>Ensure you hold at least one of the required SPL tokens in your wallet to open boxes.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Start Playing</h3>
                      <p>Use keyboard arrows or on-screen D-pad to move and interact with the game world.</p>
                    </div>
                  </div>
                </div>

                <h2>📱 Mobile Users</h2>
                <div className="mobile-warning">
                  <p>🚨 <strong>Important for Mobile Players:</strong></p>
                  <p>To complete transactions on mobile devices, you <strong>must</strong> use your wallet app's built-in browser.</p>
                </div>
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Install a Mobile Wallet App</h3>
                      <p>Download Phantom, Solflare, or Trust Wallet from your app store (iOS/Android).</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Open Wallet's Built-in Browser</h3>
                      <p>Launch your wallet app and find the "Browser" or "DApp" section (usually in the menu or bottom navigation).</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Navigate to PokéPixel</h3>
                      <p>Type or paste the PokéPixel website URL into the wallet browser's address bar.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Connect & Play</h3>
                      <p>Click "Connect Wallet" in the game. Your wallet will automatically connect since you're in its browser.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h3>Ensure Token Holdings</h3>
                      <p>Verify you hold the required SPL tokens in your wallet to open boxes.</p>
                    </div>
                  </div>
                </div>

                <div className="tip-box">
                  <h3>💡 Why use the wallet browser?</h3>
                  <p>Mobile browsers (Safari, Chrome) don't support wallet extensions. Wallet apps provide built-in browsers specifically designed for blockchain apps like PokéPixel.</p>
                </div>
                
                <h2>🔄 Exchanging Boxes for Tokens</h2>
                <p>BetaNet v1 introduces a new Box to Token Swap feature that allows you to exchange your mystery boxes for SOL or Pokepixel tokens. You must have boxes in your inventory to swap them.</p>
                
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Connect Your Wallet</h3>
                      <p>Ensure your Solana wallet is connected to the game.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Visit the Swap Page</h3>
                      <p>Navigate to the Swap page from the main menu or by visiting /swap directly.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Select Box Type</h3>
                      <p>Choose which type of box you want to swap (Silver, Gold, or Diamond).</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Choose Tokens</h3>
                      <p>Select whether you want SOL or Pokepixel tokens in return.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h3>Confirm Transaction</h3>
                      <p>Specify the amount and confirm the swap transaction in your wallet.</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {active === "gameplay" && (
              <section>
                <h1>Gameplay</h1>
                <div className="gameplay-grid">
                  <div className="gameplay-item">
                    <h3>🌍 Exploration</h3>
                    <p>Walk around towns, routes, and caves to discover hidden areas and secrets.</p>
                  </div>
                  <div className="gameplay-item">
                    <h3>💬 NPC Interaction</h3>
                    <p>Talk to characters throughout the world to receive quests and valuable information.</p>
                  </div>
                  <div className="gameplay-item">
                    <h3>🎁 Item Collection</h3>
                    <p>Gather items and resources that contribute to your progression and future rewards.</p>
                  </div>
                  <div className="gameplay-item">
                    <h3>📈 Progression</h3>
                    <p>Level up your account to unlock better rewards and increased mystery box spawn rates.</p>
                  </div>
                </div>
              </section>
            )}

            {active === "mystery-boxes" && (
              <section>
                <h1>Mystery Boxes</h1>
                <p>Mystery boxes are special in-game items that can be found and opened for rewards. In BetaNet v1, we've introduced a new three-tier system for enhanced gameplay:</p>
                
                <div className="box-types">
                  <div className="box-type-card">
                    <h3>🥉 Silver Boxes</h3>
                    <p>Common boxes that respawn frequently. Contain basic rewards like small amounts of SOL or common items.</p>
                  </div>
                  <div className="box-type-card">
                    <h3>🥇 Gold Boxes</h3>
                    <p>Uncommon boxes with better rewards. Appear less frequently but offer higher value items and tokens.</p>
                  </div>
                  <div className="box-type-card">
                    <h3>💎 Diamond Boxes</h3>
                    <p>Rare boxes with the highest value rewards. Contain exclusive NFTs, large SOL amounts, and rare collectibles.</p>
                  </div>
                </div>
                
                <h2>How to Find and Open Boxes</h2>
                <p>To find boxes, explore different areas of the game world. When you walk over a box, you can interact with it using your Solana wallet.</p>
                <p>Each box can only be opened once. After opening a box, you immediately receive your rewards and the box disappears.</p>
                
                <h3>Opening Requirements</h3>
                <p>To open a box, you must:</p>
                <ol>
                  <li>Have a Solana wallet connected</li>
                  <li>Hold at least Pokepixel tokens in your wallet-no minimum required</li>
                </ol>
                
                <div className="rewards-section">
                  <h2>Potential Rewards by Box Tier</h2>
                  <h3>🥉 Silver Box Rewards</h3>
                  <ul>
                    <li>0.01-0.05 SOL</li>
                    <li>Common items</li>
                    <li>Basic Pokepixel tokens</li>
                  </ul>
                  
                  <h3>🥇 Gold Box Rewards</h3>
                  <ul>
                    <li>0.05-0.15 SOL</li>
                    <li>Uncommon items</li>
                    <li>Moderate Pokepixel tokens</li>
                    <li>Occasional NFTs</li>
                  </ul>
                  
                  <h3>💎 Diamond Box Rewards</h3>
                  <ul>
                    <li>0.15-0.5 SOL</li>
                    <li>Rare items</li>
                    <li>Large Pokepixel token amounts</li>
                    <li>Exclusive NFTs and cNFTs</li>
                  </ul>
                </div>

                <div className="tips">
                  <h3>💡 Pro Tips</h3>
                  <ul>
                    <li>Explore different areas regularly to find new boxes</li>
                    <li>Higher level accounts get access to better rewards</li>
                    <li>Complete quests to unlock special Quest Boxes</li>
                    <li>Boxes that have been opened will respawn after some time</li>
                    <li>Diamond boxes are rare - keep exploring to find them!</li>
                  </ul>
                </div>
              </section>
            )}

            {active === "roadmap" && (
              <section>
                <h1>Roadmap</h1>
                <div className="roadmap-timeline">
                  <div className="roadmap-phase">
                    <div className="phase-header">
                      <h3>Alpha Phase</h3>
                      <span className="phase-status">Completed</span>
                    </div>
                    <p>Core gameplay live, early community building and testing.</p>
                  </div>
                  <div className="roadmap-phase">
                    <div className="phase-header">
                      <h3>Beta Phase v1</h3>
                      <span className="phase-status current">Current</span>
                    </div>
                    <p>Enhanced gameplay with three-tier box system, token swap features, and social features rollout.</p>
                  </div>
                  <div className="roadmap-phase">
                    <div className="phase-header">
                      <h3>Beta Phase v2</h3>
                      <span className="phase-status upcoming">Upcoming</span>
                    </div>
                    <p>Advanced trading features, expanded quests, and additional box types.</p>
                  </div>
                  <div className="roadmap-phase">
                    <div className="phase-header">
                      <h3>Super Phase</h3>
                      <span className="phase-status upcoming">Future</span>
                    </div>
                    <p>Full ecosystem expansion and Rewards program, including the swap feature and advanced trading options. New features and updates to enhance the gaming experience and player engagement.</p>
                  </div>
                </div>
              </section>
            )}

            {active === "swap" && (
              <section>
                <h1>Box to Token Swap</h1>
                <p>BetaNet v1 introduces the new Box to Token Swap feature, allowing players to exchange their mystery boxes for SOL or Pokepixel tokens directly within the game. You must have boxes in your inventory to swap them.</p>
                
                <h2>How to Access the Swap Page</h2>
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Connect Your Wallet</h3>
                      <p>Ensure your Solana wallet is connected to the game.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Navigate to Swap</h3>
                      <p>Click on the "Swap" option in the main menu or visit the dedicated swap page.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Select Box Type</h3>
                      <p>Choose which type of box you want to swap (Silver, Gold, or Diamond).</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Select Token</h3>
                      <p>Choose whether you want SOL or Pokepixel tokens in return.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h3>Enter Amount & Confirm</h3>
                      <p>Specify the number of boxes you wish to swap and confirm the transaction.</p>
                    </div>
                  </div>
                </div>
                
                <h2>Swap Rates</h2>
                <div className="feature-grid">
                  <div className="feature-card">
                    <h3>🥈 Silver Box</h3>
                    <p>1 Box = 0.1 SOL or 1000 POKE</p>
                  </div>
                  <div className="feature-card">
                    <h3>🥇 Gold Box</h3>
                    <p>1 Box = 0.25 SOL or 2500 POKE</p>
                  </div>
                  <div className="feature-card">
                    <h3>💎 Diamond Box</h3>
                    <p>1 Box = 0.5 SOL or 5000 POKE</p>
                  </div>
                </div>
                
                <div className="info-box">
                  <h3>💡 Swap Benefits</h3>
                  <ul>
                    <li>Convert your boxes to liquid tokens</li>
                    <li>Low transaction fees (0.5%)</li>
                    <li>Instant processing</li>
                    <li>Secure blockchain-based swaps</li>
                    <li>No intermediaries</li>
                    <li>Direct wallet-to-wallet transfers</li>
                  </ul>
                </div>
                
                <div className="tip-box">
                  <h3>⚠️ Important Notes</h3>
                  <ul>
                    <li>You must have boxes in your inventory to swap them</li>
                    <li>Swaps are irreversible once confirmed</li>
                    <li>Network fees are paid in SOL</li>
                    <li>Minimum swap amount is 1 box</li>
                  </ul>
                </div>
              </section>
            )}

            {active === "contract" && (
              <section>
                <h1>Official Contract</h1>
                <div className="contract-card">
                  <h3>Contract Address</h3>
                  <code className="contract-address">{contractAddress}</code>
                  <div className="contract-actions">
                    <button className="copy-btn" onClick={copyContract} aria-label="Copy contract address">
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="contract-note">Always verify this address before making any transactions.</p>
                </div>
              </section>
            )}

            {active === "faq" && (
              <section>
                <h1>Frequently Asked Questions</h1>
                <div className="faq-list">
                  <div className="faq-item">
                    <h3>What is Pokepixel?</h3>
                    <p>A free-to-play pixel adventure game built on Solana where you explore, complete quests, and earn rewards. It's inspired by classic monster-catching games but operates as an independent Web3 project.</p>
                  </div>
                  <div className="faq-item">
                    <h3>How do I play?</h3>
                    <p>Connect your Solana wallet, explore the map using keyboard arrows or on-screen controls, and interact with objects and NPCs to find mystery boxes. When you find a box, walk over it and press the action button to open it and immediately receive your rewards.</p>
                  </div>
                  <div className="faq-item">
                    <h3>Is there a cost to play?</h3>
                    <p>PokéPixel is completely free to play during AlphaNet. You only need a Solana wallet to get started. Opening reward boxes requires a small on-chain transaction fee (paid in SOL).</p>
                  </div>
                  <div className="faq-item">
                    <h3>📱 Can I play on mobile?</h3>
                    <p>Yes! But you <strong>must use your wallet app's built-in browser</strong> (not Safari or Chrome). Download Phantom, Solflare, or Trust Wallet, open their built-in browser, and navigate to PokéPixel from there.</p>
                  </div>
                  <div className="faq-item">
                    <h3>Why can't I make transactions on mobile Safari/Chrome?</h3>
                    <p>Mobile browsers don't support wallet extensions. You need to use the built-in browser inside your wallet app (Phantom, Solflare, Trust) to connect and make transactions.</p>
                  </div>
                  <div className="faq-item">
                    <h3>What are the system requirements?</h3>
                    <p><strong>Desktop:</strong> Any modern browser (Chrome, Firefox, Safari) with a Solana wallet extension.<br /><strong>Mobile:</strong> Wallet app with built-in browser (Phantom, Solflare, Trust).</p>
                  </div>
                  <div className="faq-item">
                    <h3>What rewards can I earn?</h3>
                    <p>Players can earn NFTs, cNFTs, SOL rewards, rare items, and PokéPixel tokens by opening boxes and progressing through the game. Higher levels unlock better rewards and more frequent box spawns.</p>
                  </div>
                  <div className="faq-item">
                    <h3>How do mystery boxes work?</h3>
                    <p>There are two types of boxes in Pokepixel: Quest Boxes and Reward Boxes. Quest Boxes are earned through completing in-game quests and achievements. Reward Boxes appear randomly throughout the game world and respawn periodically as you explore. When you open a box, you immediately receive rewards such as SOL, tokens, or NFTs. Each box can only be opened once, after which it will disappear and may respawn after some time.</p>
                  </div>
                  <div className="faq-item">
                    <h3>Can I get boxes to respawn faster?</h3>
                    <p>Yes! The more you play and the higher your character level, the more frequently boxes will appear and respawn. Regular exploration and quest completion will increase your opportunities to find new boxes.</p>
                  </div>
                  <div className="faq-item">
                    <h3>What SPL tokens are required to open boxes?</h3>
                    <p>To open boxes, you must hold at least one of the specific SPL tokens in your wallet. The exact token addresses are configured by the game developers and can be found in the game's documentation or by checking the required token list in the game settings.</p>
                  </div>
                  <div className="faq-item">
                    <h3>Can I swap my boxes for tokens?</h3>
                    <p>Yes! BetaNet v1 introduces a new Box to Token Swap feature. You can exchange your Silver, Gold, or Diamond boxes for SOL or Pokepixel tokens directly in the game. Visit the Swap page, select your box type and desired token, and confirm the transaction. Note that you must have the boxes in your inventory to swap them.</p>
                  </div>
                  <div className="faq-item">
                    <h3>What are the swap rates for boxes?</h3>
                    <p>Swap rates vary by box type: 1 Silver Box = 0.1 SOL or 1000 POKE, 1 Gold Box = 0.25 SOL or 2500 POKE, 1 Diamond Box = 0.5 SOL or 5000 POKE. A small 0.5% transaction fee applies to all swaps.</p>
                  </div>
                  <div className="faq-item">
                    <h3>Is this affiliated with Pokémon?</h3>
                    <p>No. PokéPixel is an independent fan-made project inspired by the monster-catching genre. We are not affiliated with Nintendo, Game Freak, or The Pokémon Company.</p>
                  </div>
                </div>
              </section>
            )}

            {active === "license" && (
              <section>
                <h1>⚠️ License & Disclaimer</h1>
                <div className="license-content">
                  <p>
                    PokéPixel is an independent fan-made project inspired by the classic monster-catching genre.
                  </p>
                  <p>
                    We are <strong>not affiliated, connected, or endorsed</strong> by Nintendo, Game Freak, The Pokémon Company, or any related entity.
                    All references are purely creative tributes to the legendary Pokémon series, and PokéPixel operates as its own independent project.
                  </p>
                  <p>
                    Our team consists of passionate Web3 developers and artists creating new, blockchain-based gaming experiences.
                  </p>
                  
                  <div className="disclaimer-box">
                    <h3>📜 Important Notice</h3>
                    <ul>
                      <li>This is a fan-made, independent Web3 project</li>
                      <li>No official connection to Nintendo or The Pokémon Company</li>
                      <li>All game assets are original or properly licensed</li>
                      <li>Built on Solana blockchain for transparency and decentralization</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {active === "credit" && (
              <section>
                <h1>👾 Credits</h1>
                <div className="credits-content">
                  <div className="credit-card">
                    <h3>Development Team</h3>
                    <p>Developed by <strong>[RB_pokepixel],[PS_pokepixel]</strong></p>
                    
                    <p>A passionate team of Web3 developers and pixel artists bringing blockchain gaming to life.</p>
                  </div>

                  <div className="credit-card">
                    <h3>Community</h3>
                    <p>Thank you for playing and supporting the early PokéPixel Alpha — your journey is just beginning! 🌟</p>
                    <p>Join us on this adventure and be part of the next generation of blockchain gaming.</p>
                  </div>

                  <div className="credit-card">
                    <h3>Special Thanks</h3>
                    <p>To all early alpha testers, community members, and supporters who believed in this project from the start.</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </article>
      </div>
      
      {sidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)} />}
      
      <footer className="docs-footer">
        <div className="footer-container">
          <span>© {new Date().getFullYear()} Pokepixel. All rights reserved.</span>
        </div>
      </footer>

      <style jsx>{`
  * {
    box-sizing: border-box;
  }
  
  :global(html, body) { 
    margin: 0; 
    padding: 0; 
    background: linear-gradient(135deg, #000000 0%, #1a001a 100%);
    width: 100%;
    overflow-x: hidden;
    scroll-padding-top: 80px; /* Smooth scrolling offset for fixed navbar */
  }
  /* Override global game CSS on docs: ensure normal flow and no centering */
  :global(body) {
    display: block;
    justify-content: initial;
    align-items: initial;
    padding: 0; /* ensure no body padding pushes content */
  }
  
  .docs-root { 
    min-height: 100vh; 
    display: flex; 
    flex-direction: column; 
    background: transparent; 
    color: #f8e7ff; 
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  .docs-nav { 
    height: 64px; 
    border-bottom: 1px solid rgba(75, 0, 130, 0.5); 
    background: linear-gradient(135deg, #2F1B41 0%, #1B1024 100%); 
    position: sticky; 
    top: 0; 
    z-index: 30; 
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }
  
  .nav-container {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
  
  .brand { 
    width: 100%;
    height: 64px; 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    padding: 0 24px; 
    margin: 0;
  }
  
  .brand img { 
    width: 32px; 
    height: 32px; 
    border-radius: 8px; 
  }
  
  .brand span { 
    font-weight: 700; 
    font-size: 18px; 
    color: #FF8C00; 
    text-shadow: 0px 0px 12px rgba(255, 140, 0, 0.8);
    flex: 1; 
  }
  
  .menu-btn { 
    display: none; 
    background: transparent; 
    border: none; 
    font-size: 22px; 
    line-height: 1; 
    cursor: pointer; 
    padding: 6px 8px; 
    color: #FF8C00; 
    text-shadow: 0px 0px 12px rgba(255, 140, 0, 0.8);
  }

  .docs-main { 
    flex: 1; 
    display: grid; 
    grid-template-columns: 280px 1fr; 
    gap: 0; 
    width: 100%; 
    margin: 0;
    padding: 0;
    min-height: calc(100vh - 64px);
    background: radial-gradient(1200px 400px at 20% -10%, rgba(75,0,130,0.15), transparent),
                radial-gradient(900px 300px at 100% 0%, rgba(255,69,0,0.08), transparent);
  }
  
  .docs-sidebar { 
    border-right: 1px solid rgba(75, 0, 130, 0.5); 
    background: linear-gradient(180deg, #251633 0%, #110A18 100%); 
    position: sticky; 
    top: 64px; 
    height: calc(100vh - 64px); 
    overflow-y: auto;
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: inset 0 0 18px rgba(0,0,0,0.6);
  }
  
  .sidebar-content {
    padding: 24px 0;
    width: 100%;
  }
  
  .nav-item { 
    display: block; 
    width: 100%; 
    text-align: left; 
    border: none; 
    background: transparent; 
    padding: 14px 24px; 
    margin: 0;
    color: #d6c3ff; 
    cursor: pointer; 
    border-right: 3px solid transparent;
    transition: all 0.2s ease;
    font-size: 15px;
  }
  
  .nav-item:hover { 
    background: rgba(75, 0, 130, 0.25); 
    color: #ffffff; 
  }
  
  .nav-item.active { 
    background: rgba(75, 0, 130, 0.35); 
    color: #FF8C00; 
    text-shadow: 0 0 8px rgba(255,140,0,0.6);
    font-weight: 700; 
    border-right-color: #FF4500;
  }

  .docs-content { 
    min-width: 0; 
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    color: #f8e7ff;
  }
  
  .content-container {
    width: 100%;
    max-width: 100%;
    padding: 40px 48px;
    margin: 0;
  }
  
  .docs-content h1 { 
    margin: 0 0 24px 0; 
    font-size: 32px; 
    color: #FF8C00; 
    text-shadow: 0 0 14px rgba(255,140,0,0.5);
    font-weight: 800;
    /* Add scroll margin to account for fixed navbar */
    scroll-margin-top: 80px;
    /* Add padding top to ensure visibility */
    padding-top: 16px;
  }
  
  .docs-content h2 { 
    margin: 32px 0 16px 0;
    font-size: 24px;
    color: #ffa64d;
    font-weight: 700;
    text-shadow: 0 0 10px rgba(255,140,0,0.35);
    /* Add scroll margin for h2 as well */
    scroll-margin-top: 80px;
    padding-top: 16px;
  }

  /* Ensure all heading levels account for sticky nav when linked via hash */
  .docs-content h3,
  .docs-content h4,
  .docs-content h5,
  .docs-content h6 {
    scroll-margin-top: 80px;
  }
  
  .docs-content h3 { 
    margin: 24px 0 12px 0; 
    font-size: 18px; 
    color: #e6d7ff; 
    font-weight: 700;
  }
  
  .docs-content p, .docs-content li { 
    color: #000000; 
    line-height: 1.7; 
    font-size: 16px; 
    margin-bottom: 16px;
  }
  
  .docs-content code { 
    background:rgb(5, 5, 5); 
    padding: 4px 8px; 
    border-radius: 6px; 
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 14px;
  }
  
  .docs-content ul, .docs-content ol { 
    padding-left: 24px; 
  }

  /* Feature Grid */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin: 32px 0;
    width: 100%;
  }

  .feature-card {
    background: linear-gradient(180deg, rgba(47,27,65,0.85) 0%, rgba(27,16,36,0.85) 100%);
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #4B0082;
    box-shadow: 0 8px 25px rgba(0,0,0,0.5), inset 0 3px 10px rgba(255,255,255,0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.6);
  }

  .feature-card h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
    color: #FF8C00;
    text-shadow: 0 0 8px rgba(255,140,0,0.5);
  }

  .feature-card p {
    margin: 0;
    font-size: 14px;
    color: #000000;
  }

  /* Steps */
  .steps {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 32px 0;
    width: 100%;
  }

  .step {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .step-number {
    background: linear-gradient(180deg, #2F1B41 0%, #1B1024 100%);
    color: #FF8C00;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    alignogens: center;
    justify-content: center;
    font-weight: 800;
    box-shadow: 0 0 10px rgba(255,69,0,0.35);
    flex-shrink: 0;
    border: 2px solid #4B0082;
  }

  .step-content h3 {
    margin: 0 0 8px 0;
  }

  .step-content p {
    margin: 0;
    color: #64748b;
  }

  /* Gameplay Grid */
  .gameplay-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 32px 0;
    width: 100%;
  }

  .gameplay-item {
    background: linear-gradient(180deg, rgba(47,27,65,0.85) 0%, rgba(27,16,36,0.85) 100%);
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #4B0082;
    box-shadow: 0 8px 20px rgba(0,0,0,0.45);
  }

  .gameplay-item h3 {
    margin: 0 0 8px 0;
  }

  .gameplay-item p {
    margin: 0;
    font-size: 14px;
    color: #000000;
  }

  /* Rewards */
  .rewards-section {
    margin: 32px 0;
    width: 100%;
  }

  .rewards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin: 20px 0;
    width: 100%;
  }

  .reward-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: #f0f9ff;
    border-radius: 8px;
    text-align: center;
  }

  .reward-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  /* Roadmap */
  .roadmap-timeline {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 32px 0;
    width: 100%;
  }

  .roadmap-phase {
    background: #f8fafc;
    padding: 24px;
    border-radius: 8px;
    border-left: 4px solid #1d4ed8;
  }

  .phase-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .phase-header h3 {
    margin: 0;
    flex: 1;
  }

  .phase-status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .phase-status.current {
    background: #dcfce7;
    color: #166534;
  }

  .phase-status.upcoming {
    background: #fef3c7;
    color: #92400e;
  }

  /* Contract */
  .contract-card {
    background: linear-gradient(180deg, rgba(47,27,65,0.85) 0%, rgba(27,16,36,0.85) 100%);
    padding: 24px;
    border-radius: 8px;
    margin: 24px 0;
    width: 100%;
    border: 1px solid #4B0082;
    box-shadow: 0 8px 20px rgba(0,0,0,0.45);
  }

  .contract-address {
    display: block;
    background: linear-gradient(180deg, #2F1B41 0%, #1B1024 100%);
    color: #FF8C00;
    padding: 16px;
    border-radius: 8px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    margin: 16px 0;
    word-break: break-all;
    width: 100%;
    border: 1px solid #4B0082;
    box-shadow: inset 0 3px 10px rgba(255,255,255,0.05);
  }

  .contract-note {
    color: #000000;
    font-size: 14px;
    margin: 0;
  }

  .contract-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .copy-btn {
    background: linear-gradient(180deg, #2F1B41 0%, #1B1024 100%);
    color: #FF8C00;
    border-radius: 8px;
    padding: 10px 14px;
    font-weight: 800;
    border: 1px solid #4B0082;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    text-shadow: 0 0 8px rgba(255,140,0,0.5);
  }

  .copy-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(0,0,0,0.4);
  }

  /* FAQ */
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 32px 0;
    width: 100%;
  }

  .faq-item {
    background: linear-gradient(180deg, rgba(47,27,65,0.85) 0%, rgba(27,16,36,0.85) 100%);
    padding: 24px;
    border-radius: 8px;
    border: 1px solid #4B0082;
    box-shadow: 0 8px 20px rgba(0,0,0,0.45);
  }

  .faq-item h3 {
    margin: 0 0 12px 0;
  }

  .faq-item p {
    margin: 0;
    color: #000000;
  }

  /* Tips */
  .tips {
    background: rgba(75,0,130,0.25);
    padding: 20px;
    border-radius: 8px;
    margin: 24px 0;
    width: 100%;
    border-left: 4px solid #4B0082;
  }

  .tips h3 {
    margin: 0 0 12px 0;
  }

  .tips ul {
    margin: 0;
  }

  /* Box Types */
  .box-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 24px 0;
    width: 100%;
  }

  .box-type-card {
    background: linear-gradient(180deg, rgba(47,27,65,0.85) 0%, rgba(27,16,36,0.85) 100%);
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #FF4500;
    box-shadow: 0 8px 20px rgba(0,0,0,0.45);
  }

  .box-type-card h3 {
    margin: 0 0 8px 0;
    color: #FF8C00;
    text-shadow: 0 0 8px rgba(255,140,0,0.5);
  }

  .box-type-card p {
    margin: 0;
    color: #000000;
    font-size: 14px;
  }

  /* Info Box */
  .info-box {
    background: rgba(255, 140, 0, 0.12);
    padding: 24px;
    border-radius: 8px;
    border-left: 4px solid #FF8C00;
    margin: 32px 0;
    width: 100%;
  }

  .info-box h3 {
    margin: 0 0 12px 0;
    color: #FF8C00;
  }

  .info-box p {
    margin: 8px 0;
    color: #000000;
  }

  .info-box ul {
    margin: 12px 0;
    padding-left: 24px;
    color: #000000;
  }

  .info-box li {
    margin: 6px 0;
  }

  /* Mobile Warning */
  .mobile-warning {
    background: rgba(255,69,0,0.12);
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #FF4500;
    margin: 24px 0;
    width: 100%;
  }

  .mobile-warning p {
    margin: 8px 0;
    color: #000000;
  }

  .mobile-warning strong {
    color: #FF4500;
  }

  /* Tip Box */
  .tip-box {
    background: rgba(50,205,50,0.12);
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #32CD32;
    margin: 24px 0;
    width: 100%;
  }

  .tip-box h3 {
    margin: 0 0 12px 0;
    color: #9cff9c;
  }

  .tip-box p {
    margin: 0;
    color: #000000;
  }

  /* License & Credits */
  .license-content {
    margin: 24px 0;
  }

  .license-content p {
    margin: 16px 0;
    line-height: 1.6;
    color: #000000;
  }

  .disclaimer-box {
    background: #fef3c7;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #f59e0b;
    margin: 24px 0;
  }

  .disclaimer-box h3 {
    margin: 0 0 12px 0;
    color: #92400e;
  }

  .disclaimer-box ul {
    margin: 12px 0;
    padding-left: 24px;
    color: #000000;
  }

  .disclaimer-box li {
    margin: 8px 0;
  }

  .credits-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 24px 0;
  }

  .credit-card {
    background: linear-gradient(180deg, rgba(47,27,65,0.85) 0%, rgba(27,16,36,0.85) 100%);
    padding: 24px;
    border-radius: 8px;
    border-left: 4px solid #4B0082;
    box-shadow: 0 8px 20px rgba(0,0,0,0.45);
  }

  .credit-card h3 {
    margin: 0 0 12px 0;
    color: #FF8C00;
    text-shadow: 0 0 8px rgba(255,140,0,0.5);
  }

  .credit-card p {
    margin: 8px 0;
    color: #000000;
    line-height: 1.6;
  }

  .docs-footer { 
    border-top: 1px solid rgba(75,0,130,0.5); 
    background: linear-gradient(135deg, #2F1B41 0%, #1B1024 100%); 
    padding: 24px; 
    text-align: center; 
    color: #d6c3ff; 
    width: 100%;
    margin: 0;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.4);
  }

  .footer-container {
    width: 100%;
    max-width: 100%;
  }

  @media (max-width: 900px) {
    .menu-btn { display: inline-block; }
    .docs-main { grid-template-columns: 1fr; }
    .docs-sidebar { 
      position: fixed; 
      top: 64px; 
      left: 0; 
      bottom: 0; 
      width: 82%; 
      max-width: 320px; 
      border-right: 1px solid rgba(75,0,130,0.5); 
      border-bottom: none; 
      background: linear-gradient(180deg, #251633 0%, #110A18 100%); 
      transform: translateX(-100%); 
      transition: transform 200ms ease; 
      z-index: 40; 
      height: auto; 
      padding: 0;
      overflow: auto; 
      box-shadow: inset 0 0 18px rgba(0,0,0,0.6);
    }
    .sidebar-content {
      padding: 16px 0;
    }
    .docs-sidebar.open { transform: translateX(0); box-shadow: 2px 0 12px rgba(0,0,0,0.15); }
    .backdrop { position: fixed; top: 64px; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.25); z-index: 35; }
    .nav-item { padding: 16px 24px; font-size: 16px; }
    .content-container { padding: 24px; }
    
    /* Add mobile-specific scroll margin */
    .docs-content h1,
    .docs-content h2 {
      scroll-margin-top: 72px;
    }
    
    .feature-grid,
    .gameplay-grid,
    .rewards-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .brand {
      padding: 0 16px;
    }
    .content-container {
      padding: 20px;
    }
  }

  @media (max-width: 480px) {
    .content-container {
      padding: 16px;
    }
    
    .feature-card,
    .gameplay-item,
    .faq-item {
      padding: 16px;
    }
    
    /* Adjust scroll margin for very small screens */
    .docs-content h1,
    .docs-content h2 {
      scroll-margin-top: 68px;
    }
  }
`}</style>
    </div>
  );
}