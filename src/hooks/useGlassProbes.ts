import React from 'react';
/**
 * useGlassProbes Hook
 * 
 * React hook for integrating glass style probes into components.
 * Provides real-time monitoring and compliance checking for glass elements.
 */

import { useEffect, useRef, useState } from 'react';
import { GlassStyleProbes, GlassProbeResult } from '../utils/glassStyleProbes';

export interface UseGlassProbesOptions {
  /** Enable automatic monitoring for this component */
  monitor?: boolean;
  /** Probe interval in milliseconds */
  probeInterval?: number;
  /** Callback for compliance issues */
  onComplianceIssue?: (result: GlassProbeResult) => void;
  /** Callback for performance warnings */
  onPerformanceWarning?: (result: GlassProbeResult) => void;
}

export interface GlassProbesData {
  isMonitoring: boolean;
  latestResult: GlassProbeResult | null;
  complianceScore: number;
  hasPerformanceIssues: boolean;
  deprecationWarnings: string[];
}

/**
 * Hook for monitoring glass elements with real-time probes
 */
export function useGlassProbes(options: UseGlassProbesOptions = {}): GlassProbesData {
  const {
    monitor = true,
    probeInterval = 5000,
    onComplianceIssue,
    onPerformanceWarning
  } = options;

  const [probesData, setProbesData] = useState<GlassProbesData>({
    isMonitoring: false,
    latestResult: null,
    complianceScore: 1.0,
    hasPerformanceIssues: false,
    deprecationWarnings: []
  });

  const probesRef = useRef<GlassStyleProbes | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!monitor) return;

    // Initialize probes
    probesRef.current = GlassStyleProbes.getInstance();
    probesRef.current.startMonitoring();

    setProbesData((prev: any) => ({ ...prev, isMonitoring: true }));

    // Set up periodic updates
    intervalRef.current = setInterval(() => {
      if (probesRef.current) {
        const results = probesRef.current.getProbeResults();
        const latestResult = results[results.length - 1];
        
        if (latestResult) {
          const newData: GlassProbesData = {
            isMonitoring: true,
            latestResult,
            complianceScore: latestResult.compliance.accessibilityScore,
            hasPerformanceIssues: !latestResult.performance.backdropSupported ||
                                 (latestResult.performance.renderTime || 0) > 16,
            deprecationWarnings: latestResult.usage.deprecationWarnings
          };

          setProbesData(newData);

          // Trigger callbacks
          if (onComplianceIssue && latestResult.compliance.accessibilityScore < 0.7) {
            onComplianceIssue(latestResult);
          }

          if (onPerformanceWarning && newData.hasPerformanceIssues) {
            onPerformanceWarning(latestResult);
          }
        }
      }
    }, probeInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [monitor, probeInterval, onComplianceIssue, onPerformanceWarning]);

  return probesData;
}

/**
 * Hook for monitoring a specific glass element by ref
 */
export function useGlassElementProbe<T extends HTMLElement>(
  elementRef: React.RefObject<T>,
  options: UseGlassProbesOptions = {}
): GlassProbesData & { probeElement: () => void } {
  const [elementData, setElementData] = useState<GlassProbesData>({
    isMonitoring: false,
    latestResult: null,
    complianceScore: 1.0,
    hasPerformanceIssues: false,
    deprecationWarnings: []
  });

  const probesRef = useRef<GlassStyleProbes | null>(null);

  useEffect(() => {
    if (!options.monitor) return;

    probesRef.current = GlassStyleProbes.getInstance();
    probesRef.current.startMonitoring();
    
    setElementData((prev: any) => ({ ...prev, isMonitoring: true }));
  }, [options.monitor]);

  const probeElement = () => {
    if (!elementRef.current || !probesRef.current) return;

    const result = probesRef.current.probeElementById(elementRef.current.id);
    if (result) {
      setElementData({
        isMonitoring: true,
        latestResult: result,
        complianceScore: result.compliance.accessibilityScore,
        hasPerformanceIssues: !result.performance.backdropSupported ||
                             (result.performance.renderTime || 0) > 16,
        deprecationWarnings: result.usage.deprecationWarnings
      });
    }
  };

  return { ...elementData, probeElement };
}

/**
 * Hook for glass development debugging
 */
export function useGlassDebug(): {
  summary: any;
  allResults: GlassProbeResult[];
  exportData: () => void;
} {
  const [debugData, setDebugData] = useState<{
    summary: any;
    allResults: GlassProbeResult[];
  }>({
    summary: null,
    allResults: []
  });

  useEffect(() => {
    const probes = GlassStyleProbes.getInstance();
    
    const updateDebugData = () => {
      const summary = probes.getLatestSummary();
      const allResults = probes.getProbeResults();
      setDebugData({ summary, allResults });
    };

    // Update initially and then periodically
    updateDebugData();
    const interval = setInterval(updateDebugData, 10000);

    return () => clearInterval(interval);
  }, []);

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      summary: debugData.summary,
      results: debugData.allResults,
      environment: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        support: {
          // Use createGlassStyle() instead,
          webkitBackdropFilter: CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
        }
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auraglass-probe-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { ...debugData, exportData };
}