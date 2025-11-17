import React from "react";
import "./gameboy.css";
import emitter, { Event } from "../app/emitter";
import {
  FaCaretUp,
  FaCaretRight,
  FaCaretDown,
  FaCaretLeft,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import CustomConnectButton from "../wallets/wallets";
import useIsMobile from "../app/use-is-mobile";
import { useWallet } from "@solana/wallet-adapter-react";

// Custom hook for gameboy-specific responsive behavior
const useIsSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    window.addEventListener("resize", checkScreenSize);
    checkScreenSize(); // Check initial size

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isSmallScreen;
};

interface Props {
  children?: React.ReactNode;
}

// Cast icons to any to bypass TypeScript errors
const CaretUp = FaCaretUp as any;
const CaretRight = FaCaretRight as any;
const CaretDown = FaCaretDown as any;
const CaretLeft = FaCaretLeft as any;
const Mic = FaMicrophone as any;
const MicOff = FaMicrophoneSlash as any;

const Gameboy = ({ children }: Props) => {
  const isSmallScreen = useIsSmallScreen(); // Use 1000px breakpoint to match CSS
  const [musicUiMuted, setMusicUiMuted] = React.useState(false);
  const { connected } = useWallet();
  const [isConnected, setIsConnected] = React.useState(false);

  // Ensure we update the connection status when it changes
  React.useEffect(() => {
    setIsConnected(connected);
  }, [connected]);

  const contractAddress = "https://www.pokepixel.xyz/docs";
  
  // URLs for swap and docs
  const swapUrl = "/swap";
  const docsUrl = "/docs";

  // Emit helpers that stop propagation (avoid passive listener preventDefault warnings)
  const emitPrevent = (ev: Event, extra?: Event[]) => (e: React.TouchEvent | React.MouseEvent) => {
    if (e && typeof (e as any).stopPropagation === "function") (e as any).stopPropagation();
    // Emit discrete event(s) first so menus react immediately, then continuous
    if (extra && extra.length) extra.forEach((x) => emitter.emit(x));
    emitter.emit(ev);
  };

  // Track if we've already emitted discrete events for this press
  const [emittedDiscrete, setEmittedDiscrete] = React.useState({
    up: false,
    down: false,
    left: false,
    right: false
  });

  // Track last event type to prevent double-firing
  const lastEventTypeRef = React.useRef<string>('');

  const emitDiscreteOnce = (direction: keyof typeof emittedDiscrete, discreteEv: Event, continuousEv: Event) => (e: React.TouchEvent | React.MouseEvent) => {
    if (e && typeof (e as any).stopPropagation === "function") (e as any).stopPropagation();
    
    // Prevent double-firing on mobile (both touch and mouse events fire)
    const currentEventType = e.type;
    if (currentEventType === 'mousedown' && lastEventTypeRef.current === 'touchstart') {
      lastEventTypeRef.current = currentEventType;
      return;
    }
    lastEventTypeRef.current = currentEventType;
    
    // Only emit discrete event on first press
    if (!emittedDiscrete[direction]) {
      emitter.emit(discreteEv);
      setEmittedDiscrete(prev => ({ ...prev, [direction]: true }));
    }
    
    // Always emit continuous event for movement
    emitter.emit(continuousEv);
  };

  const emitStop = (direction: keyof typeof emittedDiscrete, stopEv: Event) => (e: React.TouchEvent | React.MouseEvent) => {
    if (e && typeof (e as any).stopPropagation === "function") (e as any).stopPropagation();
    emitter.emit(stopEv);
    setEmittedDiscrete(prev => ({ ...prev, [direction]: false }));
  };

  // Speaker dot pattern data to reduce repetition
  const speakerPattern = [
    "placeholder",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "placeholder",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "placeholder",
    "closed",
    "open",
    "closed",
    "open",
    "closed",
    "open",
    "placeholder",
  ];

  // Speaker component to avoid duplication
  const Speaker = () => (
    <div className="speaker">
      {speakerPattern.map((type, index) => (
        <div key={index} className={`dot ${type}`} />
      ))}
    </div>
  );
  const Speaker1 = () => (
    <div className="speaker1">
      {speakerPattern.map((type, index) => (
        <div key={index} className={`dot ${type}`} />
      ))}
    </div>
  );

  return (
    <div className="gameboy" id="GameBoy">
      <div className="display-section">
        <div className="screen-area">
          <div className="power">
            <div className="indicator">
              <div className={`led ${isConnected ? 'connected' : 'disconnected'}`}></div>
              {/* <div className="led"></div> */}
              
            </div>
            BETAV1
          </div>
          <div className="toplogo">POKEPIXEL</div>

          <div className="display">{children}</div>

          <div className="label">
            <div className="title">SolBOY</div>
            <img src="/sol.jpg" />
          </div>
        </div>
      </div>
      {/* Only show connect wallet button on smaller screens (< 1000px) */}
      {isSmallScreen && (
        <div className="walletconnect">
          <CustomConnectButton />
        </div>
      )}

      {isSmallScreen && (
        <button
          className="music-toggle"
          aria-label="Toggle music"
          onClick={() => {
            setMusicUiMuted((v) => !v);
            emitter.emit(Event.ToggleMusic);
          }}
        >
          {musicUiMuted ? <MicOff size={14} /> : <Mic size={14} />}

        </button>
      )}

      {/* Swap and Docs buttons for mobile */}
      {isSmallScreen && (
        <button
          className="copyswap"
          aria-label="Go to Swap"
          onClick={() => window.open(swapUrl, "_blank")}
          style={{ left: 15 }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: "#C0C0C0" }}>SWAP</span>
        </button>
      )}

      {isSmallScreen && (
        <button
          className="copyca"
          aria-label="Go to Docs"
          onClick={() => window.open(docsUrl, "_blank")}
          style={{ right: 15 }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: "#C0C0C0" }}>DOCS</span>
        </button>
      )}

      <div className="control-section">
        <div className="controls">
          {/* Music toggle for larger screens: place above D-pad near connect area */}
          {!isSmallScreen && (
            <div style={{ position: "absolute", right: 24, top: 16 }}>
              <button
                aria-label="Toggle music"
                onClick={() => {
                  setMusicUiMuted((v) => !v);
                  emitter.emit(Event.ToggleMusic);
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "2px solid #333333",
                  background: "linear-gradient(135deg, #2c2c2c 0%, #000000 50%, #1a1a1a 100%)",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#C0C0C0",
                  boxShadow: "-1px 1px 5px black, 0px 0px 5px black inset"
                }}
              >
                {musicUiMuted ? <MicOff size={14} /> : <Mic size={14} />}
                <span>{musicUiMuted ? "Silent" : "Music"}</span>
              </button>
            </div>
          )}
          
          {/* Swap button for desktop - left side */}
          {!isSmallScreen && (
            <div style={{ position: "absolute", left: 24, top: 16 }}>
              <button
                aria-label="Go to Swap"
                onClick={() => window.open(swapUrl, "_blank")}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "2px solid #333333",
                  background: "linear-gradient(135deg, #2c2c2c 0%, #000000 50%, #1a1a1a 100%)",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  color: "#C0C0C0",
                  boxShadow: "-1px 1px 5px black, 0px 0px 5px black inset"
                }}
              >
                <span style={{ fontWeight: 700 }}>SWAP</span>
              </button>
            </div>
          )}
          
          {/* Docs button for desktop - right side */}
          {!isSmallScreen && (
            <div style={{ position: "absolute", right: 120, top: 16 }}>
              <button
                aria-label="Go to Docs"
                onClick={() => window.open(docsUrl, "_blank")}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "2px solid #333333",
                  background: "linear-gradient(135deg, #2c2c2c 0%, #000000 50%, #1a1a1a 100%)",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  color: "#C0C0C0",
                  boxShadow: "-1px 1px 5px black, 0px 0px 5px black inset"
                }}
              >
                <span style={{ fontWeight: 700 }}>DOCS</span>
              </button>
            </div>
          )}
          <div className="dpad">
            <div
              className="up"
              onMouseDown={emitDiscreteOnce('up', Event.Up, Event.StartUp)}
              onMouseUp={emitStop('up', Event.StopUp)}
              onTouchStart={emitDiscreteOnce('up', Event.Up, Event.StartUp)}
              onTouchEnd={emitStop('up', Event.StopUp)}
            >
              <CaretUp size={24} />
            </div>

            <div
              className="right"
              onMouseDown={emitDiscreteOnce('right', Event.Right, Event.StartRight)}
              onMouseUp={emitStop('right', Event.StopRight)}
              onTouchStart={emitDiscreteOnce('right', Event.Right, Event.StartRight)}
              onTouchEnd={emitStop('right', Event.StopRight)}
            >
              <CaretRight size={24} />
            </div>

            <div
              className="down"
              onMouseDown={emitDiscreteOnce('down', Event.Down, Event.StartDown)}
              onMouseUp={emitStop('down', Event.StopDown)}
              onTouchStart={emitDiscreteOnce('down', Event.Down, Event.StartDown)}
              onTouchEnd={emitStop('down', Event.StopDown)}
            >
              <CaretDown size={24} />
            </div>

            <div
              className="left"
              onMouseDown={emitDiscreteOnce('left', Event.Left, Event.StartLeft)}
              onMouseUp={emitStop('left', Event.StopLeft)}
              onTouchStart={emitDiscreteOnce('left', Event.Left, Event.StartLeft)}
              onTouchEnd={emitStop('left', Event.StopLeft)}
            >
              <CaretLeft size={24} />
            </div>

            <div className="middle"></div>
          </div>

          <div className="a-b">
            <div className="b" onMouseDown={emitPrevent(Event.B)} onTouchStart={emitPrevent(Event.B)}>
              B
            </div>
            <div className="a" onMouseDown={emitPrevent(Event.A)} onTouchStart={emitPrevent(Event.A)}>
              A
            </div>
          </div>
        </div>

        <div className="start-select">
          <div className="select" onMouseDown={emitPrevent(Event.B)} onTouchStart={emitPrevent(Event.B)}>
            BACK
          </div>
          <div className="start" onMouseDown={emitPrevent(Event.Start)} onTouchStart={emitPrevent(Event.Start)}>
            SELECT
          </div>
        </div>
      </div>

      
      

      <Speaker1 />
    </div>
  );
};

export default Gameboy;
