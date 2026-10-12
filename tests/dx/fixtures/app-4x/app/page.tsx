'use client';
import { GlassButton, GlassCard } from 'aura-glass';
import { RECIPES } from '../components/recipes';

export default function Home() {
  return (
    <main>
      <h1>AuraGlass 4.x canary app</h1>
      <GlassCard>
        <ul>
          {RECIPES.map((id) => (
            <li key={id}><a href={`/recipes/${id}`}>{id}</a></li>
          ))}
        </ul>
      </GlassCard>
      <GlassButton variant="primary">Primary action</GlassButton>
    </main>
  );
}
