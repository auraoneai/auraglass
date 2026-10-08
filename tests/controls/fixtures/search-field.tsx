import * as React from 'react';
import { SearchField } from '../../../src/components/search-field';

export function SearchFieldFixture(props: Record<string, unknown>) {
  return <SearchField label="Search" {...props} />;
}
