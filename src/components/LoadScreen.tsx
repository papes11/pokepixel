import styled from "styled-components"; 
import Menu from "./Menu"; 
import { useState, useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux"; 
import { load, selectHasSave, selectName } from "../state/gameSlice"; 
import { 
  hideLoadMenu, 
  selectGameboyMenu, 
  selectLoadMenu, 
  selectTitleMenu, 
  showText, 
} from "../state/uiSlice"; 
import Text from "./Text"; 
 
const StyledLoadScreen = styled.div` 
  position: absolute; 
  top: 0; 
  left: 0; 
  height: 100%; 
  width: 100%; 
  z-index: 1000; 
  background: var(--bg); 
`; 
 
const LoadScreen = () => { 
  const dispatch = useDispatch(); 
  const [loaded, setLoaded] = useState(false); 
  const [hasSave, setHasSave] = useState(false);
  const titleOpen = useSelector(selectTitleMenu); 
  const show = useSelector(selectLoadMenu); 
  const gameboyOpen = useSelector(selectGameboyMenu);

  const playerName = useSelector(selectName);

  // Handle client-side save detection to prevent hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setHasSave(localStorage.getItem(playerName) !== null);
      } catch {
        setHasSave(false);
      }
    }
  }, [playerName]);

  const copyToClipboard = async (text: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        dispatch(showText(["✅ Contract Address copied to clipboard!"]));
        return;
      }
      
      // Fallback for older browsers and mobile
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        dispatch(showText(["✅ Contract Address copied to clipboard!"]));
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      dispatch(showText([
        "❌ Auto-copy failed on this device",
        "",
        "📋 Contract Address:",
        text,
        "",
        "📱 Mobile users:",
        "1. Long press the address above",
        "2. Select 'Copy' from the menu",
        "",
        "💻 Desktop users:",
        "1. Select the address above",
        "2. Press Ctrl+C (or Cmd+C on Mac)"
      ]));
    }
  }; 
 
  const loadComplete = () => { 
    setLoaded(true); 
    setTimeout(() => { 
      dispatch(hideLoadMenu()); 
    }, 300); 
  }; 
 
  const newGame = { 
    label: "New Game", 
    action: () => { 
      loadComplete(); 
    }, 
  };

  const continueGame = {
    label: "Continue",
    action: () => {
      dispatch(load());
      loadComplete();
    },
  }; 
 
  const questBox = { 
    label: "Quest Box", 
    action: () => 
      dispatch( 
        showText([ 
          "🎁 Mystery Box System 🎁", 
          "🔮 What are Mystery Boxes?", 
          "Mystery boxes are hidden quest rewards", 
          "that spawn randomly across the game world", 
          "based on your experience and level.", 
          "", 
          "📈 Level-Based Spawning:", 
          "Higher level = More frequent spawns!", 
          "The more you play, the more boxes appear", 
          "and stay/respawn in different locations.", 
          "", 
          "💎 Hidden Rewards Include:", 
          "- NFTs & cNFTs", 
          "- SOL tokens", 
          "- Rare game items", 
          "- Pokepixel tokens", 
          "", 
          "🔄 Beta & Super Phase:", 
          "Each NFT/cNFT item can be swapped", 
          "for Pokepixel tokens in future phases!", 
          "", 
          "🎯 Pro Tip:", 
          "More items = Bigger airdrops!", 
          "Keep exploring and collecting", 
          "to maximize your rewards.", 
        ]) 
      ), 
  }; 

  const contractAddress = { 
    label: "Official CA", 
    action: () => {
      const ca = "5kXGnT7kKjutRJL8dQTLBAPq8jKzDZsg8MB2reHNJiA8";
      copyToClipboard(ca);
    }, 
  }; 

  const social = { 
    label: "Social", 
    action: () => 
      dispatch( 
        showText([ 
          "🌟 Pokepixel Social & Development 🌟", 
          "👥 Our Development Team:", 
          "Developers from multiple successful", 
          "projects are working on Pokepixel.", 
          "", 
          "🚀 Development Phases:", 
          "Alpha Phase: Live on PumpFun now!", 
          "Beta Phase: Coming to DexScreen", 
          "Super Phase: Full ecosystem launch", 
          "", 
          "🔗 Social Links:", 
          "Alpha Phase: Early player community", 
          "Beta Phase: Full social links available", 
          "We're building the core community now!", 
          "", 
          "💰 Don't Miss Out:", 
          "Missed Pudgy Penguins? ❌", 
          "Missed Jupiter airdrop? ❌", 
          "Don't miss Pokepixel! ✅", 
          "", 
          "🎁 Early Player Benefits:", 
          "More items = Massive airdrops", 
          "Core community gets priority rewards", 
          "Join now and be part of something HUGE!", 
          "", 
          "Social links updating soon...", 
        ]) 
      ), 
  };

  const faq = { 
    label: "FAQs", 
    action: () => 
      dispatch( 
        showText([ 
          "✨ Pokepixel FAQ ✨", 
          "🎮 What is Pokepixel?", 
          "Pokepixel is a free-to-play,", 
          "on the Solana blockchain,", 
          "play-to-earn game where you explore", 
          "and find hidden quest boxes.", 
          "🧩 How do I play?", 
          "Connect wallet, hold 10k Pokepixel,", 
          "and start playing now!", 
          "Roam the world map,", 
          "hidden boxes spawn randomly,", 
          "collect quest box items,", 
          "and level up your airdrop,", 
          "giving you rewards and surprises!", 
          "🚀 What phase are we in?", 
          "AlphaNet is OPEN —", 
          "join and be part of something huge.", 
          "🎁 What's coming next?", 
          "- Massive airdrops for early players", 
          "- Swap features in BetaNet", 
          "- More quests and hidden box events", 
          "🔥 Don't wait! Start your journey,", 
          "find quest boxes, and claim your rewards!", 
          "Only on the Solana blockchain.", 
          "AlphaNet is open now!", 
          "Social links updating soon!", 
        ]) 
      ), 
  }; 

  const docs = {
    label: "Docs",
    action: () => {
      try {
        const a = document.createElement('a');
        a.href = "/docs";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        // Required for some mobile browsers to treat as user gesture
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.error(e);
      }
    },
  };
 
  if (!show) return null; 
 
  return ( 
    <StyledLoadScreen> 
      <Text/> 
      <Menu 
        disabled={titleOpen || gameboyOpen} 
        show={!loaded} 
        menuItems={hasSave ? [continueGame, newGame, questBox, contractAddress, social, faq, docs] : [newGame, questBox, contractAddress, social, faq, docs]} 
        close={() => setLoaded(true)} 
        noExit 
        top="2px" 
        left="2px" 
        padding="7vw" 
      /> 
    </StyledLoadScreen> 
  ); 
}; 
 
export default LoadScreen;
