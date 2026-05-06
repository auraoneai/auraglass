import{j as s,r as h}from"./iframe-BEVTBSqr.js";import{G as i,u as c,a as N,b as j,c as D}from"./GlassAchievementSystem-DvDrrRIP.js";import"./preload-helper-PPVm8Dsz.js";import"./OptimizedGlassCore-BMFMzxVt.js";const R={title:"Advanced/Consciousness Interface/Achievement System",component:i,parameters:{layout:"fullscreen",docs:{description:{component:`
# Glass Achievement System

Gamified user engagement with progressive rewards and glass-themed achievements.

## Features
- **Progressive XP System** - Earn experience points and level up through interactions
- **15+ Glass Achievements** - Themed achievements for different interaction patterns
- **Achievement Categories** - Interaction, exploration, mastery, social, creative, performance
- **Real-time Notifications** - Beautiful notifications with celebration effects
- **Achievement Dashboard** - Track progress, stats, and unlocked achievements
- **Behavioral Analytics** - Track streaks, session data, and user patterns

## Achievement Categories
- **Interaction** - Basic clicking, hovering, and component usage
- **Exploration** - Discovering new components and features
- **Mastery** - Advanced usage patterns and skill development
- **Performance** - Speed-based and efficiency achievements
- **Social** - Collaborative features and sharing
- **Creative** - Customization and personalization achievements

## Achievement Rarities
- **Common** (Gray) - Easy to earn, basic interactions (10-50 XP)
- **Rare** (Blue) - Moderate difficulty, sustained usage (50-100 XP)
- **Epic** (Purple) - Challenging requirements, skill-based (100-200 XP)
- **Legendary** (Gold) - Extremely difficult, long-term commitment (200-500 XP)

## Gamification Elements
- **XP and Levels** - Exponential progression curve with meaningful milestones
- **Achievement Notifications** - Celebration animations and visual feedback
- **Progress Tracking** - Visual progress bars and completion percentages
- **Statistics Dashboard** - Detailed analytics and performance metrics
- **Streak System** - Daily engagement rewards and consistency tracking

## Example Achievements
- **Glass Toucher** - First interaction (Common, 10 XP)
- **Glass Enthusiast** - 100 clicks (Rare, 50 XP)
- **Ethereal Navigator** - 500 hover interactions (Epic, 100 XP)
- **Glass Virtuoso** - Perfect 20-action combo (Legendary, 300 XP)
- **Consistency Crystal** - 30-day streak (Legendary, 500 XP)

## Privacy & Data
- **Local Storage** - All achievement data stored locally in browser
- **No Tracking** - No external analytics or data transmission
- **User Control** - Users can reset or disable achievement tracking
        `}}},argTypes:{userId:{control:"text",description:"Unique identifier for the user"}},tags:["autodocs"]};function E(){const{progress:a,notifications:t}=D(),{trackClick:l,trackHover:r,trackCustomization:n,recordAction:m}=c(),[b,P]=h.useState(!0),[k,S]=h.useState(!0),[G,M]=h.useState(0),[A,C]=h.useState(0),g=(e,o)=>{switch(M(d=>d+1),e){case"click":l(o),C(d=>d+1);break;case"hover":r(o);break;case"customize":n("theme",Math.random().toString());break;case"special":m("special_action",{component:o,timestamp:Date.now()});break}setTimeout(()=>{C(d=>Math.max(0,d-1))},1e3)},T=a?.achievements.filter(e=>e.unlocked).length||0,X=a?.achievements.length||0,w=t.slice(-3);return s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h1",{className:"glass-text-4xl glass-font-bold glass-text-primary",children:"🎮 Glass Achievement System"}),s.jsx("p",{className:"glass-text-lg glass-text-secondary",children:"Gamified engagement with progressive rewards and achievements"}),s.jsxs("div",{className:"glass-flex glass-justify-center glass-items-center space-x-6",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("span",{className:"glass-text-lg",children:"⭐"}),s.jsxs("span",{className:"glass-text-sm glass-text-primary",children:["Level ",a?.level||1]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("span",{className:"glass-text-lg",children:"✨"}),s.jsxs("span",{className:"glass-text-sm glass-text-primary",children:[a?.totalXP||0," XP"]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("span",{className:"glass-text-lg",children:"🏆"}),s.jsxs("span",{className:"glass-text-sm glass-text-primary",children:[T,"/",X," Achievements"]})]}),s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2 glass-surface-secondary glass-radius-full glass-px-4 glass-py-2",children:[s.jsx("span",{className:"glass-text-lg",children:"🔥"}),s.jsxs("span",{className:"glass-text-sm glass-text-primary",children:[a?.streak||0," Day Streak"]})]})]}),a&&s.jsxs("div",{className:"max-w-md glass-mx-auto glass-gap-2",children:[s.jsx("div",{className:"glass-surface-secondary glass-radius-lg glass-h-3 overflow-hidden",children:s.jsx("div",{className:"glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary transition-all duration-500",style:{width:`${a.currentXP/a.xpToNextLevel*100}%`}})}),s.jsxs("div",{className:"glass-flex glass-justify-between glass-text-xs glass-text-tertiary",children:[s.jsxs("span",{children:[a.currentXP," XP"]}),s.jsxs("span",{children:[a.xpToNextLevel," XP to Level ",a.level+1]})]})]}),s.jsxs("div",{className:"glass-flex glass-justify-center glass-gap-4",children:[s.jsx("button",{onClick:()=>P(!b),className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-px-4 glass-py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",children:b?"📊 Hide Dashboard":"📊 Show Dashboard"}),s.jsx("button",{onClick:()=>S(!k),className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-px-4 glass-py-2 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",children:k?"🔔 Hide Notifications":"🔔 Show Notifications"})]})]}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-2",children:"🎯 Achievement Triggers"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Interact with elements below to unlock achievements"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-6",children:[{id:"tap-button",icon:"🫳",label:"Glass Tap",description:"Click to earn interaction XP"},{id:"hover-zone",icon:"👻",label:"Hover Zone",description:"Hover to build ethereal skills"},{id:"combo-trigger",icon:"🎭",label:"Combo Trigger",description:"Click rapidly for combos"},{id:"custom-element",icon:"🎨",label:"Customizer",description:"Unlock creative achievements"},{id:"explore-card",icon:"🔍",label:"Explorer",description:"Discover new components"},{id:"master-element",icon:"⚡",label:"Mastery",description:"Advanced interactions"},{id:"social-button",icon:"🤝",label:"Social Hub",description:"Collaborative features"},{id:"special-action",icon:"🌟",label:"Special",description:"Hidden achievements"}].map(e=>s.jsxs("button",{className:`glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center glass-gap-4 
                        hover:glass-elev-3 transition-all duration-300 glass-cursor-pointer group glass-focus glass-touch-target glass-contrast-guard`,onClick:()=>g("click",e.id),onMouseEnter:()=>g("hover",e.id),onDoubleClick:()=>g("special",e.id),children:[s.jsx("div",{className:"glass-text-3xl group-hover:scale-110 transition-transform duration-300",children:e.icon}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary",children:e.label}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:e.description}),s.jsx("div",{className:"glass-text-xs glass-text-tertiary",children:e.id==="combo-trigger"?`Combo: ${A}`:"Click to interact"})]},e.id))}),s.jsxs("div",{className:"glass-text-center glass-gap-4",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary",children:"🎨 Special Actions"}),s.jsxs("div",{className:"glass-flex glass-justify-center glass-gap-4",children:[s.jsx("button",{onClick:()=>g("customize"),className:"glass-surface-secondary glass-elev-2 glass-radius-lg glass-px-6 glass-py-3 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",children:"🎨 Customize Theme"}),s.jsx("button",{onClick:()=>m("collaborate",{users:["demo-user"]}),className:"glass-surface-secondary glass-elev-2 glass-radius-lg glass-px-6 glass-py-3 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",children:"🤝 Collaborate"}),s.jsx("button",{onClick:()=>{for(let e=0;e<5;e++)setTimeout(()=>g("click","combo-sequence"),e*100)},className:"glass-surface-secondary glass-elev-2 glass-radius-lg glass-px-6 glass-py-3 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",children:"⚡ Trigger Combo"})]})]})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:"📈 Session Statistics"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4",children:[s.jsxs("div",{className:"glass-text-center glass-surface-secondary glass-radius-md glass-p-4",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary",children:G}),s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:"Actions"})]}),s.jsxs("div",{className:"glass-text-center glass-surface-secondary glass-radius-md glass-p-4",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary",children:a?.stats.totalInteractions||0}),s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:"Total Interactions"})]}),s.jsxs("div",{className:"glass-text-center glass-surface-secondary glass-radius-md glass-p-4",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary",children:a?.stats.componentsExplored.length||0}),s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:"Components"})]}),s.jsxs("div",{className:"glass-text-center glass-surface-secondary glass-radius-md glass-p-4",children:[s.jsx("div",{className:"glass-text-2xl glass-font-bold glass-text-primary",children:Math.max(A,a?.stats.highestStreak||0)}),s.jsx("div",{className:"glass-text-sm glass-text-secondary",children:"Best Combo"})]})]})]}),w.length>0&&s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:"🔔 Recent Achievements"}),s.jsx("div",{className:"glass-gap-3",children:w.map((e,o)=>s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-4 glass-surface-secondary glass-radius-md glass-p-3",children:[s.jsx("div",{className:"glass-text-2xl",children:e.achievement.icon}),s.jsxs("div",{className:"glass-flex-1",children:[s.jsxs("div",{className:"glass-flex glass-items-center glass-gap-2",children:[s.jsx("span",{className:"glass-text-sm glass-font-medium glass-text-primary",children:e.achievement.title}),s.jsx("span",{className:`glass-px-2 glass-py-1 glass-text-xs glass-radius-full capitalize
                      ${e.achievement.rarity==="common"?"bg-gray-600 glass-text-secondary":e.achievement.rarity==="rare"?"bg-blue-600 text-blue-200":e.achievement.rarity==="epic"?"bg-purple-600 text-purple-200":"bg-amber-500 text-amber-100"}`,children:e.achievement.rarity})]}),s.jsxs("div",{className:"glass-text-xs glass-text-secondary",children:["+",e.achievement.xp," XP • ",new Date(e.timestamp).toLocaleTimeString()]})]})]},`recent-${o}`))})]}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-xl glass-font-medium glass-text-primary glass-mb-4",children:"📚 Achievement Guide"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6",children:[s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Quick Achievements"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• Click any element (Glass Toucher)"}),s.jsx("li",{children:"• Hover over elements (Ethereal Navigator)"}),s.jsx("li",{children:"• Customize themes (Glass Artisan)"}),s.jsx("li",{children:"• Explore different components"})]})]}),s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Advanced Achievements"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• Build combo streaks (Glass Virtuoso)"}),s.jsx("li",{children:"• Use components for extended time"}),s.jsx("li",{children:"• Collaborate with other users"}),s.jsx("li",{children:"• Maintain daily streaks"})]})]}),s.jsxs("div",{className:"glass-gap-3",children:[s.jsx("h4",{className:"glass-text-lg glass-font-medium glass-text-primary",children:"Hidden Achievements"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("li",{children:"• Double-click elements (Secret Keeper)"}),s.jsx("li",{children:"• Use components at night (Night Owl)"}),s.jsx("li",{children:"• Rapid interaction patterns"}),s.jsx("li",{children:"• Discover easter eggs"})]})]})]})]}),s.jsx(N,{show:b}),k&&s.jsx(j,{position:"top-right"})]})}const x={render:a=>s.jsx(i,{...a,children:s.jsx(E,{})}),args:{userId:"storybook-demo-user"}},u={render:a=>s.jsxs(i,{...a,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Casual Achievement Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Relaxed progression with standard XP rates and 3-second notifications"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4",children:["Action 1","Action 2","Action 3","Action 4"].map((t,l)=>{const{trackClick:r}=c();return s.jsxs("button",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",onClick:()=>r(`casual-action-${l}`),children:[s.jsx("div",{className:"glass-text-2xl glass-mb-2",children:"🎮"}),s.jsx("div",{className:"glass-text-sm glass-text-primary",children:t}),s.jsx("div",{className:"glass-text-xs glass-text-secondary",children:"Casual XP"})]},t)})}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6 glass-text-center",children:[s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary glass-mb-2",children:"Casual Settings"}),s.jsxs("div",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("div",{children:"• Normal XP rates (1x multiplier)"}),s.jsx("div",{children:"• Standard notification duration (3 seconds)"}),s.jsx("div",{children:"• Progress tracking enabled"}),s.jsx("div",{children:"• All achievements visible"})]})]})]}),s.jsx(N,{show:!0}),s.jsx(j,{position:"top-right"})]}),args:{userId:"casual-user"},parameters:{docs:{description:{story:"Casual mode with standard progression and relaxed achievement unlocking."}}}},v={render:a=>s.jsxs(i,{...a,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Hardcore Achievement Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Challenging progression with reduced XP rates and hidden achievements"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6",children:["Elite Challenge","Master Quest","Legendary Trial"].map((t,l)=>{const{trackClick:r,recordAction:n}=c();return s.jsxs("button",{className:`glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 glass-text-center hover:glass-elev-3 transition-all duration-300
                         glass-border-2 glass-border-red/30 hover:glass-border-red/50 glass-focus glass-touch-target glass-contrast-guard`,onClick:()=>{r(`hardcore-challenge-${l}`),n("hardcore_action",{challenge:t,difficulty:"extreme"})},children:[s.jsx("div",{className:"glass-text-3xl glass-mb-4",children:"⚔️"}),s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary glass-mb-2",children:t}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"High difficulty challenge with reduced XP rewards"}),s.jsx("div",{className:"glass-text-xs glass-text-tertiary glass-mt-2",children:"XP Multiplier: 0.5x"})]},t)})}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6",children:[s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary glass-mb-4",children:"Hardcore Features"}),s.jsxs("div",{className:"glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-4",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Challenges"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-xs glass-text-secondary",children:[s.jsx("li",{children:"• 50% reduced XP gain"}),s.jsx("li",{children:"• Hidden achievement requirements"}),s.jsx("li",{children:"• Longer notification duration (5 seconds)"}),s.jsx("li",{children:"• Progress tracking with detailed analytics"})]})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"glass-text-sm glass-font-medium glass-text-primary glass-mb-2",children:"Rewards"}),s.jsxs("ul",{className:"glass-gap-1 glass-text-xs glass-text-secondary",children:[s.jsx("li",{children:"• Exclusive hardcore achievements"}),s.jsx("li",{children:"• Special visual effects"}),s.jsx("li",{children:"• Enhanced progression tracking"}),s.jsx("li",{children:"• Elite status indicators"})]})]})]})]})]}),s.jsx(N,{show:!0}),s.jsx(j,{position:"top-right"})]}),args:{userId:"hardcore-user"},parameters:{docs:{description:{story:"Hardcore mode with challenging progression and hidden achievements."}}}},p={render:a=>s.jsx(i,{...a,children:s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Minimal Achievement Mode"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Quiet mode with minimal notifications and hidden progress tracking"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-3 glass-gap-6",children:["Simple Action","Quiet Task","Minimal Interaction","Basic Function","Clean Action","Pure Task"].map((t,l)=>{const{trackClick:r}=c();return s.jsxs("button",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4 glass-text-center hover:glass-elev-2 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",onClick:()=>r(`minimal-${l}`),children:[s.jsx("div",{className:"glass-text-lg glass-mb-2",children:"⚪"}),s.jsx("div",{className:"glass-text-sm glass-text-primary",children:t})]},t)})}),s.jsxs("div",{className:"glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6 glass-text-center",children:[s.jsx("h3",{className:"glass-text-lg glass-font-medium glass-text-primary glass-mb-2",children:"Minimal Settings"}),s.jsxs("div",{className:"glass-gap-1 glass-text-sm glass-text-secondary",children:[s.jsx("div",{children:"• Quiet mode notifications (2 seconds)"}),s.jsx("div",{children:"• Progress tracking hidden"}),s.jsx("div",{children:"• Minimal visual feedback"}),s.jsx("div",{children:"• Background achievement tracking"})]})]})]})}),args:{userId:"minimal-user"},parameters:{docs:{description:{story:"Minimal mode with quiet notifications and hidden progress for distraction-free usage."}}}},y={render:a=>s.jsxs(i,{...a,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8 space-y-8",children:[s.jsxs("div",{className:"glass-text-center",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary glass-mb-4",children:"Achievement Notifications Demo"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary mb-6",children:"Trigger actions to see achievement notifications"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-3 md:glass-glass-grid-cols-6 glass-gap-4",children:Array.from({length:12},(t,l)=>{const{trackClick:r,trackHover:n,recordAction:m}=c();return s.jsx("button",{className:`aspect-square glass-surface-primary glass-elev-2 glass-radius-lg 
                         hover:glass-elev-3 transition-all duration-300 glass-flex glass-items-center glass-justify-center glass-focus glass-touch-target glass-contrast-guard`,onClick:()=>{r(`notification-trigger-${l}`),l%3===0&&m("special_trigger",{index:l})},onMouseEnter:()=>n(`notification-hover-${l}`),children:s.jsx("div",{className:"glass-text-xl",children:l%4===0?"🎯":l%4===1?"🌟":l%4===2?"💎":"🏆"})},l)})}),s.jsx("div",{className:"glass-text-center glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4",children:s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Click and hover over the buttons above to trigger achievement notifications in the top-right corner"})})]}),s.jsx(j,{position:"top-right"})]}),args:{userId:"notification-demo-user"},parameters:{docs:{description:{story:"Shows achievement notifications triggered by user interactions."}}}},f={render:a=>s.jsxs(i,{...a,children:[s.jsxs("div",{className:"glass-min-glass-h-screen glass-p-8",children:[s.jsxs("div",{className:"glass-text-center glass-gap-4 mb-8",children:[s.jsx("h2",{className:"glass-text-2xl glass-font-bold glass-text-primary",children:"Achievement Dashboard"}),s.jsx("p",{className:"glass-text-sm glass-text-secondary",children:"Track your progress, achievements, and statistics"})]}),s.jsx("div",{className:"glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4 mb-8",children:Array.from({length:16},(t,l)=>{const{trackClick:r}=c();return s.jsx("button",{className:"glass-surface-primary glass-elev-2 glass-radius-lg glass-p-3 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard",onClick:()=>r(`dashboard-test-${l}`),children:s.jsxs("div",{className:"glass-text-sm glass-text-primary",children:["Test ",l+1]})},l)})})]}),s.jsx(N,{show:!0})]}),args:{userId:"dashboard-demo-user"},parameters:{docs:{description:{story:"Shows the achievement dashboard with interactive elements for testing progress tracking."}}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <GlassAchievementProvider {...args}>
      <AchievementSystemDemo />
    </GlassAchievementProvider>,
  args: {
    userId: 'storybook-demo-user'
  }
}`,...x.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <GlassAchievementProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Casual Achievement Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Relaxed progression with standard XP rates and 3-second notifications
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4">
          {['Action 1', 'Action 2', 'Action 3', 'Action 4'].map((action, i) => {
          const {
            trackClick
          } = useAchievementTracker();
          return <button key={action} className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-6 glass-text-center hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard" onClick={() => trackClick(\`casual-action-\${i}\`)}>
                <div className="glass-text-2xl glass-mb-2">🎮</div>
                <div className="glass-text-sm glass-text-primary">{action}</div>
                <div className="glass-text-xs glass-text-secondary">Casual XP</div>
              </button>;
        })}
        </div>
        
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6 glass-text-center">
          <h3 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-2">Casual Settings</h3>
          <div className="glass-gap-1 glass-text-sm glass-text-secondary">
            <div>• Normal XP rates (1x multiplier)</div>
            <div>• Standard notification duration (3 seconds)</div>
            <div>• Progress tracking enabled</div>
            <div>• All achievements visible</div>
          </div>
        </div>
      </div>
      <GlassAchievementDashboard show={true} />
      <GlassAchievementNotifications position="top-right" />
    </GlassAchievementProvider>,
  args: {
    userId: 'casual-user'
  },
  parameters: {
    docs: {
      description: {
        story: 'Casual mode with standard progression and relaxed achievement unlocking.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <GlassAchievementProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Hardcore Achievement Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Challenging progression with reduced XP rates and hidden achievements
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
          {['Elite Challenge', 'Master Quest', 'Legendary Trial'].map((challenge, i) => {
          const {
            trackClick,
            recordAction
          } = useAchievementTracker();
          return <button key={challenge} className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-8 glass-text-center hover:glass-elev-3 transition-all duration-300
                         glass-border-2 glass-border-red/30 hover:glass-border-red/50 glass-focus glass-touch-target glass-contrast-guard" onClick={() => {
            trackClick(\`hardcore-challenge-\${i}\`);
            recordAction('hardcore_action', {
              challenge,
              difficulty: 'extreme'
            });
          }}>
                <div className="glass-text-3xl glass-mb-4">⚔️</div>
                <h3 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-2">{challenge}</h3>
                <p className="glass-text-sm glass-text-secondary">
                  High difficulty challenge with reduced XP rewards
                </p>
                <div className="glass-text-xs glass-text-tertiary glass-mt-2">
                  XP Multiplier: 0.5x
                </div>
              </button>;
        })}
        </div>
        
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6">
          <h3 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-4">Hardcore Features</h3>
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-4">
            <div>
              <h4 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Challenges</h4>
              <ul className="glass-gap-1 glass-text-xs glass-text-secondary">
                <li>• 50% reduced XP gain</li>
                <li>• Hidden achievement requirements</li>
                <li>• Longer notification duration (5 seconds)</li>
                <li>• Progress tracking with detailed analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="glass-text-sm glass-font-medium glass-text-primary glass-mb-2">Rewards</h4>
              <ul className="glass-gap-1 glass-text-xs glass-text-secondary">
                <li>• Exclusive hardcore achievements</li>
                <li>• Special visual effects</li>
                <li>• Enhanced progression tracking</li>
                <li>• Elite status indicators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <GlassAchievementDashboard show={true} />
      <GlassAchievementNotifications position="top-right" />
    </GlassAchievementProvider>,
  args: {
    userId: 'hardcore-user'
  },
  parameters: {
    docs: {
      description: {
        story: 'Hardcore mode with challenging progression and hidden achievements.'
      }
    }
  }
}`,...v.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <GlassAchievementProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Minimal Achievement Mode
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Quiet mode with minimal notifications and hidden progress tracking
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-3 glass-gap-6">
          {['Simple Action', 'Quiet Task', 'Minimal Interaction', 'Basic Function', 'Clean Action', 'Pure Task'].map((action, i) => {
          const {
            trackClick
          } = useAchievementTracker();
          return <button key={action} className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4 glass-text-center hover:glass-elev-2 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard" onClick={() => trackClick(\`minimal-\${i}\`)}>
                <div className="glass-text-lg glass-mb-2">⚪</div>
                <div className="glass-text-sm glass-text-primary">{action}</div>
              </button>;
        })}
        </div>
        
        <div className="glass-surface-primary glass-elev-1 glass-radius-lg glass-p-6 glass-text-center">
          <h3 className="glass-text-lg glass-font-medium glass-text-primary glass-mb-2">Minimal Settings</h3>
          <div className="glass-gap-1 glass-text-sm glass-text-secondary">
            <div>• Quiet mode notifications (2 seconds)</div>
            <div>• Progress tracking hidden</div>
            <div>• Minimal visual feedback</div>
            <div>• Background achievement tracking</div>
          </div>
        </div>
        
        {/* Note: Dashboard and notifications are intentionally minimal/hidden */}
      </div>
    </GlassAchievementProvider>,
  args: {
    userId: 'minimal-user'
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal mode with quiet notifications and hidden progress for distraction-free usage.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <GlassAchievementProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8 space-y-8">
        <div className="glass-text-center">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary glass-mb-4">
            Achievement Notifications Demo
          </h2>
          <p className="glass-text-sm glass-text-secondary mb-6">
            Trigger actions to see achievement notifications
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-3 md:glass-glass-grid-cols-6 glass-gap-4">
          {Array.from({
          length: 12
        }, (_, i) => {
          const {
            trackClick,
            trackHover,
            recordAction
          } = useAchievementTracker();
          return <button key={i} className="aspect-square glass-surface-primary glass-elev-2 glass-radius-lg 
                         hover:glass-elev-3 transition-all duration-300 glass-flex glass-items-center glass-justify-center glass-focus glass-touch-target glass-contrast-guard" onClick={() => {
            trackClick(\`notification-trigger-\${i}\`);
            if (i % 3 === 0) recordAction('special_trigger', {
              index: i
            });
          }} onMouseEnter={() => trackHover(\`notification-hover-\${i}\`)}>
                <div className="glass-text-xl">
                  {i % 4 === 0 ? '🎯' : i % 4 === 1 ? '🌟' : i % 4 === 2 ? '💎' : '🏆'}
                </div>
              </button>;
        })}
        </div>
        
        <div className="glass-text-center glass-surface-primary glass-elev-1 glass-radius-lg glass-p-4">
          <p className="glass-text-sm glass-text-secondary">
            Click and hover over the buttons above to trigger achievement notifications in the top-right corner
          </p>
        </div>
      </div>
      <GlassAchievementNotifications position="top-right" />
    </GlassAchievementProvider>,
  args: {
    userId: 'notification-demo-user'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows achievement notifications triggered by user interactions.'
      }
    }
  }
}`,...y.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <GlassAchievementProvider {...args}>
      <div className="glass-min-glass-h-screen glass-p-8">
        <div className="glass-text-center glass-gap-4 mb-8">
          <h2 className="glass-text-2xl glass-font-bold glass-text-primary">
            Achievement Dashboard
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            Track your progress, achievements, and statistics
          </p>
        </div>
        
        <div className="glass-grid glass-glass-grid-cols-2 md:glass-glass-grid-cols-4 glass-gap-4 mb-8">
          {Array.from({
          length: 16
        }, (_, i) => {
          const {
            trackClick
          } = useAchievementTracker();
          return <button key={i} className="glass-surface-primary glass-elev-2 glass-radius-lg glass-p-3 hover:glass-elev-3 transition-all duration-300 glass-focus glass-touch-target glass-contrast-guard" onClick={() => trackClick(\`dashboard-test-\${i}\`)}>
                <div className="glass-text-sm glass-text-primary">Test {i + 1}</div>
              </button>;
        })}
        </div>
      </div>
      <GlassAchievementDashboard show={true} />
    </GlassAchievementProvider>,
  args: {
    userId: 'dashboard-demo-user'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the achievement dashboard with interactive elements for testing progress tracking.'
      }
    }
  }
}`,...f.parameters?.docs?.source}}};const _=["Interactive","CasualMode","HardcoreMode","MinimalMode","NotificationsOnly","DashboardOnly"];export{u as CasualMode,f as DashboardOnly,v as HardcoreMode,x as Interactive,p as MinimalMode,y as NotificationsOnly,_ as __namedExportsOrder,R as default};
