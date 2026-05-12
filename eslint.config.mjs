import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".netlify/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "out/**",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default eslintConfig;
