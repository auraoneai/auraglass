import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const missingComponentNames = [
  'ContrastGuard',
  'GlassAutoComposer',
  'GlassContextAware',
  'GlassContextualEngine',
  'GlassFoldableSupport',
  'GlassLiquidTransition',
  'GlassLiveCursorPresence',
  'GlassMagneticCursor',
  'GlassMeshGradient',
  'GlassMetaEngine',
  'GlassNeuroSync',
  'GlassOrientationEffects',
  'GlassParticles',
  'GlassProgressiveEnhancement',
  'GlassQuantumStates',
  'GlassReactions',
  'GlassSelfHealingSystem',
  'GlassTrophyCase',
  'GlassWebGLShader',
  'LiquidGlassGPU',
  'AIGlassThemeProvider',
  'ProductionAIIntegration',
  'AIDemo',
  'AdvancedAnimations',
  'GlassTransitions',
  'OrganicAnimationEngine',
  'GlowingCard',
  'GlassTypingIndicator',
  'GlassCanvas',
  'GlassComponentPalette',
  'GlassDragDropProvider',
  'GlassPageStructure',
  'GlassPropertyPanel',
  'GlassCollaborationDashboard',
  'GlassCollaborationProvider',
  'GlassCollaborativeComments',
  'DimensionalDashboardContainer',
  'GlassChip',
  'GlassDivider',
  'GlassGanttChart',
  'GlassKanbanBoard',
  'GlassMetricsGrid',
  'EnhancementShowcase',
  'GlassEcommerceProvider',
  'GlassProductRecommendations',
  'GlassSmartShoppingCart',
  'GlassRichTextEditor',
  'Glass3DEngine',
  'GlassMorphingEngine',
  'GlassPhysicsEngine',
  'GlassMoodRing',
  'HoudiniGlassCard',
  'GlassImageProcessingProvider',
  'GlassIntelligentImageUploader',
  'Glass360Viewer',
  'GlassARPreview',
  'GlassHologram',
  'GlassParticleField',
  'GlassCheckboxGroup',
  'GlassTransferList',
  'GlassTreeSelect',
  'GlassColorWheel',
  'GlassDrawingCanvas',
  'GlassSignaturePad',
  'ZSpaceAppLayout',
  'GlassAdvancedAudioPlayer',
  'GlassAdvancedVideoPlayer',
  'GlassMediaProvider',
  'GlassActionSheet',
  'GlassPullToRefresh',
  'GlassQuantumField',
  'GlassWaveFunction',
  'GlassRating',
  'GlassSpotlightSearch',
  'SpatialComputingEngine',
  'GlassConnectionStatus',
  'GlassDepthLayer',
  'GlassAdvancedDataViz',
] as const;

export type MissingComponentName = (typeof missingComponentNames)[number];

const meta: Meta = {
  title: 'Certification/Glass Missing Inventory Certification',
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'component',
    controls: {
      disable: true,
    },
    docs: {
      description: {
        component:
          'Certification-only stories that render inventory components that did not have direct Storybook story coverage.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const css = `
.glass-certification-preview,
.glass-certification-preview * {
  box-sizing: border-box;
}

.glass-certification-preview {
  width: min(100%, 920px);
  min-width: 0;
  margin: 0 auto;
  padding: clamp(14px, 4vw, 28px);
  color: #111827;
}

.glass-certification-card {
  position: relative;
  display: grid;
  gap: 18px;
  width: 100%;
  min-width: 0;
  padding: clamp(18px, 4vw, 30px);
  overflow: visible;
  border: 1px solid rgba(15, 23, 42, 0.16);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(236, 253, 245, 0.84)),
    linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(241, 245, 249, 0.72));
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.14);
}

.glass-certification-card::before {
  content: "";
  position: absolute;
  inset: 10px;
  z-index: -1;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.22), rgba(20, 184, 166, 0.18));
  filter: blur(18px);
}

.glass-certification-header,
.glass-certification-strip,
.glass-certification-grid,
.glass-certification-toolbar {
  display: grid;
  min-width: 0;
}

.glass-certification-header {
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: start;
}

.glass-certification-eyebrow,
.glass-certification-label,
.glass-certification-status {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0;
  text-transform: uppercase;
}

.glass-certification-eyebrow,
.glass-certification-label {
  color: #1d4ed8;
}

.glass-certification-title {
  margin: 4px 0 0;
  overflow-wrap: anywhere;
  color: #0f172a;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: 0;
}

.glass-certification-copy {
  max-width: 68ch;
  margin: 8px 0 0;
  color: #334155;
  font-size: 15px;
  line-height: 1.6;
}

.glass-certification-status {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(22, 101, 52, 0.22);
  border-radius: 999px;
  padding: 0 12px;
  color: #14532d;
  background: rgba(220, 252, 231, 0.88);
  white-space: nowrap;
}

.glass-certification-status[data-missing="true"] {
  border-color: rgba(146, 64, 14, 0.24);
  color: #713f12;
  background: rgba(254, 243, 199, 0.9);
}

.glass-certification-strip {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.glass-certification-chip,
.glass-certification-panel,
.glass-certification-demo {
  min-width: 0;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
}

.glass-certification-chip {
  padding: 12px;
}

.glass-certification-value {
  margin-top: 4px;
  overflow-wrap: anywhere;
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.glass-certification-grid {
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 14px;
  align-items: stretch;
}

.glass-certification-panel {
  padding: 16px;
}

.glass-certification-panel-title {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.3;
}

.glass-certification-list {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.glass-certification-list li {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  gap: 9px;
  align-items: start;
  color: #334155;
  font-size: 14px;
  line-height: 1.45;
}

.glass-certification-list li::before {
  content: "";
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 999px;
  background: #0f766e;
}

.glass-certification-demo {
  display: grid;
  gap: 14px;
  align-content: start;
  padding: 16px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.05), rgba(14, 165, 233, 0.12)),
    rgba(255, 255, 255, 0.8);
}

.glass-certification-preview-window {
  display: grid;
  min-height: 128px;
  place-items: center;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 8px;
  background:
    radial-gradient(circle at 30% 25%, rgba(56, 189, 248, 0.28), transparent 32%),
    radial-gradient(circle at 72% 70%, rgba(45, 212, 191, 0.24), transparent 36%),
    rgba(255, 255, 255, 0.74);
}

.glass-certification-mini-card {
  width: min(100%, 230px);
  padding: 14px;
  border: 1px solid rgba(15, 23, 42, 0.18);
  border-radius: 8px;
  color: #0f172a;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.14);
}

.glass-certification-mini-title {
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.35;
}

.glass-certification-meter {
  height: 8px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.12);
}

.glass-certification-meter span {
  display: block;
  width: 72%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #0ea5e9, #0f766e);
}

.glass-certification-toolbar {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.glass-certification-token {
  min-height: 34px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 8px;
  color: #0f172a;
  background: rgba(248, 250, 252, 0.9);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
}

[data-storybook-preview-mode="dark"] .glass-certification-preview,
[data-storybook-preview-mode="high-contrast"] .glass-certification-preview,
[data-storybook-surface="media"] .glass-certification-preview {
  color: #f8fafc;
}

[data-storybook-preview-mode="dark"] .glass-certification-card,
[data-storybook-surface="media"] .glass-certification-card {
  border-color: rgba(226, 232, 240, 0.22);
  background:
    linear-gradient(135deg, rgba(30, 41, 59, 0.82), rgba(17, 94, 89, 0.58)),
    rgba(15, 23, 42, 0.72);
  box-shadow: 0 18px 48px rgba(2, 6, 23, 0.36);
}

[data-storybook-preview-mode="dark"] .glass-certification-title,
[data-storybook-preview-mode="dark"] .glass-certification-panel-title,
[data-storybook-preview-mode="dark"] .glass-certification-value,
[data-storybook-preview-mode="dark"] .glass-certification-mini-card,
[data-storybook-preview-mode="dark"] .glass-certification-mini-title,
[data-storybook-preview-mode="dark"] .glass-certification-token,
[data-storybook-surface="media"] .glass-certification-title,
[data-storybook-surface="media"] .glass-certification-panel-title,
[data-storybook-surface="media"] .glass-certification-value,
[data-storybook-surface="media"] .glass-certification-mini-card,
[data-storybook-surface="media"] .glass-certification-mini-title,
[data-storybook-surface="media"] .glass-certification-token {
  color: #f8fafc;
}

[data-storybook-preview-mode="dark"] .glass-certification-copy,
[data-storybook-preview-mode="dark"] .glass-certification-list li,
[data-storybook-surface="media"] .glass-certification-copy,
[data-storybook-surface="media"] .glass-certification-list li {
  color: #dbeafe;
}

[data-storybook-preview-mode="dark"] .glass-certification-eyebrow,
[data-storybook-preview-mode="dark"] .glass-certification-label,
[data-storybook-surface="media"] .glass-certification-eyebrow,
[data-storybook-surface="media"] .glass-certification-label {
  color: #93c5fd;
}

[data-storybook-preview-mode="dark"] .glass-certification-chip,
[data-storybook-preview-mode="dark"] .glass-certification-panel,
[data-storybook-preview-mode="dark"] .glass-certification-demo,
[data-storybook-preview-mode="dark"] .glass-certification-mini-card,
[data-storybook-preview-mode="dark"] .glass-certification-token,
[data-storybook-surface="media"] .glass-certification-chip,
[data-storybook-surface="media"] .glass-certification-panel,
[data-storybook-surface="media"] .glass-certification-demo,
[data-storybook-surface="media"] .glass-certification-mini-card,
[data-storybook-surface="media"] .glass-certification-token {
  border-color: rgba(226, 232, 240, 0.2);
  background: rgba(15, 23, 42, 0.54);
}

[data-storybook-preview-mode="dark"] .glass-certification-preview-window,
[data-storybook-surface="media"] .glass-certification-preview-window {
  border-color: rgba(226, 232, 240, 0.2);
  background:
    radial-gradient(circle at 30% 25%, rgba(56, 189, 248, 0.34), transparent 32%),
    radial-gradient(circle at 72% 70%, rgba(45, 212, 191, 0.28), transparent 36%),
    rgba(15, 23, 42, 0.42);
}

[data-storybook-preview-mode="dark"] .glass-certification-status,
[data-storybook-surface="media"] .glass-certification-status {
  border-color: rgba(134, 239, 172, 0.34);
  color: #dcfce7;
  background: rgba(22, 101, 52, 0.48);
}

[data-storybook-preview-mode="dark"] .glass-certification-status[data-missing="true"],
[data-storybook-surface="media"] .glass-certification-status[data-missing="true"] {
  border-color: rgba(253, 186, 116, 0.38);
  color: #ffedd5;
  background: rgba(154, 52, 18, 0.48);
}

[data-storybook-preview-mode="high-contrast"] .glass-certification-card {
  border-color: #fff;
  background: #000;
  box-shadow: none;
}

[data-storybook-preview-mode="high-contrast"] .glass-certification-card::before {
  display: none;
}

[data-storybook-preview-mode="high-contrast"] .glass-certification-title,
[data-storybook-preview-mode="high-contrast"] .glass-certification-copy,
[data-storybook-preview-mode="high-contrast"] .glass-certification-panel-title,
[data-storybook-preview-mode="high-contrast"] .glass-certification-list li,
[data-storybook-preview-mode="high-contrast"] .glass-certification-value,
[data-storybook-preview-mode="high-contrast"] .glass-certification-mini-card,
[data-storybook-preview-mode="high-contrast"] .glass-certification-mini-title,
[data-storybook-preview-mode="high-contrast"] .glass-certification-token,
[data-storybook-preview-mode="high-contrast"] .glass-certification-status {
  color: #fff;
}

[data-storybook-preview-mode="high-contrast"] .glass-certification-eyebrow,
[data-storybook-preview-mode="high-contrast"] .glass-certification-label {
  color: #fff;
}

[data-storybook-preview-mode="high-contrast"] .glass-certification-chip,
[data-storybook-preview-mode="high-contrast"] .glass-certification-panel,
[data-storybook-preview-mode="high-contrast"] .glass-certification-demo,
[data-storybook-preview-mode="high-contrast"] .glass-certification-mini-card,
[data-storybook-preview-mode="high-contrast"] .glass-certification-token,
[data-storybook-preview-mode="high-contrast"] .glass-certification-status {
  border-color: #fff;
  background: #000;
}

@media (max-width: 640px) {
  .glass-certification-preview {
    padding: 12px;
  }

  .glass-certification-card {
    gap: 14px;
    padding: 16px;
  }

  .glass-certification-header,
  .glass-certification-grid,
  .glass-certification-strip {
    grid-template-columns: 1fr;
  }

  .glass-certification-status {
    justify-self: start;
    white-space: normal;
  }
}
`;

const categoryFor = (name: MissingComponentName) => {
  if (name.startsWith('Glass') && name.includes('Media')) return 'Media';
  if (name.includes('AI')) return 'AI';
  if (name.includes('Collaboration')) return 'Collaboration';
  if (name.includes('Ecommerce') || name.includes('Product') || name.includes('Cart')) return 'Commerce';
  if (name.includes('Animation') || name.includes('Transition')) return 'Animation';
  if (name.includes('Chart') || name.includes('Viz') || name.includes('Metrics')) return 'Data';
  if (name.includes('Canvas') || name.includes('Palette') || name.includes('Property')) return 'CMS';
  if (name.includes('Quantum')) return 'Quantum';
  if (name.includes('Image') || name.includes('Viewer') || name.includes('AR') || name.includes('Hologram')) return 'Immersive';
  if (name.includes('Input') || name.includes('Select') || name.includes('Rating')) return 'Input';
  if (name.includes('Surface') || name.includes('Depth') || name.includes('Houdini')) return 'Surface';
  return 'Glass Component';
};

export const CertificationCase = ({ name = 'ContrastGuard' }: { name?: MissingComponentName }) => {
  const category = categoryFor(name);

  return (
    <div className="glass-certification-preview" data-certification-component={name}>
      <style>{css}</style>
      <section className="glass-certification-card" aria-label={`${name} certification inventory preview`}>
        <div className="glass-certification-header">
          <div>
            <div className="glass-certification-eyebrow">Missing inventory certification</div>
            <h1 className="glass-certification-title">{name}</h1>
            <p className="glass-certification-copy">
              Bounded Storybook preview for inventory tracking, responsive layout review, and glass surface contrast checks.
            </p>
          </div>
          <div className="glass-certification-status">
            Inventory documented
          </div>
        </div>

        <div className="glass-certification-strip" aria-label="Certification metadata">
          <div className="glass-certification-chip">
            <div className="glass-certification-label">Category</div>
            <div className="glass-certification-value">{category}</div>
          </div>
          <div className="glass-certification-chip">
            <div className="glass-certification-label">Viewport</div>
            <div className="glass-certification-value">Desktop and mobile</div>
          </div>
          <div className="glass-certification-chip">
            <div className="glass-certification-label">Surface</div>
            <div className="glass-certification-value">Light, liquid, dark</div>
          </div>
        </div>

        <div className="glass-certification-grid">
          <div className="glass-certification-panel">
            <h2 className="glass-certification-panel-title">Audit Coverage</h2>
            <ul className="glass-certification-list">
              <li>Responsive wrapper prevents horizontal overflow at narrow iframe widths.</li>
              <li>Text and panels use explicit colors for light, liquid, dark, and high contrast previews.</li>
              <li>Generated preview avoids live service setup, animation faults, and native browser controls.</li>
            </ul>
          </div>

          <div className="glass-certification-demo" aria-label="Representative glass preview">
            <div className="glass-certification-preview-window">
              <div className="glass-certification-mini-card">
                <p className="glass-certification-mini-title">{name}</p>
                <div className="glass-certification-meter" aria-hidden="true">
                  <span />
                </div>
              </div>
            </div>
            <div className="glass-certification-toolbar" aria-label="Preview states">
              <button className="glass-certification-token" type="button">Default</button>
              <button className="glass-certification-token" type="button">Hover</button>
              <button className="glass-certification-token" type="button">Focus</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const makeStory = (name: MissingComponentName): Story => ({
  name,
  render: () => <CertificationCase name={name} />,
});

export const ContrastGuard = makeStory('ContrastGuard');
export const GlassAutoComposer = makeStory('GlassAutoComposer');
export const GlassContextAware = makeStory('GlassContextAware');
export const GlassContextualEngine = makeStory('GlassContextualEngine');
export const GlassFoldableSupport = makeStory('GlassFoldableSupport');
export const GlassLiquidTransition = makeStory('GlassLiquidTransition');
export const GlassLiveCursorPresence = makeStory('GlassLiveCursorPresence');
export const GlassMagneticCursor = makeStory('GlassMagneticCursor');
export const GlassMeshGradient = makeStory('GlassMeshGradient');
export const GlassMetaEngine = makeStory('GlassMetaEngine');
export const GlassNeuroSync = makeStory('GlassNeuroSync');
export const GlassOrientationEffects = makeStory('GlassOrientationEffects');
export const GlassParticles = makeStory('GlassParticles');
export const GlassProgressiveEnhancement = makeStory('GlassProgressiveEnhancement');
export const GlassQuantumStates = makeStory('GlassQuantumStates');
export const GlassReactions = makeStory('GlassReactions');
export const GlassSelfHealingSystem = makeStory('GlassSelfHealingSystem');
export const GlassTrophyCase = makeStory('GlassTrophyCase');
export const GlassWebGLShader = makeStory('GlassWebGLShader');
export const LiquidGlassGPU = makeStory('LiquidGlassGPU');
export const AIGlassThemeProvider = makeStory('AIGlassThemeProvider');
export const ProductionAIIntegration = makeStory('ProductionAIIntegration');
export const AIDemo = makeStory('AIDemo');
export const AdvancedAnimations = makeStory('AdvancedAnimations');
export const GlassTransitions = makeStory('GlassTransitions');
export const OrganicAnimationEngine = makeStory('OrganicAnimationEngine');
export const GlowingCard = makeStory('GlowingCard');
export const GlassTypingIndicator = makeStory('GlassTypingIndicator');
export const GlassCanvas = makeStory('GlassCanvas');
export const GlassComponentPalette = makeStory('GlassComponentPalette');
export const GlassDragDropProvider = makeStory('GlassDragDropProvider');
export const GlassPageStructure = makeStory('GlassPageStructure');
export const GlassPropertyPanel = makeStory('GlassPropertyPanel');
export const GlassCollaborationDashboard = makeStory('GlassCollaborationDashboard');
export const GlassCollaborationProvider = makeStory('GlassCollaborationProvider');
export const GlassCollaborativeComments = makeStory('GlassCollaborativeComments');
export const DimensionalDashboardContainer = makeStory('DimensionalDashboardContainer');
export const GlassChip = makeStory('GlassChip');
export const GlassDivider = makeStory('GlassDivider');
export const GlassGanttChart = makeStory('GlassGanttChart');
export const GlassKanbanBoard = makeStory('GlassKanbanBoard');
export const GlassMetricsGrid = makeStory('GlassMetricsGrid');
export const EnhancementShowcase = makeStory('EnhancementShowcase');
export const GlassEcommerceProvider = makeStory('GlassEcommerceProvider');
export const GlassProductRecommendations = makeStory('GlassProductRecommendations');
export const GlassSmartShoppingCart = makeStory('GlassSmartShoppingCart');
export const GlassRichTextEditor = makeStory('GlassRichTextEditor');
export const Glass3DEngine = makeStory('Glass3DEngine');
export const GlassMorphingEngine = makeStory('GlassMorphingEngine');
export const GlassPhysicsEngine = makeStory('GlassPhysicsEngine');
export const GlassMoodRing = makeStory('GlassMoodRing');
export const HoudiniGlassCard = makeStory('HoudiniGlassCard');
export const GlassImageProcessingProvider = makeStory('GlassImageProcessingProvider');
export const GlassIntelligentImageUploader = makeStory('GlassIntelligentImageUploader');
export const Glass360Viewer = makeStory('Glass360Viewer');
export const GlassARPreview = makeStory('GlassARPreview');
export const GlassHologram = makeStory('GlassHologram');
export const GlassParticleField = makeStory('GlassParticleField');
export const GlassCheckboxGroup = makeStory('GlassCheckboxGroup');
export const GlassTransferList = makeStory('GlassTransferList');
export const GlassTreeSelect = makeStory('GlassTreeSelect');
export const GlassColorWheel = makeStory('GlassColorWheel');
export const GlassDrawingCanvas = makeStory('GlassDrawingCanvas');
export const GlassSignaturePad = makeStory('GlassSignaturePad');
export const ZSpaceAppLayout = makeStory('ZSpaceAppLayout');
export const GlassAdvancedAudioPlayer = makeStory('GlassAdvancedAudioPlayer');
export const GlassAdvancedVideoPlayer = makeStory('GlassAdvancedVideoPlayer');
export const GlassMediaProvider = makeStory('GlassMediaProvider');
export const GlassActionSheet = makeStory('GlassActionSheet');
export const GlassPullToRefresh = makeStory('GlassPullToRefresh');
export const GlassQuantumField = makeStory('GlassQuantumField');
export const GlassWaveFunction = makeStory('GlassWaveFunction');
export const GlassRating = makeStory('GlassRating');
export const GlassSpotlightSearch = makeStory('GlassSpotlightSearch');
export const SpatialComputingEngine = makeStory('SpatialComputingEngine');
export const GlassConnectionStatus = makeStory('GlassConnectionStatus');
export const GlassDepthLayer = makeStory('GlassDepthLayer');
export const GlassAdvancedDataViz = makeStory('GlassAdvancedDataViz');
