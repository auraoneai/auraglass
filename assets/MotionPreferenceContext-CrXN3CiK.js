import{r as o,j as m}from"./iframe-D2N3vCdj.js";const d=o.createContext({prefersReducedMotion:!1,isMotionSafe:!0,motionPolicy:"auto"}),s=()=>{const e=o.useContext(d);return e||{prefersReducedMotion:!1,isMotionSafe:!0,motionPolicy:"auto"}},c=({children:e,initialMotionPolicy:f="auto",initialPrefersReducedMotion:u=!1})=>{const[i,r]=o.useState(u),[n]=o.useState(f);o.useEffect(()=>{if(n!=="auto"){r(n==="never-safe");return}if(typeof window>"u")return;const t=window.matchMedia("(prefers-reduced-motion: reduce)");r(t.matches);const a=p=>{r(p.matches)};return t.addEventListener("change",a),()=>t.removeEventListener("change",a)},[n]);const l={prefersReducedMotion:i,isMotionSafe:!i,motionPolicy:n};return m.jsx(d.Provider,{value:l,children:e})};try{s.displayName="useMotionPreferenceContext",s.__docgenInfo={description:`Hook to access motion preferences from context

IMPORTANT: Use this instead of useReducedMotion() when you want centralized
motion preferences controlled by MotionPreferenceProvider at the app root.`,displayName:"useMotionPreferenceContext",props:{}}}catch{}try{c.displayName="MotionPreferenceProvider",c.__docgenInfo={description:`MotionPreferenceProvider - Centralized motion preference management

CRITICAL for SSR: Wrap your app root with this provider to:
1. Prevent hydration mismatches from motion detection
2. Centralize motion preferences across all AuraGlass components
3. Control SSR behavior via props

Example (SSR-safe):
\`\`\`tsx
<MotionPreferenceProvider initialMotionPolicy="always-safe">
  <App />
</MotionPreferenceProvider>
\`\`\`

Example (respect user preference):
\`\`\`tsx
<MotionPreferenceProvider initialMotionPolicy="auto">
  <App />
</MotionPreferenceProvider>
\`\`\``,displayName:"MotionPreferenceProvider",props:{initialMotionPolicy:{defaultValue:{value:"auto"},description:`Initial motion preference for SSR/first render
- 'auto': Detect from user preference (default)
- 'always-safe': Force motion enabled, ignore user preference
- 'never-safe': Force motion disabled

CRITICAL for SSR: Use 'always-safe' to prevent hydration mismatches
when you know your users don't prefer reduced motion.`,name:"initialMotionPolicy",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"always-safe"'},{value:'"never-safe"'}]}},initialPrefersReducedMotion:{defaultValue:{value:"false"},description:`Initial value for prefersReducedMotion during SSR
Default: false (motion allowed)

Set to true if you want to assume reduced motion during SSR`,name:"initialPrefersReducedMotion",required:!1,type:{name:"boolean | undefined"}}}}}catch{}export{s as u};
