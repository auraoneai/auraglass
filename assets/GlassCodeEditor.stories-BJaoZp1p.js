import{r as l,j as e,c as n,g as I}from"./iframe-AZkd8Eyt.js";import{O as L}from"./OptimizedGlassCore-BM69gN7z.js";import"./preload-helper-PPVm8Dsz.js";import"./deviceCapabilities-BOA6cHzv.js";const le={javascript:{keywords:/\b(const|let|var|function|return|if|else|for|while|do|switch|case|default|try|catch|finally|throw|new|class|extends|super|import|export|from|async|await|yield|typeof|instanceof|in|of)\b/g,strings:/(["'`])(.*?)\1/g,comments:/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,numbers:/\b\d+(\.\d+)?\b/g,functions:/\b\w+(?=\()/g},typescript:{keywords:/\b(const|let|var|function|return|if|else|for|while|do|switch|case|default|try|catch|finally|throw|new|class|extends|super|import|export|from|async|await|yield|typeof|instanceof|in|of|interface|type|enum|namespace|module)\b/g,strings:/(["'`])(.*?)\1/g,comments:/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,numbers:/\b\d+(\.\d+)?\b/g,types:/\b[A-Z]\w*\b/g},python:{keywords:/\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|and|or|not|in|is|None|True|False)\b/g,strings:/(["'`])(.*?)\1/g,comments:/(#.*$)/gm,numbers:/\b\d+(\.\d+)?\b/g,functions:/\b\w+(?=\()/g},css:{properties:/([a-z-]+)(?=\s*:)/g,values:/:(.+?);/g,selectors:/([.#]?[\w-]+)(?=\s*\{)/g,comments:/(\/\*[\s\S]*?\*\/)/g},json:{keys:/"([^"]+)":/g,strings:/"([^"]+)"/g,numbers:/\b\d+(\.\d+)?\b/g}},re=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),F=({value:t,language:i="plaintext",readOnly:d=!1,placeholder:f="Enter your code here...",fontSize:b=14,lineNumbers:p=!0,minimap:o=!1,wordWrap:V=!0,tabSize:h=2,autoComplete:z=!1,theme:oe="dark",maxHeight:D="320px",minHeight:O="180px",compact:v=!1,showToolbar:$=!0,className:U="",onChange:m,onFocus:_,onBlur:R,onMount:q})=>{const B=t===void 0&&!m?`import { GlassCard } from 'aura-glass';

export function Preview() {
  return <GlassCard intensity="medium">Live surface</GlassCard>;
}`:"",[K,H]=l.useState(t??B),[ie,T]=l.useState(!1),[G,Z]=l.useState({line:1,column:1}),u=l.useRef(null),W=l.useRef(null),c=t!==void 0?t:K,j=v?Math.min(b,11):b,w=v?!1:p,J=v?"220px":D,Q=v?"120px":O,M=`${Math.round(j*1.55)}px`,X=l.useCallback(s=>{const a=s.target.value;H(a),m?.(a)},[m]),Y=l.useCallback(()=>{T(!0),_?.()},[_]),ee=l.useCallback(()=>{T(!1),R?.()},[R]),ae=l.useCallback((s,a)=>{const r=re(s);return a==="plaintext"||!le[a],r},[]),se=l.useCallback(s=>{if(s.key==="Tab"&&!d){s.preventDefault();const a=u.current;if(!a)return;const r=a.selectionStart,y=a.selectionEnd,x=" ".repeat(h),g=c.substring(0,r)+x+c.substring(y);H(g),m?.(g),setTimeout(()=>{a.selectionStart=a.selectionEnd=r+h},0)}},[c,h,d,m]),P=l.useCallback(()=>{const s=u.current;if(!s)return;const a=s.value,r=s.selectionStart;let y=1,x=1;for(let g=0;g<r;g++)a[g]===`
`?(y++,x=1):x++;Z({line:y,column:x})},[]);l.useEffect(()=>{const s=u.current,a=W.current;if(!s||!a)return;const r=()=>{a.scrollTop=s.scrollTop,a.scrollLeft=s.scrollLeft};return s.addEventListener("scroll",r),()=>s.removeEventListener("scroll",r)},[]),l.useEffect(()=>{u.current&&q&&q(u.current)},[q]);const ne=ae(c,i),te=c.split(`
`);return e.jsxs(L,{"data-glass-component":!0,className:n("glass-code-editor glass-relative glass-overflow-hidden glass-max-w-full glass-surface-dark/30 glass-border glass-border-white/10",U),style:{...I({intent:"neutral",elevation:"level2"}),maxHeight:J,minHeight:Q,minWidth:0,height:"100%",display:"flex",flexDirection:"column"},blur:"medium",elevation:"level1",children:[$&&!v&&e.jsxs("div",{className:n("glass-flex glass-items-center glass-justify-between glass-px-3 glass-py-2 glass-border-b glass-border-white/10 glass-surface-dark/30"),children:[e.jsxs("div",{className:n("glass-flex glass-items-center glass-gap-4"),children:[e.jsx("span",{className:n("glass-text-sm glass-text-primary-opacity-70 glass-font-medium"),children:i.toUpperCase()}),w&&e.jsxs("span",{className:n("glass-text-xs glass-text-primary-opacity-50"),children:["Ln ",G.line,", Col ",G.column]})]}),e.jsx("div",{className:n("glass-flex glass-items-center glass-gap-2"),children:!d&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:n("glass-px-2 glass-py-1 glass-text-xs glass-text-primary-opacity-70 hover:glass-text-primary hover:glass-surface-subtle glass-radius-md glass-transition-colors"),onClick:s=>{const a=u.current;a&&(a.value="",H(""),m?.(""))},children:"Clear"}),e.jsx("button",{className:n("glass-px-2 glass-py-1 glass-text-xs glass-text-primary-opacity-70 hover:glass-text-primary hover:glass-surface-subtle glass-radius-md glass-transition-colors"),onClick:s=>{navigator.clipboard?.writeText(c)},children:"Copy"})]})})]}),e.jsxs("div",{className:n("glass-relative glass-min-h-0 glass-overflow-hidden"),style:{...I({intent:"neutral",elevation:"level1"}),minHeight:0,height:"auto",flex:"1 1 auto"},children:[e.jsx("pre",{ref:W,className:n("glass-absolute glass-inset-0 glass-p-3 glass-font-mono glass-text-sm glass-overflow-auto glass-pointer-events-none glass-whitespace-pre-wrap glass-break-words",w?"glass-pl-16":"",V?"glass-break-words":"glass-whitespace-pre"),style:{fontSize:j,lineHeight:M,tabSize:h},children:e.jsx("code",{dangerouslySetInnerHTML:{__html:ne||f},className:n(c?"":"glass-text-primary-30")})}),w&&e.jsx("div",{className:n("glass-absolute glass-left-0 glass-top-0 glass-bottom-0 glass-w-12 glass-surface-dark/40 glass-border-r glass-border-white/10 glass-p-3 glass-text-right glass-text-secondary glass-text-sm glass-font-mono glass-select-none"),style:{fontSize:j,lineHeight:M},children:te.map((s,a)=>e.jsx("div",{children:a+1},a))}),e.jsx("textarea",{ref:u,value:c,onChange:X,onFocus:Y,onBlur:ee,onKeyDown:se,onSelect:P,onClick:P,readOnly:d,placeholder:f,className:n("glass-w-full glass-p-3 glass-font-mono glass-text-sm glass-bg-transparent glass-caret-white glass-outline-none glass-resize-none glass-overflow-auto",V?"glass-break-words":"glass-whitespace-pre",w?"glass-pl-16":""),style:{color:"transparent",WebkitTextFillColor:"transparent",fontSize:j,lineHeight:M,tabSize:h,minHeight:"100%",height:"100%"},spellCheck:!1,autoComplete:z?"on":"off",autoCorrect:"off",autoCapitalize:"off"})]})]})},S=({files:t,onFileChange:i,className:d=""})=>{const[f,b]=l.useState(t[0]?.name||""),p=t.find(o=>o.name===f)||t[0];return e.jsxs("div",{className:n("glass-grid glass-grid-cols-4 glass-gap-4",d),children:[e.jsxs(L,{className:n("glass-col-span-1 glass-p-4"),blur:"medium",elevation:"level1",children:[e.jsx("h3",{className:n("glass-text-sm glass-font-semibold glass-text-primary glass-mb-4"),children:"Files"}),e.jsx("div",{className:n("glass-gap-2"),children:t.map(o=>e.jsx("button",{onClick:V=>b(o.name),className:n("glass-w-full glass-text-left glass-px-3 glass-py-2 glass-radius-md glass-text-sm glass-transition-colors",f===o.name?"glass-surface-elevated glass-text-primary":"glass-text-primary-70 glass-hover-text-primary glass-hover-surface-subtle"),children:o.name},o.name))})]}),e.jsx("div",{className:n("glass-col-span-3"),children:p&&e.jsx(F,{value:p.content,language:p.language,onChange:o=>i?.(p.name,o)})})]})};try{F.displayName="GlassCodeEditor",F.__docgenInfo={description:"",displayName:"GlassCodeEditor",props:{value:{defaultValue:null,description:"Code content",name:"value",required:!1,type:{name:"string | undefined"}},language:{defaultValue:{value:"plaintext"},description:"Language for syntax highlighting",name:"language",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"html"'},{value:'"ruby"'},{value:'"plaintext"'},{value:'"go"'},{value:'"css"'},{value:'"json"'},{value:'"javascript"'},{value:'"typescript"'},{value:'"python"'},{value:'"java"'},{value:'"cpp"'},{value:'"csharp"'},{value:'"rust"'},{value:'"php"'},{value:'"swift"'},{value:'"kotlin"'},{value:'"scala"'},{value:'"xml"'},{value:'"yaml"'},{value:'"sql"'},{value:'"bash"'},{value:'"powershell"'},{value:'"dockerfile"'},{value:'"markdown"'}]}},readOnly:{defaultValue:{value:"false"},description:"Whether the editor is read-only",name:"readOnly",required:!1,type:{name:"boolean | undefined"}},placeholder:{defaultValue:{value:"Enter your code here..."},description:"Placeholder text when empty",name:"placeholder",required:!1,type:{name:"string | undefined"}},fontSize:{defaultValue:{value:"14"},description:"Font size",name:"fontSize",required:!1,type:{name:"number | undefined"}},lineNumbers:{defaultValue:{value:"true"},description:"Number of lines to show",name:"lineNumbers",required:!1,type:{name:"boolean | undefined"}},minimap:{defaultValue:{value:"false"},description:"Whether to show minimap",name:"minimap",required:!1,type:{name:"boolean | undefined"}},wordWrap:{defaultValue:{value:"true"},description:"Whether to enable word wrap",name:"wordWrap",required:!1,type:{name:"boolean | undefined"}},tabSize:{defaultValue:{value:"2"},description:"Tab size",name:"tabSize",required:!1,type:{name:"number | undefined"}},autoComplete:{defaultValue:{value:"false"},description:"Whether to enable auto-completion",name:"autoComplete",required:!1,type:{name:"boolean | undefined"}},theme:{defaultValue:{value:"dark"},description:"Theme for syntax highlighting",name:"theme",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"auto"'},{value:'"dark"'},{value:'"light"'}]}},maxHeight:{defaultValue:{value:"320px"},description:"Maximum height",name:"maxHeight",required:!1,type:{name:"string | undefined"}},minHeight:{defaultValue:{value:"180px"},description:"Minimum height",name:"minHeight",required:!1,type:{name:"string | undefined"}},compact:{defaultValue:{value:"false"},description:"Compact mode for constrained cards, drawers, and documentation previews.",name:"compact",required:!1,type:{name:"boolean | undefined"}},showToolbar:{defaultValue:{value:"true"},description:"Hide toolbar controls/language metadata in compact mode.",name:"showToolbar",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"Custom className",name:"className",required:!1,type:{name:"string | undefined"}},onChange:{defaultValue:null,description:"Change handler",name:"onChange",required:!1,type:{name:"((value: string) => void) | undefined"}},onFocus:{defaultValue:null,description:"Focus handler",name:"onFocus",required:!1,type:{name:"(() => void) | undefined"}},onBlur:{defaultValue:null,description:"Blur handler",name:"onBlur",required:!1,type:{name:"(() => void) | undefined"}},onMount:{defaultValue:null,description:"Mount handler",name:"onMount",required:!1,type:{name:"((editor: HTMLTextAreaElement) => void) | undefined"}}}}}catch{}try{S.displayName="GlassCodeEditorWithFiles",S.__docgenInfo={description:"",displayName:"GlassCodeEditorWithFiles",props:{files:{defaultValue:null,description:"",name:"files",required:!0,type:{name:"{ name: string; content: string; language: Language; }[]"}},onFileChange:{defaultValue:null,description:"",name:"onFileChange",required:!1,type:{name:"((filename: string, content: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const me={title:"Effects + Advanced/Glass Code Editor",component:F,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glasscodeeditor component."}}},argTypes:{className:{control:"text",description:"Additional CSS classes"},value:{control:"text",description:"Code content"},language:{control:{type:"select"},options:["javascript","typescript","python","html","css","json"],description:"Programming language"},readOnly:{control:"boolean",description:"Read-only mode"},lineNumbers:{control:"boolean",description:"Show line numbers"}},args:{className:"",value:`function hello() {
  console.log("Hello, World!");
}`,language:"javascript",readOnly:!1,lineNumbers:!0}},C={args:{value:'console.log("Hello from GlassCodeEditor!");',language:"javascript"}},N={args:{value:`interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Alice",
  age: 30
};`,language:"typescript",lineNumbers:!0}},k={args:{value:`const data = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" }
];`,language:"javascript",readOnly:!0,lineNumbers:!0}},A={render:t=>e.jsx(S,{files:[{name:"index.js",content:`console.log("Hello from index.js!");

function greet(name) {
  return \`Hello, \${name}!\`;
}`,language:"javascript"},{name:"styles.css",content:`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`,language:"css"},{name:"App.tsx",content:`import React from "react";

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Hello World</h1>
    </div>
  );
};

export default App;`,language:"typescript"}],onFileChange:(...i)=>console.log("Mock function called",...i)}),args:{}},E={render:t=>e.jsx(S,{files:[{name:"package.json",content:`{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}`,language:"json"},{name:"src/App.js",content:`import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My React App</h1>
      </header>
    </div>
  );
}

export default App;`,language:"javascript"},{name:"src/App.css",content:`.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}`,language:"css"},{name:"README.md",content:`# My Project

This is a sample React project with multiple files.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start development server: \`npm start\``,language:"markdown"}],onFileChange:(...i)=>console.log("Mock function called",...i)}),args:{}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'console.log("Hello from GlassCodeEditor!");',
    language: 'javascript'
  }
}`,...C.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'interface User {\\n  name: string;\\n  age: number;\\n}\\n\\nconst user: User = {\\n  name: "Alice",\\n  age: 30\\n};',
    language: 'typescript',
    lineNumbers: true
  }
}`,...N.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'const data = [\\n  { id: 1, name: "Item 1" },\\n  { id: 2, name: "Item 2" }\\n];',
    language: 'javascript',
    readOnly: true,
    lineNumbers: true
  }
}`,...k.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <GlassCodeEditorWithFiles files={[{
    name: 'index.js',
    content: 'console.log("Hello from index.js!");\\n\\nfunction greet(name) {\\n  return \`Hello, \${name}!\`;\\n}',
    language: 'javascript'
  }, {
    name: 'styles.css',
    content: '.container {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  min-height: 100vh;\\n}',
    language: 'css'
  }, {
    name: 'App.tsx',
    content: 'import React from "react";\\n\\nconst App: React.FC = () => {\\n  return (\\n    <div className="container">\\n      <h1>Hello World</h1>\\n    </div>\\n  );\\n};\\n\\nexport default App;',
    language: 'typescript'
  }]} onFileChange={(...args) => console.log('Mock function called', ...args)} />,
  args: {}
}`,...A.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <GlassCodeEditorWithFiles files={[{
    name: 'package.json',
    content: '{\\n  "name": "my-project",\\n  "version": "1.0.0",\\n  "scripts": {\\n    "start": "react-scripts start",\\n    "build": "react-scripts build"\\n  }\\n}',
    language: 'json'
  }, {
    name: 'src/App.js',
    content: 'import React from "react";\\nimport "./App.css";\\n\\nfunction App() {\\n  return (\\n    <div className="App">\\n      <header className="App-header">\\n        <h1>My React App</h1>\\n      </header>\\n    </div>\\n  );\\n}\\n\\nexport default App;',
    language: 'javascript'
  }, {
    name: 'src/App.css',
    content: '.App {\\n  text-align: center;\\n}\\n\\n.App-header {\\n  background-color: #282c34;\\n  min-height: 100vh;\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  justify-content: center;\\n  color: white;\\n}',
    language: 'css'
  }, {
    name: 'README.md',
    content: '# My Project\\n\\nThis is a sample React project with multiple files.\\n\\n## Getting Started\\n\\n1. Install dependencies: \`npm install\`\\n2. Start development server: \`npm start\`',
    language: 'markdown'
  }]} onFileChange={(...args) => console.log('Mock function called', ...args)} />,
  args: {}
}`,...E.parameters?.docs?.source}}};const ge=["Default","TypeScriptExample","ReadOnlyExample","WithFiles","MultiFileProject"];export{C as Default,E as MultiFileProject,k as ReadOnlyExample,N as TypeScriptExample,A as WithFiles,ge as __namedExportsOrder,me as default};
