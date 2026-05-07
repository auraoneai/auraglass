import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassIntelligentSearch, SearchResult } from './GlassIntelligentSearch';

const SearchStoryFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    className="glass-intelligent-search-story-frame"
    style={{
      width: '100%',
      height: '100vh',
      minHeight: 0,
      boxSizing: 'border-box',
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: 'clamp(16px, 3vw, 32px)',
      color: '#0f172a',
      background:
        'linear-gradient(135deg, rgba(239,246,255,0.95), rgba(240,253,250,0.9) 52%, rgba(248,250,252,0.96))',
    }}
  >
    <div style={{ width: 'min(100%, 1120px)', margin: '0 auto' }}>{children}</div>
    <style>{`
      .glass-intelligent-search-story-frame,
      .glass-intelligent-search-story-frame * {
        box-sizing: border-box;
      }

      .glass-intelligent-search-story-frame .glass-intelligent-search-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.84), rgba(248, 250, 252, 0.72)), rgba(255, 255, 255, 0.78) !important;
        background-color: rgba(255, 255, 255, 0.78) !important;
      }

      .glass-intelligent-search-story-frame .glass-intelligent-search-dropdown {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.86)), rgba(255, 255, 255, 0.9) !important;
        background-color: rgba(255, 255, 255, 0.9) !important;
      }

      .glass-intelligent-search-story-frame .glass-intelligent-search input[type="text"] {
        background: rgba(255, 255, 255, 0.78) !important;
        background-color: rgba(255, 255, 255, 0.78) !important;
      }

      .glass-intelligent-search-story-frame .search-story-surface {
        display: grid;
        gap: 24px;
      }

      .glass-intelligent-search-story-frame .search-story-hero,
      .glass-intelligent-search-story-frame .search-story-callout {
        border: 1px solid rgba(15, 23, 42, 0.12);
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.72);
        box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
        backdrop-filter: blur(22px) saturate(1.35);
      }

      .glass-intelligent-search-story-frame .search-story-hero {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(220px, 0.75fr);
        gap: 24px;
        align-items: center;
        padding: clamp(20px, 3vw, 32px);
      }

      .glass-intelligent-search-story-frame .search-story-hero h1 {
        margin: 0 0 10px;
        color: #0f172a;
        font-size: clamp(1.6rem, 3vw, 2.45rem);
        line-height: 1.08;
      }

      .glass-intelligent-search-story-frame .search-story-hero p,
      .glass-intelligent-search-story-frame .search-story-callout p {
        margin: 0;
        color: #334155;
        line-height: 1.6;
      }

      .glass-intelligent-search-story-frame .search-story-metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .glass-intelligent-search-story-frame .search-story-metric {
        min-height: 88px;
        border: 1px solid rgba(15, 23, 42, 0.1);
        border-radius: 16px;
        padding: 14px;
        background: rgba(255, 255, 255, 0.62);
      }

      .glass-intelligent-search-story-frame .search-story-metric strong {
        display: block;
        color: #0f172a;
        font-size: 1.4rem;
        line-height: 1.1;
        overflow-wrap: anywhere;
      }

      .glass-intelligent-search-story-frame .search-story-metric span {
        display: block;
        margin-top: 6px;
        color: #475569;
        font-size: 0.875rem;
      }

      .glass-intelligent-search-story-frame .search-story-callout {
        padding: 22px;
      }

      .glass-intelligent-search-story-frame .search-story-callout h3,
      .glass-intelligent-search-story-frame .search-story-callout h4 {
        margin: 0 0 10px;
        color: #0f172a;
      }

      .glass-intelligent-search-story-frame .search-story-examples {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
        margin-top: 14px;
      }

      .glass-intelligent-search-story-frame .search-story-examples ul {
        margin: 0;
        padding-left: 1.1rem;
        color: #334155;
        line-height: 1.7;
      }

      .glass-intelligent-search-story-frame .search-compact {
        max-width: 42rem !important;
      }

      @media (max-width: 760px) {
        .glass-intelligent-search-story-frame .search-story-hero,
        .glass-intelligent-search-story-frame .search-story-examples {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </div>
);

const meta: Meta<typeof GlassIntelligentSearch> = {
  title: 'Controls/Search/Glass Intelligent Search',
  component: GlassIntelligentSearch,
  decorators: [
    (Story) => (
      <SearchStoryFrame>
        <Story />
      </SearchStoryFrame>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Advanced search interface with NLP capabilities, smart filters, voice search, and intelligent suggestions - like Google or Elasticsearch with AI enhancement.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassIntelligentSearch>;

// Sample data for search demonstrations
const sampleData: SearchResult[] = [
  {
    id: '1',
    title: 'Getting Started with React Hooks',
    description: 'Learn how to use React Hooks to manage state and side effects in functional components. This comprehensive guide covers useState, useEffect, useContext, and custom hooks.',
    category: 'Tutorial',
    tags: ['react', 'hooks', 'javascript', 'frontend', 'web development'],
    score: 0,
    metadata: { rating: 4.8, author: 'Jane Smith', date: '2024-01-15' }
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description: 'Master advanced TypeScript concepts including generics, conditional types, mapped types, and utility types. Build type-safe applications with confidence.',
    category: 'Documentation',
    tags: ['typescript', 'patterns', 'advanced', 'types', 'programming'],
    score: 0,
    metadata: { rating: 4.6, author: 'John Doe', date: '2024-02-20' }
  },
  {
    id: '3',
    title: 'Building Responsive Design Systems',
    description: 'Create scalable design systems with CSS-in-JS, design tokens, and component libraries. Learn best practices for responsive design and accessibility.',
    category: 'Article',
    tags: ['design system', 'css', 'responsive', 'accessibility', 'ui/ux'],
    score: 0,
    metadata: { rating: 4.9, author: 'Alice Johnson', date: '2024-03-10' }
  },
  {
    id: '4',
    title: 'Node.js Performance Optimization',
    description: 'Optimize your Node.js applications for better performance. Learn about memory management, clustering, caching strategies, and monitoring tools.',
    category: 'Guide',
    tags: ['nodejs', 'performance', 'optimization', 'backend', 'javascript'],
    score: 0,
    metadata: { rating: 4.5, author: 'Bob Wilson', date: '2024-01-25' }
  },
  {
    id: '5',
    title: 'Introduction to Machine Learning',
    description: 'Start your journey into machine learning with Python. Cover supervised and unsupervised learning, neural networks, and practical applications.',
    category: 'Course',
    tags: ['machine learning', 'python', 'ai', 'neural networks', 'data science'],
    score: 0,
    metadata: { rating: 4.7, author: 'Dr. Sarah Chen', date: '2024-02-05' }
  },
  {
    id: '6',
    title: 'GraphQL API Development',
    description: 'Build efficient APIs with GraphQL. Learn about schemas, resolvers, subscriptions, and integration with React applications.',
    category: 'Tutorial',
    tags: ['graphql', 'api', 'react', 'backend', 'web development'],
    score: 0,
    metadata: { rating: 4.4, author: 'Mike Rodriguez', date: '2024-03-01' }
  },
  {
    id: '7',
    title: 'Docker Containerization Guide',
    description: 'Containerize your applications with Docker. Learn about images, containers, Docker Compose, and deployment strategies.',
    category: 'Guide',
    tags: ['docker', 'containerization', 'deployment', 'devops', 'infrastructure'],
    score: 0,
    metadata: { rating: 4.6, author: 'Emily Davis', date: '2024-01-30' }
  },
  {
    id: '8',
    title: 'CSS Grid and Flexbox Mastery',
    description: 'Master modern CSS layout techniques with Grid and Flexbox. Create complex layouts with ease and build responsive designs.',
    category: 'Tutorial',
    tags: ['css', 'grid', 'flexbox', 'layout', 'responsive design'],
    score: 0,
    metadata: { rating: 4.8, author: 'Tom Anderson', date: '2024-02-15' }
  },
  {
    id: '9',
    title: 'Vue.js 3 Composition API',
    description: 'Explore Vue.js 3 and the Composition API. Learn about reactive state management, component composition, and modern Vue development.',
    category: 'Documentation',
    tags: ['vue', 'composition api', 'javascript', 'frontend', 'web development'],
    score: 0,
    metadata: { rating: 4.5, author: 'Lisa Wong', date: '2024-03-05' }
  },
  {
    id: '10',
    title: 'Database Design Principles',
    description: 'Learn fundamental database design principles. Cover normalization, indexing, relationships, and performance optimization strategies.',
    category: 'Guide',
    tags: ['database', 'design', 'sql', 'normalization', 'performance'],
    score: 0,
    metadata: { rating: 4.7, author: 'David Kim', date: '2024-01-20' }
  },
  {
    id: '11',
    title: 'AWS Cloud Architecture',
    description: 'Design scalable cloud architectures on AWS. Learn about EC2, S3, Lambda, RDS, and best practices for cloud-native applications.',
    category: 'Course',
    tags: ['aws', 'cloud', 'architecture', 'serverless', 'infrastructure'],
    score: 0,
    metadata: { rating: 4.9, author: 'Jennifer Lee', date: '2024-02-28' }
  },
  {
    id: '12',
    title: 'Testing Strategies for React Apps',
    description: 'Comprehensive testing strategies for React applications. Cover unit testing, integration testing, and end-to-end testing with modern tools.',
    category: 'Article',
    tags: ['testing', 'react', 'jest', 'cypress', 'quality assurance'],
    score: 0,
    metadata: { rating: 4.6, author: 'Chris Taylor', date: '2024-03-12' }
  }
];

export const BasicSearch: Story = {
  args: {
    data: sampleData,
    placeholder: "Search for tutorials, articles, and guides...",
    showFilters: true,
    showSuggestions: true,
    enableNLP: false,
    enableVoiceSearch: false,
    maxResults: 10
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic search interface with text matching and filters. Try searching for "React", "TypeScript", or "CSS".',
      },
    },
  },
};

export const IntelligentNLP: Story = {
  args: {
    data: sampleData,
    placeholder: "Ask me anything in natural language...",
    showFilters: true,
    showSuggestions: true,
    enableNLP: true,
    enableVoiceSearch: true,
    maxResults: 10
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced search with NLP capabilities. Try queries like "find the best React tutorials", "show me guides about performance", or "compare frontend frameworks".',
      },
    },
  },
};

export const VoiceSearch: Story = {
  args: {
    data: sampleData,
    placeholder: "Click the microphone to search with your voice...",
    showFilters: false,
    showSuggestions: true,
    enableNLP: true,
    enableVoiceSearch: true,
    maxResults: 8
  },
  parameters: {
    docs: {
      description: {
        story: 'Voice-enabled search with speech recognition. Click the microphone button and speak your search query.',
      },
    },
  },
};

export const FiltersOnly: Story = {
  args: {
    data: sampleData,
    placeholder: "Use filters to find content...",
    showFilters: true,
    showSuggestions: false,
    enableNLP: false,
    enableVoiceSearch: false,
    maxResults: 15
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus on advanced filtering capabilities. Use the filter controls to narrow down results by category, tags, and rating.',
      },
    },
  },
};

export const SearchShowcase: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedTitle, setSelectedTitle] = React.useState('No result selected');

    const handleSearch = (query: string, filters: Record<string, any>) => {
      setSearchQuery(query);
    };

    const handleResultClick = (result: SearchResult) => {
      setSelectedTitle(result.title);
    };

    return (
      <div className="search-story-surface">
        <section className="search-story-hero">
          <div>
            <h1>Knowledge Search Workspace</h1>
            <p>
              Natural-language search, adaptive filters, suggestions, and result scoring are composed as a real documentation workspace.
            </p>
          </div>
          <div className="search-story-metrics" aria-label="Search demo metrics">
            <div className="search-story-metric">
              <strong>{sampleData.length}</strong>
              <span>indexed records</span>
            </div>
            <div className="search-story-metric">
              <strong>3</strong>
              <span>filter dimensions</span>
            </div>
            <div className="search-story-metric">
              <strong>{searchQuery || 'Ready'}</strong>
              <span>current query</span>
            </div>
            <div className="search-story-metric">
              <strong>{selectedTitle}</strong>
              <span>selection state</span>
            </div>
          </div>
        </section>

        <GlassIntelligentSearch
          data={sampleData}
          onSearch={handleSearch}
          onResultClick={handleResultClick}
          placeholder="Try: 'find the best React tutorials' or 'show me guides about performance'"
          showFilters={true}
          showSuggestions={true}
          enableNLP={true}
          enableVoiceSearch={true}
          maxResults={12}
        />

        <section className="search-story-callout">
          <h3>Recommended demo queries</h3>
          <p>
            These examples exercise scoring, suggestions, query analysis, and multi-select filter controls without depending on external services.
          </p>
          <div className="search-story-examples">
            <div>
              <h4>Natural language</h4>
              <ul>
                <li>Find the best React tutorials</li>
                <li>Show me guides about performance</li>
                <li>Compare frontend frameworks</li>
                <li>Help me learn machine learning</li>
              </ul>
            </div>
            <div>
              <h4>Feature coverage</h4>
              <ul>
                <li>Type to reveal suggestions and result highlighting</li>
                <li>Filter by category, tags, and minimum rating</li>
                <li>Inspect NLP intent and extracted keywords</li>
                <li>Select a result to update the workspace state</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of the intelligent search system with all advanced features enabled.',
      },
    },
  },
};

export const LargeDataset: Story = {
  render: () => {
    // Generate larger dataset for performance testing
    const categories = ['Tutorial', 'Article', 'Guide', 'Course', 'Documentation', 'Video', 'Podcast', 'Tool'];
    const technologies = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'Go', 'Rust', 'Java'];
    const topics = ['Performance', 'Security', 'Testing', 'Design', 'Architecture', 'DevOps', 'Database', 'API', 'Frontend', 'Backend'];
    
    const largeDataset: SearchResult[] = Array.from({ length: 100 }, (_, i) => {
      const tech = technologies[i % technologies.length];
      const topic = topics[i % topics.length];
      const category = categories[i % categories.length];
      const rating = 3 + ((i * 17) % 21) / 10;
      const month = String((i % 12) + 1).padStart(2, '0');
      const day = String((i % 28) + 1).padStart(2, '0');
      
      return {
        id: `item-${i}`,
        title: `${topic} in ${tech} - ${category} #${i + 1}`,
        description: `Learn about ${topic.toLowerCase()} concepts in ${tech}. This ${category.toLowerCase()} covers advanced techniques, best practices, and real-world applications for modern development.`,
        category,
        tags: [tech.toLowerCase(), topic.toLowerCase(), category.toLowerCase(), 'programming', 'development'],
        score: 0,
        metadata: { 
          rating: Math.round(rating * 10) / 10,
          author: `Author ${i + 1}`,
          date: `2024-${month}-${day}`
        }
      };
    });

    return (
      <div className="glass-space-y-4">
        <div className="glass-surface-subtle glass-p-4 glass-radius-lg">
          <h3 className="glass-font-semibold glass-text-primary glass-mb-2">Performance Test Dataset</h3>
          <p className="glass-text-primary glass-text-sm">
            This demo uses {largeDataset.length} items to test search performance with larger datasets. 
            Try searching for technology names, topics, or categories to see how the intelligent search handles scale.
          </p>
        </div>

        <GlassIntelligentSearch
          data={largeDataset}
          placeholder="Search through 100+ items with intelligent filtering..."
          showFilters={true}
          showSuggestions={true}
          enableNLP={true}
          enableVoiceSearch={true}
          maxResults={20}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with a larger dataset of 100+ items to demonstrate search scalability and intelligent filtering.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    data: sampleData.slice(0, 6),
    placeholder: "Custom styled search interface...",
    showFilters: true,
    showSuggestions: true,
    enableNLP: true,
    enableVoiceSearch: false,
    maxResults: 6,
    className: "search-compact"
  },
  parameters: {
    docs: {
      description: {
        story: 'Search interface with custom styling and layout constraints.',
      },
    },
  },
};
