# TypeScript Configuration Matrix

## Configuration Files

### tsconfig.server.json

```json
{
  "target": "ES2020",
  "module": "commonjs",
  "lib": [
    "ES2020"
  ],
  "outDir": "./dist/server",
  "rootDir": "./",
  "moduleResolution": "node",
  "declaration": false,
  "declarationMap": false,
  "sourceMap": true,
  "esModuleInterop": true,
  "skipLibCheck": true,
  "forceConsistentCasingInFileNames": true,
  "resolveJsonModule": true,
  "allowSyntheticDefaultImports": true,
  "strict": true,
  "noUnusedLocals": false,
  "noUnusedParameters": false,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "types": [
    "node"
  ]
}
```

## Compiler Options Comparison

| Option | tsconfig.server |
|---|---|
| allowSyntheticDefaultImports | true |
| declaration | false |
| declarationMap | false |
| esModuleInterop | true |
| forceConsistentCasingInFileNames | true |
| lib | ["ES2020"] |
| module | "commonjs" |
| moduleResolution | "node" |
| noFallthroughCasesInSwitch | true |
| noImplicitReturns | true |
| noUnusedLocals | false |
| noUnusedParameters | false |
| outDir | "./dist/server" |
| resolveJsonModule | true |
| rootDir | "./" |
| skipLibCheck | true |
| sourceMap | true |
| strict | true |
| target | "ES2020" |
| types | ["node"] |
