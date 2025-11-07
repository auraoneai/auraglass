import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassIntelligentSearch, SearchResult } from './GlassIntelligentSearch';

const meta: Meta<typeof GlassIntelligentSearch> = {
  title: 'Search/GlassIntelligentSearch',
  component: GlassIntelligentSearch,
  parameters: {
    layout: 'fullscreen',
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
    const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (query: string, filters: Record<string, any>) => {
      setSearchQuery(query);
      // In real app, you'd make an API call here
    };

    const handleResultClick = (result: SearchResult) => {
      alert(`Clicked: ${result.title}`);
    };

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl">
          <h1 className="text-3xl font-bold glass-text-secondary mb-4">🔍 Intelligent Search System</h1>
          <p className="text-lg glass-text-secondary max-w-3xl mx-auto leading-relaxed">
            Experience the future of search with natural language processing, intelligent filters, 
            voice recognition, and smart suggestions powered by advanced algorithms.
          </p>
          
          <div className="grid glass-grid-cols-1 md:glass-grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-blue text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                🧠
              </div>
              <h3 className="font-semibold">NLP Processing</h3>
              <p className="text-sm glass-text-secondary mt-1">Understand natural language queries with intent recognition</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-green text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                🎤
              </div>
              <h3 className="font-semibold">Voice Search</h3>
              <p className="text-sm glass-text-secondary mt-1">Speech-to-text search with real-time recognition</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-primary text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                🔧
              </div>
              <h3 className="font-semibold">Smart Filters</h3>
              <p className="text-sm glass-text-secondary mt-1">Dynamic filters that adapt to your content</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-primary text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                ✨
              </div>
              <h3 className="font-semibold">Auto-suggestions</h3>
              <p className="text-sm glass-text-secondary mt-1">Intelligent suggestions based on content and history</p>
            </div>
          </div>
        </div>

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

        <div className="glass-surface-subtle border-l-4 border-yellow p-6 glass-radius-r-lg">
          <h3 className="font-semibold text-primary mb-2">🧪 Try These Advanced Search Examples</h3>
          <div className="grid glass-grid-cols-1 md:glass-grid-cols-2 gap-4 text-sm text-primary">
            <div>
              <h4 className="font-medium mb-2">Natural Language Queries:</h4>
              <ul className="space-y-1">
                <li>• "Find the best React tutorials"</li>
                <li>• "Show me guides about performance"</li>
                <li>• "Compare frontend frameworks"</li>
                <li>• "Help me learn machine learning"</li>
                <li>• "What are the top rated courses?"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Smart Features to Try:</h4>
              <ul className="space-y-1">
                <li>• Use voice search with the microphone button</li>
                <li>• Watch auto-suggestions as you type</li>
                <li>• Filter by category, tags, and ratings</li>
                <li>• See NLP analysis of your queries</li>
                <li>• Notice highlighted search terms in results</li>
              </ul>
            </div>
          </div>
        </div>
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
      
      return {
        id: `item-${i}`,
        title: `${topic} in ${tech} - ${category} #${i + 1}`,
        description: `Learn about ${topic.toLowerCase()} concepts in ${tech}. This ${category.toLowerCase()} covers advanced techniques, best practices, and real-world applications for modern development.`,
        category,
        tags: [tech.toLowerCase(), topic.toLowerCase(), category.toLowerCase(), 'programming', 'development'],
        score: 0,
        metadata: { 
          rating: Math.round((3 + Math.random() * 2) * 10) / 10,
          author: `Author ${i + 1}`,
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      };
    });

    return (
      <div className="space-y-4">
        <div className="glass-surface-subtle p-4 glass-radius-lg">
          <h3 className="font-semibold text-primary mb-2">Performance Test Dataset</h3>
          <p className="text-primary text-sm">
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
    className: "max-w-2xl"
  },
  parameters: {
    docs: {
      description: {
        story: 'Search interface with custom styling and layout constraints.',
      },
    },
  },
};