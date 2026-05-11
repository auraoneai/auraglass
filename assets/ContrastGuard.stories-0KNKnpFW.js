import{a as o,j as t}from"./iframe-CrdWMSIk.js";import{CertificationCase as s}from"./GlassMissingInventoryCertification.stories-otkYCsLf.js";import"./preload-helper-PPVm8Dsz.js";const r="ContrastGuard",e=o[r],n=`
  .ag-contrast-story {
    --glass-text-primary: #0f172a;
    --glass-text-secondary: #334155;
    --glass-text-tertiary: #475569;
    --typography-text-primary: #0f172a;
    --typography-text-secondary: #334155;
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 18% 14%, rgba(59, 130, 246, 0.2), transparent 30%),
      radial-gradient(circle at 82% 18%, rgba(20, 184, 166, 0.18), transparent 28%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.84), rgba(226, 232, 240, 0.62));
    color: #0f172a;
    backdrop-filter: blur(22px);
    padding: clamp(16px, 4vw, 32px);
  }

  .ag-contrast-story,
  .ag-contrast-story *,
  .ag-contrast-story *::before,
  .ag-contrast-story *::after {
    box-sizing: border-box;
  }

  .ag-contrast-story .glass-text-primary,
  .ag-contrast-story .glass-text-secondary,
  .ag-contrast-story p,
  .ag-contrast-story li {
    color: #0f172a !important;
  }

  [data-storybook-preview-mode="dark"] .ag-contrast-story .glass-text-primary,
  [data-storybook-preview-mode="dark"] .ag-contrast-story .glass-text-secondary,
  [data-storybook-preview-mode="dark"] .ag-contrast-story p,
  [data-storybook-preview-mode="dark"] .ag-contrast-story li {
    color: #f8fafc !important;
  }

  .ag-contrast-story > div {
    width: min(960px, calc(100vw - 32px));
    max-width: calc(100vw - 32px);
    overflow-x: auto;
  }

  .ag-contrast-story .glass,
  .ag-contrast-story .glass-contrast-guard {
    background: rgba(255, 255, 255, 0.72) !important;
    color: #0f172a !important;
  }

  .ag-contrast-story [class*="glass-certification"],
  .ag-contrast-story .glass-certification-mini-title {
    background: rgba(255, 255, 255, 0.72) !important;
    color: #0f172a !important;
    border-color: rgba(15, 23, 42, 0.16) !important;
  }

  [data-storybook-preview-mode="dark"] .ag-contrast-story {
    --glass-text-primary: #f8fafc;
    --glass-text-secondary: #e2e8f0;
    --glass-text-tertiary: #cbd5e1;
    --typography-text-primary: #f8fafc;
    --typography-text-secondary: #e2e8f0;
    background:
      radial-gradient(circle at 18% 14%, rgba(59, 130, 246, 0.28), transparent 30%),
      radial-gradient(circle at 82% 18%, rgba(20, 184, 166, 0.24), transparent 28%),
      linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(30, 27, 75, 0.62), rgba(22, 78, 99, 0.58));
    color: #f8fafc;
  }

  [data-storybook-preview-mode="dark"] .ag-contrast-story .glass,
  [data-storybook-preview-mode="dark"] .ag-contrast-story .glass-contrast-guard,
  [data-storybook-preview-mode="dark"] .ag-contrast-story [class*="glass-certification"],
  [data-storybook-preview-mode="dark"] .ag-contrast-story .glass-certification-mini-title {
    background: rgba(15, 23, 42, 0.68) !important;
    color: #f8fafc !important;
    border-color: rgba(226, 232, 240, 0.22) !important;
  }
`,g={title:"Foundations/Accessibility/Contrast Guard",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Component-owned Storybook coverage for ContrastGuard. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},a={render:()=>t.jsxs("div",{className:"ag-contrast-story glass-contrast-guard",children:[t.jsx("style",{children:n}),t.jsx("div",{children:t.jsx(s,{name:r})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="ag-contrast-story glass-contrast-guard">
      <style>{contrastStoryStyles}</style>
      <div>
        <CertificationCase name={componentName} />
      </div>
    </div>
}`,...a.parameters?.docs?.source}}};const l=["Default"];export{a as Default,l as __namedExportsOrder,g as default};
