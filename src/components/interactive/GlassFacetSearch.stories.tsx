import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassFacetSearch } from "./GlassFacetSearch";
import { fn } from "@storybook/test";

const meta: Meta<typeof GlassFacetSearch> = {
  title: "Effects + Advanced/Glass Facet Search",
  component: GlassFacetSearch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A glass morphism glassfacetsearch component.",
      },
    },
  },
  argTypes: {
    query: {
      control: "text",
      description: "Current search query",
    },
    facets: {
      control: "object",
      description: "Array of facet configurations",
    },
    facetValues: {
      control: "object",
      description: "Current facet values",
    },
    results: {
      control: "object",
      description: "Search results array",
    },
    placeholder: {
      control: "text",
      description: "Search input placeholder",
    },
    showFilters: {
      control: "boolean",
      description: "Whether to show filter panel",
    },
    showResults: {
      control: "boolean",
      description: "Whether to show results",
    },
    variant: {
      control: "select",
      options: ["default", "compact", "minimal"],
      description: "Component variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
  },
  args: {
    query: "",
    facets: [
      {
        id: "category",
        label: "Category",
        type: "checkbox",
        options: [
          { id: "docs", label: "Documentation", value: "docs", count: 25 },
          {
            id: "tutorials",
            label: "Tutorials",
            value: "tutorials",
            count: 12,
          },
          { id: "examples", label: "Examples", value: "examples", count: 8 },
        ],
      },
      {
        id: "difficulty",
        label: "Difficulty",
        type: "select",
        options: [
          { id: "beginner", label: "Beginner", value: "beginner" },
          { id: "intermediate", label: "Intermediate", value: "intermediate" },
          { id: "advanced", label: "Advanced", value: "advanced" },
        ],
      },
    ],
    facetValues: {},
    results: [],
    placeholder: "Search documentation...",
    showFilters: true,
    showResults: true,
    variant: "default",
    size: "md",
    onQueryChange: fn(),
    onFacetChange: fn(),
    onResultSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(760px, calc(100vw - 32px))" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassFacetSearch>;

export const Default: Story = {
  args: {
    query: "",
    facets: [
      {
        id: "category",
        label: "Category",
        type: "checkbox",
        options: [
          { id: "docs", label: "Documentation", value: "docs", count: 25 },
          {
            id: "tutorials",
            label: "Tutorials",
            value: "tutorials",
            count: 12,
          },
          { id: "examples", label: "Examples", value: "examples", count: 8 },
        ],
      },
    ],
    facetValues: {},
    results: [
      {
        id: "1",
        title: "Getting Started Guide",
        description: "Learn the basics of using our platform",
        category: "docs",
        tags: ["beginner", "tutorial"],
        score: 0.95,
      },
      {
        id: "2",
        title: "Advanced Configuration",
        description: "Deep dive into advanced features and configuration",
        category: "docs",
        tags: ["advanced", "configuration"],
        score: 0.87,
      },
    ],
    onQueryChange: fn(),
    onFacetChange: fn(),
    onResultSelect: fn(),
  },
};

export const Variants: Story = {
  args: {
    query: "tutorial",
    facets: [
      {
        id: "difficulty",
        label: "Difficulty Level",
        type: "select",
        options: [
          { id: "beginner", label: "Beginner", value: "beginner" },
          { id: "intermediate", label: "Intermediate", value: "intermediate" },
          { id: "advanced", label: "Advanced", value: "advanced" },
        ],
      },
    ],
    facetValues: { difficulty: "beginner" },
    results: [
      {
        id: "1",
        title: "Basic Tutorial",
        description: "Simple tutorial for beginners",
        category: "tutorials",
        tags: ["beginner"],
        score: 0.92,
      },
    ],
    variant: "compact",
    onQueryChange: fn(),
    onFacetChange: fn(),
    onResultSelect: fn(),
  },
};
