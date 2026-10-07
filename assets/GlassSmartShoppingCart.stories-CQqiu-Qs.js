import{j as t}from"./iframe-RsoZoStf.js";import{E as p}from"./GlassEcommerceProvider-BfTn1PPF.js";import{G as s}from"./GlassSmartShoppingCart-C8XXjiRT.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-CUjrQ4HR.js";const a=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f8fafc"/>
        <stop offset="1" stop-color="#cbd5e1"/>
      </linearGradient>
    </defs>
    <rect width="240" height="240" rx="42" fill="url(#g)"/>
    <circle cx="120" cy="105" r="52" fill="none" stroke="#64748b" stroke-width="14"/>
    <path d="M76 174h88" stroke="#334155" stroke-width="14" stroke-linecap="round"/>
  </svg>
`)}`,o={id:"aurora-headphones",name:"Aurora Studio Headphones",description:"Spatial audio headphones with adaptive noise control.",price:329,originalPrice:379,currency:"USD",images:[a],thumbnail:a,category:"Audio",brand:"Aura",sku:"AU-STUDIO-01",stock:18,rating:4.9,reviewCount:284,tags:["spatial-audio","wireless"],features:[{id:"spatial",name:"Spatial audio",value:!0,importance:"high"}],isOnSale:!0,availability:"in-stock"},d=[{id:"cart-aurora-headphones",productId:o.id,product:o,quantity:1,addedAt:new Date("2026-08-12T12:00:00.000Z")}],g={title:"Workflows/Glass Smart Shopping Cart",component:s,parameters:{layout:"centered",previewSurface:"component",docs:{description:{component:"Direct rendering of both public GlassSmartShoppingCart and SmartShoppingCart export names with deterministic product data."}}},tags:["autodocs"]},i=n=>t.jsx(p,{children:t.jsx("div",{style:{width:"min(520px, calc(100vw - 32px))"},children:t.jsx(s,{items:n,variant:"sidebar",compact:!0,contained:!0,maxHeight:"min(540px, calc(100vh - 48px))",showRecommendations:!1,showShippingCalculator:!1,showPromoCode:!1})})}),e={render:()=>i(d)},r={render:()=>i([])};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => renderCart(representativeItems)
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => renderCart([])
}`,...r.parameters?.docs?.source}}};const S=["GlassSmartShoppingCart","SmartShoppingCart"];export{e as GlassSmartShoppingCart,r as SmartShoppingCart,S as __namedExportsOrder,g as default};
