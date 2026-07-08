import{r as q,b as G,j as s,c as d}from"./iframe-D8J9cnFR.js";import{t as I,u as k}from"./components-DA1Uo_xs.js";import{O as z}from"./OptimizedGlassCore-BnRS7lWr.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-D-Vbq3pm.js";const t=q.forwardRef(({isTyping:a=!0,users:l,showUsers:o=!0,text:x,size:n="md",elevation:N="level1",variant:p="bounce",dotColor:C="primary",dotCount:S=3,glass:y=!0,className:h,...b},w)=>{if(G(),!a)return null;const e=Array.isArray(l)?l:l?[l]:[],g=e.length>0,$=()=>!g||!o?null:e.length===1?`${e[0]} is`:e.length===2?`${e[0]} and ${e[1]} are`:e.length>2?`${e[0]}, ${e[1]} and ${e.length-2} other${e.length-2>1?"s":""} are`:null,A=x?x.replace("{users}",e.join(", ")).replace("{isAre}",e.length===1?"is":"are"):null,i={sm:{dot:"w-1.5 h-1.5",text:"glass-text-xs",gap:"gap-1",padding:"glass-px-2 glass-py-1"},md:{dot:"w-2 h-2",text:"glass-text-sm",gap:"gap-1.5",padding:"glass-px-3 glass-py-2"},lg:{dot:"w-2.5 h-2.5",text:"glass-text-base",gap:"gap-2",padding:"glass-px-4 glass-py-3"}},T={primary:"bg-blue-500",secondary:"bg-purple-500",success:"bg-green-500",warning:"bg-yellow-500",danger:"bg-red-500",neutral:"glass-surface-subtle"},V={bounce:"animate-bounce",pulse:"animate-pulse",wave:"",fade:"animate-pulse"},_=f=>{const r=f*150,v={animationDelay:`${r}ms`};return p==="wave"&&(v.animation="wave 1.4s ease-in-out infinite",v.animationDelay=`${r}ms`),v},D=Array.from({length:S},(f,r)=>s.jsx("div",{className:d(i[n].dot,T[C],"rounded-full",p!=="wave"&&V[p]),style:_(r),"aria-hidden":"true"},r)),j=s.jsxs("div",{className:d("inline-flex items-center",i[n].gap,!y&&i[n].padding),children:[o&&g&&s.jsx("span",{className:d(i[n].text,"glass-text-secondary font-medium"),children:A||s.jsxs(s.Fragment,{children:[$()," typing",s.jsx("span",{className:"glass-inline-glass-flex glass-ml-1 glass-gap-0.5",children:Array.from({length:3},(f,r)=>s.jsx("span",{className:"glass-animate-pulse",style:{animationDelay:`${r*200}ms`},children:"."},r))})]})}),(!o||!g)&&s.jsx("div",{className:d("flex items-center",i[n].gap),children:D})]});return y?s.jsx(z,{ref:w,elevation:N,className:d("inline-flex glass-radius-full",i[n].padding,h),role:"status","aria-live":"polite","aria-label":g&&o?`${e.join(", ")} ${e.length===1?"is":"are"} typing`:"Someone is typing",...b,children:j}):s.jsx("div",{"data-glass-component":!0,ref:w,className:d("inline-flex",h),role:"status","aria-live":"polite","aria-label":g&&o?`${e.join(", ")} ${e.length===1?"is":"are"} typing`:"Someone is typing",...b,children:j})});t.displayName="GlassTypingIndicator";if(typeof document<"u"&&!document.getElementById("typing-indicator-keyframes")){const a=document.createElement("style");a.id="typing-indicator-keyframes",a.textContent=`
    @keyframes wave {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-8px);
      }
    }
  `,document.head.appendChild(a)}try{t.displayName="GlassTypingIndicator",t.__docgenInfo={description:"",displayName:"GlassTypingIndicator",props:{isTyping:{defaultValue:{value:"true"},description:"Whether the indicator is shown",name:"isTyping",required:!1,type:{name:"boolean | undefined"}},users:{defaultValue:null,description:"User or users who are typing",name:"users",required:!1,type:{name:"string | string[] | undefined"}},showUsers:{defaultValue:{value:"true"},description:"Show user names",name:"showUsers",required:!1,type:{name:"boolean | undefined"}},text:{defaultValue:{value:"'{users} {isAre} typing...'"},description:"Typing text template",name:"text",required:!1,type:{name:"string | undefined"}},size:{defaultValue:{value:"md"},description:"Size of the indicator",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},elevation:{defaultValue:{value:"level1"},description:"Glassmorphism elevation level",name:"elevation",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"level1"'},{value:'"level2"'},{value:'"level3"'},{value:'"level4"'},{value:'"level5"'}]}},variant:{defaultValue:{value:"bounce"},description:"Dot variant style",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"fade"'},{value:'"bounce"'},{value:'"pulse"'},{value:'"wave"'}]}},dotColor:{defaultValue:{value:"primary"},description:"Dot color",name:"dotColor",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"neutral"'},{value:'"success"'},{value:'"warning"'},{value:'"danger"'},{value:'"secondary"'}]}},dotCount:{defaultValue:{value:"3"},description:"Number of dots",name:"dotCount",required:!1,type:{name:"number | undefined"}},glass:{defaultValue:{value:"true"},description:"Enable glassmorphism container",name:"glass",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const E={width:"min(520px, calc(100vw - 64px))",display:"grid",gap:16},W={title:"Workflows/Glass Typing Indicator",component:t,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"A compact glass typing indicator for chat, collaboration, and assistant interfaces."}}},args:{users:["Maya","Ari"],showUsers:!0,size:"md",elevation:"level2",variant:"bounce",dotColor:"primary",dotCount:3,glass:!0}},u={render:a=>s.jsx("div",{style:E,children:s.jsxs("div",{className:"glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-mb-5",children:[s.jsx("span",{className:"glass-inline-flex glass-h-10 glass-w-10 glass-items-center glass-justify-center glass-radius-full glass-surface-blue",children:s.jsx(k,{size:18,"aria-hidden":"true"})}),s.jsxs("div",{children:[s.jsx("h3",{className:"glass-text-base glass-font-semibold glass-text-primary",children:"Design review"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Active conversation preview"})]})]}),s.jsxs("div",{className:"glass-flex glass-flex-col glass-gap-3",children:[s.jsx("div",{className:"glass-w-fit glass-max-w-full glass-radius-xl glass-surface-overlay glass-border glass-border-subtle glass-px-4 glass-py-3 glass-text-sm glass-text-primary",children:"Can we ship the clearer glass surface today?"}),s.jsx("div",{className:"glass-ml-auto glass-w-fit glass-max-w-full glass-radius-xl glass-surface-blue glass-px-4 glass-py-3 glass-text-sm glass-text-primary",children:"Yes, checking the final contrast pass now."}),s.jsx(t,{...a})]})]})})},c={render:a=>s.jsx("div",{className:"glass-grid glass-gap-3",style:{width:"min(560px, calc(100vw - 64px))"},children:["bounce","pulse","wave","fade"].map(l=>s.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-gap-4 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-4",children:[s.jsx("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:l}),s.jsx(t,{...a,showUsers:!1,users:void 0,variant:l,dotColor:l==="wave"?"success":"primary"})]},l))})},m={args:{users:"Ops assistant",text:"{users} {isAre} summarizing the handoff...",size:"sm",elevation:"level1",dotColor:"success"},render:a=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-3 glass-radius-full glass-border glass-border-subtle glass-surface-overlay glass-p-3",children:[s.jsx(I,{size:18,className:"glass-text-primary","aria-hidden":"true"}),s.jsx(t,{...a})]})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div style={chatShellStyle}>
      <div className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5">
        <div className="glass-flex glass-items-center glass-gap-3 glass-mb-5">
          <span className="glass-inline-flex glass-h-10 glass-w-10 glass-items-center glass-justify-center glass-radius-full glass-surface-blue">
            <MessageCircle size={18} aria-hidden="true" />
          </span>
          <div>
            <h3 className="glass-text-base glass-font-semibold glass-text-primary">
              Design review
            </h3>
            <p className="glass-text-sm glass-text-secondary">
              Active conversation preview
            </p>
          </div>
        </div>

        <div className="glass-flex glass-flex-col glass-gap-3">
          <div className="glass-w-fit glass-max-w-full glass-radius-xl glass-surface-overlay glass-border glass-border-subtle glass-px-4 glass-py-3 glass-text-sm glass-text-primary">
            Can we ship the clearer glass surface today?
          </div>
          <div className="glass-ml-auto glass-w-fit glass-max-w-full glass-radius-xl glass-surface-blue glass-px-4 glass-py-3 glass-text-sm glass-text-primary">
            Yes, checking the final contrast pass now.
          </div>
          <GlassTypingIndicator {...args} />
        </div>
      </div>
    </div>
}`,...u.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div className="glass-grid glass-gap-3" style={{
    width: "min(560px, calc(100vw - 64px))"
  }}>
      {(["bounce", "pulse", "wave", "fade"] as const).map(variant => <div key={variant} className="glass-flex glass-items-center glass-justify-between glass-gap-4 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-4">
          <span className="glass-text-sm glass-font-medium glass-text-primary">
            {variant}
          </span>
          <GlassTypingIndicator {...args} showUsers={false} users={undefined} variant={variant} dotColor={variant === "wave" ? "success" : "primary"} />
        </div>)}
    </div>
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    users: "Ops assistant",
    text: "{users} {isAre} summarizing the handoff...",
    size: "sm",
    elevation: "level1",
    dotColor: "success"
  },
  render: args => <div className="glass-flex glass-items-center glass-gap-3 glass-radius-full glass-border glass-border-subtle glass-surface-overlay glass-p-3">
      <ShieldCheck size={18} className="glass-text-primary" aria-hidden="true" />
      <GlassTypingIndicator {...args} />
    </div>
}`,...m.parameters?.docs?.source}}};const B=["Default","DotVariants","CompactStatus"];export{m as CompactStatus,u as Default,c as DotVariants,B as __namedExportsOrder,W as default};
