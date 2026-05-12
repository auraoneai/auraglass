import{j as s}from"./iframe-ChjdpTMc.js";import{T as a,u as y}from"./GlassToast-D0-xzZM_.js";import"./preload-helper-PPVm8Dsz.js";import"./GlassCore-CbIQyGSU.js";const D={title:"Reference/Legacy Components/Glass Toast",component:a,parameters:{layout:"fullscreen",docs:{description:{component:"A comprehensive toast notification system with multiple types, auto-dismiss, and customizable positioning."}}}},o=({position:h="top-right"})=>{const{success:l,error:r,warning:t,info:e}=y(),p=()=>{l("Success!","Your action has been completed successfully.")},x=()=>{r("Error occurred","Something went wrong. Please try again later.")},f=()=>{t("Warning","This action may have unexpected consequences.")},b=()=>{e("Information","Here's some helpful information for you.")},v=()=>{l("File uploaded","Your file has been uploaded successfully.",{action:{label:"View file",onClick:()=>alert("Opening file viewer...")},duration:8e3})},j=()=>{r("Connection lost","Unable to connect to the server. Please check your internet connection.",{duration:0,dismissible:!0})},w=()=>{t("System maintenance","The system will be under maintenance in 5 minutes.",{dismissible:!1,duration:1e4})},T=()=>{l("First notification","This is the first notification."),setTimeout(()=>e("Second notification","This is the second notification."),500),setTimeout(()=>t("Third notification","This is the third notification."),1e3),setTimeout(()=>r("Fourth notification","This is the fourth notification."),1500)};return s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-secondary glass-mb-4",children:"Toast Notification System"}),s.jsx("p",{className:"glass-text-xl glass-text-secondary mb-8",children:"Click the buttons below to see different types of toast notifications"}),s.jsxs("p",{className:"glass-text-sm glass-text-secondary",children:["Position: ",h," • Max 5 toasts • Auto-dismiss after 5 seconds"]})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-4 glass-gap-4 mb-8",children:[s.jsx("button",{onClick:p,className:"glass-surface-green hover:glass-surface-green glass-text-primary glass-font-semibold glass-py-3 glass-px-6 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"✅ Success Toast"}),s.jsx("button",{onClick:x,className:"glass-surface-red hover:glass-surface-red glass-text-primary glass-font-semibold glass-py-3 glass-px-6 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"❌ Error Toast"}),s.jsx("button",{onClick:f,className:"glass-surface-yellow hover:glass-surface-yellow glass-text-primary glass-font-semibold glass-py-3 glass-px-6 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"⚠️ Warning Toast"}),s.jsx("button",{onClick:b,className:"glass-surface-blue hover:glass-surface-blue glass-text-primary glass-font-semibold glass-py-3 glass-px-6 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"ℹ️ Info Toast"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-4 mb-8",children:[s.jsx("button",{onClick:v,className:"glass-surface-primary hover:glass-surface-primary glass-text-primary glass-font-semibold glass-py-3 glass-px-6 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"🔗 Toast with Action"}),s.jsx("button",{onClick:j,className:"glass-surface-primary hover:glass-surface-subtle glass-text-primary glass-font-semibold glass-py-3 glass-px-6 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"📌 Persistent Toast"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-4",children:[s.jsx("button",{onClick:w,className:"glass-surface-primary hover:glass-surface-primary glass-text-primary glass-font-semibold glass-py-3 glass-px-6 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"🚫 Non-Dismissible Toast"}),s.jsx("button",{onClick:T,className:"bg-indigo-500 hover:bg-indigo-600 glass-text-primary glass-font-semibold glass-py-3 glass-px-6 glass-radius-lg transition-colors glass-shadow-lg hover:glass-shadow-xl glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"📚 Multiple Toasts"})]}),s.jsxs("div",{className:"mt-12 glass-surface-subtle glass-radius-xl glass-p-6 glass-shadow-lg",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Features:"}),s.jsxs("ul",{className:"glass-text-secondary glass-space-y-2",children:[s.jsxs("li",{children:["✅ ",s.jsx("strong",{children:"Multiple Types:"})," Success, Error, Warning, Info"]}),s.jsxs("li",{children:["✅ ",s.jsx("strong",{children:"Auto-dismiss:"})," Configurable duration with progress bar"]}),s.jsxs("li",{children:["✅ ",s.jsx("strong",{children:"Actions:"})," Add interactive buttons to toasts"]}),s.jsxs("li",{children:["✅ ",s.jsx("strong",{children:"Positioning:"})," 6 different positions available"]}),s.jsxs("li",{children:["✅ ",s.jsx("strong",{children:"Persistent:"})," Toasts that stay until manually dismissed"]}),s.jsxs("li",{children:["✅ ",s.jsx("strong",{children:"Non-dismissible:"})," Critical notifications users must see"]}),s.jsxs("li",{children:["✅ ",s.jsx("strong",{children:"Queue Management:"})," Maximum toast limit with automatic cleanup"]}),s.jsxs("li",{children:["✅ ",s.jsx("strong",{children:"Smooth Animations:"})," Enter/exit animations with stagger effect"]})]})]})]})})},i={render:()=>s.jsx(a,{position:"top-right",children:s.jsx(o,{position:"top-right"})})},n={render:()=>s.jsx(a,{position:"top-left",children:s.jsx(o,{position:"top-left"})})},g={render:()=>s.jsx(a,{position:"bottom-right",children:s.jsx(o,{position:"bottom-right"})})},c={render:()=>s.jsx(a,{position:"bottom-left",children:s.jsx(o,{position:"bottom-left"})})},d={render:()=>s.jsx(a,{position:"top-center",children:s.jsx(o,{position:"top-center"})})},u={render:()=>s.jsx(a,{position:"bottom-center",children:s.jsx(o,{position:"bottom-center"})})},m={render:()=>{const h=()=>{const{success:l,error:r,warning:t,info:e}=y(),p=()=>{l("Document saved","Your changes have been saved successfully.",{action:{label:"View",onClick:()=>e("Opening document...","Redirecting to document view.")}})},x=()=>{r("Delete failed","Unable to delete the item. It may be in use by another process.",{action:{label:"Retry",onClick:()=>t("Retrying...","Attempting to delete again.")}})},f=()=>{e("Upload started","Your file is being uploaded..."),setTimeout(()=>{l("Upload complete","File uploaded successfully to the server.",{action:{label:"Share",onClick:()=>e("Share link copied","The share link has been copied to your clipboard.")}})},3e3)},b=()=>{t("Scheduled maintenance","System will be unavailable for maintenance from 2:00 AM to 4:00 AM EST.",{duration:1e4,action:{label:"Learn more",onClick:()=>e("Maintenance details","This maintenance will improve system performance and security.")}})};return s.jsx("div",{className:"glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-p-8",children:s.jsxs("div",{className:"max-w-4xl glass-mx-auto",children:[s.jsxs("div",{className:"glass-text-center mb-12",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-secondary glass-mb-4",children:"Real-World Toast Examples"}),s.jsx("p",{className:"glass-text-xl glass-text-secondary",children:"Common scenarios where toast notifications provide great user feedback"})]}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{className:"glass-surface-subtle glass-p-6 glass-radius-xl glass-shadow-lg",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Document Management"}),s.jsx("button",{onClick:p,className:"glass-w-full glass-surface-green hover:glass-surface-green glass-text-primary glass-font-medium glass-py-2 glass-px-4 glass-radius-lg transition-colors glass-mb-3 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"Save Document"}),s.jsx("button",{onClick:x,className:"glass-w-full glass-surface-red hover:glass-surface-red glass-text-primary glass-font-medium glass-py-2 glass-px-4 glass-radius-lg transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"Delete Document"})]}),s.jsxs("div",{className:"glass-surface-subtle glass-p-6 glass-radius-xl glass-shadow-lg",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"File Operations"}),s.jsx("button",{onClick:f,className:"glass-w-full glass-surface-blue hover:glass-surface-blue glass-text-primary glass-font-medium glass-py-2 glass-px-4 glass-radius-lg transition-colors glass-mb-3 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"Upload File"}),s.jsx("button",{onClick:b,className:"glass-w-full glass-surface-yellow hover:glass-surface-yellow glass-text-primary glass-font-medium glass-py-2 glass-px-4 glass-radius-lg transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",children:"System Announcement"})]})]}),s.jsxs("div",{className:"mt-12 glass-surface-subtle glass-radius-xl glass-p-6 glass-shadow-lg",children:[s.jsx("h3",{className:"glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4",children:"Best Practices:"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary glass-mb-2",children:"Success Toasts"}),s.jsxs("ul",{className:"glass-text-sm glass-text-secondary space-y-1",children:[s.jsx("li",{children:"• Use for completed actions"}),s.jsx("li",{children:"• Include relevant action buttons"}),s.jsx("li",{children:"• Keep messages concise and positive"})]})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-font-medium glass-text-secondary glass-mb-2",children:"Error Toasts"}),s.jsxs("ul",{className:"glass-text-sm glass-text-secondary space-y-1",children:[s.jsx("li",{children:"• Explain what went wrong"}),s.jsx("li",{children:"• Suggest next steps or solutions"}),s.jsx("li",{children:"• Provide retry or help actions"})]})]})]})]})]})})};return s.jsx(a,{position:"top-right",maxToasts:3,children:s.jsx(h,{})})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <ToastProvider position="top-right">
      <ToastDemo position="top-right" />
    </ToastProvider>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <ToastProvider position="top-left">
      <ToastDemo position="top-left" />
    </ToastProvider>
}`,...n.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <ToastProvider position="bottom-right">
      <ToastDemo position="bottom-right" />
    </ToastProvider>
}`,...g.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <ToastProvider position="bottom-left">
      <ToastDemo position="bottom-left" />
    </ToastProvider>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <ToastProvider position="top-center">
      <ToastDemo position="top-center" />
    </ToastProvider>
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <ToastProvider position="bottom-center">
      <ToastDemo position="bottom-center" />
    </ToastProvider>
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const RealWorldDemo = () => {
      const {
        success,
        error,
        warning,
        info
      } = useToastHelpers();
      const handleSave = () => {
        success('Document saved', 'Your changes have been saved successfully.', {
          action: {
            label: 'View',
            onClick: () => info('Opening document...', 'Redirecting to document view.')
          }
        });
      };
      const handleDelete = () => {
        error('Delete failed', 'Unable to delete the item. It may be in use by another process.', {
          action: {
            label: 'Retry',
            onClick: () => warning('Retrying...', 'Attempting to delete again.')
          }
        });
      };
      const handleUpload = () => {
        info('Upload started', 'Your file is being uploaded...');
        setTimeout(() => {
          success('Upload complete', 'File uploaded successfully to the server.', {
            action: {
              label: 'Share',
              onClick: () => info('Share link copied', 'The share link has been copied to your clipboard.')
            }
          });
        }, 3000);
      };
      const handleMaintenance = () => {
        warning('Scheduled maintenance', 'System will be unavailable for maintenance from 2:00 AM to 4:00 AM EST.', {
          duration: 10000,
          action: {
            label: 'Learn more',
            onClick: () => info('Maintenance details', 'This maintenance will improve system performance and security.')
          }
        });
      };
      return <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-p-8">
          <div className="max-w-4xl glass-mx-auto">
            <div className="glass-text-center mb-12">
              <h1 className="glass-text-4xl glass-font-bold glass-text-secondary glass-mb-4">Real-World Toast Examples</h1>
              <p className="glass-text-xl glass-text-secondary">
                Common scenarios where toast notifications provide great user feedback
              </p>
            </div>

            <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6">
              <div className="glass-surface-subtle glass-p-6 glass-radius-xl glass-shadow-lg">
                <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">Document Management</h3>
                <button onClick={handleSave} className="glass-w-full glass-surface-green hover:glass-surface-green glass-text-primary glass-font-medium glass-py-2 glass-px-4 glass-radius-lg transition-colors glass-mb-3 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard">
                  Save Document
                </button>
                <button onClick={handleDelete} className="glass-w-full glass-surface-red hover:glass-surface-red glass-text-primary glass-font-medium glass-py-2 glass-px-4 glass-radius-lg transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard">
                  Delete Document
                </button>
              </div>

              <div className="glass-surface-subtle glass-p-6 glass-radius-xl glass-shadow-lg">
                <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">File Operations</h3>
                <button onClick={handleUpload} className="glass-w-full glass-surface-blue hover:glass-surface-blue glass-text-primary glass-font-medium glass-py-2 glass-px-4 glass-radius-lg transition-colors glass-mb-3 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard">
                  Upload File
                </button>
                <button onClick={handleMaintenance} className="glass-w-full glass-surface-yellow hover:glass-surface-yellow glass-text-primary glass-font-medium glass-py-2 glass-px-4 glass-radius-lg transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard">
                  System Announcement
                </button>
              </div>
            </div>

            <div className="mt-12 glass-surface-subtle glass-radius-xl glass-p-6 glass-shadow-lg">
              <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">Best Practices:</h3>
              <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6">
                <div>
                  <h4 className="glass-font-medium glass-text-secondary glass-mb-2">Success Toasts</h4>
                  <ul className="glass-text-sm glass-text-secondary space-y-1">
                    <li>• Use for completed actions</li>
                    <li>• Include relevant action buttons</li>
                    <li>• Keep messages concise and positive</li>
                  </ul>
                </div>
                <div>
                  <h4 className="glass-font-medium glass-text-secondary glass-mb-2">Error Toasts</h4>
                  <ul className="glass-text-sm glass-text-secondary space-y-1">
                    <li>• Explain what went wrong</li>
                    <li>• Suggest next steps or solutions</li>
                    <li>• Provide retry or help actions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>;
    };
    return <ToastProvider position="top-right" maxToasts={3}>
        <RealWorldDemo />
      </ToastProvider>;
  }
}`,...m.parameters?.docs?.source}}};const P=["TopRight","TopLeft","BottomRight","BottomLeft","TopCenter","BottomCenter","RealWorldExample"];export{u as BottomCenter,c as BottomLeft,g as BottomRight,m as RealWorldExample,d as TopCenter,n as TopLeft,i as TopRight,P as __namedExportsOrder,D as default};
