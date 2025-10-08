/* eslint-disable react/no-unescaped-entities */


import React from "react";
import './docs-page.css';

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
            <img src="/logo512.png" alt="Pokepixel Logo" />
            <span>Pokepixel Docs</span>
            <button className="menu-btn" aria-label="Toggle navigation" onClick={() => setSidebarOpen((v) => !v)}>
              ☰
            </button>
          </div>
        </div>
      </nav>
      <div className="nav-spacer" />
      
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
                      <p>Download Phantom, Solflare, or any compatible Solana wallet from your browser's extension store.</p>
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
                  <code className="contract-address">5kXGnT7kKjutRJL8dQTLBAPq8jKzDZsg8MB2reHNJiA8</code>
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
    </div>
  );
}