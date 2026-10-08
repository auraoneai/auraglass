/**
 * ai-chat (SURF area): rewrite the four chat imports (GlassChat,
 * GlassChatInput, GlassMessageList, GlassTypingIndicator) from 'aura-glass' to
 * 'aura-glass/compat' and insert the spec's TODO marker above the import —
 * JSX untouched, text-level for byte-stable output.
 */
import type { FileUnit, Transform, TransformResult } from './shared.js';

const CHAT = ['GlassChat', 'GlassChatInput', 'GlassMessageList', 'GlassTypingIndicator'];
const DOC = 'apps/docs/content/surf/migration/ai.md';
const MARKER = `// TODO(aura-glass 5): migrate to aura-glass/ai Thread/Message/Composer, see ${DOC}`;

export const aiChat: Transform = {
  id: 'ai-chat',
  run(unit: FileUnit): TransformResult {
    if (unit.kind !== 'code' || !CHAT.some((c: any) => unit.source.includes(c))) {
      return { source: unit.source, changes: [], todos: [] };
    }
    if (unit.source.includes(MARKER)) return { source: unit.source, changes: [], todos: [] };
    // Text rewrite: on the aura-glass import line, move the chat specifiers to
    // a compat import; if all specifiers are chat ones, rewrite in place.
    const lines = unit.source.split('\n');
    const changes: TransformResult['changes'] = [];
    const todos: TransformResult['todos'] = [];
    for (let i = 0; i < lines.length; i += 1) {
      const m = lines[i]!.match(/^(import\s*\{)([^}]*)(\}\s*from\s*['"])aura-glass(['"];?)/);
      if (!m) continue;
      const specs = m[2]!.split(',').map((s: any) => s.trim()).filter(Boolean);
      const chatSpecs = specs.filter((s: any) => CHAT.includes(s.split(/\s+as\s+/)[0]!));
      const restSpecs = specs.filter((s: any) => !CHAT.includes(s.split(/\s+as\s+/)[0]!));
      if (!chatSpecs.length) continue;
      const insert: string[] = [];
      const keepRest = restSpecs.length > 0;
      const compatLine = `import { ${chatSpecs.join(', ')} } from 'aura-glass/compat';`;
      const restLine = keepRest ? `import { ${restSpecs.join(', ')} } from 'aura-glass';` : null;
      insert.push(MARKER);
      insert.push(keepRest ? restLine! : compatLine);
      if (keepRest) insert.push(compatLine);
      lines.splice(i, 1, ...insert);
      for (const s of chatSpecs) changes.push({ transform: 'ai-chat', description: `${s} -> aura-glass/compat` });
      todos.push({ transform: 'ai-chat', reason: 'migrate to aura-glass/ai Thread/Message/Composer', doc: DOC });
      i += insert.length - 1;
    }
    return { source: lines.join('\n'), changes, todos };
  },
};
