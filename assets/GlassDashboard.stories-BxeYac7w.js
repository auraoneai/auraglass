import{r as d,j as a,c as h}from"./iframe-LB2Lfhgp.js";import{G as F,a as S}from"./GlassGrid-DS2nRzkF.js";import{G as B}from"./GlassCard-Dx6dpAL0.js";import{G as W,I as C}from"./GlassButton-BB_LiVtS.js";import{P as K}from"./GlassAppShell-DCajML5M.js";import{H as R,V as f}from"./GlassStack-GR02H5na.js";import{M as Y}from"./MotionFramer-CR_bXaKW.js";import{G as J}from"./GlassCore-CAbtkiaQ.js";import"./preload-helper-PPVm8Dsz.js";import"./a11y-DBdyTOMI.js";import"./MotionPreferenceContext-CGVERj_F.js";import"./LiquidGlassMaterial-O4aHTI2D.js";import"./LiquidGlassLayerProvider-DEWz-jJN.js";import"./OptimizedGlassCore-Bt3saaFo.js";import"./deviceCapabilities-DKKFd1VE.js";import"./index-DCQcgPGK.js";import"./GlassPredictiveEngine-nHzYrt40.js";import"./GlassAchievementSystem-C7yLUSqC.js";import"./GlassBiometricAdaptation-CUjpLWNp.js";import"./GlassEyeTracking-d4dXQVzJ.js";import"./GlassSpatialAudio-Cjoio7Yg.js";import"./GlassContainer-BLAeZt6w.js";import"./utilsCore-iKIe4RkQ.js";const Q={id:"default",name:"Default Dashboard",widgets:[],cols:4,gap:"md"},u=d.forwardRef(({title:g="Dashboard",description:V,layout:n=Q,availableWidgets:c=[],editMode:t=!1,onEditModeChange:T,onLayoutChange:X,onWidgetAdd:b,onWidgetRemove:O,onWidgetUpdate:j,dragEnabled:p=!0,widgetRenderers:G={},actions:k,loading:E=!1,emptyState:N,className:q,...$},A)=>{const[m,w]=d.useState(null),[Z,z]=d.useState(null),M=d.useCallback(e=>{!t||!p||w(e)},[t,p]),D=d.useCallback(()=>{w(null),z(null)},[]),_=d.useCallback(e=>{!m||!j||(j(m,{position:e}),D())},[m,j,D]),L=d.useCallback(e=>{const s=c.find(i=>i.type===e);if(!s||!b)return;const o=new Set(n.widgets.map(i=>`${i.position.x},${i.position.y}`));let l={x:0,y:0};for(let i=0;i<10;i++){for(let r=0;r<n.cols;r++){const H=`${r},${i}`;if(!o.has(H)){l={x:r,y:i};break}}if(l.x!==0||l.y!==0)break}b({title:s.title,type:s.type,size:s.defaultSize,position:l})},[c,n.widgets,n.cols,b]),P={metric:({widget:e})=>a.jsxs(f,{space:"md",children:[a.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary",children:e.data?.value||"0"}),a.jsx("div",{className:"glass-text-sm glass-text-secondary",children:e.data?.label||"Metric"}),e.data?.change&&a.jsxs("div",{className:h("glass-text-xs font-medium",e.data?.change>0?"text-success":"text-destructive"),children:[e.data?.change>0?"+":"",e.data?.change,"%"]})]}),chart:({widget:e})=>a.jsxs(f,{space:"md",children:[a.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary",children:e.data?.title||"Chart"}),a.jsx("div",{className:"glass-h-32 glass-surface-subtle glass-radius-md glass-flex glass-items-center glass-justify-center",children:a.jsx("span",{className:"glass-text-secondary",children:e.data?.chartType?`${e.data?.chartType} Chart`:"Chart Widget"})})]}),table:({widget:e})=>a.jsxs(f,{space:"md",children:[a.jsx("div",{className:"glass-text-sm glass-font-medium glass-text-primary",children:e.data?.title||"Table"}),a.jsx("div",{className:"glass-auto-gap glass-auto-gap-sm",children:(e.data?.rows||[]).slice(0,3).map((s,o)=>a.jsxs("div",{className:"glass-flex glass-justify-between glass-text-sm",children:[a.jsx("span",{className:"glass-text-primary",children:s.name}),a.jsx("span",{className:"glass-text-secondary",children:s.value})]},o))})]}),text:({widget:e})=>a.jsx("div",{className:"glass-text-sm glass-text-primary",children:e.data?.content||e.data?.title||"Text Widget"})},U=e=>{const s=G?.[e.type]||P?.[e.type]||e.component;return s?a.jsx(s,{widget:e}):a.jsxs("div",{"data-glass-component":!0,className:"glass-h-full glass-flex glass-items-center glass-justify-center glass-text-secondary",children:["Unknown widget type: ",e.type]})},I=()=>!t||(c?.length||0)===0?null:a.jsx("div",{className:"glass-grid glass-grid-cols-2 glass-gap-2 glass-p-2",children:c.map(e=>a.jsx(W,{variant:"ghost",size:"sm",leftIcon:e.icon,onClick:s=>L(e.type),className:"glass-justify-start glass-focus glass-touch-target",children:e.title},e.type))});return E?a.jsx("div",{className:"glass-flex glass-items-center glass-justify-center glass-h-64",children:a.jsx("div",{className:"glass-w-8 glass-h-8 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full glass-animate-spin"})}):(n.widgets?.length||0)===0&&N?N:a.jsxs("div",{ref:A,className:h("w-full glass-auto-gap glass-auto-gap-2xl",q),"data-glass-component":!0,...$,children:[a.jsx(K,{title:g,description:V,actions:a.jsxs(R,{space:"sm",children:[k,(c?.length||0)>0&&a.jsx(W,{variant:t?"primary":"outline",size:"sm",leftIcon:t?"✓":"✏️",onClick:e=>T?.(!t),className:"glass-focus glass-touch-target",children:t?"Done":"Edit"})]})}),t&&(c?.length||0)>0&&a.jsx(Y,{preset:"slideDown",children:a.jsx(J,{className:"glass-p-4 glass-radius-lg",children:a.jsxs(f,{space:"sm",children:[a.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary",children:"Add Widget"}),I()]})})}),a.jsxs(F,{cols:n.cols,gap:n.gap,className:"glass-min-glass-h-96",children:[n.widgets.map(e=>a.jsx(S,{colSpan:e.size.cols,rowSpan:e.size.rows,className:h("transition-all duration-200",m===e.id&&"opacity-50 scale-95",t&&p&&"cursor-move"),draggable:t&&p,onDragStart:()=>M(e.id),onDragEnd:D,children:a.jsxs(B,{variant:"default",className:h("h-full relative group",t&&"hover:ring-2 hover:ring-primary/50"),children:[a.jsxs("div",{className:"glass-flex glass-items-center glass-justify-between glass-mb-4",children:[a.jsx("h3",{className:"glass-text-sm glass-font-medium glass-text-primary glass-truncate",children:e.title}),t&&a.jsxs(R,{space:"xs",className:"glass-opacity-0 glass-group-glass-hover-opacity-100 glass-transition-opacity",children:[e.removable!==!1&&a.jsx(C,{icon:"🗑️",variant:"ghost",size:"xs",onClick:s=>O?.(e.id),"aria-label":"Remove widget",className:"glass-focus glass-touch-target glass-contrast-guard"}),a.jsx(C,{icon:"⚙️",variant:"ghost",size:"xs",onClick:s=>{},"aria-label":"Configure widget",className:"glass-focus glass-touch-target glass-contrast-guard"})]})]}),a.jsx("div",{className:"glass-flex-1",children:U(e)})]})},e.id)),t&&m&&a.jsx(a.Fragment,{children:Array.from({length:n.cols*4},(e,s)=>{const o=s%n.cols,l=Math.floor(s/n.cols);return n.widgets.some(r=>r.position.x===o&&r.position.y===l)?null:a.jsx(S,{colSpan:1,rowSpan:1,className:"glass-min-glass-h-24",style:{gridColumnStart:o+1,gridRowStart:l+1},children:a.jsx("div",{className:"glass-h-full glass-border-2 glass-border-dashed glass-border-primary/30 glass-radius-lg glass-surface-primary/5 glass-flex glass-items-center glass-justify-center glass-transition-colors hover:glass-border-primary/50 hover:glass-surface-primary/10",onDragOver:r=>{r.preventDefault(),z({x:o,y:l})},onDrop:r=>{r.preventDefault(),_({x:o,y:l})},children:a.jsx("span",{className:"glass-text-xs glass-text-primary-glass-opacity-60",children:"Drop here"})})},`drop-zone-${o}-${l}`)})})]})]})});u.displayName="GlassDashboard";try{u.displayName="GlassDashboard",u.__docgenInfo={description:"",displayName:"GlassDashboard",props:{title:{defaultValue:{value:"Dashboard"},description:"Dashboard title",name:"title",required:!1,type:{name:"string | undefined"}},description:{defaultValue:null,description:"Dashboard description",name:"description",required:!1,type:{name:"string | undefined"}},layout:{defaultValue:{value:`{
  id: "default",
  name: "Default Dashboard",
  widgets: [],
  cols: 4,
  gap: "md",
}`},description:"Dashboard layout",name:"layout",required:!1,type:{name:"DashboardLayout | undefined"}},availableWidgets:{defaultValue:{value:"[]"},description:"Available widget types for adding",name:"availableWidgets",required:!1,type:{name:"{ type: string; title: string; icon: ReactNode; defaultSize: { cols: 3 | 1 | 12 | 2 | 4 | 6; rows: 3 | 1 | 2 | 4; }; }[] | undefined"}},editMode:{defaultValue:{value:"false"},description:"Whether dashboard is in edit mode",name:"editMode",required:!1,type:{name:"boolean | undefined"}},onEditModeChange:{defaultValue:null,description:"Edit mode change handler",name:"onEditModeChange",required:!1,type:{name:"((editMode: boolean) => void) | undefined"}},onLayoutChange:{defaultValue:null,description:"Layout change handler",name:"onLayoutChange",required:!1,type:{name:"((layout: DashboardLayout) => void) | undefined"}},onWidgetAdd:{defaultValue:null,description:"Widget add handler",name:"onWidgetAdd",required:!1,type:{name:"((widget: Partial<DashboardWidget>) => void) | undefined"}},onWidgetRemove:{defaultValue:null,description:"Widget remove handler",name:"onWidgetRemove",required:!1,type:{name:"((widgetId: string) => void) | undefined"}},onWidgetUpdate:{defaultValue:null,description:"Widget update handler",name:"onWidgetUpdate",required:!1,type:{name:"((widgetId: string, updates: Partial<DashboardWidget>) => void) | undefined"}},dragEnabled:{defaultValue:{value:"true"},description:"Drag and drop enabled",name:"dragEnabled",required:!1,type:{name:"boolean | undefined"}},widgetRenderers:{defaultValue:{value:"{}"},description:"Custom widget renderers",name:"widgetRenderers",required:!1,type:{name:"Record<string, ComponentType<DashboardWidgetRendererProps>> | undefined"}},actions:{defaultValue:null,description:"Dashboard actions",name:"actions",required:!1,type:{name:"ReactNode"}},loading:{defaultValue:{value:"false"},description:"Loading state",name:"loading",required:!1,type:{name:"boolean | undefined"}},emptyState:{defaultValue:null,description:"Empty state component",name:"emptyState",required:!1,type:{name:"ReactNode"}}}}}catch{}const Ne={title:"Workflows/Glass Dashboard",component:u,parameters:{layout:"centered",docs:{description:{component:"A glass morphism glassdashboard component."}}},argTypes:{className:{control:"text",description:"className prop"}},args:{className:""}},y={args:{layout:{id:"default-layout",name:"Default Dashboard",cols:4,gap:"md",widgets:[{id:"metric-1",title:"Total Users",type:"metric",size:{cols:1,rows:1},position:{x:0,y:0},data:{value:"1,234",label:"Active Users",change:12.5}},{id:"metric-2",title:"Revenue",type:"metric",size:{cols:1,rows:1},position:{x:1,y:0},data:{value:"$45,678",label:"Monthly Revenue",change:8.2}},{id:"chart-1",title:"Sales Chart",type:"chart",size:{cols:2,rows:2},position:{x:2,y:0},data:{title:"Sales Over Time",chartType:"line"}},{id:"table-1",title:"Recent Orders",type:"table",size:{cols:2,rows:1},position:{x:0,y:1},data:{title:"Latest Orders",rows:[{name:"Order #1234",value:"$299.00"},{name:"Order #1235",value:"$149.50"},{name:"Order #1236",value:"$599.00"}]}},{id:"text-1",title:"Welcome Message",type:"text",size:{cols:2,rows:1},position:{x:2,y:2},data:{content:"Welcome to your dashboard! Here you can monitor your key metrics and performance indicators."}}]}}},x={render:g=>a.jsx("div",{className:"glass-w-full glass-h-screen",children:a.jsx(u,{...g})}),args:{layout:{id:"variant-layout",name:"Variant Dashboard",cols:3,gap:"lg",widgets:[{id:"metric-variant-1",title:"Performance",type:"metric",size:{cols:1,rows:1},position:{x:0,y:0},data:{value:"98.5%",label:"System Uptime",change:2.1}},{id:"chart-variant-1",title:"Traffic Analytics",type:"chart",size:{cols:2,rows:2},position:{x:1,y:0},data:{title:"Website Traffic",chartType:"bar"}}]}}},v={args:{editMode:!0,availableWidgets:[{type:"metric",title:"Metric Widget",icon:"📊",defaultSize:{cols:1,rows:1}},{type:"chart",title:"Chart Widget",icon:"📈",defaultSize:{cols:2,rows:2}},{type:"table",title:"Table Widget",icon:"📋",defaultSize:{cols:2,rows:1}}],layout:{id:"edit-mode-layout",name:"Editable Dashboard",cols:4,gap:"md",widgets:[{id:"existing-metric",title:"Existing Metric",type:"metric",size:{cols:1,rows:1},position:{x:0,y:0},data:{value:"42",label:"Sample Metric",change:-5.2},editable:!0,removable:!0,resizable:!0}]}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}};const we=["Default","Variants","EditMode"];export{y as Default,v as EditMode,x as Variants,we as __namedExportsOrder,Ne as default};
