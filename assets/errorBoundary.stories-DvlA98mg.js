import{j as r,R as p}from"./iframe-OZreUAtx.js";import{a as n,b as h,G as x,c as y}from"./errorBoundary-DV67whkM.js";import"./preload-helper-PPVm8Dsz.js";import"./OptimizedGlassCore-DAQZMOh8.js";const N={title:"Utils/ErrorBoundary",component:n,parameters:{layout:"centered",docs:{description:{component:"Comprehensive error boundary components with glass morphism styling for graceful error handling."}}},argTypes:{maxRetries:{control:{type:"number",min:0,max:10},description:"Maximum number of retry attempts"},resetOnPropsChange:{control:"boolean",description:"Reset error state when props change"}},args:{maxRetries:3,resetOnPropsChange:!0}},o=({shouldError:s})=>{if(s)throw new Error("This is a test error for demonstration purposes");return r.jsx("div",{className:"glass-p-4 text-center",children:"Component rendered successfully!"})},E=({shouldError:s})=>{const[e,a]=p.useState(!1);if(p.useEffect(()=>{s&&setTimeout(()=>{a(!0)},1e3)},[s]),e)throw new Error("Async error occurred");return r.jsx("div",{className:"glass-p-4 text-center",children:"Async component working..."})},t={render:s=>r.jsx(n,{...s,children:r.jsx(o,{shouldError:!1})})},c={render:s=>r.jsx(n,{...s,children:r.jsx(o,{shouldError:!0})})},l={render:s=>r.jsx(h,{...s,children:r.jsx(E,{shouldError:!0})})},d={render:s=>r.jsx(y,{fallback:r.jsx("div",{className:"glass-p-4 text-center text-red-400",children:"Something went wrong!"}),onError:e=>console.error("Light error boundary caught:",e),children:r.jsx(o,{shouldError:!0})})},u={render:s=>r.jsx(x,{...s,children:r.jsx(o,{shouldError:!0})})},i={render:s=>{const[e,a]=p.useState(!0);return r.jsx(n,{...s,fallback:({retry:m})=>r.jsxs("div",{className:"p-6 text-center glass-auto-gap glass-auto-gap-lg",children:[r.jsx("h3",{className:"text-lg font-semibold",children:"Error Occurred"}),r.jsx("p",{className:"text-sm opacity-80",children:"Something went wrong, but you can retry."}),r.jsxs("div",{className:"space-x-2",children:[r.jsx("button",{onClick:m,className:"glass-px-4 glass-py-2 glass-surface-primary rounded-lg hover:bg-blue-500/30 transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Retry"}),r.jsx("button",{onClick:()=>a(!1),className:"glass-px-4 glass-py-2 glass-surface-success rounded-lg hover:bg-green-500/30 transition-colors glass-focus glass-touch-target glass-contrast-guard",children:"Fix Error"})]})]}),children:r.jsx(o,{shouldError:e})})}},g={render:s=>r.jsx(n,{...s,fallback:({error:e,retry:a,errorId:m})=>r.jsxs("div",{className:"p-8 text-center glass-auto-gap glass-auto-gap-lg max-w-md",children:[r.jsx("div",{className:"w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center",children:r.jsx("svg",{className:"w-8 h-8 text-red-400",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),r.jsx("h3",{className:"text-xl font-bold",children:"Oops! Something went wrong"}),r.jsx("p",{className:"text-sm opacity-80",children:"We encountered an unexpected error. Our team has been notified."}),r.jsxs("div",{className:"text-xs opacity-60 font-mono bg-black/20 rounded p-2",children:["Error ID: ",m]}),r.jsx("div",{className:"flex justify-center space-x-2",children:r.jsx("button",{onClick:a,className:"px-6 glass-py-2 glass-surface-primary rounded-lg hover:bg-blue-500/30 transition-colors font-medium glass-focus glass-touch-target glass-contrast-guard",children:"Try Again"})})]}),children:r.jsx(o,{shouldError:!0})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <GlassErrorBoundary {...args}>
      <ErrorComponent shouldError={false} />
    </GlassErrorBoundary>
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <GlassErrorBoundary {...args}>
      <ErrorComponent shouldError={true} />
    </GlassErrorBoundary>
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <GlassAsyncErrorBoundary {...args}>
      <AsyncErrorComponent shouldError={true} />
    </GlassAsyncErrorBoundary>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <GlassLightErrorBoundary fallback={<div className="glass-p-4 text-center text-red-400">Something went wrong!</div>} onError={error => console.error('Light error boundary caught:', error)}>
      <ErrorComponent shouldError={true} />
    </GlassLightErrorBoundary>
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <GlassComponentErrorBoundary {...args}>
      <ErrorComponent shouldError={true} />
    </GlassComponentErrorBoundary>
}`,...u.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [shouldError, setShouldError] = React.useState(true);
    return <GlassErrorBoundary {...args} fallback={({
      retry
    }) => <div className="p-6 text-center glass-auto-gap glass-auto-gap-lg">
            <h3 className="text-lg font-semibold">Error Occurred</h3>
            <p className="text-sm opacity-80">Something went wrong, but you can retry.</p>
            <div className="space-x-2">
              <button onClick={retry} className="glass-px-4 glass-py-2 glass-surface-primary rounded-lg hover:bg-blue-500/30 transition-colors glass-focus glass-touch-target glass-contrast-guard">
                Retry
              </button>
              <button onClick={() => setShouldError(false)} className="glass-px-4 glass-py-2 glass-surface-success rounded-lg hover:bg-green-500/30 transition-colors glass-focus glass-touch-target glass-contrast-guard">
                Fix Error
              </button>
            </div>
          </div>}>
        <ErrorComponent shouldError={shouldError} />
      </GlassErrorBoundary>;
  }
}`,...i.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <GlassErrorBoundary {...args} fallback={({
    error,
    retry,
    errorId
  }) => <div className="p-8 text-center glass-auto-gap glass-auto-gap-lg max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Oops! Something went wrong</h3>
          <p className="text-sm opacity-80">
            We encountered an unexpected error. Our team has been notified.
          </p>
          <div className="text-xs opacity-60 font-mono bg-black/20 rounded p-2">
            Error ID: {errorId}
          </div>
          <div className="flex justify-center space-x-2">
            <button onClick={retry} className="px-6 glass-py-2 glass-surface-primary rounded-lg hover:bg-blue-500/30 transition-colors font-medium glass-focus glass-touch-target glass-contrast-guard">
              Try Again
            </button>
          </div>
        </div>}>
      <ErrorComponent shouldError={true} />
    </GlassErrorBoundary>
}`,...g.parameters?.docs?.source}}};const C=["Default","WithError","AsyncErrorBoundary","LightErrorBoundary","ComponentErrorBoundary","WithRetry","WithCustomFallback"];export{l as AsyncErrorBoundary,u as ComponentErrorBoundary,t as Default,d as LightErrorBoundary,g as WithCustomFallback,c as WithError,i as WithRetry,C as __namedExportsOrder,N as default};
