import{r as i,j as s,C as g,c as p}from"./iframe-CCaBsF9w.js";import{G as u}from"./GlassAdvanced-BpMhHjWH.js";import"./preload-helper-PPVm8Dsz.js";import"./utilsCore-G2Gruh8-.js";class t extends i.Component{constructor(e){super(e),this.handleReset=()=>{this.setState({hasError:!1,error:null,errorInfo:null})},this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e,errorInfo:null}}componentDidCatch(e,a){this.props.onError?.(e,a),this.setState({error:e,errorInfo:a}),typeof window<"u"&&window.gtag&&window.gtag("event","exception",{description:e.toString(),fatal:!1})}render(){const{children:e,fallback:a,onError:m,className:o,"aria-label":n,"data-testid":l,...c}=this.props;return this.state.hasError?a?s.jsx(s.Fragment,{children:a}):s.jsx(u,{"data-glass-component":!0,"data-testid":l,elev:3,variant:"danger",className:p("glass-p-8 glass-m-4",o),role:"alert","aria-live":"assertive","aria-label":n,...c,children:s.jsxs(g,{as:"div",className:"glass-stack glass-gap-4",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-balance",children:"⚠️ Something went wrong"}),s.jsx("p",{className:"glass-text-secondary glass-text-balance",children:"We encountered an unexpected error. The issue has been logged and our team will investigate."}),!1,s.jsxs("div",{className:"glass-gap-4 glass-flex",children:[s.jsx("button",{onClick:this.handleReset,className:"glass-button glass-touch-target glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard","aria-label":"Try again",children:"Try Again"}),s.jsx("button",{onClick:h=>window.location.href="/",className:"glass-button glass-subtle glass-touch-target","aria-label":"Go to homepage",children:"Go Home"})]})]})}):s.jsx("div",{className:o,"aria-label":n,"data-testid":l,...c,children:e})}}try{t.displayName="GlassErrorBoundary",t.__docgenInfo={description:`Glass-styled Error Boundary
Catches errors and displays beautiful glass error UI`,displayName:"GlassErrorBoundary",props:{fallback:{defaultValue:null,description:"",name:"fallback",required:!1,type:{name:"ReactNode"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: Error, errorInfo: ErrorInfo) => void) | undefined"}}}}}catch{}const E={title:"Reference/Legacy Components/Glass Error Boundary",component:t,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for GlassErrorBoundary."}}}},r={args:{children:null},render:()=>s.jsx(t,{className:"glass-p-4",children:s.jsxs("div",{className:"glass glass-p-4 glass-radius-lg",style:{color:"rgba(248, 250, 252, 0.96)"},children:[s.jsx("strong",{children:"GlassErrorBoundary protected content"}),s.jsx("p",{className:"glass-text-sm",style:{color:"rgba(226, 232, 240, 0.86)"},children:"Component-owned story coverage sample."})]})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <Component className="glass-p-4">
      <div className="glass glass-p-4 glass-radius-lg" style={{
      color: "rgba(248, 250, 252, 0.96)"
    }}>
        <strong>GlassErrorBoundary protected content</strong>
        <p className="glass-text-sm" style={{
        color: "rgba(226, 232, 240, 0.86)"
      }}>
          Component-owned story coverage sample.
        </p>
      </div>
    </Component>
}`,...r.parameters?.docs?.source}}};const v=["Default"];export{r as Default,v as __namedExportsOrder,E as default};
