import{G as n}from"./GlassImageViewer-B47khroa.js";import{f as e}from"./index-CLSxArU-.js";import"./iframe-OZreUAtx.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C1jnw9c5.js";import"./GlassCard-CKgoLxcS.js";import"./LiquidGlassMaterial-6ZsmKJqk.js";import"./LiquidGlassLayerProvider-D9koVs6n.js";import"./OptimizedGlassCore-DAQZMOh8.js";import"./MotionFramer-BTsVQK94.js";import"./utilsCore-B384u8by.js";import"./x-CMtMyPIA.js";import"./createLucideIcon-B0rn4XfH.js";import"./GlassButton-6w9EY7YA.js";import"./index-BXuO5XkR.js";import"./GlassPredictiveEngine-Hj8SU_hc.js";import"./GlassAchievementSystem-CfusDed6.js";import"./GlassBiometricAdaptation-DaD9o7IG.js";import"./MotionPreferenceContext-DTxERmBA.js";import"./GlassEyeTracking-DEo0jGT7.js";import"./GlassSpatialAudio-C984SGkY.js";import"./chevron-left-D7_z7I5z.js";import"./chevron-right-bBJrd6oZ.js";import"./zoom-in-huHPF5YR.js";import"./rotate-ccw-CExUI3aJ.js";import"./download-5pmL2dSv.js";import"./minimize-2-unSKrfEp.js";import"./pause-DAb0BDxq.js";import"./play-BbzUvpB-.js";import"./house-B8euixT1.js";import"./index-ByImX2pa.js";const V={title:"Components/Interactive/GlassImageViewer",component:n,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassimageviewer component."}}},argTypes:{images:{control:"object",description:"Array of images to display"},initialIndex:{control:"number",description:"Initial image index to display"},enableZoom:{control:"boolean",description:"Whether to enable zoom functionality"},enablePan:{control:"boolean",description:"Whether to enable pan functionality"},enableRotation:{control:"boolean",description:"Whether to enable rotation"},enableFullscreen:{control:"boolean",description:"Whether to enable fullscreen mode"},enableNavigation:{control:"boolean",description:"Whether to enable image navigation"},showZoomControls:{control:"boolean",description:"Whether to show zoom controls"},showRotationControls:{control:"boolean",description:"Whether to show rotation controls"},showDownloadButton:{control:"boolean",description:"Whether to show download button"},showImageInfo:{control:"boolean",description:"Whether to show image information"},autoPlay:{control:"boolean",description:"Whether to auto-play slideshow"},autoPlayInterval:{control:"number",description:"Auto-play interval in milliseconds"}},args:{images:[{src:"https://picsum.photos/800/600?random=1",alt:"Sample Image 1",title:"Beautiful Landscape",description:"A stunning landscape view",width:800,height:600},{src:"https://picsum.photos/800/600?random=2",alt:"Sample Image 2",title:"Urban Architecture",description:"Modern city architecture",width:800,height:600},{src:"https://picsum.photos/800/600?random=3",alt:"Sample Image 3",title:"Nature Close-up",description:"Detailed nature photography",width:800,height:600}],initialIndex:0,enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!1,autoPlayInterval:3e3,onImageChange:e(),onZoomChange:e(),onFullscreenChange:e()}},o={args:{images:[{src:"https://picsum.photos/600/400?random=1",alt:"Default Image",title:"Sample Image",description:"A sample image for the image viewer"}],onImageChange:e(),onZoomChange:e(),onFullscreenChange:e()}},t={args:{images:[{src:"https://picsum.photos/600/400?random=2",alt:"Gallery Image 1",title:"Gallery Image 1",description:"First image in gallery"},{src:"https://picsum.photos/600/400?random=3",alt:"Gallery Image 2",title:"Gallery Image 2",description:"Second image in gallery"}],enableZoom:!0,enablePan:!0,enableRotation:!0,enableFullscreen:!0,enableNavigation:!0,showZoomControls:!0,showRotationControls:!0,showDownloadButton:!0,showImageInfo:!0,autoPlay:!0,autoPlayInterval:5e3,onImageChange:e(),onZoomChange:e(),onFullscreenChange:e()}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    images: [{
      src: 'https://picsum.photos/600/400?random=1',
      alt: 'Default Image',
      title: 'Sample Image',
      description: 'A sample image for the image viewer'
    }],
    onImageChange: fn(),
    onZoomChange: fn(),
    onFullscreenChange: fn()
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    images: [{
      src: 'https://picsum.photos/600/400?random=2',
      alt: 'Gallery Image 1',
      title: 'Gallery Image 1',
      description: 'First image in gallery'
    }, {
      src: 'https://picsum.photos/600/400?random=3',
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
}`,...t.parameters?.docs?.source}}};const z=["Default","Variants"];export{o as Default,t as Variants,z as __namedExportsOrder,V as default};
