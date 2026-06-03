import{j as r,R as h}from"./iframe-DF7JlHBi.js";import{a as o,b as x,G as y,c as b}from"./errorBoundary-niLZkt2W.js";import"./preload-helper-PPVm8Dsz.js";import"./OptimizedGlassCore-VCnDPWfd.js";import"./deviceCapabilities-D3MTg8N7.js";const S={title:"Effects + Advanced/error Boundary",component:o,parameters:{layout:"fullscreen",previewSurface:"app",docs:{description:{component:"Comprehensive error boundary components with glass morphism styling for graceful error handling."}}},argTypes:{maxRetries:{control:{type:"number",min:0,max:10},description:"Maximum number of retry attempts"},resetOnPropsChange:{control:"boolean",description:"Reset error state when props change"}},args:{maxRetries:3,resetOnPropsChange:!0}},s=({children:e})=>r.jsxs("div",{"data-bg":"light",className:"glass-on-light glass-error-boundary-story",style:{width:"100%",minHeight:"100vh",padding:"clamp(20px, 4vw, 40px)",boxSizing:"border-box",overflowX:"hidden",display:"grid",placeItems:"center",backgroundColor:"#f8fafc",backgroundImage:"linear-gradient(135deg, #f8fafc 0%, #e7f0ff 44%, #f6efff 100%)",color:"#0f172a"},children:[r.jsx("style",{children:`
      .glass-error-boundary-story {
        --glass-text-primary: rgba(15, 23, 42, 0.95);
        --glass-text-secondary: rgba(51, 65, 85, 0.88);
      }

      .glass-error-boundary-story .glass-text-primary,
      .glass-error-boundary-story .glass-text-primary-opacity-70 {
        color: rgba(15, 23, 42, 0.95) !important;
      }

      .glass-error-boundary-story svg.glass-text-primary {
        color: rgba(146, 64, 14, 0.95) !important;
      }

      .glass-error-boundary-story button {
        min-height: 44px;
      }

      [data-storybook-preview-mode="dark"] .glass-error-boundary-story .glass-surface-warning\\/20 {
        background: #fbbf24 !important;
        border: 1px solid rgba(146, 64, 14, 0.46) !important;
        color: #111827 !important;
      }

      [data-storybook-preview-mode="dark"] .glass-error-boundary-story button.glass-surface-warning\\/20:hover {
        background: #f59e0b !important;
        color: #111827 !important;
      }

      [data-storybook-preview-mode="high-contrast"] .glass-error-boundary-story button {
        background: #000 !important;
        border: 2px solid #fff !important;
        color: #fff !important;
      }
    `}),r.jsx("div",{style:{width:"min(100%, 520px)"},children:e})]}),u=({title:e="Loading Failed",message:m="The operation could not be completed.",children:g})=>r.jsxs("div",{className:"glass-p-6 text-center glass-auto-gap glass-auto-gap-lg",children:[r.jsx("div",{className:"w-16 h-16 mx-auto rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center",children:r.jsx("svg",{className:"w-8 h-8 text-red-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),r.jsxs("div",{children:[r.jsx("h3",{className:"text-xl font-bold",children:e}),r.jsx("p",{className:"text-sm opacity-80",children:m})]}),g]}),p=({shouldError:e})=>{if(e)throw new Error("This is a test error for demonstration purposes");return r.jsx("div",{className:"glass-p-4 text-center",children:"Component rendered successfully!"})},f=()=>r.jsxs("div",{className:"glass-p-6 text-center glass-auto-gap glass-auto-gap-lg",children:[r.jsx("div",{className:"w-12 h-12 mx-auto rounded-full border-2 border-blue-500/30 border-t-blue-600 animate-spin"}),r.jsxs("div",{children:[r.jsx("h3",{className:"text-lg font-semibold",children:"Loading async resource"}),r.jsx("p",{className:"text-sm opacity-80",children:"The timeout fallback will appear without throwing a page error."})]})]}),a={render:e=>r.jsx(s,{children:r.jsx(o,{...e,children:r.jsx(p,{shouldError:!1})})})},t={render:e=>r.jsx(s,{children:r.jsx(o,{...e,children:r.jsx(u,{title:"Error Boundary Fallback",message:"A captured render failure is represented here without throwing in Storybook."})})})},n={render:e=>r.jsx(s,{children:r.jsx(x,{...e,timeout:900,children:r.jsx(f,{})})})},l={render:e=>r.jsx(s,{children:r.jsx(b,{fallback:r.jsx("div",{className:"glass-p-4 text-center text-red-600",children:"Something went wrong!"}),children:r.jsx(u,{title:"Lightweight Fallback",message:"Non-critical content can collapse into a compact fallback state."})})})},c={render:e=>r.jsx(s,{children:r.jsx(y,{...e,children:r.jsx(u,{title:"Component Fallback",message:"The component boundary keeps the rest of the preview stable."})})})},i={render:e=>{const[m,g]=h.useState(!0);return r.jsx(s,{children:r.jsx(o,{...e,children:m?r.jsx(u,{title:"Error Occurred",message:"Something went wrong, but the preview can recover.",children:r.jsx("div",{className:"flex flex-wrap justify-center gap-2",children:r.jsx("button",{onClick:()=>g(!1),className:"glass-px-4 glass-py-2 glass-surface-success rounded-lg hover:bg-green-500/30 transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Fix Error"})})}):r.jsx(p,{shouldError:!1})})})}},d={render:e=>r.jsx(s,{children:r.jsx(o,{...e,children:r.jsxs("div",{className:"p-8 text-center glass-auto-gap glass-auto-gap-lg max-w-md",children:[r.jsx("div",{className:"w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center",children:r.jsx("svg",{className:"w-8 h-8 text-red-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),r.jsx("h3",{className:"text-xl font-bold",children:"Oops! Something went wrong"}),r.jsx("p",{className:"text-sm opacity-80",children:"We encountered an unexpected error. Our team has been notified."}),r.jsx("div",{className:"text-xs opacity-60 font-mono bg-black/20 rounded p-2",children:"Error ID: storybook-preview"}),r.jsx("div",{className:"flex justify-center space-x-2",children:r.jsx("button",{type:"button",className:"px-6 glass-py-2 glass-surface-primary rounded-lg hover:bg-blue-500/30 transition-colors font-medium glass-focus glass-touch-target glass-contrast-guard",children:"Try Again"})})]})})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorStoryFrame>
      <GlassErrorBoundary {...args}>
        <ErrorComponent shouldError={false} />
      </GlassErrorBoundary>
    </ErrorStoryFrame>
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorStoryFrame>
      <GlassErrorBoundary {...args}>
        <ErrorStatePreview title="Error Boundary Fallback" message="A captured render failure is represented here without throwing in Storybook." />
      </GlassErrorBoundary>
    </ErrorStoryFrame>
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorStoryFrame>
      <GlassAsyncErrorBoundary {...args} timeout={900}>
        <AsyncLoadingComponent />
      </GlassAsyncErrorBoundary>
    </ErrorStoryFrame>
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorStoryFrame>
      <GlassLightErrorBoundary fallback={<div className="glass-p-4 text-center text-red-600">Something went wrong!</div>}>
        <ErrorStatePreview title="Lightweight Fallback" message="Non-critical content can collapse into a compact fallback state." />
      </GlassLightErrorBoundary>
    </ErrorStoryFrame>
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorStoryFrame>
      <GlassComponentErrorBoundary {...args}>
        <ErrorStatePreview title="Component Fallback" message="The component boundary keeps the rest of the preview stable." />
      </GlassComponentErrorBoundary>
    </ErrorStoryFrame>
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [shouldError, setShouldError] = React.useState(true);
    return <ErrorStoryFrame>
        <GlassErrorBoundary {...args}>
          {shouldError ? <ErrorStatePreview title="Error Occurred" message="Something went wrong, but the preview can recover.">
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={() => setShouldError(false)} className="glass-px-4 glass-py-2 glass-surface-success rounded-lg hover:bg-green-500/30 transition-colors glass-focus glass-touch-target glass-contrast-guard">
                  Fix Error
                </button>
              </div>
            </ErrorStatePreview> : <ErrorComponent shouldError={false} />}
        </GlassErrorBoundary>
      </ErrorStoryFrame>;
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorStoryFrame>
      <GlassErrorBoundary {...args}>
        <div className="p-8 text-center glass-auto-gap glass-auto-gap-lg max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Oops! Something went wrong</h3>
          <p className="text-sm opacity-80">
            We encountered an unexpected error. Our team has been notified.
          </p>
          <div className="text-xs opacity-60 font-mono bg-black/20 rounded p-2">
            Error ID: storybook-preview
          </div>
          <div className="flex justify-center space-x-2">
            <button type="button" className="px-6 glass-py-2 glass-surface-primary rounded-lg hover:bg-blue-500/30 transition-colors font-medium glass-focus glass-touch-target glass-contrast-guard">
              Try Again
            </button>
          </div>
        </div>
      </GlassErrorBoundary>
    </ErrorStoryFrame>
}`,...d.parameters?.docs?.source}}};const N=["Default","WithError","AsyncErrorBoundary","LightErrorBoundary","ComponentErrorBoundary","WithRetry","WithCustomFallback"];export{n as AsyncErrorBoundary,c as ComponentErrorBoundary,a as Default,l as LightErrorBoundary,d as WithCustomFallback,t as WithError,i as WithRetry,N as __namedExportsOrder,S as default};
