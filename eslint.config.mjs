import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // The supplied design reference — a third-party artifact bundle, not our
    // source. Linting it only produces noise about someone else's code.
    'ref/**',
  ]),

  {
    /**
     * Imperative graphics code.
     *
     * `react-hooks/*` flags `cam.position.z = …`, `group.rotation.y = …` and
     * `el.style.x = …` as "this value cannot be modified". For React state that
     * is right. For three.js objects and DOM nodes driven from a render loop it
     * is not — mutating them per frame *is* the React Three Fiber programming
     * model, and routing it through React state would re-render 60 times a
     * second.
     *
     * Scoped to the files that actually drive a frame loop, so the rule keeps
     * protecting the rest of the codebase.
     */
    files: ['src/components/stack/StackScene.tsx', 'src/components/monogram/Monogram3D.tsx'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
]);

export default eslintConfig;
