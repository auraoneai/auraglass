'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle,
    HelpCircle,
    MessageCircle,
    Mic,
    MicOff,
    Pause,
    Settings,
    SkipBack,
    SkipForward,
    Volume1,
    X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface VoiceGlassControlProps {
  className?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  autoEnable?: boolean;
  showTranscript?: boolean;
  onVoiceCommand?: (command: string, result: any) => void;
  onToggleControls?: (show: boolean) => void;
  wakeWord?: string;
  enableFeedback?: boolean;
  showHelp?: boolean;
  maxTranscriptLength?: number;
}

interface VoiceCommand {
  id: string;
  command: string;
  description: string;
  category: 'navigation' | 'media' | 'ui' | 'system';
  example?: string;
}

// Mock voice control hook - in real implementation this would use actual Web Speech API
const useVoiceGlassControl = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Mock implementation
  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) &&
      'speechSynthesis' in window);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const enable = useCallback(() => {
    if (!isSupported) {
      setError('Voice control not supported in this browser');
      return;
    }
    setIsEnabled(true);
    setError(null);
  }, [isSupported]);

  const disable = useCallback(() => {
    setIsEnabled(false);
    setIsListening(false);
    setWakeWordDetected(false);
  }, []);

  const toggle = useCallback(() => {
    if (isEnabled) {
      disable();
    } else {
      enable();
    }
  }, [isEnabled, enable, disable]);

  const speak = useCallback((text: string, voice?: SpeechSynthesisVoice) => {
    if (!isSupported) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
    }

    speechSynthesis.speak(utterance);
  }, [isSupported]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getAvailableVoices = useCallback(() => {
    return availableVoices;
  }, [availableVoices]);

  return {
    state: {
      isEnabled,
      isListening,
      isSupported,
      transcript,
      interimTranscript,
      lastCommand,
      error,
      wakeWordDetected,
      lastFeedback: lastCommand?.feedback
    },
    actions: {
      enable,
      disable,
      toggle,
      speak,
      clearError,
      getAvailableVoices
    }
  };
};

// Mock voice commands helper
const getVoiceCommandsHelp = (): string[] => {
  const commands = [
    `"Hey Genesis" - wake word to activate voice control`,
    `"Show navigation" - open main navigation menu`,
    `"Hide navigation" - close main navigation menu`,
    `"Go to home" - navigate to home page`,
    `"Go to settings" - navigate to settings page`,
    `"Scroll up" - scroll page up`,
    `"Scroll down" - scroll page down`,
    `"Play music" - start playing media`,
    `"Pause music" - pause current media`,
    `"Next track" - skip to next track`,
    `"Previous track" - go to previous track`,
    `"Increase volume" - turn up volume`,
    `"Decrease volume" - turn down volume`,
    `"Show help" - display voice commands help`,
    `"Hide help" - close help overlay`,
    `"Toggle theme" - switch between light and dark mode`,
    `"Show notifications" - open notifications panel`,
    `"Hide notifications" - close notifications panel`,
    `"Search for [term]" - search for specific content`,
    `"Open [app name]" - launch specific application`,
    `"Close [window]" - close specific window or panel`
  ];

  return commands;
};

export default function VoiceGlassControl({
  className,
  position = 'top-left',
  autoEnable = false,
  showTranscript = true,
  onVoiceCommand,
  onToggleControls,
  wakeWord = 'Hey Genesis',
  enableFeedback = true,
  showHelp = true,
  maxTranscriptLength = 100
}: VoiceGlassControlProps) {
  const { state, actions } = useVoiceGlassControl();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [feedbackEnabled, setFeedbackEnabled] = useState(enableFeedback);
  const [currentVolume, setCurrentVolume] = useState(75);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-enable on mount if requested
  useEffect(() => {
    if (autoEnable && state.isSupported && !state.isEnabled) {
      actions.enable();
    }
  }, [autoEnable, state.isSupported, state.isEnabled, actions]);

  // Load available voices when speech synthesis is ready
  useEffect(() => {
    const loadVoices = () => {
      const voices = actions.getAvailableVoices();
      if (voices.length > 0 && !selectedVoice) {
        // Prefer English voices
        const englishVoice = voices.find(voice =>
          voice.lang.startsWith('en') && voice.localService
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        setSelectedVoice(englishVoice);
      }
    };

    loadVoices();

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [actions, selectedVoice]);

  // Handle voice command callback
  useEffect(() => {
    if (state.lastCommand && onVoiceCommand) {
      onVoiceCommand(state.lastCommand.originalText, state.lastCommand);
    }
  }, [state.lastCommand, onVoiceCommand]);

  // Handle controls visibility
  useEffect(() => {
    if (state.lastCommand?.type === 'TOGGLE_CONTROLS' && onToggleControls) {
      onToggleControls(state.lastCommand.parameters?.show || false);
    }
  }, [state.lastCommand, onToggleControls]);

  // Mock voice command processing
  const processVoiceCommand = useCallback((transcript: string) => {
    const command = transcript.toLowerCase().trim();

    // Navigation commands
    if (command.includes('show navigation') || command.includes('open menu')) {
      setLastCommand({
        type: 'NAVIGATION',
        action: 'show',
        feedback: 'Navigation menu opened',
        parameters: { target: 'navigation' }
      });
    } else if (command.includes('hide navigation') || command.includes('close menu')) {
      setLastCommand({
        type: 'NAVIGATION',
        action: 'hide',
        feedback: 'Navigation menu closed',
        parameters: { target: 'navigation' }
      });
    } else if (command.includes('go to home')) {
      setLastCommand({
        type: 'NAVIGATION',
        action: 'navigate',
        feedback: 'Navigating to home',
        parameters: { target: 'home' }
      });
    } else if (command.includes('go to settings')) {
      setLastCommand({
        type: 'NAVIGATION',
        action: 'navigate',
        feedback: 'Opening settings',
        parameters: { target: 'settings' }
      });
    }

    // Media commands
    else if (command.includes('play music') || command.includes('play')) {
      setIsPlaying(true);
      setLastCommand({
        type: 'MEDIA',
        action: 'play',
        feedback: 'Playing music',
        parameters: { target: 'music' }
      });
    } else if (command.includes('pause music') || command.includes('pause')) {
      setIsPlaying(false);
      setLastCommand({
        type: 'MEDIA',
        action: 'pause',
        feedback: 'Music paused',
        parameters: { target: 'music' }
      });
    } else if (command.includes('next track') || command.includes('next')) {
      setLastCommand({
        type: 'MEDIA',
        action: 'next',
        feedback: 'Next track',
        parameters: { target: 'music' }
      });
    } else if (command.includes('previous track') || command.includes('previous')) {
      setLastCommand({
        type: 'MEDIA',
        action: 'previous',
        feedback: 'Previous track',
        parameters: { target: 'music' }
      });
    }

    // Volume commands
    else if (command.includes('increase volume') || command.includes('volume up')) {
      const newVolume = Math.min(100, currentVolume + 10);
      setCurrentVolume(newVolume);
      setLastCommand({
        type: 'VOLUME',
        action: 'increase',
        feedback: `Volume set to ${newVolume}%`,
        parameters: { volume: newVolume }
      });
    } else if (command.includes('decrease volume') || command.includes('volume down')) {
      const newVolume = Math.max(0, currentVolume - 10);
      setCurrentVolume(newVolume);
      setLastCommand({
        type: 'VOLUME',
        action: 'decrease',
        feedback: `Volume set to ${newVolume}%`,
        parameters: { volume: newVolume }
      });
    }

    // UI commands
    else if (command.includes('toggle theme')) {
      setLastCommand({
        type: 'UI',
        action: 'toggle_theme',
        feedback: 'Theme toggled',
        parameters: { target: 'theme' }
      });
    } else if (command.includes('show help')) {
      setShowHelpPanel(true);
      setLastCommand({
        type: 'UI',
        action: 'show_help',
        feedback: 'Help panel opened',
        parameters: { target: 'help' }
      });
    } else if (command.includes('hide help')) {
      setShowHelpPanel(false);
      setLastCommand({
        type: 'UI',
        action: 'hide_help',
        feedback: 'Help panel closed',
        parameters: { target: 'help' }
      });
    } else if (command.includes('show notifications')) {
      setLastCommand({
        type: 'UI',
        action: 'show_notifications',
        feedback: 'Notifications panel opened',
        parameters: { target: 'notifications' }
      });
    } else if (command.includes('hide notifications')) {
      setLastCommand({
        type: 'UI',
        action: 'hide_notifications',
        feedback: 'Notifications panel closed',
        parameters: { target: 'notifications' }
      });
    }

    // Help command
    else if (command.includes('what can i say') || command.includes('help')) {
      setShowHelpPanel(true);
      setLastCommand({
        type: 'HELP',
        action: 'show_commands',
        feedback: 'Showing available voice commands',
        parameters: { target: 'commands' }
      });
    }

    // Unknown command
    else {
      setLastCommand({
        type: 'UNKNOWN',
        action: 'unknown',
        feedback: `I didn't understand: "${transcript}"`,
        parameters: { originalText: transcript }
      });
    }
  }, [currentVolume]);

  // Mock function to set last command (would be handled by the hook in real implementation)
  const setLastCommand = (command: any) => {
    // In real implementation, this would update the hook's state
    console.log('Voice command processed:', command);
    if (feedbackEnabled && command.feedback) {
      actions.speak(command.feedback, selectedVoice || undefined);
    }
  };

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4'
  };

  const getStateIcon = () => {
    if (!state.isSupported) return <AlertCircle className="h-5 w-5 text-primary" />;
    if (state.isListening) return <Mic className="h-5 w-5 text-primary" />;
    if (state.wakeWordDetected) return <Mic className="h-5 w-5 text-primary animate-pulse" />;
    if (state.error) return <AlertCircle className="h-5 w-5 text-primary" />;
    if (state.isEnabled) return <MicOff className="h-5 w-5 glass-text-secondary" />;
    return <MicOff className="h-5 w-5 glass-text-secondary" />;
  };

  const getStateColor = () => {
    if (!state.isSupported) return 'border-red-400 bg-red-400/10';
    if (state.isListening) return 'border-blue-400 bg-blue-400/10';
    if (state.wakeWordDetected) return 'border-green-400 bg-green-400/10';
    if (state.error) return 'border-red-400 bg-red-400/10';
    return 'border-gray-400 bg-gray-400/10';
  };

  const getStateDescription = () => {
    if (!state.isSupported) return 'Voice control not supported';
    if (state.isListening) return `Listening for "${wakeWord}"...`;
    if (state.wakeWordDetected) return 'Wake word detected! Speak your command...';
    if (state.error) return state.error;
    if (state.isEnabled) return 'Voice control active - say wake word to begin';
    return 'Voice control inactive';
  };

  const handleTestCommand = () => {
    const testCommands = [
      'show navigation',
      'play music',
      'increase volume',
      'toggle theme',
      'show help'
    ];
    const randomCommand = testCommands[Math.floor(Math.random() * testCommands.length)];
    processVoiceCommand(randomCommand);
  };

  if (!state.isSupported) {
    return (
      <div className={cn('fixed z-50', positionClasses[position], className)}>
        <motion.div
          className="backdrop-blur-lg border border-red/20 glass-surface-red/10 p-3 glass-radius-lg"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-2 text-primary">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Voice control not supported</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      <div className="flex flex-col gap-2">
        {/* Main Control */}
        <motion.div
          className={cn(
            'backdrop-blur-lg border p-3 rounded-lg transition-all duration-300',
            getStateColor()
          )}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-3">
            {/* State Icon */}
            <button
              onClick={actions.toggle}
              className="flex items-center justify-center w-10 h-10 glass-radius-full glass-surface-subtle/10 hover:glass-surface-subtle/20 transition-colors"
            >
              {getStateIcon()}
            </button>

            {/* State Info */}
            <div className="flex-1 min-glass-w-0">
              <div className="text-sm font-medium text-primary">
                Voice Control
              </div>
              <div className="text-xs text-primary/70 truncate">
                {getStateDescription()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {showHelp && (
                <button
                  onClick={() => setShowHelpPanel(true)}
                  className="p-1.5 hover:glass-surface-subtle/10 glass-radius transition-colors"
                  title="Help"
                >
                  <HelpCircle className="h-4 w-4 text-primary/70" />
                </button>
              )}
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 hover:glass-surface-subtle/10 glass-radius transition-colors"
                title="Settings"
              >
                <Settings className="h-4 w-4 text-primary/70" />
              </button>
            </div>
          </div>

          {/* Wake Word Indicator */}
          {state.wakeWordDetected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 p-2 glass-surface-green/20 glass-radius text-xs text-primary text-center"
            >
              🎤 Wake word detected - speak your command now!
            </motion.div>
          )}

          {/* Error Display */}
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-2 glass-surface-red/20 glass-radius text-xs text-primary"
            >
              <div className="flex items-center justify-between">
                <span>{state.error}</span>
                <button
                  onClick={actions.clearError}
                  className="p-0.5 hover:glass-surface-red/20 glass-radius"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Transcript Display */}
          {showTranscript && (state.transcript || state.interimTranscript) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-2 glass-surface-subtle/10 glass-radius text-xs"
            >
              <div className="text-primary font-medium">
                {state.transcript}
                <span className="text-primary/50 italic">
                  {state.interimTranscript}
                </span>
              </div>
            </motion.div>
          )}

          {/* Last Command Feedback */}
          {state.lastFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-2 glass-surface-blue/20 glass-radius text-xs text-primary"
            >
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 glass-mt-0-5 flex-shrink-0" />
                <span>{state.lastFeedback}</span>
              </div>
            </motion.div>
          )}

          {/* Media Controls (when music is playing) */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-2 p-2 glass-surface-subtle/10 glass-radius"
            >
              <button
                onClick={() => setIsPlaying(false)}
                className="p-1 hover:glass-surface-subtle/20 glass-radius"
                title="Pause"
              >
                <Pause className="h-3 w-3 text-primary" />
              </button>
              <button
                onClick={() => processVoiceCommand('previous track')}
                className="p-1 hover:glass-surface-subtle/20 glass-radius"
                title="Previous"
              >
                <SkipBack className="h-3 w-3 text-primary" />
              </button>
              <button
                onClick={() => processVoiceCommand('next track')}
                className="p-1 hover:glass-surface-subtle/20 glass-radius"
                title="Next"
              >
                <SkipForward className="h-3 w-3 text-primary" />
              </button>
              <div className="flex-1 flex items-center gap-2">
                <Volume1 className="h-3 w-3 text-primary/70" />
                <div className="flex-1 glass-surface-subtle/20 glass-radius-full h-1">
                  <div
                    className="glass-surface-blue h-1 glass-radius-full transition-all"
                    style={{ width: `${currentVolume}%` }}
                  />
                </div>
                <span className="text-xs text-primary/70">{currentVolume}%</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="backdrop-blur-lg border border-white/20 glass-surface-subtle/10 p-4 glass-radius-lg w-80">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-primary">Voice Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 hover:glass-surface-subtle/10 glass-radius transition-colors"
                  >
                    <X className="h-4 w-4 text-primary/70" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Wake Word */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Wake Word
                    </label>
                    <input
                      type="text"
                      value={wakeWord}
                      readOnly
                      className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius text-primary text-sm"
                    />
                    <div className="text-xs text-primary/60 mt-1">
                      Say this to activate voice control
                    </div>
                  </div>

                  {/* Voice Selection */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Voice
                    </label>
                    <select
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const voice = actions.getAvailableVoices().find(v => v.name === e.target.value);
                        setSelectedVoice(voice || null);
                      }}
                      className="w-full p-2 glass-surface-subtle/10 border border-white/20 glass-radius text-primary text-sm"
                    >
                      {actions.getAvailableVoices().map(voice => (
                        <option key={voice.name} value={voice.name} className="glass-surface-primary">
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Voice Feedback Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-primary">Voice Feedback</div>
                      <div className="text-xs text-primary/60">Speak command confirmations</div>
                    </div>
                    <button
                      onClick={() => setFeedbackEnabled(!feedbackEnabled)}
                      className={cn(
                        'w-10 h-6 rounded-full transition-colors relative',
                        feedbackEnabled ? 'bg-blue-500' : 'bg-white/20'
                      )}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          feedbackEnabled ? 'transform translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Test Commands */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Test Commands
                    </label>
                    <button
                      onClick={handleTestCommand}
                      className="w-full p-2 glass-surface-blue/20 hover:glass-surface-blue/30 border border-blue/30 glass-radius text-primary text-sm transition-colors"
                    >
                      Try Random Command
                    </button>
                    <button
                      onClick={() => actions.speak('Voice control is working correctly', selectedVoice || undefined)}
                      className="w-full p-2 glass-surface-green/20 hover:glass-surface-green/30 border border-green/30 glass-radius text-primary text-sm transition-colors mt-2"
                    >
                      Test Voice Output
                    </button>
                  </div>

                  {/* Status Info */}
                  <div className="pt-3 border-t border-white/10 space-y-1 text-xs text-primary/60">
                    <div>Status: {state.isEnabled ? 'Enabled' : 'Disabled'}</div>
                    <div>Listening: {state.isListening ? 'Active' : 'Inactive'}</div>
                    <div>Available voices: {actions.getAvailableVoices().length}</div>
                    <div>Volume: {currentVolume}%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelpPanel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="backdrop-blur-lg border border-white/20 glass-surface-subtle/10 p-4 glass-radius-lg w-96 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-primary">Voice Commands</h3>
                  <button
                    onClick={() => setShowHelpPanel(false)}
                    className="p-1 hover:glass-surface-subtle/10 glass-radius transition-colors"
                  >
                    <X className="h-4 w-4 text-primary/70" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-primary/80">
                    Start commands with <span className="font-mono glass-surface-subtle/20 px-1 glass-radius">"{wakeWord}"</span>:
                  </div>

                  <div className="space-y-2">
                    {getVoiceCommandsHelp().slice(0, 10).map((command, index) => (
                      <div key={index} className="p-2 glass-surface-subtle/5 glass-radius text-sm">
                        <div className="text-primary font-mono">"{command}"</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <div className="text-xs text-primary/60">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>Tips:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 ml-5">
                        <li>Speak clearly and at normal volume</li>
                        <li>Wait for the wake word confirmation</li>
                        <li>Use natural language variations</li>
                        <li>Check your microphone permissions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

