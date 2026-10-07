import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

import type {
  ConsciousnessConfig,
  ConsciousnessEventHandlers,
} from "@/types/consciousness";
import { DEFAULT_CONSCIOUSNESS_CONFIG } from "@/types/consciousness";

type ConsciousnessFeatureKey = keyof ConsciousnessConfig["features"];

export interface ConsciousnessStreamEvent {
  id: string;
  feature: ConsciousnessFeatureKey | string;
  timestamp: number;
  payload?: Record<string, unknown>;
  confidence?: number;
  status?: "info" | "success" | "warning" | "error";
}

interface ConsciousnessStreamState {
  config: ConsciousnessConfig;
  handlers: ConsciousnessEventHandlers;
  events: ConsciousnessStreamEvent[];
}

type ConsciousnessStreamAction =
  | { type: "updateConfig"; payload: Partial<ConsciousnessConfig> }
  | { type: "updateFeature"; feature: ConsciousnessFeatureKey; value: boolean }
  | { type: "logEvent"; event: ConsciousnessStreamEvent }
  | { type: "clearEvents" }
  | { type: "mergeHandlers"; handlers: Partial<ConsciousnessEventHandlers> };

const mergeConfigs = (
  base: ConsciousnessConfig,
  update: Partial<ConsciousnessConfig>
): ConsciousnessConfig => ({
  ...base,
  ...update,
  features: {
    ...base.features,
    ...update.features,
  },
  performance: {
    ...base.performance,
    ...update.performance,
  },
  privacy: {
    ...base.privacy,
    ...update.privacy,
  },
  accessibility: {
    ...base.accessibility,
    ...update.accessibility,
  },
});

const streamReducer = (
  state: ConsciousnessStreamState,
  action: ConsciousnessStreamAction
): ConsciousnessStreamState => {
  switch (action.type) {
    case "updateConfig":
      return {
        ...state,
        config: mergeConfigs(state.config, action.payload),
      };
    case "updateFeature":
      return {
        ...state,
        config: {
          ...state.config,
          features: {
            ...state.config.features,
            [action.feature]: action.value,
          },
        },
      };
    case "logEvent":
      return {
        ...state,
        events: [...state.events, action.event].slice(-200),
      };
    case "clearEvents":
      return {
        ...state,
        events: [],
      };
    case "mergeHandlers":
      return {
        ...state,
        handlers: { ...state.handlers, ...action.handlers },
      };
    default:
      return state;
  }
};

const createEventId = () =>
  `cse-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export interface ConsciousnessStreamContextValue {
  config: ConsciousnessConfig;
  handlers: ConsciousnessEventHandlers;
  events: ConsciousnessStreamEvent[];
  updateConfig: (config: Partial<ConsciousnessConfig>) => void;
  updateFeature: (feature: ConsciousnessFeatureKey, enabled: boolean) => void;
  logEvent: (
    event: Omit<ConsciousnessStreamEvent, "id" | "timestamp"> & {
      id?: string;
      timestamp?: number;
    }
  ) => ConsciousnessStreamEvent;
  clearEvents: () => void;
  registerHandlers: (handlers: Partial<ConsciousnessEventHandlers>) => void;
}

const ConsciousnessStreamContext =
  createContext<ConsciousnessStreamContextValue | null>(null);

const defaultConsciousnessStreamContext: ConsciousnessStreamContextValue = {
  config: DEFAULT_CONSCIOUSNESS_CONFIG,
  handlers: {},
  events: [],
  updateConfig: () => {},
  updateFeature: () => {},
  logEvent: (event) => ({
    id: event.id ?? createEventId(),
    timestamp: event.timestamp ?? Date.now(),
    feature: event.feature,
    payload: event.payload,
    confidence: event.confidence,
    status: event.status,
  }),
  clearEvents: () => {},
  registerHandlers: () => {},
};

export interface ConsciousnessStreamProviderProps {
  children: React.ReactNode;
  config?: Partial<ConsciousnessConfig>;
  handlers?: Partial<ConsciousnessEventHandlers>;
  initialEvents?: ConsciousnessStreamEvent[];
}

export function ConsciousnessStreamProvider({
  children,
  config,
  handlers,
  initialEvents = [],
}: ConsciousnessStreamProviderProps) {
  const [state, dispatch] = useReducer(streamReducer, {
    config: mergeConfigs(DEFAULT_CONSCIOUSNESS_CONFIG, config ?? {}),
    handlers: (handlers ?? {}) as ConsciousnessEventHandlers,
    events: initialEvents.slice(-200),
  });

  const updateConfig = useCallback((partial: Partial<ConsciousnessConfig>) => {
    dispatch({ type: "updateConfig", payload: partial });
  }, []);

  const updateFeature = useCallback(
    (feature: ConsciousnessFeatureKey, enabled: boolean) => {
      dispatch({ type: "updateFeature", feature, value: enabled });
    },
    []
  );

  const logEvent: ConsciousnessStreamContextValue["logEvent"] = useCallback(
    (eventInput) => {
      const event: ConsciousnessStreamEvent = {
        id: eventInput.id ?? createEventId(),
        timestamp: eventInput.timestamp ?? Date.now(),
        feature: eventInput.feature,
        payload: eventInput.payload,
        confidence: eventInput.confidence,
        status: eventInput.status,
      };

      dispatch({ type: "logEvent", event });
      return event;
    },
    []
  );

  const clearEvents = useCallback(() => {
    dispatch({ type: "clearEvents" });
  }, []);

  const registerHandlers = useCallback(
    (partial: Partial<ConsciousnessEventHandlers>) => {
      dispatch({ type: "mergeHandlers", handlers: partial });
    },
    []
  );

  const value = useMemo<ConsciousnessStreamContextValue>(
    () => ({
      config: state.config,
      handlers: state.handlers,
      events: state.events,
      updateConfig,
      updateFeature,
      logEvent,
      clearEvents,
      registerHandlers,
    }),
    [
      state.config,
      state.handlers,
      state.events,
      updateConfig,
      updateFeature,
      logEvent,
      clearEvents,
      registerHandlers,
    ]
  );

  return (
    <ConsciousnessStreamContext.Provider value={value}>
      {children}
    </ConsciousnessStreamContext.Provider>
  );
}

export function useConsciousnessStream(): ConsciousnessStreamContextValue {
  const context = useContext(ConsciousnessStreamContext);
  return context ?? defaultConsciousnessStreamContext;
}
