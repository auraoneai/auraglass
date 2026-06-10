import{r as c,j as a,c as g}from"./iframe-DL0Cy6Qm.js";import{G as re,a as O}from"./GlassGrid-czUfn9nG.js";import{G as le}from"./GlassCard-DCtUFKr-.js";import{G as M,I as G}from"./GlassButton-DfOzjBO4.js";import{P as ie}from"./GlassAppShell-CMbYi7vh.js";import{H as k,V as y}from"./GlassStack-Cal1PHO2.js";import{M as oe}from"./MotionFramer-CMmRorie.js";import{G as de}from"./GlassCore-ChkIexNe.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-BmS7yTss.js";import"./MotionPreferenceContext-CE2cIJWP.js";import"./LiquidGlassMaterial-UbBe1GEe.js";import"./LiquidGlassLayerProvider-CWq40Pup.js";import"./OptimizedGlassCore-DCil-Mtt.js";import"./deviceCapabilities-bTwC3axp.js";import"./GlassPredictiveEngine-05Sa5boq.js";import"./GlassAchievementSystem-BHEgKCBn.js";import"./GlassBiometricAdaptation-BgUrssxj.js";import"./GlassEyeTracking-DbcgmIgS.js";import"./GlassSpatialAudio-BSI6cL7u.js";import"./GlassContainer-I_lQ9dUy.js";import"./utilsCore-BTp3mrmn.js";const ce={id:"default",name:"Default Dashboard",widgets:[],cols:4,gap:"md"},p=c.forwardRef(({title:h="Dashboard",description:$,layout:t=ce,availableWidgets:u=[],editMode:n=!1,onEditModeChange:A,onLayoutChange:ue,onWidgetAdd:j,onWidgetRemove:H,onWidgetUpdate:w,dragEnabled:f=!0,widgetRenderers:_={},actions:L,loading:P=!1,emptyState:W,compact:d=!1,contained:D=!1,showHeader:U=!0,showActions:I=!0,showToolbar:S=!0,height:C,width:B,maxHeight:V,className:F,style:q,...K},Y)=>{const[m,R]=c.useState(null),[me,T]=c.useState(null),N=d||D||C!==void 0||V!==void 0,E=d?Math.min(t.cols,2):t.cols,J=N?"glass-min-glass-h-0":"glass-min-glass-h-96",Q={...q,width:B,height:C,maxHeight:V??(d||D?420:void 0),overflow:N?"hidden":q?.overflow},X=c.useCallback(e=>{!n||!f||R(e)},[n,f]),z=c.useCallback(()=>{R(null),T(null)},[]),Z=c.useCallback(e=>{!m||!w||(w(m,{position:e}),z())},[m,w,z]),ee=c.useCallback(e=>{const s=u.find(i=>i.type===e);if(!s||!j)return;const o=new Set(t.widgets.map(i=>`${i.position.x},${i.position.y}`));let l={x:0,y:0};for(let i=0;i<10;i++){for(let r=0;r<t.cols;r++){const ne=`${r},${i}`;if(!o.has(ne)){l={x:r,y:i};break}}if(l.x!==0||l.y!==0)break}j({title:s.title,type:s.type,size:s.defaultSize,position:l})},[u,t.widgets,t.cols,j]),ae={metric:({widget:e})=>a.jsxs(y,{space:"md",children:[a.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary",children:e.data?.value||"0"}),a.jsx("div",{className:"glass-text-sm glass-text-secondary",children:e.data?.label||"Metric"}),e.data?.change&&a.jsxs("div",{className:g("glass-text-xs font-medium",e.data?.change>0?"text-success":"text-destructive"),children:[e.data?.change>0?"+":"",e.data?.change,"%"]})]}),chart:({widget:e})=>a.jsxs(y,{space:"md",children:[a.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary",children:e.data?.title||"Chart"}),a.jsx("div",{className:"glass-h-32 glass-surface-subtle glass-radius-md glass-flex glass-items-center glass-justify-center",children:a.jsx("span",{className:"glass-text-secondary",children:e.data?.chartType?`${e.data?.chartType} Chart`:"Chart Widget"})})]}),table:({widget:e})=>a.jsxs(y,{space:"md",children:[a.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary",children:e.data?.title||"Table"}),a.jsx("div",{className:"glass-auto-gap glass-auto-gap-sm",children:(e.data?.rows||[]).slice(0,3).map((s,o)=>a.jsxs("div",{className:"glass-flex glass-justify-between glass-text-sm",children:[a.jsx("span",{className:"glass-text-primary",children:s.name}),a.jsx("span",{className:"glass-text-secondary",children:s.value})]},o))})]}),text:({widget:e})=>a.jsx("div",{className:"glass-text-sm glass-text-primary",children:e.data?.content||e.data?.title||"Text Widget"})},se=e=>{const s=_?.[e.type]||ae?.[e.type]||e.component;return s?a.jsx(s,{widget:e}):a.jsxs("div",{"data-glass-component":!0,className:"glass-h-full glass-flex glass-items-center glass-justify-center glass-text-secondary",children:["Unknown widget type: ",e.type]})},te=()=>!n||(u?.length||0)===0?null:a.jsx("div",{className:"glass-grid glass-grid-cols-2 glass-gap-2 glass-p-2",children:u.map(e=>a.jsx(M,{variant:"ghost",size:"sm",leftIcon:e.icon,onClick:s=>ee(e.type),className:"glass-justify-start glass-focus glass-touch-target",children:e.title},e.type))});return P?a.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-64",children:a.jsx("div",{className:"glass-w-8 glass-h-8 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full glass-animate-spin"})}):(t.widgets?.length||0)===0&&W?W:a.jsxs("div",{ref:Y,className:g("w-full glass-auto-gap",d?"glass-auto-gap-md":"glass-auto-gap-2xl",D&&"glass-contained",F),style:Q,"data-glass-component":!0,...K,children:[U&&a.jsx(ie,{title:h,description:d?void 0:$,actions:I?a.jsxs(k,{space:"sm",children:[L,S&&(u?.length||0)>0&&a.jsx(M,{variant:n?"primary":"outline",size:"sm",leftIcon:n?"✓":"Edit",onClick:e=>A?.(!n),className:"glass-focus glass-touch-target",children:n?"Done":"Edit"})]}):void 0}),S&&n&&(u?.length||0)>0&&a.jsx(oe,{preset:"slideDown",children:a.jsx(de,{className:"glass-p-4 glass-radius-lg",children:a.jsxs(y,{space:"sm",children:[a.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary",children:"Add Widget"}),te()]})})}),a.jsxs(re,{cols:E,gap:t.gap,className:g(J,N&&"glass-overflow-y-auto glass-pr-1"),children:[t.widgets.map(e=>a.jsx(O,{colSpan:d?Math.min(e.size.cols,E):e.size.cols,rowSpan:d?Math.min(e.size.rows,2):e.size.rows,className:g("transition-all duration-200",m===e.id&&"opacity-50 scale-95",n&&f&&"cursor-move"),draggable:n&&f,onDragStart:()=>X(e.id),onDragEnd:z,children:a.jsxs(le,{variant:"default",className:g("h-full relative group",n&&"hover:ring-2 hover:ring-primary/50"),children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[a.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-truncate",children:e.title}),n&&a.jsxs(k,{space:"xs",className:"glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity",children:[e.removable!==!1&&a.jsx(G,{icon:"🗑️",variant:"ghost",size:"xs",onClick:s=>H?.(e.id),"aria-label":"Remove widget",className:"glass-focus glass-touch-target glass-contrast-guard"}),a.jsx(G,{icon:"⚙️",variant:"ghost",size:"xs",onClick:s=>{},"aria-label":"Configure widget",className:"glass-focus glass-touch-target glass-contrast-guard"})]})]}),a.jsx("div",{className:"glass-flex-1",children:se(e)})]})},e.id)),n&&m&&a.jsx(a.Fragment,{children:Array.from({length:t.cols*4},(e,s)=>{const o=s%t.cols,l=Math.floor(s/t.cols);return t.widgets.some(r=>r.position.x===o&&r.position.y===l)?null:a.jsx(O,{colSpan:1,rowSpan:1,className:"glass-min-glass-h-24",style:{gridColumnStart:o+1,gridRowStart:l+1},children:a.jsx("div",{className:"glass-h-full glass-border-2 glass-border-dashed glass-border-primary/30 glass-radius-lg glass-surface-primary/5 glass-flex glass-items-center glass-justify-center glass-transition-colors hover:glass-border-primary/50 hover:glass-surface-primary/10",onDragOver:r=>{r.preventDefault(),T({x:o,y:l})},onDrop:r=>{r.preventDefault(),Z({x:o,y:l})},children:a.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:"Drop here"})})},`drop-zone-${o}-${l}`)})})]})]})});p.displayName="GlassDashboard";try{p.displayName="GlassDashboard",p.__docgenInfo={description:"",displayName:"GlassDashboard",props:{title:{defaultValue:{value:"Dashboard"},description:"Dashboard title",name:"title",required:!1,type:{name:"string | undefined"}},description:{defaultValue:null,description:"Dashboard description",name:"description",required:!1,type:{name:"string | undefined"}},layout:{defaultValue:{value:`{
  id: "default",
  name: "Default Dashboard",
  widgets: [],
  cols: 4,
  gap: "md",
}`},description:"Dashboard layout",name:"layout",required:!1,type:{name:"DashboardLayout | undefined"}},availableWidgets:{defaultValue:{value:"[]"},description:"Available widget types for adding",name:"availableWidgets",required:!1,type:{name:"{ type: string; title: string; icon: ReactNode; defaultSize: { cols: 1 | 2 | 3 | 4 | 6 | 12; rows: 1 | 2 | 3 | 4; }; }[] | undefined"}},editMode:{defaultValue:{value:"false"},description:"Whether dashboard is in edit mode",name:"editMode",required:!1,type:{name:"boolean | undefined"}},onEditModeChange:{defaultValue:null,description:"Edit mode change handler",name:"onEditModeChange",required:!1,type:{name:"((editMode: boolean) => void) | undefined"}},onLayoutChange:{defaultValue:null,description:"Layout change handler",name:"onLayoutChange",required:!1,type:{name:"((layout: DashboardLayout) => void) | undefined"}},onWidgetAdd:{defaultValue:null,description:"Widget add handler",name:"onWidgetAdd",required:!1,type:{name:"((widget: Partial<DashboardWidget>) => void) | undefined"}},onWidgetRemove:{defaultValue:null,description:"Widget remove handler",name:"onWidgetRemove",required:!1,type:{name:"((widgetId: string) => void) | undefined"}},onWidgetUpdate:{defaultValue:null,description:"Widget update handler",name:"onWidgetUpdate",required:!1,type:{name:"((widgetId: string, updates: Partial<DashboardWidget>) => void) | undefined"}},dragEnabled:{defaultValue:{value:"true"},description:"Drag and drop enabled",name:"dragEnabled",required:!1,type:{name:"boolean | undefined"}},widgetRenderers:{defaultValue:{value:"{}"},description:"Custom widget renderers",name:"widgetRenderers",required:!1,type:{name:"Record<string, ComponentType<DashboardWidgetRendererProps>> | undefined"}},actions:{defaultValue:null,description:"Dashboard actions",name:"actions",required:!1,type:{name:"ReactNode"}},loading:{defaultValue:{value:"false"},description:"Loading state",name:"loading",required:!1,type:{name:"boolean | undefined"}},emptyState:{defaultValue:null,description:"Empty state component",name:"emptyState",required:!1,type:{name:"ReactNode"}},compact:{defaultValue:{value:"false"},description:"Compact rendering for constrained cards and docs previews.",name:"compact",required:!1,type:{name:"boolean | undefined"}},contained:{defaultValue:{value:"false"},description:"Keep the dashboard bounded inside its parent instead of assuming a page-scale layout.",name:"contained",required:!1,type:{name:"boolean | undefined"}},showHeader:{defaultValue:{value:"true"},description:"Whether to render the dashboard header.",name:"showHeader",required:!1,type:{name:"boolean | undefined"}},showActions:{defaultValue:{value:"true"},description:"Whether to render actions in the header.",name:"showActions",required:!1,type:{name:"boolean | undefined"}},showToolbar:{defaultValue:{value:"true"},description:"Whether to render edit toolbar controls.",name:"showToolbar",required:!1,type:{name:"boolean | undefined"}},height:{defaultValue:null,description:"Explicit dashboard height for embedded layouts.",name:"height",required:!1,type:{name:"Height<string | number> | undefined"}},width:{defaultValue:null,description:"Explicit dashboard width for embedded layouts.",name:"width",required:!1,type:{name:"Width<string | number> | undefined"}},maxHeight:{defaultValue:null,description:"Maximum dashboard height for embedded layouts.",name:"maxHeight",required:!1,type:{name:"MaxHeight<string | number> | undefined"}}}}}catch{}const Me={title:"Workflows/Glass Dashboard",component:p,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassdashboard component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},x={args:{layout:{id:"default-layout",name:"Default Dashboard",cols:4,gap:"md",widgets:[{id:"metric-1",title:"Total Users",type:"metric",size:{cols:1,rows:1},position:{x:0,y:0},data:{value:"1,234",label:"Active Users",change:12.5}},{id:"metric-2",title:"Revenue",type:"metric",size:{cols:1,rows:1},position:{x:1,y:0},data:{value:"$45,678",label:"Monthly Revenue",change:8.2}},{id:"chart-1",title:"Sales Chart",type:"chart",size:{cols:2,rows:2},position:{x:2,y:0},data:{title:"Sales Over Time",chartType:"line"}},{id:"table-1",title:"Recent Orders",type:"table",size:{cols:2,rows:1},position:{x:0,y:1},data:{title:"Latest Orders",rows:[{name:"Order #1234",value:"$299.00"},{name:"Order #1235",value:"$149.50"},{name:"Order #1236",value:"$599.00"}]}},{id:"text-1",title:"Welcome Message",type:"text",size:{cols:2,rows:1},position:{x:2,y:2},data:{content:"Welcome to your dashboard! Here you can monitor your key metrics and performance indicators."}}]}}},b={render:h=>a.jsx("div",{className:"glass-w-full glass-h-screen",children:a.jsx(p,{...h})}),args:{layout:{id:"variant-layout",name:"Variant Dashboard",cols:3,gap:"lg",widgets:[{id:"metric-variant-1",title:"Performance",type:"metric",size:{cols:1,rows:1},position:{x:0,y:0},data:{value:"98.5%",label:"System Uptime",change:2.1}},{id:"chart-variant-1",title:"Traffic Analytics",type:"chart",size:{cols:2,rows:2},position:{x:1,y:0},data:{title:"Website Traffic",chartType:"bar"}}]}}},v={args:{editMode:!0,availableWidgets:[{type:"metric",title:"Metric Widget",icon:"📊",defaultSize:{cols:1,rows:1}},{type:"chart",title:"Chart Widget",icon:"📈",defaultSize:{cols:2,rows:2}},{type:"table",title:"Table Widget",icon:"📋",defaultSize:{cols:2,rows:1}}],layout:{id:"edit-mode-layout",name:"Editable Dashboard",cols:4,gap:"md",widgets:[{id:"existing-metric",title:"Existing Metric",type:"metric",size:{cols:1,rows:1},position:{x:0,y:0},data:{value:"42",label:"Sample Metric",change:-5.2},editable:!0,removable:!0,resizable:!0}]}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    layout: {
      id: 'default-layout',
      name: 'Default Dashboard',
      cols: 4,
      gap: 'md' as const,
      widgets: [{
        id: 'metric-1',
        title: 'Total Users',
        type: 'metric',
        size: {
          cols: 1,
          rows: 1
        },
        position: {
          x: 0,
          y: 0
        },
        data: {
          value: '1,234',
          label: 'Active Users',
          change: 12.5
        }
      }, {
        id: 'metric-2',
        title: 'Revenue',
        type: 'metric',
        size: {
          cols: 1,
          rows: 1
        },
        position: {
          x: 1,
          y: 0
        },
        data: {
          value: '$45,678',
          label: 'Monthly Revenue',
          change: 8.2
        }
      }, {
        id: 'chart-1',
        title: 'Sales Chart',
        type: 'chart',
        size: {
          cols: 2,
          rows: 2
        },
        position: {
          x: 2,
          y: 0
        },
        data: {
          title: 'Sales Over Time',
          chartType: 'line'
        }
      }, {
        id: 'table-1',
        title: 'Recent Orders',
        type: 'table',
        size: {
          cols: 2,
          rows: 1
        },
        position: {
          x: 0,
          y: 1
        },
        data: {
          title: 'Latest Orders',
          rows: [{
            name: 'Order #1234',
            value: '$299.00'
          }, {
            name: 'Order #1235',
            value: '$149.50'
          }, {
            name: 'Order #1236',
            value: '$599.00'
          }]
        }
      }, {
        id: 'text-1',
        title: 'Welcome Message',
        type: 'text',
        size: {
          cols: 2,
          rows: 1
        },
        position: {
          x: 2,
          y: 2
        },
        data: {
          content: 'Welcome to your dashboard! Here you can monitor your key metrics and performance indicators.'
        }
      }]
    }
  }
}`,...x.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: (args: any) => <div className="glass-w-full glass-h-screen">
      <GlassDashboard {...args} />
    </div>,
  args: {
    layout: {
      id: 'variant-layout',
      name: 'Variant Dashboard',
      cols: 3,
      gap: 'lg' as const,
      widgets: [{
        id: 'metric-variant-1',
        title: 'Performance',
        type: 'metric',
        size: {
          cols: 1,
          rows: 1
        },
        position: {
          x: 0,
          y: 0
        },
        data: {
          value: '98.5%',
          label: 'System Uptime',
          change: 2.1
        }
      }, {
        id: 'chart-variant-1',
        title: 'Traffic Analytics',
        type: 'chart',
        size: {
          cols: 2,
          rows: 2
        },
        position: {
          x: 1,
          y: 0
        },
        data: {
          title: 'Website Traffic',
          chartType: 'bar'
        }
      }]
    }
  }
}`,...b.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    editMode: true,
    availableWidgets: [{
      type: 'metric',
      title: 'Metric Widget',
      icon: '📊',
      defaultSize: {
        cols: 1,
        rows: 1
      }
    }, {
      type: 'chart',
      title: 'Chart Widget',
      icon: '📈',
      defaultSize: {
        cols: 2,
        rows: 2
      }
    }, {
      type: 'table',
      title: 'Table Widget',
      icon: '📋',
      defaultSize: {
        cols: 2,
        rows: 1
      }
    }],
    layout: {
      id: 'edit-mode-layout',
      name: 'Editable Dashboard',
      cols: 4,
      gap: 'md' as const,
      widgets: [{
        id: 'existing-metric',
        title: 'Existing Metric',
        type: 'metric',
        size: {
          cols: 1,
          rows: 1
        },
        position: {
          x: 0,
          y: 0
        },
        data: {
          value: '42',
          label: 'Sample Metric',
          change: -5.2
        },
        editable: true,
        removable: true,
        resizable: true
      }]
    }
  }
}`,...v.parameters?.docs?.source}}};const Ge=["Default","Variants","EditMode"];export{x as Default,v as EditMode,b as Variants,Ge as __namedExportsOrder,Me as default};
