import{r as e,d as _,j as i}from"./iframe-DxUvObG1.js";import"./preload-helper-PPVm8Dsz.js";const P={preferredIntensity:.6,preferredContrast:.5,readingTime:5,deviceType:"desktop",accessibilityNeeds:{highContrast:!1,reducedMotion:!1,largerText:!1},engagementLevel:.5,returnRate:.5},B=e.createContext(void 0);function k({children:a,initialConfig:x={},storageKey:s="ai-glass-theme-data",enableAnalytics:T=!0,className:$,"data-testid":R}){const[c,u]=e.useState(null),[S,w]=e.useState(!1),[D,N]=e.useState(null),[p,G]=e.useState({adaptToSentiment:!0,adaptToContext:!0,adaptToTime:!0,adaptToSeason:!0,adaptToBehavior:!0,enableABTesting:!1,accessibilityFirst:!0,performanceMode:!1,...x}),[o,O]=e.useState(P),[m,C]=e.useState([]),[f,A]=e.useState([]),[E,W]=e.useState(!1),[V,L]=e.useState(!1),q=e.useRef(0),j=e.useRef(new Map),y=e.useRef([]);e.useEffect(()=>{(async()=>{try{const t=localStorage.getItem(s);if(t){const r=JSON.parse(t);r.userBehavior&&O({...P,...r.userBehavior}),r.themeHistory&&C(r.themeHistory),r.favoriteThemes&&A(r.favoriteThemes),r.aiConfig&&G({...p,...r.aiConfig})}}catch{N("Failed to initialize AI theme system")}})()},[]),e.useEffect(()=>{const n={userBehavior:o,themeHistory:m.slice(-50),favoriteThemes:f,aiConfig:p,timestamp:new Date().toISOString()};try{localStorage.setItem(s,JSON.stringify(n))}catch{}},[o,m,f,p,s]);const z=e.useCallback(n=>{G(t=>({...t,...n}))},[]),H=e.useCallback(async(n,t={})=>{w(!0),N(null),q.current=performance.now();try{await new Promise(v=>setTimeout(v,_.DURATION.slow));const r=n.length,d=["urgent","important","breaking"].some(v=>n.toLowerCase().includes(v)),l=d?0:Math.random()*360,h=.7,g=.6,M={id:`theme-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,name:`Generated Theme ${m.length+1}`,colors:{primary:`hsl(${l}, ${h*100}%, ${g*100}%)`,secondary:`hsl(${(l+60)%360}, ${h*100}%, ${(g+.1)*100}%)`,accent:`hsl(${(l+120)%360}, ${h*100}%, ${(g-.1)*100}%)`,background:`hsl(${l}, ${h*50}%, ${g*20}%)`,surface:`hsl(${l}, ${h*30}%, ${g*40}%)`,text:`hsl(${l}, ${h*20}%, ${g*90}%)`},glass:{blur:Math.max(8,Math.min(20,r/100)),opacity:d?.9:.7,borderRadius:d?"8px":"16px"},animations:{duration:E?_.DURATION.fast/1e3:_.DURATION.slow/1e3,easing:"ease-out"},metadata:{sentiment:d?"urgent":"neutral",context:t.type||"general",created:new Date}};return C(v=>[M,...v.slice(0,49)]),u(M),M}catch(r){const d=r instanceof Error?r.message:"Theme generation failed";throw N(d),r}finally{w(!1)}},[m.length,E]),J=e.useCallback(async(n,t={})=>{const r=j.current.get(n.sentiment)||0;j.current.set(n.sentiment,r+1);const d=`This is ${n.sentiment} content with ${n.intensity} intensity`;return H(d,t)},[H]),b=e.useCallback(n=>{O(t=>({...t,...n}))},[]),K=e.useCallback((n,t,r)=>{if(!T)return;y.current.push({timestamp:new Date,engagement:t}),y.current.length>100&&(y.current=y.current.slice(-100));const l=(o.engagementLevel+t)/2;b({engagementLevel:l,returnRate:r>.7?Math.min(1,o.returnRate+.1):o.returnRate})},[T,o,b]),Q=e.useCallback(n=>{A(t=>t.find(r=>r.id===n.id)?t:[n,...t])},[]),X=e.useCallback(n=>{A(t=>t.filter(r=>r.id!==n))},[]),Y=e.useCallback(()=>{C([]),j.current.clear(),y.current=[];try{localStorage.removeItem(s)}catch{}},[s]),Z=e.useCallback(()=>{const n={version:"1.0.0",timestamp:new Date().toISOString(),aiConfig:p,userBehavior:o,themeHistory:m,favoriteThemes:f};return JSON.stringify(n,null,2)},[p,o,m,f]),ee=e.useCallback(n=>{try{const t=JSON.parse(n);return t.aiConfig&&z(t.aiConfig),t.userBehavior&&b(t.userBehavior),t.themeHistory&&C(t.themeHistory),t.favoriteThemes&&A(t.favoriteThemes),!0}catch{return!1}},[z,b]),te={currentTheme:c,isGenerating:S,generationError:D,aiConfig:p,updateAIConfig:z,generateTheme:H,generateThemeFromSentiment:J,themeHistory:m,favoriteThemes:f,addToFavorites:Q,removeFromFavorites:X,userBehavior:o,updateUserBehavior:b,trackInteraction:K,performanceMode:E,setPerformanceMode:W,accessibilityMode:V,setAccessibilityMode:L,clearCache:Y,exportAIData:Z,importAIData:ee};return i.jsx(B.Provider,{value:te,children:i.jsx("div",{className:$,"data-testid":R,children:a})})}function F(){const a=e.useContext(B);if(a===void 0)throw new Error("useAIGlassTheme must be used within an AIGlassThemeProvider");return a}function ne(){const{generateTheme:a,trackInteraction:x,currentTheme:s}=F(),T=e.useCallback(async c=>await a(c),[a]),$=e.useCallback(async(c,u,S)=>{const w=`${c} ${u}`;return a(w,S?{category:S,type:"news"}:{})},[a]),R=e.useCallback((c,u=.7)=>{s&&x(s.id,c,u)},[s,x]);return{generateFromContent:T,generateFromArticle:$,recordEngagement:R,currentTheme:s}}try{k.displayName="AIGlassThemeProvider",k.__docgenInfo={description:"",displayName:"AIGlassThemeProvider",props:{initialConfig:{defaultValue:{value:"{}"},description:"",name:"initialConfig",required:!1,type:{name:"Partial<AIThemeConfig> | undefined"}},storageKey:{defaultValue:{value:"ai-glass-theme-data"},description:"",name:"storageKey",required:!1,type:{name:"string | undefined"}},enableAnalytics:{defaultValue:{value:"true"},description:"",name:"enableAnalytics",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string | undefined"}}}}}catch{}const re=Object.freeze(Object.defineProperty({__proto__:null,AIGlassThemeProvider:k,default:k,useAIGlassTheme:F,useSmartTheme:ne},Symbol.toStringTag,{value:"Module"})),ae="AIGlassThemeProvider",U=re[ae],oe={title:"AI + Intelligence/AIGlass Theme Provider",component:U,parameters:{layout:"centered",previewSurface:"app",docs:{description:{component:"Component-owned Storybook coverage for AIGlassThemeProvider. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},I={render:()=>i.jsxs("div",{className:"ai-theme-provider-story",style:{width:"100%",maxWidth:720,maxHeight:"min(620px, calc(100vh - 64px))",overflow:"auto",borderRadius:20,border:"1px solid rgba(15, 23, 42, 0.14)",background:"linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(224, 242, 254, 0.92))",boxShadow:"0 24px 64px rgba(15, 23, 42, 0.18)",padding:"clamp(18px, 4vw, 30px)",color:"#0f172a"},children:[i.jsx("style",{children:`
        .ai-theme-provider-story,
        .ai-theme-provider-story * {
          box-sizing: border-box;
        }

        .ai-theme-provider-story :where(h3, p, span, strong, button, div) {
          color: #0f172a;
          overflow-wrap: anywhere;
        }

        .ai-theme-provider-story .ai-theme-provider-story-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(176px, 1fr));
          gap: 12px;
          margin-top: 18px;
        }
      `}),i.jsx(U,{storageKey:"storybook-ai-theme-provider",enableAnalytics:!1,children:i.jsxs("div",{children:[i.jsx("span",{style:{display:"inline-flex",borderRadius:999,border:"1px solid rgba(15, 23, 42, 0.16)",background:"rgba(255, 255, 255, 0.78)",padding:"6px 10px",fontSize:12,fontWeight:700},children:"AI theme context"}),i.jsx("h3",{style:{margin:"12px 0 8px",fontSize:24,lineHeight:1.2},children:"Adaptive Theme Provider"}),i.jsx("p",{style:{margin:0,maxWidth:560,fontSize:15,lineHeight:1.55},children:"Bounded provider sample with readable content, analytics disabled, and deterministic storage so the provider shell can be inspected without overflowing the Storybook canvas."}),i.jsx("div",{className:"ai-theme-provider-story-grid",children:["Sentiment","Context","Accessibility"].map(a=>i.jsxs("div",{style:{minWidth:0,borderRadius:14,border:"1px solid rgba(15, 23, 42, 0.12)",background:"rgba(255, 255, 255, 0.82)",padding:16},children:[i.jsx("strong",{style:{display:"block",fontSize:14},children:a}),i.jsx("span",{style:{display:"block",marginTop:6,fontSize:13},children:"Enabled in provider state"})]},a))})]})})]})};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <div className="ai-theme-provider-story" style={{
    width: "100%",
    maxWidth: 720,
    maxHeight: "min(620px, calc(100vh - 64px))",
    overflow: "auto",
    borderRadius: 20,
    border: "1px solid rgba(15, 23, 42, 0.14)",
    background: "linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(224, 242, 254, 0.92))",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
    padding: "clamp(18px, 4vw, 30px)",
    color: "#0f172a"
  }}>
      <style>{\`
        .ai-theme-provider-story,
        .ai-theme-provider-story * {
          box-sizing: border-box;
        }

        .ai-theme-provider-story :where(h3, p, span, strong, button, div) {
          color: #0f172a;
          overflow-wrap: anywhere;
        }

        .ai-theme-provider-story .ai-theme-provider-story-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(176px, 1fr));
          gap: 12px;
          margin-top: 18px;
        }
      \`}</style>
      <Component storageKey="storybook-ai-theme-provider" enableAnalytics={false}>
        <div>
          <span style={{
          display: "inline-flex",
          borderRadius: 999,
          border: "1px solid rgba(15, 23, 42, 0.16)",
          background: "rgba(255, 255, 255, 0.78)",
          padding: "6px 10px",
          fontSize: 12,
          fontWeight: 700
        }}>
            AI theme context
          </span>
          <h3 style={{
          margin: "12px 0 8px",
          fontSize: 24,
          lineHeight: 1.2
        }}>
            Adaptive Theme Provider
          </h3>
          <p style={{
          margin: 0,
          maxWidth: 560,
          fontSize: 15,
          lineHeight: 1.55
        }}>
            Bounded provider sample with readable content, analytics disabled,
            and deterministic storage so the provider shell can be inspected
            without overflowing the Storybook canvas.
          </p>
          <div className="ai-theme-provider-story-grid">
            {["Sentiment", "Context", "Accessibility"].map(label => <div key={label} style={{
            minWidth: 0,
            borderRadius: 14,
            border: "1px solid rgba(15, 23, 42, 0.12)",
            background: "rgba(255, 255, 255, 0.82)",
            padding: 16
          }}>
                <strong style={{
              display: "block",
              fontSize: 14
            }}>
                  {label}
                </strong>
                <span style={{
              display: "block",
              marginTop: 6,
              fontSize: 13
            }}>
                  Enabled in provider state
                </span>
              </div>)}
          </div>
        </div>
      </Component>
    </div>
}`,...I.parameters?.docs?.source}}};const de=["Default"];export{I as Default,de as __namedExportsOrder,oe as default};
