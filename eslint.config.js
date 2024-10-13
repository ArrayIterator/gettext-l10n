module.exports = [
    {
        ignores: [
            "node_modules/**/*",
            "dist/**/*",
            "build/**/*",
            "*.js"
        ],
        files: [
            "src/**/*.ts",
            "webpack.config.js",
        ],
        languageOptions: {
            parser: require("@typescript-eslint/parser"),
            parserOptions: {
                project: "./tsconfig.json",
                ecmaVersion: "esnext",
                sourceType: "script"
            }
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
            "import-newlines": require("eslint-plugin-import-newlines"),
            "jsdoc": require("eslint-plugin-jsdoc")
        },
        rules: {
            semi: 'off',
            'linebreak-style': ['error', 'unix'],
            indent: [
                "error",
                4,
                {
                    SwitchCase: 1
                }
            ],
            "eol-last": ["error", "always"],
            "no-multiple-empty-lines": [
                "error",
                {
                    max: 1,
                    maxEOF: 0
                }
            ],
            "no-array-constructor": [
                "error"
            ],
            quotes: ['error', 'single'],
            "object-curly-newline": [
                "error",
                {
                    ObjectExpression: {
                        multiline: true,
                        minProperties: 1
                    },
                    ObjectPattern: {
                        multiline: true,
                        minProperties: 1
                    },
                    ImportDeclaration: {
                        multiline: true,
                        minProperties: 2
                    },
                    ExportDeclaration: {
                        multiline: true,
                        minProperties: 2
                    }
                }
            ],
            // import-newlines rules
            "import-newlines/enforce": [
                "error",
                {
                    items: 1
                }
            ],
            // jsdoc rules
            "jsdoc/require-jsdoc": [
                "error",
                {
                    "require": {
                        "FunctionDeclaration": true,
                        "MethodDefinition": true,
                        "ClassDeclaration": true,
                        "ArrowFunctionExpression": true,
                        "FunctionExpression": true,
                        "ClassExpression": true,
                    }
                }
            ],
            "jsdoc/require-property": "error",
            // typescript-eslint rules
            "@typescript-eslint/ban-ts-comment": "error",
            "@typescript-eslint/ban-types": "off", // Disable the rule if not found
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/explicit-member-accessibility": "error",
            "@typescript-eslint/no-var-requires": "error",
            "@typescript-eslint/prefer-as-const": "error",
            "@typescript-eslint/triple-slash-reference": "error"
        }
    }
]