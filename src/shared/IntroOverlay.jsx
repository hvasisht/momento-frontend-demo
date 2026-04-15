/* Landing intro — DEMO MODE (no auth) */

function IntroOverlay({dark, onEnter, showForeground=true}) {
  const [hoveredAction, setHoveredAction] = useState(null);
  const [momentsRevealRect, setMomentsRevealRect] = useState(null);
  const [ytHovered, setYtHovered] = useState(false);
  const isMobile = window.innerWidth <= 768;

  useLayoutEffect(()=>{
    if(!showForeground) {
      setMomentsRevealRect(null);
      return;
    }

    let animationFrameId = null;
    let followUntil = 0;

    const updateRevealRect = ()=>{
      const frameElement = document.querySelector("[data-opening-moments-frame]");
      if(!frameElement) {
        setMomentsRevealRect(null);
        return;
      }
      const rect = frameElement.getBoundingClientRect();
      setMomentsRevealRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    const trackFrameDuringLayout = ()=>{
      updateRevealRect();
      if(performance.now() < followUntil){
        animationFrameId = window.requestAnimationFrame(trackFrameDuringLayout);
      }
    };

    const startTracking = (duration = 700)=>{
      followUntil = performance.now() + duration;
      if(animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(trackFrameDuringLayout);
    };

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(()=>startTracking(700))
      : null;
    const frameElement = document.querySelector("[data-opening-moments-frame]");
    if(frameElement && resizeObserver) resizeObserver.observe(frameElement);
    const handleResize = ()=>startTracking(900);
    window.addEventListener("resize", handleResize);
    startTracking(900);

    return ()=>{
      if(animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
      if(resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [showForeground]);

  return (
    <div style={{
      position:"fixed",
      inset:0,
      zIndex:600,
      overflow:"hidden",
      background:"#110b07",
    }}>
      <img
        src="./opening page image.png"
        alt="Library shelf opening scene"
        style={{
          position:"absolute",
          inset:0,
          width:"100%",
          height:"100%",
          objectFit:"cover",
          objectPosition:"center center",
          display:"block",
          opacity:showForeground ? 1 : 0.5,
          transition:"opacity 220ms ease",
        }}
      />

      <div style={{
        position:"absolute",
        inset:0,
        background:showForeground
          ? "radial-gradient(circle at 50% 19%, rgba(255,222,168,0.54) 0%, rgba(255,222,168,0.3) 12%, rgba(255,222,168,0.12) 22%, rgba(255,222,168,0) 36%), radial-gradient(circle at 50% 50%, rgba(255,190,108,0.16) 0%, rgba(255,190,108,0) 44%), radial-gradient(circle at top left, rgba(7,4,2,0.78) 0%, rgba(7,4,2,0.22) 30%, rgba(7,4,2,0) 52%), radial-gradient(circle at top right, rgba(7,4,2,0.78) 0%, rgba(7,4,2,0.22) 30%, rgba(7,4,2,0) 52%), radial-gradient(circle at bottom left, rgba(7,4,2,0.82) 0%, rgba(7,4,2,0.28) 30%, rgba(7,4,2,0) 52%), radial-gradient(circle at bottom right, rgba(7,4,2,0.82) 0%, rgba(7,4,2,0.28) 30%, rgba(7,4,2,0) 52%), linear-gradient(180deg, rgba(17,11,7,0.06) 0%, rgba(17,11,7,0.05) 22%, rgba(17,11,7,0.08) 54%, rgba(17,11,7,0.22) 100%)"
          : "radial-gradient(circle at 50% 19%, rgba(255,222,168,0.38) 0%, rgba(255,222,168,0.18) 12%, rgba(255,222,168,0.07) 22%, rgba(255,222,168,0) 36%), radial-gradient(circle at 50% 50%, rgba(255,190,108,0.1) 0%, rgba(255,190,108,0) 44%), radial-gradient(circle at top left, rgba(7,4,2,0.82) 0%, rgba(7,4,2,0.28) 30%, rgba(7,4,2,0) 52%), radial-gradient(circle at top right, rgba(7,4,2,0.82) 0%, rgba(7,4,2,0.28) 30%, rgba(7,4,2,0) 52%), radial-gradient(circle at bottom left, rgba(7,4,2,0.86) 0%, rgba(7,4,2,0.34) 30%, rgba(7,4,2,0) 52%), radial-gradient(circle at bottom right, rgba(7,4,2,0.86) 0%, rgba(7,4,2,0.34) 30%, rgba(7,4,2,0) 52()), linear-gradient(180deg, rgba(17,11,7,0.14) 0%, rgba(17,11,7,0.12) 22%, rgba(17,11,7,0.18) 54%, rgba(17,11,7,0.34) 100%)",
      }}/>

      {showForeground && momentsRevealRect ? (
        <div
          style={{
            position:"absolute",
            top:momentsRevealRect.top,
            left:momentsRevealRect.left,
            width:momentsRevealRect.width,
            height:momentsRevealRect.height,
            overflow:"hidden",
            pointerEvents:"none",
          }}>
          <img
            src="./opening page image.png"
            alt=""
            aria-hidden="true"
            style={{
              position:"absolute",
              top:-momentsRevealRect.top,
              left:-momentsRevealRect.left,
              width:"100vw",
              height:"100vh",
              objectFit:"cover",
              objectPosition:"center center",
              display:"block",
              maxWidth:"none",
            }}
          />
        </div>
      ) : null}

      <div style={{
        position:"absolute",
        inset:0,
        display:"flex",
        flexDirection:"column",
        padding:"32px 32px 46px",
        zIndex:760,
        opacity:showForeground ? 1 : 0,
        pointerEvents:showForeground ? "auto" : "none",
        transition:"opacity 220ms ease",
      }}>
        <div style={{
          display:"flex",
          alignItems:"flex-start",
          justifyContent:"flex-start",
          width:isMobile ? "clamp(120px, 40vw, 200px)" : "clamp(168px, 18.5vw, 296px)",
          marginLeft:"8px",
          position:"relative",
          zIndex:4,
          isolation:"isolate",
        }}>
          <img
            data-opening-logo
            src="./logo-clean.png"
            alt="momento"
            style={{
              width:"100%",
              height:"auto",
              display:"block",
              opacity:1,
              filter:"brightness(0) invert(1) contrast(1.22) drop-shadow(0 10px 24px rgba(0,0,0,0.08))",
            }}
          />
        </div>

        {/* Learn More — top right */}
        <a
          href="https://tmomentof.github.io/Demo/brochure/momento_interactive_brochure.html"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans"
          onMouseEnter={e=>{e.currentTarget.style.color="#F0C040";e.currentTarget.style.borderBottomColor="rgba(240,192,64,0.8)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,248,234,0.85)";e.currentTarget.style.borderBottomColor="rgba(255,248,234,0.45)";}}
          style={{
            position:"absolute",
            top:32,
            right:32,
            color:"rgba(255,248,234,0.85)",
            fontSize:12,
            fontWeight:700,
            letterSpacing:"0.18em",
            textTransform:"uppercase",
            textDecoration:"none",
            borderBottom:"1px solid rgba(255,248,234,0.45)",
            paddingBottom:3,
            zIndex:5,
            transition:"color 180ms ease, border-bottom-color 180ms ease",
          }}
        >
          Learn More
        </a>

        <div style={{
          flex:1,
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"center",
          width:"100%",
          textAlign:"center",
          gap:18,
        }}>
          <div style={{
            width:"min(1320px, 94vw)",
            minHeight:180,
          }}/>

          <div
            style={{
              minHeight:74,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
            }}
          >
            <button
              data-opening-enter
              onClick={onEnter}
              onMouseEnter={()=>setHoveredAction("enter")}
              onMouseLeave={()=>setHoveredAction(null)}
              className="font-sans"
              style={{
                padding:"0 0 8px",
                minWidth:92,
                borderRadius:0,
                border:"none",
                background:"transparent",
                color:"#F0C040",
                cursor:"pointer",
                fontSize:18,
                fontWeight:700,
                letterSpacing:"0.24em",
                textTransform:"uppercase",
                borderBottom:`${hoveredAction==="enter" ? 2 : 1}px solid ${hoveredAction==="enter" ? "#F0C040" : "rgba(240,192,64,0.78)"}`,
                textShadow:"0 4px 16px rgba(0,0,0,0.1)",
                transform:`translateY(${hoveredAction==="enter" ? "-3px" : "0"})`,
                transition:"transform 260ms ease, border-bottom-width 180ms ease, border-color 180ms ease",
              }}
            >
              Enter
            </button>
          </div>
        </div>
      </div>

    {/* Preview notice — bottom-center */}
    {showForeground && (
      <div style={{
        position:"absolute",
        bottom:22,
        left:0,
        right:0,
        textAlign:"center",
        zIndex:800,
        pointerEvents:"none",
        padding:"0 24px",
      }}>
        <p className="font-sans" style={{
          margin:0,
          fontSize:10,
          lineHeight:1.55,
          color:"rgba(255,248,234,0.45)",
          letterSpacing:"0.01em",
        }}>
          This preview showcases Momento's experience. The AI-weighed version is available on request.{" "}
          <a
            href="mailto:themomentofolio@gmail.com"
            style={{
              color:"rgba(255,220,130,0.65)",
              textDecoration:"none",
              borderBottom:"1px solid rgba(255,220,130,0.3)",
              paddingBottom:1,
              pointerEvents:"auto",
              transition:"color 180ms ease, border-color 180ms ease",
            }}
            onMouseEnter={e=>{e.currentTarget.style.color="rgba(255,220,130,0.95)";e.currentTarget.style.borderBottomColor="rgba(255,220,130,0.7)";}}
            onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,220,130,0.65)";e.currentTarget.style.borderBottomColor="rgba(255,220,130,0.3)";}}
          >
            Contact us at themomentofolio@gmail.com
          </a>
        </p>
      </div>
    )}

    {/* YouTube preview — bottom-left corner */}
    <div
      onMouseEnter={()=>!isMobile&&setYtHovered(true)}
      onMouseLeave={()=>!isMobile&&setYtHovered(false)}
      onClick={()=>isMobile&&setYtHovered(v=>!v)}
      style={{position:"absolute",bottom:20,left:20,zIndex:800}}
    >
      {/* Transparent bridge fills the gap so mouse-leave doesn't fire mid-hover */}
      <div style={{position:"absolute",bottom:"100%",left:0,width:"100%",height:12,background:"transparent"}}/>
      {/* Tooltip with embedded video */}
      <div style={{
        position:"absolute",
        bottom:"calc(100% + 12px)",
        left:0,
        width:320,
        height:180,
        borderRadius:10,
        overflow:"hidden",
        boxShadow:"0 8px 32px rgba(0,0,0,0.55)",
        opacity:ytHovered ? 1 : 0,
        pointerEvents:ytHovered ? "auto" : "none",
        transition:"opacity 200ms ease",
        background:"#000",
      }}>
        {ytHovered && (
          <iframe
            width="320"
            height="180"
            src="https://www.youtube.com/embed/0OZ2RS7UP_U?autoplay=1&rel=0"
            title="Momento Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{display:"block",width:"100%",height:"100%",border:"none"}}
          />
        )}
      </div>
      {/* YouTube icon button */}
      <button
        aria-label="Watch Momento demo"
        style={{
          background:"transparent",
          border:"none",
          cursor:"pointer",
          padding:0,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          opacity:ytHovered ? 1 : 0.65,
          transform:ytHovered ? "scale(1.12)" : "scale(1)",
          transition:"opacity 180ms ease, transform 180ms ease",
        }}
      >
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="38" height="38" rx="9" fill="#FF0000"/>
          <polygon points="15,11 28,19 15,27" fill="white"/>
        </svg>
      </button>
    </div>

    </div>
  );
}
