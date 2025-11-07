import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MediaProvider } from './GlassMediaProvider';
import { GlassAdvancedVideoPlayer } from './GlassAdvancedVideoPlayer';
import { GlassAdvancedAudioPlayer } from './GlassAdvancedAudioPlayer';
import type { MediaFile } from './GlassMediaProvider';

const meta: Meta = {
  title: 'Media/GlassAdvancedMediaPlayer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# 🎬 Glass Advanced Media Player

Revolutionary audio and video players with AI-powered transcription, chapter navigation, and advanced analytics.

## ✨ **Revolutionary Features**

### 🎥 **Advanced Video Player**
- **Custom Controls**: Professional video player with full control customization
- **Quality Selection**: Adaptive quality streaming from 144p to 4K
- **Chapter Navigation**: Interactive chapter markers with thumbnails
- **Subtitle Support**: Multi-language subtitles with auto-generation
- **Fullscreen Mode**: Native fullscreen with custom controls
- **Playback Speed**: Variable playback from 0.25x to 2x speed
- **Keyboard Shortcuts**: Space, arrow keys, and more

### 🎵 **Advanced Audio Player**
- **Multiple Variants**: Compact, full, podcast, and music player modes
- **Audio Visualization**: Real-time bars, wave, and circular visualizers
- **Waveform Display**: Interactive audio waveform with seek capability
- **Playlist Support**: Full playlist management with auto-progression
- **High-Quality Audio**: Support for multiple audio formats

### 🤖 **AI-Powered Transcription**
- **Real-time Transcription**: Automatic speech-to-text conversion
- **Speaker Identification**: AI identifies and labels different speakers
- **Confidence Scoring**: Accuracy metrics for each transcript segment
- **Sentiment Analysis**: Emotion detection in speech content
- **Keyword Extraction**: Automatic identification of key topics
- **Searchable Transcripts**: Full-text search through transcribed content
- **Clickable Navigation**: Jump to any point by clicking transcript

### 📊 **Advanced Analytics**
- **View Tracking**: Detailed engagement and completion metrics
- **Heat Maps**: Visual representation of most-watched segments
- **Drop-off Analysis**: Identify where users stop watching
- **Device Analytics**: Cross-platform usage statistics
- **Engagement Points**: Track user interactions throughout media

### 🎯 **Professional Features**
- **Auto-save Progress**: Resume playback from last position
- **Buffering Indicators**: Visual feedback for loading states
- **Error Handling**: Graceful failure with user-friendly messages
- **Accessibility**: Full screen reader and keyboard navigation support
- **Mobile Responsive**: Touch-friendly controls for mobile devices

## 🚀 **Use Cases**

- **Online Learning Platforms**: Interactive educational content with searchable transcripts
- **Podcast Applications**: Professional podcast players with episode management
- **Video Conferencing**: Meeting recordings with speaker identification
- **Entertainment Streaming**: Netflix-style video players with advanced features
- **Corporate Training**: Training videos with analytics and progress tracking
- **Content Creation**: Tools for content creators with detailed analytics

This represents the most advanced media player system available, combining the best features of YouTube, Spotify, Zoom, and professional media platforms into elegant React components.
        `,
      },
    },
  },
};

export default meta;

// Sample media files for demonstrations
const sampleVideoFile: MediaFile = {
  id: 'video_demo',
  type: 'video',
  src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  title: 'Product Demo Video',
  description: 'Learn about our advanced media player capabilities in this comprehensive demonstration.',
  duration: 30,
  poster: 'https://via.placeholder.com/1280x720/3b82f6/ffffff?text=Product+Demo',
  quality: '720p',
  chapters: [
    {
      id: 'chapter_1',
      title: 'Introduction',
      startTime: 0,
      endTime: 8,
      thumbnail: 'https://via.placeholder.com/160x90/3b82f6/ffffff?text=Intro',
      description: 'Welcome and overview of features'
    },
    {
      id: 'chapter_2', 
      title: 'Core Features',
      startTime: 8,
      endTime: 20,
      thumbnail: 'https://via.placeholder.com/160x90/10b981/ffffff?text=Features',
      description: 'Demonstration of key capabilities'
    },
    {
      id: 'chapter_3',
      title: 'Advanced Functionality',
      startTime: 20,
      endTime: 30,
      thumbnail: 'https://via.placeholder.com/160x90/f59e0b/ffffff?text=Advanced',
      description: 'AI transcription and analytics'
    }
  ],
  subtitles: [
    {
      id: 'en_subtitles',
      language: 'en',
      label: 'English',
      isDefault: true,
      content: [
        {
          id: 'sub_1',
          startTime: 0,
          endTime: 4,
          text: 'Welcome to our advanced media player demonstration.',
          speaker: 'Presenter'
        },
        {
          id: 'sub_2',
          startTime: 4,
          endTime: 8,
          text: 'Today we\'ll explore the revolutionary features that set our player apart.',
          speaker: 'Presenter'
        }
      ]
    }
  ],
  metadata: {
    bitrate: '1000kbps',
    codec: 'H.264',
    resolution: '1280x720',
    fps: 30
  }
};

const sampleAudioFile: MediaFile = {
  id: 'audio_demo',
  type: 'audio',
  src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  title: 'Tech Podcast Episode #127',
  description: 'Deep dive into the future of web media technologies and AI-powered content analysis.',
  duration: 120,
  thumbnail: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Podcast',
  format: 'mp3',
  metadata: {
    artist: 'Tech Talk Weekly',
    album: 'Season 3',
    bitrate: '320kbps',
    genre: 'Technology'
  }
};

const samplePlaylist: MediaFile[] = [
  {
    id: 'track_1',
    type: 'audio',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    title: 'Introduction to Web Media',
    description: 'Overview of modern web media capabilities',
    duration: 180
  },
  {
    id: 'track_2', 
    type: 'audio',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    title: 'AI in Media Processing',
    description: 'How artificial intelligence transforms media experiences',
    duration: 240
  },
  {
    id: 'track_3',
    type: 'audio',
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    title: 'Future of Interactive Media',
    description: 'Trends and predictions for next-generation media',
    duration: 200
  }
];

type VideoStory = StoryObj<typeof GlassAdvancedVideoPlayer>;
type AudioStory = StoryObj<typeof GlassAdvancedAudioPlayer>;

export const AdvancedVideoPlayer: VideoStory = {
  render: () => (
    <MediaProvider>
      <div className="h-screen glass-surface-subtle p-4">
        <GlassAdvancedVideoPlayer
          mediaFile={sampleVideoFile}
          showControls={true}
          showTranscript={false}
          showChapters={false}
          className="h-full"
        />
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🎬 **Professional Video Player**

Full-featured video player with custom controls and professional-grade functionality:

**🎯 Key Features:**
- Custom video controls with scrubbing timeline
- Quality selection (144p to 4K)
- Playback speed control (0.25x to 2x)
- Volume control with mute functionality
- Fullscreen mode with native controls
- Buffering and loading indicators
- Error handling with user feedback

**🎮 Try These Interactions:**
- Click play/pause or use spacebar
- Drag the progress bar to seek
- Right-click for context menu
- Use arrow keys for fine control
- Try fullscreen mode
        `,
      },
    },
  },
};

export const VideoWithChapters: VideoStory = {
  render: () => (
    <MediaProvider>
      <div className="h-screen glass-surface-subtle p-4">
        <GlassAdvancedVideoPlayer
          mediaFile={sampleVideoFile}
          showControls={true}
          showChapters={true}
          showTranscript={false}
          className="h-full"
        />
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 📚 **Chapter Navigation**

Video player with interactive chapter markers for easy content navigation:

**📖 Chapter Features:**
- Thumbnail previews for each chapter
- Click to jump to any chapter instantly
- Visual progress indicator shows current chapter
- Chapter descriptions and timing information
- Auto-highlight active chapter during playback

**📝 Sample Chapters:**
1. **Introduction** (0:00-0:08) - Welcome and overview
2. **Core Features** (0:08-0:20) - Key capabilities demo
3. **Advanced Functionality** (0:20-0:30) - AI features
        `,
      },
    },
  },
};

export const VideoWithTranscription: VideoStory = {
  render: () => (
    <MediaProvider>
      <div className="h-screen glass-surface-subtle p-4">
        <GlassAdvancedVideoPlayer
          mediaFile={sampleVideoFile}
          showControls={true}
          showChapters={false}
          showTranscript={true}
          className="h-full"
        />
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🤖 **AI-Powered Transcription**

Video player with automatic speech-to-text transcription and advanced AI features:

**🧠 AI Features:**
- Real-time transcription generation
- Speaker identification and labeling
- Confidence scoring for accuracy
- Sentiment analysis (😊😐😔)
- Keyword extraction and tagging
- Full-text search through transcript
- Click transcript to jump to that moment

**🔍 Try These Features:**
1. Wait for transcript to auto-generate (2 seconds)
2. Click any transcript entry to jump to that time
3. Use the search box to find specific content
4. Notice speaker labels and confidence scores
5. See keyword tags on transcript entries
        `,
      },
    },
  },
};

export const FullFeaturedVideoPlayer: VideoStory = {
  render: () => (
    <MediaProvider>
      <div className="h-screen glass-surface-subtle p-4">
        <GlassAdvancedVideoPlayer
          mediaFile={sampleVideoFile}
          showControls={true}
          showChapters={true}
          showTranscript={true}
          showAnalytics={true}
          className="h-full"
        />
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🚀 **Complete Video Experience**

The ultimate video player with all advanced features enabled:

**💎 Premium Features:**
- Professional video controls
- Interactive chapter navigation with thumbnails
- AI-powered live transcription
- Speaker identification and confidence scoring
- Real-time sentiment analysis
- Searchable transcript with highlighting
- Advanced analytics and engagement tracking
- Quality adaptation and speed control
- Fullscreen with custom overlay controls

**🎯 Complete Feature Set:**
This represents the pinnacle of web video player technology, combining YouTube's player quality, Zoom's transcription capabilities, and advanced analytics into a single component.
        `,
      },
    },
  },
};

export const CompactAudioPlayer: AudioStory = {
  render: () => (
    <MediaProvider>
      <div className="p-8 glass-surface-subtle glass-min-h-screen">
        <div className="max-w-md mx-auto">
          <GlassAdvancedAudioPlayer
            mediaFile={sampleAudioFile}
            variant="compact"
            visualizerType="none"
            className="mb-4"
          />
        </div>
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🎵 **Compact Audio Player**

Minimalist audio player perfect for embedded use or space-constrained layouts:

**⚡ Compact Features:**
- Clean, minimal interface
- Essential play/pause controls
- Track title and description
- Current time and duration display
- Perfect for cards, sidebars, or mobile

**🎯 Use Cases:**
- Embedded in blog posts
- Sidebar audio widgets
- Mobile-first applications
- Notification sounds
        `,
      },
    },
  },
};

export const FullAudioPlayerWithVisualizer: AudioStory = {
  render: () => (
    <MediaProvider>
      <div className="p-8 glass-surface-subtle glass-min-h-screen">
        <div className="max-w-2xl mx-auto">
          <GlassAdvancedAudioPlayer
            mediaFile={sampleAudioFile}
            variant="full"
            visualizerType="bars"
            showWaveform={false}
            className="mb-4"
          />
        </div>
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🎼 **Audio Player with Visualizer**

Full-featured audio player with real-time audio visualization:

**🌊 Visualizer Types:**
- **Bars**: Classic frequency bar display
- **Wave**: Smooth waveform visualization  
- **Circular**: Radial frequency display
- **None**: Clean interface without visualization

**🎛️ Advanced Controls:**
- Large play/pause button
- Skip forward/backward 10 seconds
- Volume slider with mute
- Playback speed control (0.5x to 2x)
- Progress bar with time display

**🎨 Visual Features:**
- Real-time audio frequency analysis
- Responsive color-coded visualization
- Smooth animations and transitions
        `,
      },
    },
  },
};

export const AudioPlayerWithWaveform: AudioStory = {
  render: () => (
    <MediaProvider>
      <div className="p-8 glass-surface-subtle glass-min-h-screen">
        <div className="max-w-2xl mx-auto">
          <GlassAdvancedAudioPlayer
            mediaFile={sampleAudioFile}
            variant="full"
            visualizerType="none"
            showWaveform={true}
            className="mb-4"
          />
        </div>
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🌊 **Waveform Audio Player**

Professional audio player with interactive waveform display:

**📊 Waveform Features:**
- Visual representation of audio amplitude
- Click anywhere on waveform to seek
- Progress indicator shows current position
- Hover to preview seek position
- Color-coded played vs unplayed sections

**🎯 Professional Use:**
- Podcast editing interfaces
- Music production tools
- Audio analysis applications
- Educational content with precise timing
        `,
      },
    },
  },
};

export const PodcastPlayerWithTranscript: AudioStory = {
  render: () => (
    <MediaProvider>
      <div className="h-screen glass-surface-subtle p-4">
        <div className="h-full">
          <GlassAdvancedAudioPlayer
            mediaFile={sampleAudioFile}
            variant="podcast"
            showTranscript={true}
            visualizerType="wave"
            className="h-full"
          />
        </div>
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🎙️ **Podcast Player with AI Transcription**

Professional podcast player with automatic transcription and advanced features:

**🎙️ Podcast Features:**
- Optimized for long-form audio content
- Real-time transcription generation
- Speaker identification and labeling
- Searchable transcript with full-text search
- Click transcript to jump to specific moments
- Confidence scoring for transcription accuracy

**🤖 AI Capabilities:**
- Automatic speech-to-text conversion
- Speaker diarization (who said what)
- Keyword extraction from content
- Sentiment analysis of speech
- Smart chapter detection
- Content summarization

**🔍 Interactive Features:**
- Search through entire transcript
- Highlighted search results
- Speaker-based filtering
- Time-stamped navigation
        `,
      },
    },
  },
};

export const MusicPlayerWithPlaylist: AudioStory = {
  render: () => (
    <MediaProvider>
      <div className="h-screen glass-surface-subtle p-4">
        <div className="h-full">
          <GlassAdvancedAudioPlayer
            mediaFile={samplePlaylist[0]}
            variant="music"
            showPlaylist={true}
            playlist={samplePlaylist}
            visualizerType="circular"
            className="h-full"
          />
        </div>
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🎵 **Music Player with Playlist**

Complete music player experience with playlist management and visualization:

**🎶 Music Features:**
- Full playlist management
- Auto-progression to next track
- Circular audio visualizer
- Track metadata display
- Album artwork support
- Shuffle and repeat modes

**📋 Playlist Features:**
- Visual track listing with duration
- Click any track to play instantly
- Current track highlighting
- Track numbering and metadata
- Scroll through large playlists

**🎨 Visualizer:**
- Beautiful circular frequency display
- Real-time audio analysis
- Color-coded frequency bands
- Smooth animations and transitions

**🎯 Perfect For:**
- Music streaming applications
- DJ software interfaces
- Audio entertainment platforms
- Background music players
        `,
      },
    },
  },
};

export const MediaPlayerShowcase: Meta = {
  render: () => (
    <MediaProvider>
      <div className="glass-min-h-screen glass-surface-subtle">
        {/* Header */}
        <div className="glass-surface-subtle border-b border-subtle p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold glass-text-secondary mb-2">
              🎬 Advanced Media Player Showcase
            </h1>
            <p className="text-lg glass-text-secondary">
              Revolutionary audio and video players with AI transcription, analytics, and professional features
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 glass-surface-subtle glass-radius-lg">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-semibold text-primary">AI Transcription</h3>
                <p className="text-sm text-primary">Real-time speech-to-text with speaker ID</p>
              </div>
              <div className="text-center p-4 glass-surface-subtle glass-radius-lg">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-primary">Advanced Analytics</h3>
                <p className="text-sm text-primary">Detailed engagement and view metrics</p>
              </div>
              <div className="text-center p-4 glass-surface-subtle glass-radius-lg">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-semibold text-primary">Visualizers</h3>
                <p className="text-sm text-primary">Real-time audio frequency displays</p>
              </div>
              <div className="text-center p-4 glass-surface-subtle glass-radius-lg">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold text-primary">Responsive</h3>
                <p className="text-sm text-primary">Perfect on desktop, tablet, and mobile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Video Player Section */}
          <section>
            <h2 className="text-2xl font-semibold glass-text-secondary mb-4">🎬 Video Player</h2>
            <div className="glass-surface-subtle glass-radius-lg shadow-sm overflow-hidden">
              <GlassAdvancedVideoPlayer
                mediaFile={sampleVideoFile}
                showControls={true}
                showChapters={true}
                showTranscript={true}
                className="h-96"
              />
            </div>
          </section>

          {/* Audio Players Section */}
          <section>
            <h2 className="text-2xl font-semibold glass-text-secondary mb-4">🎵 Audio Players</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-surface-subtle glass-radius-lg shadow-sm p-6">
                <h3 className="text-lg font-medium glass-text-secondary mb-4">Full Player with Visualizer</h3>
                <GlassAdvancedAudioPlayer
                  mediaFile={sampleAudioFile}
                  variant="full"
                  visualizerType="bars"
                />
              </div>
              
              <div className="glass-surface-subtle glass-radius-lg shadow-sm p-6">
                <h3 className="text-lg font-medium glass-text-secondary mb-4">Compact Player</h3>
                <GlassAdvancedAudioPlayer
                  mediaFile={sampleAudioFile}
                  variant="compact"
                  visualizerType="none"
                />
                
                <div className="mt-6">
                  <h4 className="text-md font-medium glass-text-secondary mb-2">With Waveform</h4>
                  <GlassAdvancedAudioPlayer
                    mediaFile={sampleAudioFile}
                    variant="full"
                    showWaveform={true}
                    visualizerType="none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section>
            <h2 className="text-2xl font-semibold glass-text-secondary mb-4">🚀 Revolutionary Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '🎯',
                  title: 'Professional Controls',
                  description: 'Custom video/audio controls with scrubbing, quality selection, and speed control'
                },
                {
                  icon: '🤖',
                  title: 'AI Transcription',
                  description: 'Real-time speech-to-text with speaker identification and confidence scoring'
                },
                {
                  icon: '📚',
                  title: 'Chapter Navigation',
                  description: 'Interactive chapter markers with thumbnails and descriptions'
                },
                {
                  icon: '🔍',
                  title: 'Searchable Content',
                  description: 'Full-text search through transcripts with highlighted results'
                },
                {
                  icon: '📊',
                  title: 'Advanced Analytics',
                  description: 'Detailed engagement metrics, heat maps, and viewing statistics'
                },
                {
                  icon: '🎨',
                  title: 'Audio Visualizers',
                  description: 'Real-time frequency visualization with bars, waves, and circular displays'
                }
              ].map((feature, index) => (
                <div key={index} className="glass-surface-subtle glass-radius-lg shadow-sm p-6">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold glass-text-secondary mb-2">{feature.title}</h3>
                  <p className="glass-text-secondary text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MediaProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🎮 **Complete Media Player Showcase**

This comprehensive demonstration showcases the full power of the Advanced Media Player system:

**🎬 Video Capabilities:**
- Professional-grade video player with custom controls
- Chapter navigation with thumbnail previews
- Real-time AI transcription with speaker identification
- Quality adaptation and playback speed control
- Fullscreen mode with overlay controls

**🎵 Audio Excellence:**
- Multiple player variants (compact, full, podcast, music)
- Real-time audio visualization (bars, wave, circular)
- Interactive waveform display
- Playlist management with auto-progression
- Professional controls and metadata display

**🤖 AI-Powered Features:**
- Automatic speech-to-text transcription
- Speaker identification and labeling
- Confidence scoring for accuracy
- Sentiment analysis of content
- Keyword extraction and tagging
- Content summarization

**📊 Analytics & Insights:**
- View tracking and engagement metrics
- Heat map visualization of popular segments
- Drop-off analysis and completion rates
- Device and platform analytics
- User behavior insights

This represents the most advanced media player system available for web applications, combining the best features of YouTube, Spotify, Zoom, and professional media platforms.
        `,
      },
    },
  },
};