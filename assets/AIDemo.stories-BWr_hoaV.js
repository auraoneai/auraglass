import{r as i,j as s,c as K}from"./iframe-C690vU5J.js";import{O as W}from"./OptimizedGlassCore-BFIVwF34.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-CziwpX2D.js";var O={};class Y{constructor(l={}){this.authToken=null,this.config={apiUrl:l.apiUrl||O.NEXT_PUBLIC_API_URL||"http://localhost:3001",wsUrl:l.wsUrl||O.NEXT_PUBLIC_WS_URL||"ws://localhost:3002",getAuthToken:l.getAuthToken||(()=>Promise.resolve(this.authToken)),onError:l.onError||(()=>{})}}setAuthToken(l){this.authToken=l}async request(l,e={}){try{const t=await this.config.getAuthToken(),c=`${this.config.apiUrl}${l}`,r={"Content-Type":"application/json",...e.headers};t&&(r.Authorization=`Bearer ${t}`);const o=await fetch(c,{...e,headers:r});if(!o.ok){const h=await o.json().catch(()=>({error:o.statusText}));throw new Error(h.error||h.message||"Request failed")}return await o.json()}catch(t){throw this.config.onError(t),t}}async login(l,e){const t=await this.request("/api/auth/login",{method:"POST",body:JSON.stringify({email:l,password:e})});return this.authToken=t.token,t}async register(l,e,t){const c=await this.request("/api/auth/register",{method:"POST",body:JSON.stringify({email:l,password:e,name:t})});return this.authToken=c.token,c}async refreshToken(l){const e=await this.request("/api/auth/refresh",{method:"POST",body:JSON.stringify({refreshToken:l})});return this.authToken=e.token,e}async logout(){await this.request("/api/auth/logout",{method:"POST"}),this.authToken=null}async generateFormFields(l,e=[]){return(await this.request("/api/ai/generate-form",{method:"POST",body:JSON.stringify({context:l,existingFields:e})})).fields}async search(l,e={}){return await this.request("/api/ai/search",{method:"POST",body:JSON.stringify({query:l,options:e})})}async indexDocuments(l){return await this.request("/api/ai/index-documents",{method:"POST",body:JSON.stringify({documents:l})})}async analyzeImage(l,e=["all"]){return(await this.request("/api/ai/analyze-image",{method:"POST",body:JSON.stringify({image:l,analysisTypes:e})})).analysis}async removeBackground(l){return(await this.request("/api/ai/remove-background",{method:"POST",body:JSON.stringify({image:l})})).image}async summarize(l,e=200){return(await this.request("/api/ai/summarize",{method:"POST",body:JSON.stringify({content:l,maxLength:e})})).summary}async healthCheck(){const l=`${this.config.apiUrl}/health`,e=await fetch(l);if(!e.ok)throw new Error("Health check failed");return await e.json()}}const d=new Y,f=()=>{const[g,l]=i.useState("forms"),[e,t]=i.useState(!1),[c,r]=i.useState(null),[o,h]=i.useState(""),[u,S]=i.useState(""),[k,b]=i.useState(!1),[w,_]=i.useState("user registration form"),[v,F]=i.useState([]),[j,R]=i.useState(""),[N,E]=i.useState([]),[T,q]=i.useState(""),[p,A]=i.useState(null),[n,U]=i.useState(null),D=async()=>{t(!0),r(null);try{await d.login(o,u),b(!0)}catch(a){r(a.message)}finally{t(!1)}},L=async()=>{t(!0),r(null);try{await d.register(o,u),b(!0)}catch(a){r(a.message)}finally{t(!1)}},z=async()=>{await d.logout(),b(!1),h(""),S("")},G=async()=>{t(!0),r(null);try{const a=await d.generateFormFields(w,v);F(a)}catch(a){r(a.message)}finally{t(!1)}},I=async()=>{t(!0),r(null);try{const a=await d.search(j,{limit:10});E(a.results),q(a.enhancedQuery)}catch(a){r(a.message)}finally{t(!1)}},J=async a=>{const m=a.target.files?.[0];if(m){t(!0),r(null);try{const x=new FileReader;x.onload=async V=>{const C=V.target?.result;A(C);const X=await d.analyzeImage(C,["all"]);U(X),t(!1)},x.readAsDataURL(m)}catch(x){r(x.message),t(!1)}}},B=async()=>{if(p){t(!0),r(null);try{const a=await d.removeBackground(p);A(a)}catch(a){r(a.message)}finally{t(!1)}}},Q=()=>s.jsx("div",{className:"glass-space-y-6",children:s.jsxs("div",{children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90 glass-mb-4",children:k?"✓ Authenticated":"Authentication Required"}),k?s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("p",{className:"glass-text-primary-opacity-70",children:["You are logged in as: ",s.jsx("strong",{children:o})]}),s.jsx("button",{onClick:z,className:"glass-px-4 glass-py-2 glass-border glass-border-red/30 glass-text-primary glass-radius-lg hover:glass-surface-red/10 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"Logout"})]}):s.jsxs("div",{className:"glass-space-y-4",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Email"}),s.jsx("input",{type:"email",value:o,onChange:a=>h(a.target.value),placeholder:"user@example.com",className:"glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 glass-text-primary glass-focus glass-touch-target glass-contrast-guard"})]}),s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Password"}),s.jsx("input",{type:"password",value:u,onChange:a=>S(a.target.value),placeholder:"********",className:"glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 glass-text-primary glass-focus glass-touch-target glass-contrast-guard"})]}),s.jsxs("div",{className:"glass-flex glass-gap-3",children:[s.jsx("button",{onClick:D,disabled:e||!o||!u,className:"glass-flex-1 glass-px-4 glass-py-2 glass-surface-blue glass-text-primary glass-radius-lg hover:glass-opacity-90 disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:e?"Logging in...":"Login"}),s.jsx("button",{onClick:L,disabled:e||!o||!u,className:"glass-flex-1 glass-px-4 glass-py-2 glass-border glass-border-white/30 glass-text-primary glass-radius-lg hover:glass-surface-subtle/5 disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:e?"Registering...":"Register"})]})]})]})}),H=()=>s.jsxs("div",{className:"glass-space-y-6",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Form Context (describe your form)"}),s.jsx("input",{type:"text",value:w,onChange:a=>_(a.target.value),placeholder:"e.g., 'user registration form', 'contact form', 'payment form'",className:"glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 glass-text-primary glass-focus glass-touch-target glass-contrast-guard"})]}),s.jsx("button",{onClick:G,disabled:e||!w,className:"glass-w-full glass-px-6 glass-py-3 glass-surface-blue glass-text-primary glass-radius-lg hover:glass-opacity-90 disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:e?"Generating with GPT-4...":"🤖 Generate Smart Form Fields"}),v.length>0&&s.jsxs("div",{className:"glass-space-y-3",children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Generated Fields:"}),v.map((a,m)=>s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-2",children:[s.jsx("span",{className:"glass-font-medium glass-text-primary-glass-opacity-90",children:a.label}),s.jsx("span",{className:"glass-text-xs glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius",children:a.fieldType})]}),s.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-60 glass-mb-2",children:a.placeholder}),a.required&&s.jsx("span",{className:"glass-text-xs glass-text-primary",children:"* Required"}),a.validation&&s.jsxs("div",{className:"glass-text-xs glass-text-primary-glass-opacity-50 glass-mt-2",children:["Validation: ",JSON.stringify(a.validation)]})]},m))]})]}),$=()=>s.jsxs("div",{className:"glass-space-y-6",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Search Query"}),s.jsx("input",{type:"text",value:j,onChange:a=>R(a.target.value),onKeyPress:a=>a.key==="Enter"&&I(),placeholder:"Search anything...",className:"glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 glass-text-primary glass-focus glass-touch-target glass-contrast-guard"})]}),s.jsx("button",{onClick:I,disabled:e||!j,className:"glass-w-full glass-px-6 glass-py-3 glass-surface-blue glass-text-primary glass-radius-lg hover:glass-opacity-90 disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:e?"Searching with AI...":"🔍 Semantic Search"}),T&&s.jsxs("div",{className:"glass-p-3 glass-surface-subtle/10 glass-border glass-border-blue/20 glass-radius-lg",children:[s.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:"Enhanced Query:"}),s.jsx("p",{className:"glass-text-sm glass-text-primary-glass-opacity-90 glass-mt-1",children:T})]}),N.length>0&&s.jsxs("div",{className:"glass-space-y-3",children:[s.jsxs("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:["Results (",N.length,"):"]}),N.map(a=>s.jsxs("div",{className:"glass-p-4 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg",children:[s.jsx("p",{className:"glass-text-primary-glass-opacity-90 glass-mb-2",children:a.content}),s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-60",children:[s.jsxs("span",{children:["Score: ",a.score.toFixed(3)]}),a.highlights&&a.highlights.length>0&&s.jsx("span",{className:"glass-text-primary",children:"★ Highlighted"})]})]},a.id))]})]}),M=()=>s.jsxs("div",{className:"glass-space-y-6",children:[s.jsxs("div",{children:[s.jsx("label",{className:"glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2",children:"Upload Image"}),s.jsx("input",{type:"file",accept:"image/*",onChange:J,className:"glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 glass-text-primary glass-file-mr-4 glass-file-py-2 glass-file-px-4 glass-file-radius glass-file-border-0 glass-file-surface-blue glass-file-text-primary glass-touch-target glass-contrast-guard"})]}),p&&s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"glass-aspect-square glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden",children:s.jsx("img",{src:p,alt:"Uploaded",className:"glass-w-full glass-h-full glass-object-cover"})}),s.jsx("button",{onClick:B,disabled:e,className:"glass-w-full glass-px-6 glass-py-3 glass-surface-green glass-text-primary glass-radius-lg hover:glass-opacity-90 disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:e?"Removing Background...":"✂️ Remove Background"})]}),n&&s.jsxs("div",{className:"glass-space-y-3",children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80",children:"Analysis Results:"}),s.jsxs("div",{className:"glass-grid glass-grid-cols-2 glass-gap-3",children:[s.jsxs("div",{className:"glass-p-3 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary-glass-opacity-90",children:n.faces?.length||0}),s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:"Faces Detected"})]}),s.jsxs("div",{className:"glass-p-3 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary-glass-opacity-90",children:n.objects?.length||0}),s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:"Objects Detected"})]})]}),n.labels&&n.labels.length>0&&s.jsxs("div",{className:"glass-p-3 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg",children:[s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2",children:"Labels:"}),s.jsx("div",{className:"glass-flex glass-flex-wrap glass-gap-2",children:n.labels.slice(0,5).map((a,m)=>s.jsxs("span",{className:"glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius glass-text-xs glass-text-primary-glass-opacity-90",children:[a.description," (",(a.score*100).toFixed(0),"%)"]},m))})]}),n.text&&n.text.text&&s.jsxs("div",{className:"glass-p-3 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg",children:[s.jsx("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2",children:"Extracted Text:"}),s.jsxs("p",{className:"glass-text-sm glass-text-primary-glass-opacity-90",children:[n.text.text.substring(0,200),"..."]})]})]})]});return s.jsx("div",{"data-glass-component":!0,className:"glass-min-h-screen glass-p-6",children:s.jsx("div",{className:"glass-max-w-4xl glass-mx-auto",children:s.jsxs(W,{className:"glass-p-8",children:[s.jsxs("div",{className:"glass-mb-8",children:[s.jsx("h1",{className:"glass-text-3xl glass-font-bold glass-text-primary-glass-opacity-90 glass-mb-2",children:"🤖 AuraGlass AI Demo"}),s.jsx("p",{className:"glass-text-primary-glass-opacity-60",children:"Production-ready AI features with real OpenAI, Pinecone, and Google Vision APIs"})]}),c&&s.jsx("div",{className:"glass-mb-6 glass-p-4 glass-border glass-border-red/30 glass-surface-red/20 glass-radius-lg",children:s.jsxs("p",{className:"glass-text-primary glass-text-sm",children:["⚠️ ",c]})}),s.jsx("div",{className:"glass-flex glass-gap-2 glass-mb-6 glass-border-b glass-border-white/10 glass-pb-4",children:[{id:"auth",label:"🔐 Auth",icon:"🔐"},{id:"forms",label:"📝 Smart Forms",icon:"📝"},{id:"search",label:"🔍 Search",icon:"🔍"},{id:"images",label:"🖼️ Images",icon:"🖼️"}].map(a=>s.jsx("button",{onClick:()=>l(a.id),className:K("px-4 py-2 glass-radius-lg transition-colors glass-focus glass-touch-target glass-contrast-guard",g===a.id?"glass-surface-blue text-primary":"text-primary/60 hover:text-primary/90 hover:bg-white/5"),children:a.label},a.id))}),s.jsxs("div",{className:"glass-min-h-400px",children:[g==="auth"&&Q(),g==="forms"&&H(),g==="search"&&$(),g==="images"&&M()]}),s.jsx("div",{className:"glass-mt-8 glass-pt-6 glass-border-t glass-border-white/10",children:s.jsxs("div",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:["💡 ",s.jsx("strong",{children:"Tip:"})," Make sure your API server is running on port 3001. Run:"," ",s.jsx("code",{className:"glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius",children:"npm run server:all"})]})})]})})})};try{f.displayName="AIDemo",f.__docgenInfo={description:"",displayName:"AIDemo",props:{}}}catch{}const Z=Object.freeze(Object.defineProperty({__proto__:null,AIDemo:f,default:f},Symbol.toStringTag,{value:"Module"})),ss="AIDemo",P=Z[ss],rs={title:"AI + Intelligence/AIDemo",component:P,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Component-owned Storybook coverage for AIDemo. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},y={render:()=>s.jsxs("div",{className:"ai-demo-story-shell",style:{width:"100%",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:"clamp(16px, 3vw, 32px)",background:"linear-gradient(135deg, #f8fafc 0%, #e0f2fe 46%, #eef2ff 100%)",color:"#0f172a"},children:[s.jsx("style",{children:`
        .ai-demo-story-shell,
        .ai-demo-story-shell * {
          box-sizing: border-box;
        }

        .ai-demo-story-shell > [data-glass-component] {
          width: min(920px, 100%);
          min-height: 0;
          max-height: min(760px, calc(100vh - 64px));
          overflow: auto;
          padding: 0;
        }

        .ai-demo-story-shell [data-glass-component] > div {
          width: 100%;
          max-width: none;
          margin: 0;
        }

        .ai-demo-story-shell :where(h1, h2, h3, h4, p, label, span, strong, button, code, input, div) {
          color: #0f172a;
          opacity: 1;
          overflow-wrap: anywhere;
        }

        .ai-demo-story-shell :where(button, input, code) {
          max-width: 100%;
          border-color: rgba(15, 23, 42, 0.18);
        }

        [data-storybook-preview-mode="dark"] .ai-demo-story-shell :where(button) {
          color: #f8fafc;
          border-color: rgba(226, 232, 240, 0.22);
          background: rgba(15, 23, 42, 0.68);
        }

        .ai-demo-story-shell :where(input) {
          background: rgba(255, 255, 255, 0.92);
        }

        .ai-demo-story-shell :where(.glass-flex) {
          flex-wrap: wrap;
        }

        .ai-demo-story-shell :where(.glass-grid-cols-2) {
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }

        .ai-demo-story-shell :where(.glass-min-h-400px) {
          min-height: 260px;
        }

        @media (max-width: 640px) {
          .ai-demo-story-shell {
            padding: 16px;
          }

          .ai-demo-story-shell > [data-glass-component] {
            max-height: calc(100vh - 40px);
          }

          .ai-demo-story-shell :where(.glass-p-8) {
            padding: 18px;
          }
        }
      `}),s.jsx(P,{})]})};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="ai-demo-story-shell" style={{
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "clamp(16px, 3vw, 32px)",
    background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 46%, #eef2ff 100%)",
    color: "#0f172a"
  }}>
      <style>{\`
        .ai-demo-story-shell,
        .ai-demo-story-shell * {
          box-sizing: border-box;
        }

        .ai-demo-story-shell > [data-glass-component] {
          width: min(920px, 100%);
          min-height: 0;
          max-height: min(760px, calc(100vh - 64px));
          overflow: auto;
          padding: 0;
        }

        .ai-demo-story-shell [data-glass-component] > div {
          width: 100%;
          max-width: none;
          margin: 0;
        }

        .ai-demo-story-shell :where(h1, h2, h3, h4, p, label, span, strong, button, code, input, div) {
          color: #0f172a;
          opacity: 1;
          overflow-wrap: anywhere;
        }

        .ai-demo-story-shell :where(button, input, code) {
          max-width: 100%;
          border-color: rgba(15, 23, 42, 0.18);
        }

        [data-storybook-preview-mode="dark"] .ai-demo-story-shell :where(button) {
          color: #f8fafc;
          border-color: rgba(226, 232, 240, 0.22);
          background: rgba(15, 23, 42, 0.68);
        }

        .ai-demo-story-shell :where(input) {
          background: rgba(255, 255, 255, 0.92);
        }

        .ai-demo-story-shell :where(.glass-flex) {
          flex-wrap: wrap;
        }

        .ai-demo-story-shell :where(.glass-grid-cols-2) {
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }

        .ai-demo-story-shell :where(.glass-min-h-400px) {
          min-height: 260px;
        }

        @media (max-width: 640px) {
          .ai-demo-story-shell {
            padding: 16px;
          }

          .ai-demo-story-shell > [data-glass-component] {
            max-height: calc(100vh - 40px);
          }

          .ai-demo-story-shell :where(.glass-p-8) {
            padding: 18px;
          }
        }
      \`}</style>
      <Component />
    </div>
}`,...y.parameters?.docs?.source}}};const is=["Default"];export{y as Default,is as __namedExportsOrder,rs as default};
