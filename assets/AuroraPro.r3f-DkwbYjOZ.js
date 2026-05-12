import{b as F,r as p,j as e,c as a,m as C,C as M}from"./iframe-CN7unHsM.js";import{C as g,j as q,m as J,i as K,S as z,A as E,D as Q,B as Y,a as S,P as L,u as ss,h as es}from"./react-three-fiber.esm-Byi0dgPO.js";import{F as as}from"./flame-uCLUs2HA.js";import{P as ts}from"./pause-B8k-5APq.js";import{P as rs}from"./play-D_Dww0s8.js";import{W as os}from"./wind-Cx445Oo3.js";import{S as R}from"./sparkles-CLXYGP2v.js";import{S as ls}from"./star-Bm8W1gUt.js";import{P as is}from"./palette-DN66tR0r.js";import{Z as ns}from"./zap-Dr7KzAyL.js";import{c as cs}from"./createLucideIcon-SauGLeX7.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CWG1rEj-.js";const us=[["path",{d:"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"knzxuh"}],["path",{d:"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"2jd2cc"}],["path",{d:"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"rd2r6e"}]],ds=cs("waves",us),b={createAuroraWave:(s=20,t=10,l=64)=>{const r=new L(s,t,l,32),o=r.attributes.position.array;for(let n=0;n<o.length;n+=3){const c=o[n],u=o[n+1],d=Math.sin(c*.2)*Math.cos(u*.3)*2;o[n+2]=d}return r.computeVertexNormals(),r},createAuroraCurtain:(s=15,t=8,l=3)=>{const r=new L(s,t,32,16),o=r.attributes.position.array;for(let n=0;n<o.length;n+=3){const c=o[n],u=o[n+1],d=Math.sin(c*.3)*Math.cos(u*.4)*l;o[n+2]=d}return r.computeVertexNormals(),r},createAuroraParticles:(s=100)=>{const t=new Y,l=new Float32Array(s*3),r=new Float32Array(s*3),o=new Float32Array(s),n=[new g(5227511),new g(8505220),new g(16758605),new g(12216520),new g(16747109),new g(5093036)];for(let c=0;c<s;c++){l[c*3]=(Math.random()-.5)*25,l[c*3+1]=Math.random()*12+2,l[c*3+2]=(Math.random()-.5)*8;const u=n[Math.floor(Math.random()*n.length)];r[c*3]=u.r,r[c*3+1]=u.g,r[c*3+2]=u.b,o[c]=Math.random()*3+1}return t.setAttribute("position",new S(l,3)),t.setAttribute("color",new S(r,3)),t.setAttribute("size",new S(o,1)),t},createAuroraMaterial:(s={})=>{const{color1:t=new g(5227511),color2:l=new g(8505220),color3:r=new g(12216520),intensity:o=1,speed:n=1}=s;return new z({uniforms:{time:{value:0},color1:{value:t},color2:{value:l},color3:{value:r},intensity:{value:o},speed:{value:n}},vertexShader:`
        varying vec3 vPosition;
        varying vec2 vUv;

        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float intensity;
        uniform float speed;

        varying vec3 vPosition;
        varying vec2 vUv;

        // Noise function for organic movement
        float noise(vec2 st) {
  const prefersReducedMotion = useReducedMotion();
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
          vec2 st = vUv;
          float n = noise(st * 3.0 + time * speed * 0.1);

          // Create flowing aurora effect
          float wave1 = sin(st.x * 6.0 + time * speed) * 0.5 + 0.5;
          float wave2 = cos(st.y * 4.0 + time * speed * 0.7) * 0.5 + 0.5;
          float wave3 = sin((st.x + st.y) * 3.0 + time * speed * 0.5) * 0.5 + 0.5;

          // Mix colors based on waves
          vec3 color = mix(color1, color2, wave1);
          color = mix(color, color3, wave2);
          color = mix(color, color1, wave3);

          // Add some sparkle
          float sparkle = sin(time * 10.0 + st.x * 20.0 + st.y * 20.0) * 0.5 + 0.5;
          color += sparkle * 0.3;

          float alpha = (wave1 + wave2 + wave3) / 3.0 * intensity * 0.8;

          gl_FragColor = vec4(color, alpha);
        }
      `,transparent:!0,side:Q,blending:E})},createParticleMaterial:()=>new z({uniforms:{time:{value:0}},vertexShader:`
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        uniform float time;
        varying vec3 vColor;

        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.0, 0.5, r);
          alpha *= sin(time * 3.0 + gl_PointCoord.x * 10.0) * 0.3 + 0.7;

          gl_FragColor = vec4(vColor, alpha);
        }
      `,transparent:!0,vertexColors:!0,blending:E})},y={waveFlow:(s,t,l=1)=>{s.material&&"uniforms"in s.material&&s.material.uniforms&&typeof s.material.uniforms=="object"&&"time"in s.material.uniforms&&(s.material.uniforms.time.value=t*l)},particleDrift:(s,t,l=1)=>{if(!s.geometry)return;const r=s.geometry.attributes.position.array;for(let o=0;o<r.length;o+=3){const n=r[o];r[o]=n+Math.sin(t*l+o*.01)*.5}s.geometry.attributes.position.needsUpdate=!0},colorShift:(s,t,l=1)=>{if(!s.material||!("uniforms"in s.material)||!s.material.uniforms)return;const r=t*l*.1%1,o=new g().setHSL(r,.7,.6),n=new g().setHSL((r+.3)%1,.7,.6),c=new g().setHSL((r+.6)%1,.7,.6);typeof s.material.uniforms=="object"&&"color1"in s.material.uniforms&&(s.material.uniforms.color1.value=o),typeof s.material.uniforms=="object"&&"color2"in s.material.uniforms&&(s.material.uniforms.color2.value=n),typeof s.material.uniforms=="object"&&"color3"in s.material.uniforms&&(s.material.uniforms.color3.value=c)},intensityPulse:(s,t,l=1)=>{if(!s.material||!("uniforms"in s.material)||!s.material.uniforms)return;const r=Math.sin(t*l)*.3+.7;typeof s.material.uniforms=="object"&&"intensity"in s.material.uniforms&&(s.material.uniforms.intensity.value=r)}};function G({intensity:s=1,speed:t=1,colorPalette:l="arctic",customColors:r,particleCount:o=50,showParticles:n=!0,showWaves:c=!0,showCurtain:u=!1,animationMode:d="flow",className:v="",showControls:P=!1,autoAnimate:x=!0,onAnimationChange:V,children:I}){const j=F(),W=p.useRef(null),[h,U]=p.useState(x),[k,B]=p.useState(d),[D,H]=p.useState([]),[O,T]=p.useState(null),A={arctic:["#4fc3f7","#81c784","#ba68c8"],forest:["#4caf50","#8bc34a","#009688"],sunset:["#ff9800","#e91e63","#9c27b0"],ocean:["#00bcd4","#2196f3","#3f51b5"],cosmic:["#9c27b0","#673ab7","#3f51b5"],custom:r||["var(--glass-white)","var(--glass-white)","var(--glass-white)"]};p.useEffect(()=>{const i=[],m=A[l].map(f=>new g(f));if(c){const f=b.createAuroraWave(25,12,64),N=b.createAuroraMaterial({color1:m[0],color2:m[1],color3:m[2],intensity:s,speed:t}),w=new q(f,N);w.position.set(0,5,-5),i.push(w)}if(u){const f=b.createAuroraCurtain(20,10,2),N=b.createAuroraMaterial({color1:m[1],color2:m[2],color3:m[0],intensity:s*.8,speed:t*.7}),w=new q(f,N);w.position.set(0,3,-3),i.push(w)}if(n){const f=b.createAuroraParticles(o),N=b.createParticleMaterial(),w=new J(f,N);T(w)}H(i)},[l,s,t,c,u,n,o,r]);const Z=p.useCallback(i=>{B(i),V?.(i)},[V]),$=p.useCallback(()=>{U(i=>!i)},[]),X=i=>{switch(i){case"flow":return e.jsx(ds,{className:a("glass-w-4 glass-h-4")});case"pulse":return e.jsx(ns,{className:a("glass-w-4 glass-h-4")});case"shift":return e.jsx(is,{className:a("glass-w-4 glass-h-4")});case"mixed":return e.jsx(R,{className:a("glass-w-4 glass-h-4")});default:return e.jsx(ls,{className:a("glass-w-4 glass-h-4")})}},_=i=>(F(),A[i]||A.arctic);return e.jsxs("div",{className:a("aurora-pro glass-relative glass-overflow-hidden",v),children:[e.jsx(K,{ref:W,className:a("glass-absolute glass-inset-0 glass-pointer-events-none"),camera:{position:[0,8,15],fov:75},gl:{alpha:!0,antialias:!0,powerPreference:"high-performance"},children:e.jsx(gs,{auroraMeshes:D,particleSystem:O,currentMode:k,intensity:s,speed:t,isPlaying:h})}),e.jsx("div",{className:a("glass-relative glass-z-10"),children:I}),e.jsx(C.div,{initial:{opacity:0,y:20},animate:j?{}:{opacity:1,y:0},className:a("glass-absolute glass-top-4 glass-left-4 glass-px-3 glass-py-2 glass-radius-lg glass-foundation-complete glass-border glass-border-subtle glass-surface-dark"),children:e.jsxs("div",{className:a("glass-flex glass-items-center glass-gap-2 glass-text-white"),children:[e.jsx("div",{className:a("glass-flex glass-gap-1"),children:_(l).map((i,m)=>e.jsx("div",{className:a("glass-w-3 glass-h-3 glass-radius-full"),style:{backgroundColor:i}},m))}),e.jsx(M,{children:e.jsx("span",{className:a("glass-text-sm glass-font-medium glass-capitalize"),children:l})}),e.jsxs("div",{className:a("glass-flex glass-items-center glass-gap-1 glass-text-xs glass-text-secondary"),children:[e.jsx(as,{className:a("glass-w-3 glass-h-3")}),e.jsx(M,{children:e.jsxs("span",{children:[(s*100).toFixed(0),"%"]})})]})]})}),P&&e.jsxs(C.div,{initial:{opacity:0,y:20},animate:j?{}:{opacity:1,y:0},className:a("glass-absolute glass-bottom-4 glass-right-4 glass-flex glass-flex-col glass-gap-2"),children:[e.jsx("div",{className:a("glass-flex glass-gap-2 glass-p-2 glass-surface-dark glass-foundation-complete glass-radius-lg glass-border glass-border-subtle"),children:["flow","pulse","shift","mixed"].map(i=>e.jsx("button",{onClick:()=>Z(i),className:a("glass-p-2 glass-radius-lg glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",k===i?"glass-surface-subtle glass-text-white":"glass-text-secondary hover:glass-text-white hover:glass-surface-hover"),title:`Switch to ${i} animation`,children:X(i)},i))}),e.jsxs("div",{className:a("glass-flex glass-gap-2 glass-p-2 glass-surface-dark glass-foundation-complete glass-radius-lg glass-border glass-border-subtle"),children:[e.jsx("button",{onClick:$,className:a("glass-p-2 glass-radius-lg glass-text-white hover:glass-surface-hover glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"),title:h?"Pause Aurora":"Play Aurora",children:h?e.jsx(ts,{className:a("glass-w-4 glass-h-4")}):e.jsx(rs,{className:a("glass-w-4 glass-h-4")})}),e.jsxs("div",{className:a("glass-flex glass-items-center glass-gap-2 glass-text-secondary glass-text-sm"),children:[e.jsx(os,{className:a("glass-w-3 glass-h-3")}),e.jsx(M,{children:e.jsxs("span",{children:[t.toFixed(1),"x"]})})]})]}),e.jsx("div",{className:a("glass-grid glass-grid-cols-2 glass-gap-2 glass-p-2 glass-surface-dark glass-foundation-complete glass-radius-lg glass-border glass-border-subtle"),children:Object.keys(A).slice(0,6).map(i=>e.jsxs("button",{onClick:()=>{},className:a("glass-p-2 glass-radius-lg glass-transition-colors glass-text-xs glass-focus glass-touch-target glass-contrast-guard",l===i?"glass-surface-subtle glass-text-white":"glass-text-secondary hover:glass-text-white hover:glass-surface-hover"),title:`Switch to ${i} palette`,children:[e.jsx("div",{className:a("glass-flex glass-gap-0.5 glass-mb-1"),children:_(i).map((m,f)=>e.jsx("div",{className:a("glass-w-2 glass-h-2 glass-radius-full"),style:{backgroundColor:m}},f))}),e.jsx(M,{children:e.jsx("span",{className:a("glass-capitalize"),children:i})})]},i))})]}),e.jsx(C.div,{initial:{opacity:0,x:-20},animate:j?{}:{opacity:1,x:0},className:a("glass-absolute glass-top-4 glass-right-4 glass-px-3 glass-py-2 glass-radius-lg glass-foundation-complete glass-border glass-border-subtle glass-surface-dark"),children:e.jsxs("div",{className:a("glass-flex glass-items-center glass-gap-2 glass-text-secondary glass-text-sm"),children:[e.jsx(C.div,{animate:j?{}:{scale:h?[1,1.2,1]:1,opacity:h?[.6,1,.6]:.6},transition:j?{duration:0}:{duration:2,repeat:h?1/0:0,ease:"easeInOut"},children:e.jsx(R,{className:a("glass-w-3 glass-h-3")})}),e.jsx(M,{children:e.jsx("span",{className:a("glass-capitalize"),children:k})}),h&&e.jsx("div",{className:a("glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse")})]})})]})}function gs({auroraMeshes:s,particleSystem:t,currentMode:l,intensity:r,speed:o,isPlaying:n}){const{scene:c}=ss();return p.useEffect(()=>(s.forEach(u=>{c.add(u)}),t&&c.add(t),()=>{s.forEach(u=>{c.remove(u)}),t&&c.remove(t)}),[s,t,c]),es(u=>{if(!n)return;const d=u.clock.elapsedTime;s.forEach((v,P)=>{const x=o*(.8+P*.2);switch(l){case"flow":y.waveFlow(v,d,x);break;case"pulse":y.intensityPulse(v,d,x);break;case"shift":y.colorShift(v,d,x);break;case"mixed":y.waveFlow(v,d,x),y.intensityPulse(v,d,x*.5),P%2===0&&y.colorShift(v,d,x*.3);break}}),t&&y.particleDrift(t,d,o*.5)}),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.1}),e.jsx("directionalLight",{position:[10,10,5],intensity:.3,color:5227511}),e.jsx("pointLight",{position:[0,15,0],intensity:.2,color:8505220}),e.jsx("fog",{attach:"fog",args:["#000011",10,50]})]})}try{G.displayName="AuroraPro",G.__docgenInfo={description:"",displayName:"AuroraPro",props:{intensity:{defaultValue:{value:"1"},description:"",name:"intensity",required:!1,type:{name:"number | undefined"}},speed:{defaultValue:{value:"1"},description:"",name:"speed",required:!1,type:{name:"number | undefined"}},colorPalette:{defaultValue:{value:"arctic"},description:"",name:"colorPalette",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sunset"'},{value:'"cosmic"'},{value:'"custom"'},{value:'"forest"'},{value:'"ocean"'},{value:'"arctic"'}]}},customColors:{defaultValue:null,description:"",name:"customColors",required:!1,type:{name:"[string, string, string] | undefined"}},particleCount:{defaultValue:{value:"50"},description:"",name:"particleCount",required:!1,type:{name:"number | undefined"}},showParticles:{defaultValue:{value:"true"},description:"",name:"showParticles",required:!1,type:{name:"boolean | undefined"}},showWaves:{defaultValue:{value:"true"},description:"",name:"showWaves",required:!1,type:{name:"boolean | undefined"}},showCurtain:{defaultValue:{value:"false"},description:"",name:"showCurtain",required:!1,type:{name:"boolean | undefined"}},animationMode:{defaultValue:{value:"flow"},description:"",name:"animationMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"mixed"'},{value:'"flow"'},{value:'"shift"'},{value:'"pulse"'}]}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}},showControls:{defaultValue:{value:"false"},description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},autoAnimate:{defaultValue:{value:"true"},description:"",name:"autoAnimate",required:!1,type:{name:"boolean | undefined"}},onAnimationChange:{defaultValue:null,description:"",name:"onAnimationChange",required:!1,type:{name:"((mode: string) => void) | undefined"}}}}}catch{}export{G as AuroraPro,G as default};
