import{G as s}from"./GlassImageViewer-BPmZ4GSY.js";import{f as t}from"./index-CLSxArU-.js";import"./iframe-BvzymGjt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dpha_HXc.js";import"./GlassCard-Cxta_oc2.js";import"./LiquidGlassMaterial-JI_jzYet.js";import"./LiquidGlassLayerProvider-CJtka88e.js";import"./OptimizedGlassCore-B02J0fwe.js";import"./deviceCapabilities-B7YDzcww.js";import"./MotionFramer-C3KXdYVW.js";import"./utilsCore-CvMw9IQa.js";import"./x-VgHlCL75.js";import"./createLucideIcon-BO6DqFNW.js";import"./GlassButton-BVHfBqfh.js";import"./index-JwCOk9wq.js";import"./a11y-DPdpkR3m.js";import"./GlassPredictiveEngine-Dz7LnWwV.js";import"./GlassAchievementSystem-CKBD-Gym.js";import"./GlassBiometricAdaptation-D9YF3poe.js";import"./MotionPreferenceContext-DOLWeM-v.js";import"./GlassEyeTracking-D9jSxkg9.js";import"./GlassSpatialAudio-DHSENIRo.js";import"./chevron-left-DXVuYyTF.js";import"./chevron-right-C5Axf4Ek.js";import"./zoom-in-DJQQpDE9.js";import"./rotate-ccw-C9a62LOI.js";import"./download-DnGRs3F9.js";import"./minimize-2-BvWOZAs1.js";import"./pause-a380JNSp.js";import"./play-DQ_xEYek.js";import"./house-BZYjBu0_.js";import"./index-ByImX2pa.js";const a=(l,i,e=800,o=600)=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${o}" viewBox="0 0 ${e} ${o}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f172a"/>
          <stop offset="0.55" stop-color="${i}"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="${e*.76}" cy="${o*.26}" r="${Math.min(e,o)*.18}" fill="rgba(255,255,255,.18)"/>
      <rect x="${e*.1}" y="${o*.16}" width="${e*.5}" height="${o*.13}" rx="22" fill="rgba(255,255,255,.16)"/>
      <rect x="${e*.1}" y="${o*.76}" width="${e*.72}" height="${o*.035}" rx="12" fill="rgba(255,255,255,.22)"/>
      <text x="${e*.1}" y="${o*.68}" font-family="Inter, Arial, sans-serif" font-size="${Math.max(24,e*.052)}" font-weight="700" fill="#ffffff">${l}</text>
    </svg>
  `)}`,_={title:"Media/Glass Image Viewer",component:s,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassimageviewer component."}}},argTypes:{images:{control:"object",description:"Array of images to display"},initialIndex:{control:"number",description:"Initial image index to display"},enableZoom:{control:"boolean",description:"Whether to enable zoom functionality"},enablePan:{control:"boolean",description:"Whether to enable pan functionality"},enableRotation:{control:"boolean",description:"Whether to enable rotation"},enableFullscreen:{control:"boolean",description:"Whether to enable fullscreen mode"},enableNavigation:{control:"boolean",description:"Whether to enable image navigation"},showZoomControls:{control:"boolean",description:"Whether to show zoom controls"},showRotationControls:{control:"boolean",description:"Whether to show rotation controls"},showDownloadButton:{control:"boolean",description:"Whether to show download button"},showImageInfo:{control:"boolean",description:"Whether to show image information"},autoPlay:{control:"boolean",description:"Whether to auto-play slideshow"},autoPlayInterval:{control:"number",description:"Auto-play interval in milliseconds"}},args:{images:[{src:a("Landscape","#2563eb"),alt:"Sample Image 1",title:"Beautiful Landscape",description:"A stunning landscape view",width:800,height:600},{src:a("Architecture","#7c3aed"),alt:"Sample Image 2",title:"Urban Architecture",description:"Modern city architecture",width:800,height:600},{src:a("Nature Detail","#0f766e"),alt:"Sample Image 3",title:"Nature Close-up",description:"Detailed nature photography",width:800,height:600}],initialIndex:0,enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!1,autoPlayInterval:3e3,onImageChange:t(),onZoomChange:t(),onFullscreenChange:t()}},n={args:{images:[{src:a("Sample Image","#2563eb",600,400),alt:"Default Image",title:"Sample Image",description:"A sample image for the image viewer"}],onImageChange:t(),onZoomChange:t(),onFullscreenChange:t()}},r={args:{images:[{src:a("Gallery 1","#7c3aed",600,400),alt:"Gallery Image 1",title:"Gallery Image 1",description:"First image in gallery"},{src:a("Gallery 2","#0f766e",600,400),alt:"Gallery Image 2",title:"Gallery Image 2",description:"Second image in gallery"}],enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!0,autoPlayInterval:5e3,onImageChange:t(),onZoomChange:t(),onFullscreenChange:t()}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    images: [{
      src: viewerImage('Sample Image', '#2563eb', 600, 400),
      alt: 'Default Image',
      title: 'Sample Image',
      description: 'A sample image for the image viewer'
    }],
    onImageChange: fn(),
    onZoomChange: fn(),
    onFullscreenChange: fn()
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    images: [{
      src: viewerImage('Gallery 1', '#7c3aed', 600, 400),
      alt: 'Gallery Image 1',
      title: 'Gallery Image 1',
      description: 'First image in gallery'
    }, {
      src: viewerImage('Gallery 2', '#0f766e', 600, 400),
      alt: 'Gallery Image 2',
      title: 'Gallery Image 2',
      description: 'Second image in gallery'
    }],
    enableZoom: true,
    enablePan: true,
    enableRotation: true,
    enableFullscreen: true,
    enableNavigation: true,
    showZoomControls: true,
    showRotationControls: true,
    showDownloadButton: true,
    showImageInfo: true,
    autoPlay: true,
    autoPlayInterval: 5000,
    onImageChange: fn(),
    onZoomChange: fn(),
    onFullscreenChange: fn()
  }
}`,...r.parameters?.docs?.source}}};const j=["Default","Variants"];export{n as Default,r as Variants,j as __namedExportsOrder,_ as default};
