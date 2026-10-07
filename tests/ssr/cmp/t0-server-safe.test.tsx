/* CMP-420: T0 server components (Text, Heading, Stack, Grid, Container, Card)
   render under renderToStaticMarkup and carry no 'use client' directives. */
/**
 * @jest-environment node
 */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as React from 'react';
import './ssr-polyfill';
import { renderToStaticMarkup } from 'react-dom/server';
import { Text } from '../../../src/components/text';
import { Heading } from '../../../src/components/heading';
import { Stack } from '../../../src/components/stack';
import { Grid } from '../../../src/components/grid';
import { Container } from '../../../src/components/container';
import { Card } from '../../../src/components/card';

const root = process.cwd();
const SERVER_SOURCES = [
  'src/components/text/Text.tsx',
  'src/components/heading/Heading.tsx',
  'src/components/stack/Stack.tsx',
  'src/components/grid/Grid.tsx',
  'src/components/container/Container.tsx',
  'src/components/card/Card.tsx',
];

describe('T0 server components', () => {
  it('render to markup without DOM globals', () => {
    const html = renderToStaticMarkup(
      <Container size="md">
        <Stack direction="column" gap={4}>
          <Text type="caption" muted>caption</Text>
          <Heading level={2} size="title-1">Title</Heading>
          <Grid columns={2}><div>a</div><div>b</div></Grid>
          <Card>
            <Card.Header><Card.Title>C</Card.Title><Card.Description>d</Card.Description></Card.Header>
            <Card.Body>b</Card.Body>
            <Card.Footer>f</Card.Footer>
          </Card>
        </Stack>
      </Container>,
    );
    for (const part of ['root', 'header', 'title', 'description', 'body', 'footer']) {
      expect(html).toContain(`data-ag-part="${part}"`);
    }
    expect(html).toContain('data-ag-type="caption"');
    expect(html).toContain('data-ag-level="2"');
    expect(html).toContain('data-ag-cols="2"');
  });
  it('implementation files carry no "use client" directive', () => {
    for (const f of SERVER_SOURCES) {
      const head = readFileSync(join(root, f), 'utf8').slice(0, 400);
      expect(head).not.toContain("'use client'");
      expect(head).not.toContain('"use client"');
    }
  });
});
