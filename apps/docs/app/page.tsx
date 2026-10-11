import Link from 'next/link';

export default function Home() {
  return (
    <article>
      <h1>AuraGlass 5.0</h1>
      <p>
        Glass-native component system, registry and docs. Start with the{' '}
        <Link href="/plat/introduction">introduction</Link> or the{' '}
        <Link href="/quickstart/next">Next quickstart</Link>.
      </p>
    </article>
  );
}
