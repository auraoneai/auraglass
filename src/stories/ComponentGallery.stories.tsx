import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { createGlassStyle } from '../core/mixins/glassMixins';

// Component gallery for AuraGlass
const ComponentGallery: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      background: 'radial-gradient(circle at 20% 50%, #120E43 0%, #0A0A0A 50%, #1A1A2E 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, var(--glass-white), #a855f7)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '1rem'
          }}>
            AuraGlass Design System
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
            225 Glassmorphism Components • Single Source of Truth • Unified API
          </p>
        </header>

        
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Core (178)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMotionController</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Animations/GlassMotionController
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassButton</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Button/GlassButton
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFab</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Button/GlassFab
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCalendar</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Calendar/GlassCalendar
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCard</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Card/GlassCard
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>div</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Glass Components/div
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>glass</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Glass Components/glass-card-link
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAreaChart</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Charts/GlassAreaChart
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassBarChart</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Charts/GlassBarChart
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassChart</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Charts/GlassChart
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDataChart</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Charts/GlassDataChart
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassLineChart</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Charts/GlassLineChart
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassPieChart</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Charts/GlassPieChart
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ModularGlassDataChart</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Charts/ModularGlassDataChart
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassActivityFeed</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Dashboard/GlassActivityFeed
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassChartWidget</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Dashboard/GlassChartWidget
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassKPICard</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Dashboard/GlassKPICard
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMetricCard</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Dashboard/GlassMetricCard
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassStatCard</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Dashboard/GlassStatCard
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAccordion</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassAccordion
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAlert</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassAlert
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAnimatedNumber</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-Display/GlassAnimatedNumber
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAvatar</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassAvatar
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassBadge</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassBadge
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassBadgeLine</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassBadgeLine
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDataGrid</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassDataGrid
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDataGridPro</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassDataGridPro
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDataTable</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassDataTable
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDiffViewer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassDiffViewer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassHeatmap</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassHeatmap
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassJSONViewer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassJSONViewer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassLoadingSkeleton</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassLoadingSkeleton
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMetricChip</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassMetricChip
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassNotificationCenter</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-Display/GlassNotificationCenter
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassProgress</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassProgress
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSchemaViewer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassSchemaViewer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSkeleton</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-Display/GlassSkeleton
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSkeletonLoader</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassSkeletonLoader
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSparkline</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassSparkline
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassStatusDot</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassStatusDot
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassTimeline</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassTimeline
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassToast</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassToast
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassVirtualTable</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/GlassVirtualTable
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCheckbox</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassCheckbox
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassColorPicker</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassColorPicker
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDatePicker</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassDatePicker
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDateRangePicker</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassDateRangePicker
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassForm</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassForm
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFormStepper</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassFormStepper
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFormTable</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassFormTable
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassInput</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassInput
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassLabel</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassLabel
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMultiSelect</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassMultiSelect
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMultiStepForm</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassMultiStepForm
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassRadioGroup</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassRadioGroup
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSelect</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassSelect
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSelectCompound</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassSelectCompound
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSlider</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassSlider
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassStep</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassStep
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassStepIcon</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassStepIcon
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassStepLabel</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassStepLabel
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSwitch</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassSwitch
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassTextarea</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassTextarea
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassToggle</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassToggle
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassWizard</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Input/GlassWizard
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ContextAwareGlass</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/ContextAwareGlass
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassA11yAuditor</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassA11yAuditor
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAdvancedSearch</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassAdvancedSearch
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAvatarGroup</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassAvatarGroup
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCardLink</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassCardLink
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCarousel</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassCarousel
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassChat</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassChat
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassChatInput</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassChatInput
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCoachmarks</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassCoachmarks
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCodeEditor</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassCodeEditor
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassColorSchemeGenerator</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassColorSchemeGenerator
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCommand</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassCommand
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCommandPalette</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassCommandPalette
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCommentThread</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassCommentThread
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassComponentPlayground</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassComponentPlayground
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDraggable</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassDraggable
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFacetSearch</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassFacetSearch
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFileExplorer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassFileExplorer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFileTree</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassFileTree
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFileUpload</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassFileUpload
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFilterPanel</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassFilterPanel
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFocusRing</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassFocusRing
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFormBuilder</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassFormBuilder
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassGallery</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassGallery
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassGradientPicker</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassGradientPicker
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassImageViewer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassImageViewer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassInfiniteScroll</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassInfiniteScroll
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassInlineEdit</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassInlineEdit
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassKanban</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassKanban
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassKeyValueEditor</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassKeyValueEditor
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassLazyImage</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassLazyImage
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMentionList</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassMentionList
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMessageList</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassMessageList
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMindMap</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassMindMap
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>CleanGlassContainer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassPresets
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassQueryBuilder</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassQueryBuilder
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassReactionBar</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassReactionBar
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSearchInterface</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassSearchInterface
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSpotlight</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassSpotlight
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassStepper</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassStepper
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassTagInput</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassTagInput
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassThemeDemo</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassThemeDemo
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassThemeSwitcher</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassThemeSwitcher
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassUserPresence</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassUserPresence
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassVideoPlayer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassVideoPlayer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassVirtualList</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassVirtualList
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassWhiteboard</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/GlassWhiteboard
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ThemedGlassComponents</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/ThemedGlassComponents
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAppShell</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassAppShell
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassBox</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassBox
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassContainer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassContainer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFlex</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassFlex
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassGrid</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassGrid
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMasonry</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassMasonry
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassScrollArea</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassScrollArea
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSeparator</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassSeparator
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSplitPane</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassSplitPane
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassStack</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/GlassStack
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>OptimizedGlassContainer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/OptimizedGlassContainer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassBottomSheet</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Modal/GlassBottomSheet
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDialog</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Modal/GlassDialog
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDrawer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Modal/GlassDrawer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassHoverCard</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Modal/GlassHoverCard
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassModal</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Modal/GlassModal
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassPopover</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Modal/GlassPopover
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassTooltip</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Modal/GlassTooltip
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>EnhancedGlassTabs</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/EnhancedGlassTabs
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassBottomNav</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassBottomNav
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassBreadcrumb</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassBreadcrumb
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCommandBar</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassCommandBar
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassContextMenu</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassContextMenu
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDropdownMenu</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassDropdownMenu
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassHeader</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassHeader
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMenubar</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassMenubar
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassMobileNav</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassMobileNav
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassNavigation</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassNavigation
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassNavigationMenu</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassNavigationMenu
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassPagination</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassPagination
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassResponsiveNav</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassResponsiveNav
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSegmentedControl</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassSegmentedControl
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassSidebar</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassSidebar
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassTabBar</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassTabBar
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassTabs</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassTabs
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassToolbar</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/GlassToolbar
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>DimensionalGlass</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Surfaces/DimensionalGlass
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>FrostedGlass</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Surfaces/FrostedGlass
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>HeatGlass</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Surfaces/HeatGlass
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>PageGlassContainer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Surfaces/PageGlassContainer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>WidgetGlass</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Surfaces/WidgetGlass
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDashboard</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Dashboard/GlassDashboard
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassDetailView</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Detail/GlassDetailView
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFormTemplate</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Forms/GlassFormTemplate
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassFormWizardSteps</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Forms/GlassFormWizardSteps
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassWizardTemplate</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Forms/GlassWizardTemplate
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassListView</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/List/GlassListView
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAccordionUI</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Ui-components/GlassAccordionUI
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCheckboxUI</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Ui-components/GlassCheckboxUI
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassPanel</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/UI-Components/GlassPanel
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassChartsDemo</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Website-components/GlassChartsDemo
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassLinkButton</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Website-components/GlassLinkButton
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassPrismComparison</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Website-components/GlassPrismComparison
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassWipeSlider</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Website-components/GlassWipeSlider
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassWipeSliderExamples</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Website-components/GlassWipeSliderExamples
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>MotionAwareGlass</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Website-components/MotionAwareGlass
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassLocalizationProvider</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Lib/GlassLocalizationProvider
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassCore</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Primitives/GlassCore
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>MotionNative</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Primitives/MotionNative
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>OptimizedGlassCore</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Primitives/OptimizedGlassCore
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassAdvanced</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Glass/GlassAdvanced
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>OptimizedGlassAdvanced</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Glass/OptimizedGlassAdvanced
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>MotionFramer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Motion/MotionFramer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ReducedMotionProvider</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Motion/ReducedMotionProvider
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlassErrorBoundary</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Utils/ErrorBoundary
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Backgrounds (3)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>AtmosphericBackground</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Backgrounds/AtmosphericBackground
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>DynamicAtmosphere</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Backgrounds/DynamicAtmosphere
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ParticleBackground</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Backgrounds/ParticleBackground
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Button (3)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>MagneticButton</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Button/MagneticButton
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ToggleButton</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Toggle-button/ToggleButton
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ToggleButtonGroup</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Toggle-button/ToggleButtonGroup
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Components (9)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>AtmosphericEffects</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/AtmosphericEffects
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ChartFilters</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/ChartFilters
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ChartLegend</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/ChartLegend
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ChartRenderer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/ChartRenderer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ChartTooltip</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/ChartTooltip
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>KpiChart</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/KpiChart
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>CollapsedMenu</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/CollapsedMenu
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ScrollButtons</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/ScrollButtons
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>TabItem</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/TabItem
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Charts (1)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ChartAxis</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Charts/ChartAxis
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Layout (5)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ChartContainer</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/ChartContainer
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ChartGrid</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Components/ChartGrid
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Box</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/Box
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>HStack</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/HStack
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>VStack</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Layout/VStack
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Cookie-consent (3)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>CompactCookieNotice</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Cookie-consent/CompactCookieNotice
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>CookieConsent</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Cookie-consent/CookieConsent
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>GlobalCookieConsent</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Cookie-consent/GlobalCookieConsent
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Data Display (1)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Typography</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Data-display/Typography
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Icons (1)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ClearIcon</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Icons/ClearIcon
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Image-list (3)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ImageList</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Image-list/ImageList
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ImageListItem</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Image-list/ImageListItem
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ImageListItemBar</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Image-list/ImageListItemBar
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Interactive (2)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>CursorGlow</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/CursorGlow
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>PageTransitionDemo</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Interactive/PageTransitionDemo
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Navigation (1)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>HeaderUserMenu</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Navigation/HeaderUserMenu
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Speed-dial (3)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>SpeedDial</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Speed-dial/SpeedDial
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>SpeedDialAction</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Speed-dial/SpeedDialAction
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>SpeedDialIcon</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Speed-dial/SpeedDialIcon
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Widgets (3)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ChartWidget</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Widgets/ChartWidget
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>MetricWidget</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Widgets/MetricWidget
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>TableWidget</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Widgets/TableWidget
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Tree-view (2)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>TreeItem</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Tree-view/TreeItem
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>TreeView</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Tree-view/TreeView
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Visual-feedback (4)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>FocusIndicator</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Visual-feedback/FocusIndicator
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>RippleButton</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Visual-feedback/RippleButton
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>StateIndicator</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Visual-feedback/StateIndicator
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>VisualFeedback</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Visual-feedback/VisualFeedback
                </p>
              </div>
            
          </div>
        </section>
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            paddingBottom: '0.5rem'
          }}>
            Focus (3)
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' 
          }}>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>FocusTrap</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Focus/FocusTrap
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>ScreenReader</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Focus/ScreenReader
                </p>
              </div>
            
              <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>SkipLinks</h4>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.8rem', 
                  opacity: '0.7',
                  fontFamily: 'monospace'
                }}>
                  Components/Focus/SkipLinks
                </p>
              </div>
            
          </div>
        </section>

        <footer style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.6 }}>
          <p>🔒 API Surface Locked v1.0.0 • ✅ All Validation Checks Passed • 🎯 46% Migration Coverage</p>
        </footer>
      </div>
    </div>
  );
};

const meta: Meta<typeof ComponentGallery> = {
  title: 'AuraGlass/Component Gallery',
  component: ComponentGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete gallery of all AuraGlass components organized by category.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};

export const TokenSystem: Story = {
  render: () => (
    <div style={{ 
      padding: '2rem',
      background: 'radial-gradient(circle at 20% 50%, #120E43 0%, #0A0A0A 50%, #1A1A2E 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Token System Overview</h1>
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
          <h3>Intent System</h3>
          <p>neutral • primary • success • warning • danger • info</p>
        </div>
        <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
          <h3>Elevation System</h3>
          <p>level1 • level2 • level3 • level4</p>
        </div>
        <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
          <h3>Performance Tiers</h3>
          <p>high • medium • low</p>
        </div>
        <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
          <h3>Unified API</h3>
          <p>createGlassStyle(options)</p>
        </div>
      </div>
    </div>
  ),
};
