/* ─── MAIN APP — DEMO MODE (no auth, no backend) ────────────────────────────── */
function MomentApp() {
  const [introActive, setIntroActive] = useState(true);
  const [showGuidePrompt, setShowGuidePrompt] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [onboardingStage, setOnboardingStage] = useState(0);
  const [showConsent, setShowConsent] = useState(false);
  const [momentEdits, setMomentEdits] = useState({});
  const [expandedSections,setExpandedSections] = useState(new Set([0]));
  const [cubeIndex,setCubeIndex]   = useState(0);
  const [isRotating,setIsRotating] = useState(false);
  const [pairSide,setPairSide]     = useState("left");
  const [draggedMoment,setDraggedMoment] = useState(null);
  const [ghostPos,setGhostPos]     = useState({x:0,y:0});
  const [dropTarget,setDropTarget] = useState(null);
  const [dropZone,setDropZone] = useState(null);
  const [readDropMoment,setReadDropMoment] = useState(null);
  const [focusedMoments,setFocusedMoments] = useState({worth:null,sharing:null});
  const [snippedMoments,setSnippedMoments] = useState([
    {
      id:"demo-moment-1",
      passage:"You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.",
      book:"Frankenstein",
      chapter:"Letter 1",
      pg:1,
      interpretation:"He writes home with triumph, but the word 'disaster' is already there. Shelley plants the shadow in the first line.",
    }
  ]);
  const [deletedMomentIds,setDeletedMomentIds] = useState(new Set());
  const [worthMessage,setWorthMessage] = useState("Snip Moments to create Momentos and shape your circle.");
  const [firstMomentToast, setFirstMomentToast] = useState(null);
  const [momentsSavedBlink,setMomentsSavedBlink] = useState(false);
  const [worthNotif,setWorthNotif] = useState(false);
  const [sharingNotifCount,setSharingNotifCount] = useState(0);
  const [sharingFeedAdditions,setSharingFeedAdditions] = useState([]);
  const [wavedProfileNames,setWavedProfileNames] = useState(new Set());
  const firstProfileShownRef = useRef(false);
  const [activeWhisper,setActiveWhisper] = useState(null);
  const [sharingDropZone,setSharingDropZone] = useState(null);
  const [expandedMomentId,setExpandedMomentId] = useState(null);
  const [whisperTarget,setWhisperTarget] = useState(null);
  const [sharingActiveThread,setSharingActiveThread] = useState({name:null,pendingMoment:null});
  const [showProfile,setShowProfile] = useState(false);
  const [showHint,setShowHint] = useState(false);
  const [darkMode,setDarkMode] = useState(false);
  const [headerSearchExpanded,setHeaderSearchExpanded] = useState(false);
  const [readSearchQuery,setReadSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const [momentsLayoutMode, setMomentsLayoutMode] = useState("clip-by-books");
  const [momentsPassageFirst, setMomentsPassageFirst] = useState(true);
  const [momentsShowLayoutMenu, setMomentsShowLayoutMenu] = useState(false);
  const [openBookInRead,setOpenBookInRead] = useState(null);
  const [lastOpenedBook,setLastOpenedBook] = useState(null);
  const [momentsBrowsingBook,setMomentsBrowsingBook] = useState(false);
  const [sharingAssistMode, setSharingAssistMode] = useState(false);
  const [isMobile, setIsMobile] = useState(()=>window.innerWidth <= 768);

  useEffect(()=>{
    const onResize = ()=>setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return ()=>window.removeEventListener("resize", onResize);
  },[]);

  const heroAnchorVisible = (introActive || showGuide) && !showGuidePrompt;
  const heroAnchorMode = showGuide ? "top" : "hero";
  const isMomentsSolo = expandedSections.size===1 && cubeIndex===1;
  const isWorthSolo = expandedSections.size===1 && cubeIndex===2;
  const isSharingSolo = expandedSections.size===1 && cubeIndex===3;
  const _allMomentsFlat = [...(snippedMoments||[])]
    .filter(m => !deletedMomentIds.has(m.id))
    .map(m => momentEdits[m.id] !== undefined ? {...m, interpretation: momentEdits[m.id]} : m);
  const _filteredMomentsFlat = openBookInRead ? _allMomentsFlat.filter(m=>m.book===openBookInRead.title) : _allMomentsFlat;
  const momentsWithMomento = _filteredMomentsFlat.filter(m=>m.interpretation).length;
  const _momBooksSet = new Set(_filteredMomentsFlat.map(m=>m.book||"—"));
  const momentsBookCount = _momBooksSet.size;

  const launchApp = useCallback(()=>{
    setShowConsent(false);
    setIntroActive(false);
    setExpandedSections(new Set([0]));
    setCubeIndex(0);
    setPairSide("left");
  },[]);

  const handleConsentAccepted = useCallback(()=>{
    launchApp();
  },[launchApp]);

  const handleGuideComplete = useCallback(({moment, closeReader})=>{
    if(moment){
      const tempId = moment.id || ('snip_'+Date.now());
      const withId = {...moment, id: tempId};
      setSnippedMoments(prev=>[withId, ...prev.filter(m=>m.id!=="demo-moment-1")]);
      setExpandedMomentId(tempId);
      setWorthNotif(true);
      setWorthMessage(closeReader
        ? `${closeReader.name} is your first Close Reader. Worth will keep shaping your circle from what you write.`
        : "Your first Momento is saved. Worth will now start shaping your circle."
      );
    }
    setShowGuide(false);
    setShowConsent(true);
  },[]);

  // Dark mode color tokens
  const dm = darkMode ? {
    bg:"#1C1710",
    bgSecondary:"var(--bg2)",
    bgCard:"var(--card)",
    bgCardAlt:"var(--card2)",
    text:"#E8DCC8",
    textMuted:"rgba(232,220,200,0.45)",
    amber:"#C4A055",
    amberMuted:"rgba(196,160,85,0.35)",
    border:"rgba(196,160,85,0.18)",
    borderStrong:"rgba(196,160,85,0.3)",
    headerBg:"var(--bg)",
    navBg:"#161210",
    white:"#2A2318",
  } : {
    bg:"var(--bg)",
    bgSecondary:"#FAF7EF",
    bgCard:"var(--card)",
    bgCardAlt:"#FAF7EF",
    text:"#1C1C1A",
    textMuted:"var(--text2)",
    amber:"#8B6914",
    amberMuted:"rgba(139,105,20,0.35)",
    border:"rgba(139,105,20,0.18)",
    borderStrong:"rgba(139,105,20,0.3)",
    headerBg:"var(--bg2)",
    headerAmber:"#8B6914",
    headerAmberMuted:"rgba(139,105,20,0.4)",
    headerBorder:"rgba(139,105,20,0.22)",
    headerBorderStrong:"rgba(139,105,20,0.35)",
    navBg:"var(--bg)",
    white:"#FFFFFF",
  };

  const onUpdateMoment = useCallback((id, interpretation) => {
    setMomentEdits(prev => ({...prev, [id]: interpretation}));
  }, []);

  const onSnip = useCallback((m)=>{
    const tempId = 'snip_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
    const withId = m.id ? m : {...m, id: tempId};
    setSnippedMoments(prev=>{
      const next=[...prev,withId];
      setMomentsSavedBlink(true);
      setTimeout(()=>setMomentsSavedBlink(false), 2000);
      if(prev.length === 0) {
        var _wc = m.interpretation ? m.interpretation.trim().split(/\s+/).filter(Boolean).length : 0;
        var _type = (m.interpretation && _wc < 10) ? 'combined' : 'normal';
        setFirstMomentToast(_type);
        setTimeout(()=>setFirstMomentToast(null), 5000);
      }
      if(m.interpretation) {
        setWorthNotif(true);
        const totalWithInterp = next.filter(x=>x.interpretation).length;
        if(totalWithInterp<=3) setWorthMessage("Worth is just getting to know you. Keep writing.");
        else if(totalWithInterp<=6) setWorthMessage("Worth is shaping your circle from your Momentos.");
        else setWorthMessage("Your circle is coming into focus. Keep reading.");
      }
      return next;
    });
  },[]);

  const onDeleteMoment = useCallback((id)=>{
    setSnippedMoments(prev=>prev.filter(m=>m.id!==id));
    setDeletedMomentIds(prev=>new Set([...prev,id]));
  },[]);

  const openCountRef = useRef({});
  const closeCountRef = useRef({});
  const lastOpenedRef = useRef({index: null, direction: 'right'});
  const [closingSections, setClosingSections] = useState(new Set());
  const dragStateRef = useRef({active:false,moment:null});

  const expandedArray = Array.from(expandedSections).sort((a,b)=>a-b);
  const activeLabels = expandedArray.map(i=>SECTIONS[i].label).join(" · ");

  const rotateTo = useCallback((newIndex)=>{
    if(newIndex===cubeIndex||isRotating||newIndex<0||newIndex>3) return;
    setIsRotating(true); setCubeIndex(newIndex);
    if(expandedSections.size===1){setExpandedSections(new Set([newIndex]));setPairSide(newIndex<=1?"left":"right");}
    setTimeout(()=>setIsRotating(false),350);
  },[cubeIndex,isRotating,expandedSections]);

  const rotateToPair = useCallback((target)=>{
    if(isRotating||target===pairSide) return;
    setIsRotating(true); setPairSide(target);
    setExpandedSections(new Set(target==="left"?[0,1]:[2,3]));
    setCubeIndex(target==="left"?0:2);
    setTimeout(()=>setIsRotating(false),350);
  },[isRotating,pairSide]);

  const toggleSection = useCallback((index)=>{
    if(isMobile){ rotateTo(index); return; }
    setExpandedSections(prev=>{
      const next=new Set(prev);
      if(next.has(index)){
        if(next.size>1){next.delete(index);const rem=Array.from(next).sort((a,b)=>a-b);setCubeIndex(rem[0]);if(rem.every(i=>i<=1))setPairSide("left");else if(rem.every(i=>i>=2))setPairSide("right");}
      }else{
        next.add(index);const all=[...Array.from(prev),index];
        if(all.every(i=>i<=1))setPairSide("left");else if(all.every(i=>i>=2))setPairSide("right");
        openCountRef.current[index] = (openCountRef.current[index]||0) + 1;
        const existingMin = prev.size > 0 ? Math.min(...Array.from(prev)) : index;
        lastOpenedRef.current = { index, direction: index < existingMin ? 'left' : 'right' };
      }
      return next;
    });
  },[isMobile, rotateTo]);

  const handleClose = useCallback((index)=>{
    if(index===3) setSharingAssistMode(false);
    if(index===3) setSharingActiveThread({name:null,pendingMoment:null});
    closeCountRef.current[index] = (closeCountRef.current[index]||0) + 1;
    setClosingSections(prev=>new Set([...prev, index]));
    setTimeout(()=>{
      setClosingSections(prev=>{ const n=new Set(prev); n.delete(index); return n; });
      toggleSection(index);
    }, 420);
  },[toggleSection]);

  const expandSection = useCallback((index)=>{
    if(isMobile){ rotateTo(index); return; }
    if(!expandedSections.has(index))setExpandedSections(prev=>new Set([...prev,index]));
  },[isMobile, rotateTo, expandedSections]);

  useEffect(()=>{
    if(expandedSections.has(3)) setSharingNotifCount(0);
  },[expandedSections]);

  const openMomentsAlongsideSharing = useCallback(()=>{
    setSharingAssistMode(true);
    setExpandedSections(new Set([1,3]));
    setCubeIndex(1);
    setPairSide("left");
  },[]);

  const onDragStart = useCallback((moment,clientX,clientY)=>{
    dragStateRef.current={active:true,moment};
    setDraggedMoment(moment); setGhostPos({x:clientX,y:clientY});
    document.body.classList.add("dragging-moment");
  },[]);

  useEffect(()=>{
    const onMove=e=>{
      if(!dragStateRef.current.active) return;
      setGhostPos({x:e.clientX,y:e.clientY});
      const el=document.elementFromPoint(e.clientX,e.clientY);
      const face=el?.closest("[data-section]")?.getAttribute("data-section");
      setDropTarget(face||null);
      if(face==="sharing"){
        const readerName = el?.closest("[data-reader-name]")?.getAttribute("data-reader-name");
        setDropZone(readerName||"thread");
      } else {
        setDropZone(null);
      }
    };
    const onUp=e=>{
      if(!dragStateRef.current.active) return;
      const el=document.elementFromPoint(e.clientX,e.clientY);
      const face=el?.closest("[data-section]")?.getAttribute("data-section");
      const readerName = face==="sharing" ? el?.closest("[data-reader-name]")?.getAttribute("data-reader-name") : null;
      const droppedMoment = dragStateRef.current.moment;
      if(face && droppedMoment){
        if(face==="read"){
          var fixedMatch = typeof FIXED_SHELF!=='undefined' ? FIXED_SHELF.find(function(b){
            var t1=b.title.toLowerCase(), t2=(droppedMoment.book||'').toLowerCase();
            return t1===t2||t1.includes(t2)||t2.includes(t1);
          }) : null;
          if(fixedMatch){ setReadDropMoment({...droppedMoment, book:fixedMatch.title}); rotateTo(0); }
        } else if(face==="moments"){
          setExpandedMomentId(droppedMoment.id||null);
          expandSection(1);
        } else if(face==="worth"){
          setFocusedMoments(p=>({...p,worth:droppedMoment}));
        } else {
          if(face==="sharing"){
            if(readerName){
              setSharingActiveThread({name:readerName, pendingMoment:droppedMoment});
              expandSection(3);
            } else {
              setSharingActiveThread(prev=> prev.name ? ({...prev, pendingMoment:droppedMoment}) : prev);
            }
          }
        }
      }
      dragStateRef.current={active:false,moment:null};
      setDraggedMoment(null); setDropTarget(null); setDropZone(null);
      document.body.classList.remove("dragging-moment");
    };
    window.addEventListener("mousemove",onMove); window.addEventListener("mouseup",onUp);
    return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);};
  },[]);

  const getPanelProps = (sid) => {
    if(sid==="read")    return {onSnip, headerSearchExpanded, setHeaderSearchExpanded, searchInputRef, readSearchQuery, setReadSearchQuery, onBookOpen:(book)=>{setOpenBookInRead(book);setLastOpenedBook(book);}, onBookClose:()=>setOpenBookInRead(null), shelfOnly:expandedSections.size===4, sectionCount:expandedSections.size, allMoments:_allMomentsFlat, dropMoment:readDropMoment, onDropMomentHandled:()=>setReadDropMoment(null), initialOpenBook:openBookInRead};
    if(sid==="moments") return {onDragStart, snippedMoments, onUpdateMoment, onDeleteMoment, onBrowsingBookChange:setMomentsBrowsingBook, expandedMomentId, onClearExpanded:()=>setExpandedMomentId(null), openBookInRead, sharingAssistMode:sharingAssistMode&&expandedSections.has(3), layoutMode:momentsLayoutMode, setLayoutMode:setMomentsLayoutMode, passageFirst:momentsPassageFirst, setPassageFirst:setMomentsPassageFirst, showLayoutMenu:momentsShowLayoutMenu, setShowLayoutMenu:setMomentsShowLayoutMenu, hideHeader:isMomentsSolo, sectionCount:expandedSections.size};
    if(sid==="worth")   return {
      authUser: null,
      focusedMoment:focusedMoments.worth,
      onClear:()=>{setFocusedMoments(p=>({...p,worth:null}));},
      worthMessage, onDismissMessage:()=>{setWorthMessage(null);setWorthNotif(false);},
      activeWhisper, onSnip, onCloseWhisper:()=>setActiveWhisper(null),
      snippedMoments, openBookInRead, lastOpenedBook, onOpenMoments:openMomentsAlongsideSharing,
      hideHeader:isWorthSolo||expandedSections.size===4,
      sectionCount:expandedSections.size,
      onOpenWhisper:(name,moment)=>{
        setWhisperTarget({name, pendingMoment:moment||null});
        setSharingActiveThread({name, pendingMoment:moment||null});
        expandSection(3);
      },
      isDraggingToWorth:!!draggedMoment && dropTarget==="worth",
      wavedNames:wavedProfileNames,
      onAddWaved:(name)=>setWavedProfileNames(prev=>new Set([...prev,name])),
      onFirstProfileShown:()=>{
        if(!firstProfileShownRef.current){
          firstProfileShownRef.current = true;
          setWorthMessage("Hooray! You just found your first close reader.");
          setWorthNotif(true);
        }
      },
      onAnotherProfileShown:()=>{
        if(firstProfileShownRef.current){
          firstProfileShownRef.current = false;
          setWorthMessage("Snip Moments to create Momentos and shape your circle.");
          setWorthNotif(false);
        }
      },
      onWave:(profile)=>{
        if(firstProfileShownRef.current){
          firstProfileShownRef.current = false;
          setWorthMessage("Snip Moments to create Momentos and shape your circle.");
          setWorthNotif(false);
        }
        setTimeout(()=>{
          const initials = profile.name.split(" ").map(n=>n[0]).join("");
          const entry = {
            id:`feed-waveback-${profile.name}-${Date.now()}`,
            initials, name:profile.name,
            bg: profile.coverBg||"#8B6914",
            signal:"wave_back",
            activeBook: profile.moments?.[0]?.book||"",
            momentBook: profile.moments?.[0]?.book||"",
          };
          setSharingFeedAdditions(prev=>[entry,...prev]);
          setSharingNotifCount(prev=>prev+1);
        }, 3000);
      },
    };
    if(sid==="sharing") return {
      authUser: null,
      focusedMoment:focusedMoments.sharing,
      onClear:()=>{setFocusedMoments(p=>({...p,sharing:null}));setSharingDropZone(null);},
      whisperTarget, onClearWhisperTarget:()=>setWhisperTarget(null),
      activeThreadName:sharingActiveThread.name,
      activeThreadPendingMoment:sharingActiveThread.pendingMoment,
      onOpenThread:(name,pendingMoment=null)=>setSharingActiveThread({name,pendingMoment}),
      onResolveThreadPendingMoment:()=>setSharingActiveThread(prev=>({...prev,pendingMoment:null})),
      onCloseThread:()=>setSharingActiveThread({name:null,pendingMoment:null}),
      onSnip, sharingDropZone, openBookInRead, onOpenMoments:openMomentsAlongsideSharing,
      feedAdditions:sharingFeedAdditions,
      hideHeader: isSharingSolo,
      sectionCount: expandedSections.size,
    };
    return {};
  };

  const renderPanel = (section, canClose, onClose) => {
    const PC = PANEL_COMPONENTS[section.id];
    const isDropTarget = dropTarget===section.id;
    return (
      <div data-section={section.id} className="section-panel" style={{flex:1,height:"100%",background:dm.bg,display:"flex",flexDirection:"column",position:"relative",outline:isDropTarget?`3px solid ${section.accent}`:"none",transition:"outline 150ms, background 400ms ease",border:`1.5px solid ${dm.border}`,boxSizing:"border-box"}}>
        {canClose&&onClose&&(
          <button className="section-close-btn" onClick={onClose} style={{position:"absolute",top:0,right:0,zIndex:20,width:24,height:24,borderRadius:"0 0 0 6px",border:"none",background:"rgba(139,105,20,0.12)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(139,105,20,0.6)",transition:"opacity 150ms, color 150ms, background 150ms"}}
            onMouseEnter={e=>{e.currentTarget.style.background=`${section.accent}33`;e.currentTarget.style.color=section.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(139,105,20,0.12)";e.currentTarget.style.color="rgba(139,105,20,0.6)";}}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        )}
        {section.id==="read" ? (
          <div style={{flex:1,minHeight:0,overflow:"hidden"}}><PC {...getPanelProps(section.id)}/></div>
        ) : (
          <div className="panel-scroll" style={{flex:1,overflowY:"auto"}}><PC {...getPanelProps(section.id)}/></div>
        )}
        {isDropTarget && section.id==="sharing" ? (
          <div style={{position:"absolute",inset:0,background:"rgba(139,105,20,0.12)",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:50}}>
            <div style={{padding:"10px 20px",background:section.accent,borderRadius:20,color:"#fff",fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>Drop to share in thread</div>
          </div>
        ) : isDropTarget && section.id==="read" ? (
          <div style={{position:"absolute",inset:0,background:"rgba(139,105,20,0.08)",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:50}}>
            <div style={{padding:"10px 20px",background:section.accent,borderRadius:20,color:"#fff",fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>Drop to open passage</div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className={[darkMode?"dark":"",expandedSections.size===4?"four-panel":""].filter(Boolean).join(" ")} style={{display:"flex",flexDirection:"column",width:"100vw",height:"100vh",overflow:"hidden",background:darkMode?"#181410":"#FAF7EF",transition:"background 400ms ease"}}>
      {heroAnchorVisible && <HeroTaglineAnchor mode={heroAnchorMode} activeStage={showGuide ? onboardingStage : -1}/>}
      {/* ── Intro overlay ── */}
      {introActive && <IntroOverlay dark={darkMode} onEnter={()=>setShowGuidePrompt(true)} showForeground={!showGuide && !showConsent && !showGuidePrompt}/>}
      {/* ── Guide / Skip prompt ── */}
      {showGuidePrompt && (
        <div style={{position:"fixed",inset:0,zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(8,5,2,0.72)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)"}}>
          <div style={{width:"min(360px,88vw)",background:"linear-gradient(160deg,#1C1208 0%,#140E06 100%)",border:"1px solid rgba(196,160,85,0.28)",borderRadius:20,padding:"32px 28px 26px",display:"flex",flexDirection:"column",alignItems:"center",gap:20,boxShadow:"0 24px 60px rgba(0,0,0,0.55)"}}>
            <img src="./just logo.png" alt="" style={{width:32,height:32,objectFit:"contain",opacity:0.7}}/>
            <div style={{textAlign:"center"}}>
              <h3 className="font-serif" style={{margin:"0 0 10px",fontSize:22,fontWeight:600,fontStyle:"italic",color:"rgba(255,247,232,0.95)",lineHeight:1.1}}>
                New to Momento?
              </h3>
              <p className="font-sans" style={{margin:0,fontSize:12,lineHeight:1.65,color:"rgba(220,200,170,0.65)"}}>
                The guide walks you through capturing your first moment. It only takes a minute.
              </p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%"}}>
              <button
                onClick={()=>{setShowGuidePrompt(false);setShowGuide(true);}}
                className="font-sans"
                style={{width:"100%",padding:"13px 0",borderRadius:999,border:"1px solid rgba(196,160,85,0.5)",background:"rgba(196,160,85,0.14)",color:"rgba(196,160,85,0.95)",fontSize:11,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer",transition:"background 180ms,border-color 180ms"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(196,160,85,0.24)";e.currentTarget.style.borderColor="rgba(196,160,85,0.75)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(196,160,85,0.14)";e.currentTarget.style.borderColor="rgba(196,160,85,0.5)";}}
              >
                Take the Guide
              </button>
              <button
                onClick={()=>{setShowGuidePrompt(false);setShowConsent(true);}}
                className="font-sans"
                style={{width:"100%",padding:"11px 0",borderRadius:999,border:"none",background:"transparent",color:"rgba(196,160,85,0.38)",fontSize:10,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",transition:"color 180ms"}}
                onMouseEnter={e=>e.currentTarget.style.color="rgba(196,160,85,0.65)"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(196,160,85,0.38)"}
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuide && <ReaderOnboardingOverlay profile={null} onStageChange={setOnboardingStage} onComplete={handleGuideComplete}/>}
      {showConsent && <ConsentScreen onAccept={handleConsentAccepted} onDecline={()=>{
        setShowConsent(false);
        setShowGuide(true);
      }}/>}

      {!introActive && <TopChrome
        expandedSections={expandedSections}
        cubeIndex={cubeIndex}
        expandedArray={expandedArray}
        setShowHint={setShowHint}
        darkMode={darkMode}
        dm={dm}
        TRACK_W={TRACK_W}
        SECTIONS={SECTIONS}
        momentsSavedBlink={momentsSavedBlink}
        worthNotif={worthNotif}
        sharingNotifCount={sharingNotifCount}
        rotateTo={rotateTo}
        handleClose={handleClose}
        toggleSection={toggleSection}
        expandSection={expandSection}
        searchInputRef={searchInputRef}
        readSearchQuery={readSearchQuery}
        setReadSearchQuery={setReadSearchQuery}
        setShowProfile={setShowProfile}
        showProfile={showProfile}
        isWorthSolo={isWorthSolo}
        worthMessage={worthMessage}
        isMomentsSolo={isMomentsSolo}
        momentsWithMomento={momentsWithMomento}
        momentsBookCount={momentsBookCount}
        momentsLayoutMode={momentsLayoutMode}
        setMomentsLayoutMode={setMomentsLayoutMode}
        momentsPassageFirst={momentsPassageFirst}
        setMomentsPassageFirst={setMomentsPassageFirst}
        momentsShowLayoutMenu={momentsShowLayoutMenu}
        setMomentsShowLayoutMenu={setMomentsShowLayoutMenu}
        isSharingSolo={isSharingSolo}
        onSharingOpenThread={(name,pendingMoment=null)=>setSharingActiveThread({name,pendingMoment})}
        bookOpen={openBookInRead !== null}
        momentsBrowsingBook={momentsBrowsingBook}
        isMobile={isMobile}
      />}

      {!introActive && <ProfileDrawer
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSignOut={()=>{
          setShowProfile(false);
          setIntroActive(true);
          setShowGuide(false);
          setShowConsent(false);
          setSnippedMoments([{id:"demo-moment-1",passage:"You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.",book:"Frankenstein",chapter:"Letter 1",pg:1,interpretation:"He writes home with triumph, but the word 'disaster' is already there. Shelley plants the shadow in the first line."}]);
          setMomentEdits({});
          setDeletedMomentIds(new Set());
        }}
        allMoments={_allMomentsFlat}
        readerProfile={null}
      />}
      {!introActive && <div style={{display:"flex",flex:1,minHeight:0,position:"relative",animation:"shelfRise 600ms cubic-bezier(0.34,1.2,0.64,1) 1800ms both",marginTop:0,paddingBottom:isMobile?56:0}}>
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          {expandedSections.size===1 ? (
            <div style={{width:"400%",height:"100%",display:"flex",position:"absolute",top:0,left:0,
              transform:`translateX(${-cubeIndex*25}%)`,
              transition:isRotating?"transform 350ms cubic-bezier(0.4,0,0.2,1)":"none"}}>
              {SECTIONS.map((section,index)=>(
                <div key={section.id} style={{width:"25%",height:"100%",flexShrink:0,display:"flex",flexDirection:"column",background:dm.bg,transition:"background 400ms ease"}}>
                  {renderPanel(section,false,null)}
                </div>
              ))}
            </div>
          ) : (
            <div style={{width:"100%",height:"100%",display:"flex"}}>
              {(()=>{
                const allSi = [...new Set([...expandedArray, ...Array.from(closingSections)])].sort((a,b)=>a-b);
                return allSi.map((si,i,arr)=>{
                  const section=SECTIONS[si];
                  const isClosing = closingSections.has(si);
                  const foldDir = i===0 ? "fold-out-left" : "fold-out-right";
                  return (
                    <div key={isClosing ? `${section.id}-close-${closeCountRef.current[si]||0}` : `${section.id}-${openCountRef.current[si]||0}`}
                      className={isClosing ? foldDir : (lastOpenedRef.current.index===si && lastOpenedRef.current.direction==='left' ? "unfold-panel-left" : "unfold-panel")}
                      style={{
                        display:"flex",flexDirection:"column",
                        flex:"1 1 0%",
                        overflow:"hidden",
                        borderRight:i<arr.length-1?"1px solid rgba(139,105,20,0.12)":"none",
                        transformOrigin:i===0?"right center":"left center",
                        pointerEvents:isClosing?"none":"auto"}}>
                      {renderPanel(section,expandedSections.size>1,()=>!isClosing&&closingSections.size===0?handleClose(si):null)}
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>}

      {/* ── Mobile bottom nav bar ── */}
      {!introActive && isMobile && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,height:56,zIndex:100,
          background:darkMode?"rgba(24,20,16,0.97)":"rgba(250,247,239,0.97)",
          backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",
          borderTop:`1px solid ${darkMode?"rgba(196,160,85,0.15)":"rgba(139,105,20,0.15)"}`,
          display:"flex",alignItems:"stretch",
        }}>
          {SECTIONS.map((s,i)=>(
            <button key={s.id} onClick={()=>rotateTo(i)} style={{
              flex:1,height:"100%",border:"none",background:"transparent",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,
              cursor:"pointer",position:"relative",
              borderTop:`2px solid ${cubeIndex===i?(darkMode?"#C4A055":"#8B6914"):"transparent"}`,
              transition:"border-color 200ms ease",
            }}>
              <span className="font-sans" style={{
                fontSize:9,fontWeight:cubeIndex===i?700:500,letterSpacing:"0.12em",textTransform:"uppercase",
                color:cubeIndex===i?(darkMode?"#C4A055":"#8B6914"):(darkMode?"rgba(232,220,200,0.4)":"rgba(80,50,8,0.4)"),
                transition:"color 200ms ease",
              }}>{s.label}</span>
              {s.id==="moments" && momentsSavedBlink && cubeIndex!==1 && (
                <span style={{position:"absolute",top:6,right:"calc(50% - 18px)",fontSize:9,color:"var(--amber)",fontWeight:700,animation:"blink-in 2s ease forwards"}}>✓</span>
              )}
              {s.id==="worth" && worthNotif && cubeIndex!==2 && (
                <span style={{position:"absolute",top:6,right:"calc(50% - 16px)",width:12,height:12,borderRadius:"50%",background:"#8B6914",display:"flex",alignItems:"center",justifyContent:"center",animation:"blink-in 2s ease forwards"}}>
                  <span style={{fontSize:7,fontWeight:700,color:"var(--bg)",lineHeight:1}}>!</span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {draggedMoment&&(
        <div style={{position:"fixed",left:ghostPos.x+12,top:ghostPos.y-20,width:220,background:"var(--bg)",border:"1px solid rgba(139,105,20,0.2)",borderRadius:4,boxShadow:"6px 8px 24px rgba(0,0,0,0.18)",pointerEvents:"none",zIndex:9999,transform:"rotate(2deg)",opacity:0.95}}>
          <div className="notebook-line" style={{padding:"12px 12px 12px 16px"}}>
            <p className="font-handwriting" style={{fontSize:13,lineHeight:1.7,color:"var(--text)",margin:0,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{draggedMoment.interpretation}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderTop:"1px solid rgba(139,105,20,0.08)",background:"rgba(139,105,20,0.02)"}}>
            <span className="font-serif" style={{fontSize:10,fontStyle:"italic",color:"var(--amber)"}}>{draggedMoment.book}</span>
            <span className="font-sans" style={{fontSize:9,color:"var(--text)"}}>p. {draggedMoment.page}</span>
          </div>
        </div>
      )}

      <CubeHint showHint={showHint}/>

      <div style={{
        position:"fixed",
        bottom:28,
        left:"50%",
        transform:`translateX(-50%) translateY(${firstMomentToast ? 0 : 20}px)`,
        opacity: firstMomentToast ? 1 : 0,
        pointerEvents: firstMomentToast ? "auto" : "none",
        transition:"opacity 360ms ease, transform 360ms ease",
        zIndex:999,
        background:"linear-gradient(135deg, #1C1209 0%, #2C1A08 100%)",
        border:"1px solid rgba(196,160,85,0.35)",
        borderRadius:16,
        padding:"12px 20px",
        boxShadow:"0 8px 32px rgba(0,0,0,0.32)",
        maxWidth:"min(420px, calc(100vw - 48px))",
        textAlign:"center",
      }}>
        <p className="font-sans" style={{margin:0,fontSize:13,lineHeight:1.55,color:"rgba(248,242,228,0.92)"}}>
          {firstMomentToast === 'combined' ? (
            <>
              <span style={{color:"#D4B87A",fontWeight:700}}>You captured your first moment!</span>
              {" "}To find readers, you need to write a little more.
            </>
          ) : (
            <>
              <span style={{color:"#D4B87A",fontWeight:700}}>You just captured your first Moment!</span>
              {" "}More the moments, more closer you get to other readers.
            </>
          )}
        </p>
      </div>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(MomentApp));
