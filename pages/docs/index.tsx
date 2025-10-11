import React from "react";

type DocKey =
  | "overview"
  | "getting-started"
  | "gameplay"
  | "mystery-boxes"
  | "roadmap"
  | "contract"
  | "faq";

const SECTIONS: { key: DocKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "getting-started", label: "Getting Started" },
  { key: "gameplay", label: "Gameplay" },
  { key: "mystery-boxes", label: "Mystery Boxes" },
  { key: "roadmap", label: "Roadmap" },
  { key: "contract", label: "Official Contract" },
  { key: "faq", label: "FAQ" },
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
                <h1>Overview</h1>
                <p>Pokepixel is a retro adventure on Solana. Explore, discover hidden quest boxes, and collect rewards that contribute to future airdrops.</p>
                <div className="feature-grid">
                  <div className="feature-card">
                    <h3>🎮 Play to Earn</h3>
                    <p>Collect items and progress your account for future rewards and airdrops.</p>
                  </div>
                  <div className="feature-card">
                    <h3>🔍 Explore</h3>
                    <p>Discover hidden quest boxes and mysterious locations across the map.</p>
                  </div>
                  <div className="feature-card">
                    <h3>🎯 Complete Quests</h3>
                    <p>Engage with NPCs and complete challenges to earn exclusive rewards.</p>
                  </div>
                </div>
              </section>
            )}

            {active === "getting-started" && (
              <section>
                <h1>Getting Started</h1>
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Install a Solana Wallet</h3>
                      <p>Download Phantom, Solflare, or any compatible Solana wallet from your browser&apos;s extension store.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Connect Your Wallet</h3>
                      <p>Open the game and click the connect button to link your wallet securely.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Start Playing</h3>
                      <p>Use keyboard arrows or on-screen D-pad to move and interact with the game world.</p>
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
                <p>Mystery boxes spawn based on your activity and account level. Higher levels increase spawn frequency and persistence.</p>
                
                <div className="rewards-section">
                  <h2>Potential Rewards</h2>
                  <div className="rewards-grid">
                    <div className="reward-item">
                      <span className="reward-icon">🖼️</span>
                      <span>NFTs & cNFTs</span>
                    </div>
                    <div className="reward-item">
                      <span className="reward-icon">💰</span>
                      <span>SOL Rewards</span>
                    </div>
                    <div className="reward-item">
                      <span className="reward-icon">⚡</span>
                      <span>Rare Items</span>
                    </div>
                    <div className="reward-item">
                      <span className="reward-icon">🎯</span>
                      <span>Pokepixel Tokens</span>
                    </div>
                  </div>
                </div>

                <div className="tips">
                  <h3>💡 Pro Tips</h3>
                  <ul>
                    <li>Explore daily to trigger more box spawns</li>
                    <li>Higher level accounts get better rewards</li>
                    <li>Complete quests to increase spawn chances</li>
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
                      <span className="phase-status current">Current</span>
                    </div>
                    <p>Core gameplay live, early community building and testing.</p>
                  </div>
                  <div className="roadmap-phase">
                    <div className="phase-header">
                      <h3>Beta Phase</h3>
                      <span className="phase-status upcoming">Upcoming</span>
                    </div>
                    <p>Expanded quests, swap features, and social features rollout.</p>
                  </div>
                  <div className="roadmap-phase">
                    <div className="phase-header">
                      <h3>Super Phase</h3>
                      <span className="phase-status upcoming">Upcoming</span>
                    </div>
                    <p>Full ecosystem launch and broader blockchain integrations.</p>
                  </div>
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
                    <p>A free-to-play exploration game on Solana with play-to-earn elements. Explore the world, complete quests, and collect rewards.</p>
                  </div>
                  <div className="faq-item">
                    <h3>How do I play?</h3>
                    <p>Connect your Solana wallet, explore the map using keyboard or on-screen controls, and interact with objects and NPCs to find mystery boxes.</p>
                  </div>
                  <div className="faq-item">
                    <h3>Is there a cost to play?</h3>
                    <p>Pokepixel is free to play. You only need a Solana wallet to get started and track your progress.</p>
                  </div>
                  <div className="faq-item">
                    <h3>What are the system requirements?</h3>
                    <p>Any modern browser with a Solana wallet extension. Chrome, Firefox, and Safari are all supported.</p>
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
    background: #ffffff;
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
    background: #ffffff; 
    color: #111826; 
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  .docs-nav { 
    height: 64px; 
    border-bottom: 1px solid #e5e7eb; 
    background: #ffffff; 
    position: sticky; 
    top: 0; 
    z-index: 30; 
    width: 100%;
    margin: 0;
    padding: 0;
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
    color: #111827; 
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
  }
  
  .docs-sidebar { 
    border-right: 1px solid #e5e7eb; 
    background: #fafafa; 
    position: sticky; 
    top: 64px; 
    height: calc(100vh - 64px); 
    overflow-y: auto;
    width: 100%;
    margin: 0;
    padding: 0;
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
    color: #374151; 
    cursor: pointer; 
    border-right: 3px solid transparent;
    transition: all 0.2s ease;
    font-size: 15px;
  }
  
  .nav-item:hover { 
    background: #f3f4f6; 
    color: #111827; 
  }
  
  .nav-item.active { 
    background: #eff6ff; 
    color: #1d4ed8; 
    font-weight: 600; 
    border-right-color: #1d4ed8;
  }

  .docs-content { 
    min-width: 0; 
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
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
    color: #111827; 
    font-weight: 700;
    /* Add scroll margin to account for fixed navbar */
    scroll-margin-top: 80px;
    /* Add padding top to ensure visibility */
    padding-top: 16px;
  }
  
  .docs-content h2 { 
    margin: 32px 0 16px 0;
    font-size: 24px;
    color: #111827;
    font-weight: 600;
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
    color: #111827; 
    font-weight: 600;
  }
  
  .docs-content p, .docs-content li { 
    color: #374151; 
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
    background: #f8fafc;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    transition: transform 0.2s ease;
  }

  .feature-card:hover {
    transform: translateY(-2px);
  }

  .feature-card h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
  }

  .feature-card p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
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
    background: #1d4ed8;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
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
    background: #f8fafc;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #1d4ed8;
  }

  .gameplay-item h3 {
    margin: 0 0 8px 0;
  }

  .gameplay-item p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
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
    background: #f8fafc;
    padding: 24px;
    border-radius: 8px;
    margin: 24px 0;
    width: 100%;
  }

  .contract-address {
    display: block;
    background: #1e293b;
    color: #f1f5f9;
    padding: 16px;
    border-radius: 8px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    margin: 16px 0;
    word-break: break-all;
    width: 100%;
  }

  .contract-note {
    color: #64748b;
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
    background: #1d4ed8;
    color: #ffffff;
    border-radius: 8px;
    padding: 10px 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .copy-btn:hover {
    background: #1e40af;
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
    background: #f8fafc;
    padding: 24px;
    border-radius: 8px;
  }

  .faq-item h3 {
    margin: 0 0 12px 0;
  }

  .faq-item p {
    margin: 0;
    color: #64748b;
  }

  /* Tips */
  .tips {
    background: #f0f9ff;
    padding: 20px;
    border-radius: 8px;
    margin: 24px 0;
    width: 100%;
  }

  .tips h3 {
    margin: 0 0 12px 0;
  }

  .tips ul {
    margin: 0;
  }

  .docs-footer { 
    border-top: 1px solid #e5e7eb; 
    background: #ffffff; 
    padding: 24px; 
    text-align: center; 
    color: #6b7280; 
    width: 100%;
    margin: 0;
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
      border-right: 1px solid #e5e7eb; 
      border-bottom: none; 
      background: #ffffff; 
      transform: translateX(-100%); 
      transition: transform 200ms ease; 
      z-index: 40; 
      height: auto; 
      padding: 0;
      overflow: auto; 
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