import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(__dirname, '../..');

const readText = (relativePath: string) =>
  fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

describe('3.3 hosted deployment contract', () => {
  it('keeps server:build-and-start pointed at the hosted build and real servers', () => {
    const packageJson = JSON.parse(readText('package.json'));
    const scripts = packageJson.scripts;

    expect(scripts['build:server']).toBe('tsc --project tsconfig.server.json');
    expect(scripts['build:hosted']).toBe('npm run build && npm run build:server');
    expect(scripts['server:api']).toBe('node dist/server/server/index.js');
    expect(scripts['server:websocket']).toBe('node server/websocket-server.js');
    expect(scripts['server:all']).toContain('npm run server:websocket');
    expect(scripts['server:all']).toContain('npm run server:api');
    expect(scripts['server:build-and-start']).toBe(
      'npm run build:hosted && npm run server:all'
    );
  });

  it('keeps Docker and Compose on the canonical API, WebSocket, and health paths', () => {
    const dockerfile = readText('Dockerfile');
    const compose = readText('docker-compose.yml');

    expect(dockerfile).toContain('RUN npm run build:hosted');
    expect(dockerfile).toContain('CMD ["node", "dist/server/server/index.js"]');
    expect(dockerfile).toContain("http://localhost:3002/health");

    expect(compose).toMatch(/api:[\s\S]*?ports:[\s\S]*?"\$\{API_HOST_PORT:-3002\}:3002"/);
    expect(compose).toContain('API_SERVER_PORT=3002');
    expect(compose).toMatch(/api:[\s\S]*?command: node dist\/server\/server\/index\.js/);
    expect(compose).toMatch(/websocket:[\s\S]*?ports:[\s\S]*?"\$\{WS_HOST_PORT:-3001\}:3001"/);
    expect(compose).toContain('WS_PORT=3001');
    expect(compose).toMatch(/websocket:[\s\S]*?command: node server\/websocket-server\.js/);
    expect(compose).toContain('REDIS_URL=redis://redis:6379');
  });

  it('keeps nginx routing aligned with hosted runtime services', () => {
    const nginx = readText('nginx.conf');
    const compose = readText('docker-compose.yml');

    expect(nginx).toMatch(/upstream api_servers\s*{[\s\S]*?server api:3002;/);
    expect(nginx).toMatch(/upstream websocket_servers\s*{[\s\S]*?server websocket:3001;/);
    expect(nginx).toMatch(/upstream frontend_servers\s*{[\s\S]*?server frontend:3000;/);
    expect(nginx).toMatch(/location \/api\/\s*{[\s\S]*?proxy_pass http:\/\/api_servers;/);
    expect(nginx).toMatch(/location \/socket\.io\/\s*{[\s\S]*?proxy_http_version 1\.1;/);
    expect(nginx).toMatch(/location \/socket\.io\/\s*{[\s\S]*?proxy_set_header Upgrade \$http_upgrade;/);
    expect(nginx).toMatch(/location \/health\s*{[\s\S]*?proxy_pass http:\/\/api_servers\/health;/);

    expect(compose).toMatch(/nginx:[\s\S]*?image: nginx:alpine/);
    expect(compose).toContain('./nginx.conf:/etc/nginx/nginx.conf:ro');
    expect(compose).toMatch(/nginx:[\s\S]*?depends_on:[\s\S]*?- api[\s\S]*?- websocket[\s\S]*?- frontend/);
  });

  it('documents the same deployment contract exposed by server README and deployment guide', () => {
    const serverReadme = readText('server/README.md');
    const deploymentGuide = readText('docs/deployment.md');

    for (const doc of [serverReadme, deploymentGuide]) {
      expect(doc).toContain('API_SERVER_PORT=3002');
      expect(doc).toContain('WS_PORT=3001');
      expect(doc).toContain('server/index.ts');
      expect(doc).toContain('server/websocket-server.js');
      expect(doc).toContain('server/api-server.js');
      expect(doc).toContain('AURA_PROVIDER_UNCONFIGURED');
    }

    expect(deploymentGuide).toContain('npm run server:all');
    expect(deploymentGuide).toContain('The legacy demo/mock `server/api-server.js` path is not used');
  });
});
