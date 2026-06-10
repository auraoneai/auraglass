import{b as T,r as d,j as r,c as m,e as K,m as V}from"./iframe-B8jVgyad.js";import{j as Q,V as z,i as W,P as X,C as Y,S as ee,D as te,E as G,n as k,u as ae,h as se}from"./react-three-fiber.esm-Bzx3iMVa.js";import{R as ne,Z as oe,br as ie}from"./components-Dfh6oSUn.js";import{S as A}from"./random-B9-1h0DP.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CWG1rEj-.js";const O={createGlassShard:(a=1,c=3,o=new A)=>{const e=new X(a,a,c,c),t=e.attributes.position.array;for(let s=0;s<t.length;s+=3){const l=t[s],i=t[s+1];Math.abs(l)+Math.abs(i)>.8&&(t[s]+=o.nextSigned()*.1,t[s+1]+=o.nextSigned()*.1,t[s+2]+=o.nextSigned()*.05)}return e.computeVertexNormals(),e},createShatterField:(a=20,c=5,o=new A)=>{const e=[];for(let t=0;t<a;t++){const s=.5+o.next()*1.5,l=2+o.nextInt(0,2),i=O.createGlassShard(s,l,o);e.push(i)}return e}},re={createGlassShardMaterial:(a={})=>{const{color:c=new Y(.7,.9,1),opacity:o=.8,refractionRatio:e=1.5,reflectivity:t=.8}=a;return new ee({uniforms:{time:{value:0},color:{value:c},opacity:{value:o},refractionRatio:{value:e},reflectivity:{value:t},shatterProgress:{value:0}},vertexShader:`
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;

          vec3 displacedPosition = position;
          displacedPosition += normal * sin(time * 10.0 + position.x * 5.0) * 0.02;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
        }
      `,fragmentShader:`
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        uniform float refractionRatio;
        uniform float reflectivity;
        uniform float shatterProgress;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);

          vec3 finalColor = color;
          finalColor += vec3(
            sin(vPosition.x * 10.0) * 0.1,
            cos(vPosition.y * 10.0) * 0.1,
            sin(vPosition.z * 10.0) * 0.1
          );

          float shatterEffect = sin(time * 20.0 + vPosition.x * 5.0 + vPosition.y * 5.0) * 0.5 + 0.5;
          finalColor *= (1.0 - shatterProgress * 0.3);

          float finalOpacity = opacity * (0.7 + 0.3 * fresnel) * (1.0 - shatterProgress * 0.2);

          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `,transparent:!0,side:te})}},E={createShardAnimation:(a,c,o,e=2)=>{const t=a.position.clone(),s=a.rotation.clone(),l=Date.now();return()=>{const i=(Date.now()-l)/1e3,f=Math.min(i/e,1),u=(v=>1-Math.pow(1-v,3))(f);return a.position.lerpVectors(t,c,u),a.rotation.x=k.lerp(s.x,o.x,u),a.rotation.y=k.lerp(s.y,o.y,u),a.rotation.z=k.lerp(s.z,o.z,u),f>=1}},createExplosionAnimation:(a,c,o=10,e=1)=>{T();const t=a.map(s=>{const l=new z((Math.random()-.5)*2,(Math.random()-.5)*2,(Math.random()-.5)*2).normalize(),i=2+Math.random()*3,f=c.clone().add(l.multiplyScalar(i)),g=new G(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2);return E.createShardAnimation(s,f,g,e)});return()=>t.every(s=>s())},createReformAnimation:(a,c,o=2)=>{const e=a.map((t,s)=>{const l=c[s],i=new G(0,0,0);return E.createShardAnimation(t,l,i,o)});return()=>e.every(t=>t())}};function D(a){const{children:c,className:o="",trigger:e="click",duration:t=2,intensity:s=1,shardCount:l=12,autoReform:i=!0,reformDelay:f=3e3,onShatter:g,onReform:u,disabled:v=!1,showControls:U=!1,seed:I}=a,R=T(),q=d.useRef(null),F=d.useRef(null),[p,_]=d.useState(!1),[h,j]=d.useState(!1),[P,Z]=d.useState([]),[L,$]=d.useState([]),[B,C]=d.useState(null);d.useEffect(()=>{if(!F.current)return;const n=new A(I??`${l}`),S=O.createShatterField(l,5,n),b=[],M=[];S.forEach(H=>{const J=re.createGlassShardMaterial({opacity:.8-n.next()*.3,refractionRatio:1.3+n.next()*.4}),w=new Q(H,J);w.position.set(n.nextSigned()*2,n.nextSigned()*2,0),w.rotation.set(n.next()*Math.PI*2,n.next()*Math.PI*2,n.next()*Math.PI*2),b.push(w),M.push(w.position.clone())}),Z(b),$(M)},[l,I]);const y=d.useCallback(()=>{if(!p||h)return;j(!0),u?.();const n=E.createReformAnimation(P,L,t);C(()=>n)},[p,h,P,L,t,u]),x=d.useCallback(()=>{if(v||h)return;_(!0),j(!0),g?.();const n=new z(0,0,0),S=E.createExplosionAnimation(P,n,s*10,t);C(()=>S),i&&setTimeout(()=>{y()},f)},[v,h,P,s,t,i,f,g,y]),N=d.useCallback(()=>{p?y():x()},[p,y,x]);return d.useEffect(()=>{if(v)return;const n=q.current;if(!n)return;const S=()=>{e==="click"&&N()},b=()=>{e==="hover"&&x()},M=()=>{e==="hover"&&i&&setTimeout(()=>y(),f)};return e==="click"?n.addEventListener("click",S):e==="hover"&&(n.addEventListener("mouseenter",b),n.addEventListener("mouseleave",M)),()=>{n.removeEventListener("click",S),n.removeEventListener("mouseenter",b),n.removeEventListener("mouseleave",M)}},[e,v,N,x,y,i,f]),d.useEffect(()=>{if(e==="auto"&&!v){const n=setInterval(()=>{h||x()},5e3);return()=>clearInterval(n)}},[e,v,h,x]),r.jsxs("div",{ref:q,className:m("glass-shatter-effects glass-relative glass-overflow-hidden",o),style:{position:"relative",cursor:e==="click"?"pointer":"default"},children:[r.jsx("div",{className:m("content glass-transition-opacity glass-duration-300",p?"glass-opacity-0":"glass-opacity-100"),children:c}),r.jsx(K,{children:p&&r.jsx(V.div,{initial:{opacity:0},animate:R?{}:{opacity:1},exit:{opacity:0},className:m("glass-absolute glass-inset-0 glass-pointer-events-none"),children:r.jsx(W,{ref:F,className:m("glass-w-full glass-h-full"),camera:{position:[0,0,5],fov:75},gl:{alpha:!0,antialias:!0},children:r.jsx(le,{shards:P,currentAnimation:B,setCurrentAnimation:C,setIsAnimating:j,setIsShattered:_,isShattered:p})})})}),U&&r.jsxs(V.div,{initial:{opacity:0,y:20},animate:R?{}:{opacity:1,y:0},className:m("glass-absolute glass-bottom-4 glass-right-4 glass-flex glass-gap-2"),children:[r.jsx("button",{onClick:N,disabled:h,className:m("glass-p-2 glass-surface-subtle glass-foundation-complete glass-radius-lg glass-border glass-border-primary hover:glass-surface-hover glass-transition-colors disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard"),title:p?"Reform":"Shatter",children:p?r.jsx(ne,{className:m("glass-w-4 glass-h-4")}):r.jsx(oe,{className:m("glass-w-4 glass-h-4")})}),h&&r.jsxs("div",{className:m("glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2 glass-surface-info glass-foundation-complete glass-radius-lg glass-text-info glass-text-sm"),children:[r.jsx(V.div,{animate:R?{}:{rotate:360},transition:R?{duration:0}:{duration:1,repeat:1/0,ease:"linear"},children:r.jsx(ie,{className:m("glass-w-3 glass-h-3")})}),"Animating..."]})]})]})}function le({shards:a,currentAnimation:c,setCurrentAnimation:o,setIsAnimating:e,setIsShattered:t,isShattered:s}){const{scene:l}=ae();return d.useEffect(()=>(a.forEach(i=>{l.add(i)}),()=>{a.forEach(i=>{l.remove(i)})}),[a,l]),se(i=>{const f=i.clock.elapsedTime;a.forEach(g=>{const u=g.material;u&&u.uniforms&&(u.uniforms.time&&(u.uniforms.time.value=f),u.uniforms.shatterProgress&&(u.uniforms.shatterProgress.value=s?1:0))}),c&&c()&&(o(null),e(!1),s||t(!1))}),r.jsxs(r.Fragment,{children:[r.jsx("ambientLight",{intensity:.4}),r.jsx("pointLight",{position:[10,10,10],intensity:.8}),r.jsx("pointLight",{position:[-10,-10,-10],intensity:.3,color:4491519})]})}try{D.displayName="GlassShatterEffectsR3F",D.__docgenInfo={description:"",displayName:"GlassShatterEffectsR3F",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},trigger:{defaultValue:null,description:"",name:"trigger",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"manual"'},{value:'"hover"'},{value:'"click"'}]}},duration:{defaultValue:null,description:"",name:"duration",required:!1,type:{name:"number | undefined"}},intensity:{defaultValue:null,description:"",name:"intensity",required:!1,type:{name:"number | undefined"}},shardCount:{defaultValue:null,description:"",name:"shardCount",required:!1,type:{name:"number | undefined"}},autoReform:{defaultValue:null,description:"",name:"autoReform",required:!1,type:{name:"boolean | undefined"}},reformDelay:{defaultValue:null,description:"",name:"reformDelay",required:!1,type:{name:"number | undefined"}},onShatter:{defaultValue:null,description:"",name:"onShatter",required:!1,type:{name:"(() => void) | undefined"}},onReform:{defaultValue:null,description:"",name:"onReform",required:!1,type:{name:"(() => void) | undefined"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean | undefined"}},showControls:{defaultValue:null,description:"",name:"showControls",required:!1,type:{name:"boolean | undefined"}},seed:{defaultValue:null,description:"",name:"seed",required:!1,type:{name:"string | number | undefined"}}}}}catch{}export{D as GlassShatterEffectsR3F,D as default};
