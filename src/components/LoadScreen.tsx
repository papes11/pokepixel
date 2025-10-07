import styled from "styled-components"; 
import Menu from "./Menu"; 
import { useState } from "react"; 
import { useDispatch, useSelector } from "react-redux"; 
import { load, selectHasSave } from "../state/gameSlice"; 
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
  const hasSave = useSelector(selectHasSave); 
  const titleOpen = useSelector(selectTitleMenu); 
  const show = useSelector(selectLoadMenu); 
  const gameboyOpen = useSelector(selectGameboyMenu); 
 
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
 
  const loadGame = { 
    label: "Continue", 
    action: () => { 
      dispatch(load()); 
      loadComplete(); 
    }, 
  }; 
 
  const faq = { 
    label: "FAQ", 
    action: () => 
      dispatch( 
        showText([ 
          "✨ Pokepixel FAQ ✨", 
          "🎮 What is Pokepixel?", 
          "Pokepixel is a free-to-play, ", 
          "On solana blockchain,", 
          "play-to-earn game where you explore,", 
          "and find hidden quest boxes.", 
          "🧩 How do I play?", 
          "Connect wallet Hold 10k pokepixel", 
          "and Start playing now", 
          "Roam the world map,", 
          "Hidden boxes spawn randomly", 
          "collect quest boxes items", 
          "and level up your airdrop", 
          "giving you rewards and surprises!", 
          "🚀 What phase are we in?", 
          "AlphaNet is OPEN — ", 
          "join and be part of something huge.", 
          "🎁 What's coming next?", 
          "- Massive airdrops for early players", 
          "- Swap features in BetaNet", 
          "- More quests and  hidden box events", 
          "🔥 Don't wait! Start your journey,", 
          "find quest boxes, and claim your rewards!", 
          "only on solana blockchain", 
          "alphanet is open now!", 
          "Social links updating soon!", 
        ]) 
      ), 
  }; 

  const mysteryBox = { 
    label: "Mystery Box", 
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
 
  if (!show) return null; 
 
  return ( 
     
    <StyledLoadScreen> 
      <Text/> 
      <Menu 
        disabled={titleOpen || gameboyOpen} 
        show={!loaded} 
        menuItems={hasSave ? [loadGame, newGame, faq, mysteryBox, social] : [newGame, faq, mysteryBox, social]} 
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