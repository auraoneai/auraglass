/* Frozen 4.x story props for the W3 (AI) compat adapters — REQ-SURF-13.
   Copied from the named release/4.x story files (645735fce): meta `args`
   merged with the Default story's args. `Date.now()`-relative timestamps are
   pinned; `fn()` callbacks are injected by the test. */
import type { StoryArgs } from '../app-shell/story-args';

const NOW = Date.UTC(2026, 9, 7, 12, 0, 0);

export const W3_STORY_ARGS: Record<string, StoryArgs> = {
  GlassChat: {
    story: 'src/components/interactive/GlassChat.stories.tsx (meta args)',
    props: {
      messages: [
        { id: '1', content: 'Hello! This is a sample chat message.', sender: { id: 'user1', name: 'Alice', avatar: '', status: 'online' }, timestamp: new Date(NOW - 60000), type: 'text' },
        { id: '2', content: 'Hi Alice! How are you doing?', sender: { id: 'user2', name: 'Bob', avatar: '', status: 'online' }, timestamp: new Date(NOW - 30000), type: 'text' },
      ],
      title: 'General Chat',
      enableReactions: true,
      currentUserId: 'user1',
    },
    expectText: ['Hello! This is a sample chat message.', 'Hi Alice! How are you doing?'],
  },
  GlassChatInput: {
    story: 'src/components/interactive/GlassChatInput.stories.tsx (meta args)',
    props: { disabled: false, placeholder: 'Type a message...', enableAttachments: true, enableVoice: false, enableEmoji: true, maxLength: 1000 },
  },
  GlassMessageList: {
    story: 'src/components/interactive/GlassMessageList.stories.tsx (meta args + Default)',
    props: {
      currentUserId: 'user1',
      enableReactions: true,
      showTimestamps: true,
      showAvatars: true,
      messages: [
        { id: '1', content: 'Hello everyone! Welcome to the chat.', sender: { id: 'user1', name: 'Alice', avatar: '', status: 'online' }, timestamp: new Date(NOW - 300000), type: 'text' },
        { id: '2', content: 'Thanks Alice! Glad to be here.', sender: { id: 'user2', name: 'Bob', avatar: '', status: 'online' }, timestamp: new Date(NOW - 240000), type: 'text' },
        { id: '3', content: 'How is everyone doing today?', sender: { id: 'user3', name: 'Charlie', avatar: '', status: 'away' }, timestamp: new Date(NOW - 180000), type: 'text' },
      ],
    },
    expectText: ['Hello everyone! Welcome to the chat.', 'How is everyone doing today?'],
  },
  GlassTypingIndicator: {
    story: 'src/components/chat/GlassTypingIndicator.stories.tsx (meta args)',
    props: { users: ['Maya', 'Ari'], showUsers: true, size: 'md', elevation: 'level2', variant: 'bounce', dotColor: 'primary', dotCount: 3, glass: true },
    expectText: ['Maya, Ari are typing'],
  },
};
