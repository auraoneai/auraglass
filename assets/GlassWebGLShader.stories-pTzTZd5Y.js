import{r as l,b as X,j as n,c as U,g as R}from"./iframe-CtRSFJTE.js";import"./preload-helper-PPVm8Dsz.js";const K={...R({intent:"primary",elevation:"level3"}),minHeight:220,borderColor:"rgba(226, 232, 240, 0.14)",color:"#e5f4ff"},Y={...R({intent:"primary",elevation:"level2"})},$={...R({intent:"primary",elevation:"level3"}),borderColor:"rgba(226,232,240,0.26)",boxShadow:"0 24px 80px rgba(56,189,248,0.2), inset 0 1px 0 rgba(255,255,255,0.18)",transform:"translate(-50%, -50%)"},J=`
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`,Q={refraction:`
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    void main() {
      vec2 uv = v_texCoord;
      vec2 center = vec2(0.5, 0.5);
      vec2 mouseNorm = u_mouse / u_resolution;

      // Calculate refraction based on distance from mouse
      float dist = distance(uv, mouseNorm);
      float refraction = sin(dist * 10.0 - u_time * 2.0) * 0.02 * u_intensity;

      // Apply chromatic aberration
      vec2 rOffset = uv + vec2(refraction, 0.0);
      vec2 gOffset = uv;
      vec2 bOffset = uv - vec2(refraction, 0.0);

      float r = texture2D(u_image, rOffset).r;
      float g = texture2D(u_image, gOffset).g;
      float b = texture2D(u_image, bOffset).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,dispersion:`
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    void main() {
      vec2 uv = v_texCoord;

      // Rainbow dispersion effect
      float wave = sin(uv.y * 10.0 + u_time) * 0.01 * u_intensity;

      vec2 rUV = uv + vec2(wave * 2.0, 0.0);
      vec2 gUV = uv + vec2(wave, 0.0);
      vec2 bUV = uv;

      vec3 color;
      color.r = texture2D(u_image, rUV).r;
      color.g = texture2D(u_image, gUV).g;
      color.b = texture2D(u_image, bUV).b;

      // Add prismatic highlights
      float highlight = sin(uv.x * 20.0 + u_time * 2.0) * 0.1;
      color += vec3(highlight, highlight * 0.5, highlight * 0.3);

      gl_FragColor = vec4(color, 1.0);
    }
  `,frosted:`
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = v_texCoord;
      vec3 color = vec3(0.0);

      // Frosted glass blur
      float blurSize = 0.01 * u_intensity;
      int samples = 9;

      for(int i = 0; i < samples; i++) {
        float angle = float(i) / float(samples) * 6.28318;
        vec2 offset = vec2(cos(angle), sin(angle)) * blurSize;
        offset *= random(uv + float(i));

        color += texture2D(u_image, uv + offset).rgb;
      }

      color /= float(samples);

      // Add frost texture
      float frost = random(uv * 100.0 + u_time * 0.1) * 0.1;
      color += vec3(frost);

      gl_FragColor = vec4(color, 1.0);
    }
  `,crystal:`
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    void main() {
      vec2 uv = v_texCoord;
      vec2 center = vec2(0.5, 0.5);

      // Crystal facets
      float angle = atan(uv.y - center.y, uv.x - center.x);
      float facets = 8.0;
      angle = floor(angle * facets) / facets;

      float dist = distance(uv, center);
      vec2 facetUV = center + vec2(cos(angle), sin(angle)) * dist;

      // Refraction through crystal
      vec2 refractUV = mix(uv, facetUV, u_intensity * 0.5);
      vec3 color = texture2D(u_image, refractUV).rgb;

      // Add sparkle
      float sparkle = sin(angle * 20.0 + u_time * 3.0) * 0.2;
      color += vec3(sparkle);

      // Inner reflections
      float reflection = sin(dist * 30.0 - u_time * 2.0) * 0.1;
      color += vec3(reflection, reflection * 0.8, reflection * 1.2);

      gl_FragColor = vec4(color, 1.0);
    }
  `,prism:`
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_intensity;

    varying vec2 v_texCoord;

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec2 uv = v_texCoord;

      // Prism light splitting
      float prismAngle = uv.x + sin(uv.y * 10.0 + u_time) * 0.1;

      // Sample at different wavelengths
      vec3 color = vec3(0.0);
      int samples = 7;

      for(int i = 0; i < samples; i++) {
        float wavelength = float(i) / float(samples);
        vec2 offset = vec2(wavelength * 0.02 * u_intensity, 0.0);

        vec3 sample = texture2D(u_image, uv + offset).rgb;

        // Apply wavelength-based tinting
        vec3 tint = hsv2rgb(vec3(wavelength, 0.8, 1.0));
        color += sample * tint;
      }

      color /= float(samples);

      // Add rainbow spectrum overlay
      float spectrum = sin(prismAngle * 20.0) * 0.3;
      vec3 rainbow = hsv2rgb(vec3(prismAngle, 1.0, spectrum));
      color = mix(color, rainbow, 0.2 * u_intensity);

      gl_FragColor = vec4(color, 1.0);
    }
  `};function p({className:v,variant:g="refraction",intensity:A=1,animated:D=!0,interactive:C=!0,backgroundColor:G="transparent",renderMode:P="auto",respectMotionPreference:V=!0,compact:N=!1,contained:j=!1,preview:B=!1,height:b,maxHeight:x,style:I}){const f=l.useRef(null),h=l.useRef(null),y=l.useRef(null),_=l.useRef(0),w=l.useRef({x:0,y:0}),[z,d]=l.useState(!0),S=X(),u=D&&(V?!S:!0),E=P==="css",L=N||j||B,M=typeof b=="number"?`${b}px`:b,q=typeof x=="number"?`${x}px`:x,T={minHeight:M??(L?220:void 0),maxHeight:q??(L?240:void 0),width:"100%",...I??{}};l.useEffect(()=>{if(E){d(!1);return}const e=f.current;if(!e)return;d(!0);const t=e.getContext("webgl")||e.getContext("experimental-webgl");if(!t){d(!1);return}h.current=t;const a=k(t,t.VERTEX_SHADER,J),r=k(t,t.FRAGMENT_SHADER,Q[g]);if(!a||!r){d(!1);return}const o=W(t,a,r);if(!o){d(!1);return}return y.current=o,O(t,o),H(t),F(),()=>{_.current&&cancelAnimationFrame(_.current);try{t.getExtension("WEBGL_lose_context")?.loseContext()}catch{}h.current=null,y.current=null}},[g,u,A,E]),l.useEffect(()=>{if(!C||S||typeof window>"u")return;const e=t=>{const a=f.current;if(!a)return;const r=a.getBoundingClientRect();w.current={x:t.clientX-r.left,y:t.clientY-r.top}};return window.addEventListener("mousemove",e,{passive:!0}),()=>window.removeEventListener("mousemove",e)},[C,S]);function k(e,t,a){const r=e.createShader(t);return r?(e.shaderSource(r,a),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null}function W(e,t,a){const r=e.createProgram();return r?(e.attachShader(r,t),e.attachShader(r,a),e.linkProgram(r),e.getProgramParameter(r,e.LINK_STATUS)?r:(e.deleteProgram(r),null)):null}function O(e,t){const a=new Float32Array([-1,-1,1,-1,-1,1,1,1]),r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,a,e.STATIC_DRAW);const o=e.getAttribLocation(t,"a_position");e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0);const i=new Float32Array([0,1,1,1,0,0,1,0]),s=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,i,e.STATIC_DRAW);const c=e.getAttribLocation(t,"a_texCoord");e.enableVertexAttribArray(c),e.vertexAttribPointer(c,2,e.FLOAT,!1,0,0)}function H(e){const t=e.createTexture();e.bindTexture(e.TEXTURE_2D,t);const a=256,r=256,o=new Uint8Array(a*r*4);for(let i=0;i<r;i++)for(let s=0;s<a;s++){const c=(i*a+s)*4;o[c]=s/a*255,o[c+1]=i/r*255,o[c+2]=128,o[c+3]=255}e.texImage2D(e.TEXTURE_2D,0,e.RGBA,a,r,0,e.RGBA,e.UNSIGNED_BYTE,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR)}function F(){const e=h.current,t=y.current,a=f.current;if(!e||!t||!a)return;e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(t);const r=e.getUniformLocation(t,"u_resolution");e.uniform2f(r,a.width,a.height);const o=e.getUniformLocation(t,"u_mouse");e.uniform2f(o,w.current.x,w.current.y);const i=e.getUniformLocation(t,"u_time");e.uniform1f(i,performance.now()/1e3);const s=e.getUniformLocation(t,"u_intensity");e.uniform1f(s,A),e.drawArrays(e.TRIANGLE_STRIP,0,4),u&&typeof requestAnimationFrame=="function"&&(_.current=requestAnimationFrame(F))}return z?n.jsx("div",{className:U("relative overflow-hidden",v),style:{backgroundColor:G,...T},children:n.jsx("canvas",{ref:f,className:"glass-absolute glass-inset-0 glass-w-full glass-h-full glass-pointer-events-none",width:800,height:600,"aria-hidden":"true"})}):n.jsxs("div",{"data-glass-component":!0,className:U("glass-relative glass-overflow-hidden glass-rounded-2xl glass-border glass-p-4",v),role:"status",style:{...K,...T},children:[n.jsx("div",{className:"glass-absolute glass-inset-x-6 glass-top-8 glass-h-px",style:{...Y,animation:u?"ag-webgl-shader-line 2.8s ease-in-out infinite alternate":void 0}}),n.jsx("div",{className:"glass-absolute glass-left-1/2 glass-top-1/2 glass-h-20 glass-w-20 glass-rounded-2xl glass-border",style:{...$,animation:u?"ag-webgl-shader-tile 3.2s ease-in-out infinite alternate":void 0}}),n.jsx("div",{"aria-hidden":"true",className:"glass-absolute ag-webgl-shader-orb",style:{left:"-18%",top:"18%",width:"64%",height:"48%",borderRadius:999,filter:"blur(18px)",mixBlendMode:"screen",opacity:.68,animation:u?"ag-webgl-shader-orb 2.4s ease-in-out infinite alternate":void 0}}),u?n.jsx("style",{children:`
            .ag-webgl-shader-orb {
              background: radial-gradient(circle, rgba(124,211,255,0.74) 0%, rgba(216,111,255,0.44) 42%, transparent 72%);
            }
            @keyframes ag-webgl-shader-tile {
              0% { transform: translate(-68%, -56%) rotate(-10deg) scale(0.86); opacity: 0.45; }
              50% { transform: translate(-38%, -42%) rotate(13deg) scale(1.18); opacity: 1; }
              100% { transform: translate(-52%, -64%) rotate(-4deg) scale(0.96); opacity: 0.64; }
            }
            @keyframes ag-webgl-shader-line {
              0% { transform: translateX(-34%); opacity: 0.24; }
              50% { transform: translateX(46%); opacity: 1; }
              100% { transform: translateX(8%); opacity: 0.5; }
            }
            @keyframes ag-webgl-shader-orb {
              0% { transform: translate3d(0%, -10%, 0) scale(0.82); opacity: 0.38; }
              50% { transform: translate3d(86%, 8%, 0) scale(1.16); opacity: 0.9; }
              100% { transform: translate3d(44%, 38%, 0) scale(0.98); opacity: 0.62; }
            }
          `}):null,n.jsxs("div",{className:"glass-relative glass-z-10 glass-flex glass-h-full glass-min-h-48 glass-flex-col glass-justify-between",children:[n.jsxs("div",{children:[n.jsx("p",{className:"glass-text-xs glass-uppercase glass-tracking-widest glass-text-primary-glass-opacity-60",children:"CSS shader"}),n.jsxs("p",{className:"glass-mt-1 glass-text-base glass-font-semibold glass-text-primary",children:[g," glass field"]})]}),n.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Lightweight preview mode active."})]})]})}try{p.displayName="GlassWebGLShader",p.__docgenInfo={description:"",displayName:"GlassWebGLShader",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties | undefined"}},variant:{defaultValue:{value:"refraction"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"frosted"'},{value:'"refraction"'},{value:'"dispersion"'},{value:'"crystal"'},{value:'"prism"'}]}},intensity:{defaultValue:{value:"1"},description:"",name:"intensity",required:!1,type:{name:"number | undefined"}},animated:{defaultValue:{value:"true"},description:"",name:"animated",required:!1,type:{name:"boolean | undefined"}},interactive:{defaultValue:{value:"true"},description:"",name:"interactive",required:!1,type:{name:"boolean | undefined"}},backgroundColor:{defaultValue:{value:"transparent"},description:"",name:"backgroundColor",required:!1,type:{name:"string | undefined"}},renderMode:{defaultValue:{value:"auto"},description:"",name:"renderMode",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"webgl"'},{value:'"css"'}]}},respectMotionPreference:{defaultValue:{value:"true"},description:"",name:"respectMotionPreference",required:!1,type:{name:"boolean | undefined"}},compact:{defaultValue:{value:"false"},description:"",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"",name:"contained",required:!1,type:{name:"boolean | undefined"}},preview:{defaultValue:{value:"false"},description:"",name:"preview",required:!1,type:{name:"boolean | undefined"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number | undefined"}},maxHeight:{defaultValue:null,description:"",name:"maxHeight",required:!1,type:{name:"string | number | undefined"}}}}}catch{}const Z=Object.freeze(Object.defineProperty({__proto__:null,GlassWebGLShader:p},Symbol.toStringTag,{value:"Module"})),ee="GlassWebGLShader",te=Z[ee],ne={title:"Effects + Advanced/Glass Web GLShader",component:te,parameters:{layout:"centered",docs:{description:{component:"Component-owned Storybook coverage for GlassWebGLShader. This story renders the certified AuraGlass sample used by the full visual certification suite."}}}},m={parameters:{previewSurface:"media"},render:()=>n.jsxs("div",{style:{position:"relative",boxSizing:"border-box",width:"100%",maxWidth:800,height:"clamp(320px, 58vh, 450px)",overflow:"hidden",borderRadius:20,border:"1px solid rgba(255, 255, 255, 0.28)",background:"linear-gradient(135deg, rgba(15, 23, 42, 0.68) 0%, rgba(22, 78, 99, 0.7) 42%, rgba(76, 29, 149, 0.68) 100%)",backdropFilter:"blur(22px)",boxShadow:"0 28px 72px rgba(15, 23, 42, 0.4)"},children:[n.jsx(p,{className:"glass-absolute glass-inset-0",variant:"prism",intensity:.72,animated:!0,interactive:!1,backgroundColor:"transparent"}),n.jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,background:"linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 38%, rgba(255, 255, 255, 0.12) 68%, transparent)",pointerEvents:"none",mixBlendMode:"screen"}}),n.jsx("div",{style:{position:"relative",zIndex:1,display:"grid",boxSizing:"border-box",height:"100%",alignContent:"end",padding:"clamp(20px, 4vw, 34px)",color:"#f8fafc"},children:n.jsxs("div",{style:{width:"min(440px, 100%)",padding:"clamp(16px, 3vw, 22px)",borderRadius:16,color:"#f8fafc",background:"rgba(15, 23, 42, 0.70)",border:"1px solid rgba(255, 255, 255, 0.24)",backdropFilter:"blur(18px)"},children:[n.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#e2e8f0"},children:"GPU GLASS SHADER"}),n.jsx("h3",{style:{margin:"8px 0 6px",fontSize:"clamp(22px, 5vw, 28px)",lineHeight:1.12,color:"#f8fafc"},children:"Prism Refraction Preview"}),n.jsx("p",{style:{margin:0,fontSize:15,lineHeight:1.55,color:"#f8fafc"},children:"The WebGL canvas now fills a framed scene, giving Storybook a nonblank render target for shader and fallback inspection."})]})})]})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    previewSurface: "media"
  },
  render: () => <div style={{
    position: "relative",
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 800,
    height: "clamp(320px, 58vh, 450px)",
    overflow: "hidden",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.28)",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.68) 0%, rgba(22, 78, 99, 0.7) 42%, rgba(76, 29, 149, 0.68) 100%)",
    backdropFilter: "blur(22px)",
    boxShadow: "0 28px 72px rgba(15, 23, 42, 0.4)"
  }}>
      <GlassWebGLShader className="glass-absolute glass-inset-0" variant="prism" intensity={0.72} animated interactive={false} backgroundColor="transparent" />
      <div aria-hidden="true" style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 38%, rgba(255, 255, 255, 0.12) 68%, transparent)",
      pointerEvents: "none",
      mixBlendMode: "screen"
    }} />
      <div style={{
      position: "relative",
      zIndex: 1,
      display: "grid",
      boxSizing: "border-box",
      height: "100%",
      alignContent: "end",
      padding: "clamp(20px, 4vw, 34px)",
      color: "#f8fafc"
    }}>
        <div style={{
        width: "min(440px, 100%)",
        padding: "clamp(16px, 3vw, 22px)",
        borderRadius: 16,
        color: "#f8fafc",
        background: "rgba(15, 23, 42, 0.70)",
        border: "1px solid rgba(255, 255, 255, 0.24)",
        backdropFilter: "blur(18px)"
      }}>
          <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#e2e8f0"
        }}>
            GPU GLASS SHADER
          </div>
          <h3 style={{
          margin: "8px 0 6px",
          fontSize: "clamp(22px, 5vw, 28px)",
          lineHeight: 1.12,
          color: "#f8fafc"
        }}>
            Prism Refraction Preview
          </h3>
          <p style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.55,
          color: "#f8fafc"
        }}>
            The WebGL canvas now fills a framed scene, giving Storybook a
            nonblank render target for shader and fallback inspection.
          </p>
        </div>
      </div>
    </div>
}`,...m.parameters?.docs?.source}}};const oe=["Default"];export{m as Default,oe as __namedExportsOrder,ne as default};
