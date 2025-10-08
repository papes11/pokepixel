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

  // Handler functions to prevent code repetition
  const handleButtonClick = (event: Event) => () => emitter.emit(event);

  const handleTouchStart = (event: Event) => () => emitter.emit(event);

  const handleTouchEnd = (event: Event) => () => emitter.emit(event);

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
              <div className="led"></div>
              <span className="arc" style={{ zIndex: 2 }}></span>
              <span className="arc" style={{ zIndex: 1 }}></span>
              <span className="arc" style={{ zIndex: 0 }}></span>
            </div>
            Alphanet
          </div>
          <div className="toplogo">POKEPIXEL</div>

          <div className="display">{children}</div>

          <div className="label flex">
            <div className="title">SolBOY</div>
            <img src="/sol.jpg" />
          </div>
        </div>
      </div>
      {/* Only show connect wallet button on smaller screens (< 1000px) */}
      {isSmallScreen && (
        <div
          className="connect"
          style={{ display: "flex", alignItems: "center" }}
        >
          <CustomConnectButton />
        </div>
      )}

      {isSmallScreen && (
        <button
          className="connect1"
          aria-label="Toggle music"
          onClick={() => {
            setMusicUiMuted((v) => !v);
            emitter.emit(Event.ToggleMusic);
          }}
        >
          {musicUiMuted ? <MicOff size={14} /> : <Mic size={14} />}
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
                  border: "2px solid #333",
                  background: "#f9f2fa",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {musicUiMuted ? <MicOff size={14} /> : <Mic size={14} />}
                <span>{musicUiMuted ? "Silent" : "Music"}</span>
              </button>
            </div>
          )}
          <div className="dpad">
            <div
              className="up"
              onClick={handleButtonClick(Event.Up)}
              onTouchStart={handleTouchStart(Event.StartUp)}
              onTouchEnd={handleTouchEnd(Event.StopUp)}
            >
              <CaretUp size={24} />
            </div>

            <div
              className="right"
              onClick={handleButtonClick(Event.Right)}
              onTouchStart={handleTouchStart(Event.StartRight)}
              onTouchEnd={handleTouchEnd(Event.StopRight)}
            >
              <CaretRight size={24} />
            </div>

            <div
              className="down"
              onClick={handleButtonClick(Event.Down)}
              onTouchStart={handleTouchStart(Event.StartDown)}
              onTouchEnd={handleTouchEnd(Event.StopDown)}
            >
              <CaretDown size={24} />
            </div>

            <div
              className="left"
              onClick={handleButtonClick(Event.Left)}
              onTouchStart={handleTouchStart(Event.StartLeft)}
              onTouchEnd={handleTouchEnd(Event.StopLeft)}
            >
              <CaretLeft size={24} />
            </div>

            <div className="middle"></div>
          </div>

          <div className="a-b">
            <div className="b" onClick={handleButtonClick(Event.B)}>
              B
            </div>
            <div className="a" onClick={handleButtonClick(Event.A)}>
              A
            </div>
          </div>
        </div>

        <div className="start-select">
          <div className="select" onClick={handleButtonClick(Event.B)}>
            BACK
          </div>
          <div className="start" onClick={handleButtonClick(Event.Start)}>
            SELECT
          </div>
        </div>
      </div>

      <Speaker />
      <Speaker />

      <Speaker1 />
    </div>
  );
};

export default Gameboy;
