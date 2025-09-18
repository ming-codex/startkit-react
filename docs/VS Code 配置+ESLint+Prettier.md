## VS Code 配置

### .vscode/extensions.json
推荐的VS Code插件配置：

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "EditorConfig.EditorConfig",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### .vscode/settings.json
VS Code 工作区设置：

```json
{
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "tsconfig.json": "tsconfig.*.json",
    "vite.config.*": "jsconfig*, vitest.config.*, cypress.config.*, playwright.config.*",
    "package.json": "package-lock.json, pnpm*, .yarnrc*, yarn*, .eslint*, eslint*, .prettier*, prettier*, .editorconfig"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact", 
    "typescript",
    "typescriptreact"
  ],
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescriptreact": "html",
    "javascriptreact": "html"
  }
}
```

## ESLint 配置

### eslint.config.js
使用ESLint 9的扁平配置格式，支持不同文件类型的分离配置：

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  // 忽略文件
  { ignores: ['dist'] },

  // Node.js 配置文件（如 vite.config.ts）
  {
    files: ['*.config.{js,ts}', '**/*.config.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
    },
    ...js.configs.recommended,
  },

  // 基础JavaScript配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    ...js.configs.recommended,
  },

  // Node.js TypeScript 配置文件（如 vite.config.ts）
  {
    files: ['*.config.{ts}', '**/*.config.{ts}', 'plugins/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.node.json',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off', // 配置文件中允许 console
      'no-debugger': 'error',
    },
  },

  // 应用 TypeScript 配置（src 目录）
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.app.json',
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React Refresh 规则
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript 规则优化
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // 通用规则
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': 'error',
    },
  },
]
```

## Prettier 配置

### .prettierrc
代码格式化配置（项目中使用的完整配置）：

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf"
}
```

### .prettierignore
忽略文件配置：

```
README.md
docs/**/*.md
dist
dist-ssr
coverage
node_modules
*.local
.env*
```

## EditorConfig 配置

### .editorconfig
统一编辑器配置（项目中的实际配置）：

```ini
[*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue,css,scss,sass,less,styl}]
charset = utf-8
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
end_of_line = lf
max_line_length = 120
```

## 使用说明

### 1. 安装推荐插件
在VS Code中按 `Ctrl+Shift+P`，输入 `Extensions: Show Recommended Extensions`，安装所有推荐的插件。

### 2. 代码格式化
- **保存时自动格式化**：配置已启用，保存文件时会自动运行ESLint修复和Prettier格式化
- **手动格式化**：`Shift+Alt+F`
- **ESLint修复**：`Ctrl+Shift+P` → `ESLint: Fix all auto-fixable Problems`

### 3. 代码检查
```bash
# 运行ESLint检查（项目配置的脚本）
npm run lint

# 等价于运行：
# eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0

# 自动修复可修复的问题
npx eslint src --ext ts,tsx --fix
```