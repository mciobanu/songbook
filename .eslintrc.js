module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
        'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        //'react-hooks',
    ],
    rules: {
        'spaced-comment': 'off',
        'object-curly-spacing': ['error', 'never'],
        'indent': ['error', 4, {
            'FunctionExpression': {
                'body': 1,
                'parameters': 2,
            },
            'CallExpression': {
                'arguments': 2,
            },
            'MemberExpression': 1,
            'VariableDeclarator': 1,
        }],
        'no-multiple-empty-lines': 'off',
        'no-unused-vars': 'off',
        'no-console': 'off',
        'quote-props': 'off',
        'max-len': ['warn', {code: 120, 'comments': 240, 'ignoreTrailingComments': true}],
        'no-multi-spaces': 'off',
        'function-paren-newline': 'off',
        'function-call-argument-newline': 'off',
        'strict': 'off',
        'semi-spacing': 'off',
        'no-alert': 'off',
        'no-plusplus': 'off', //ttt0 Review the problems with ++
        'no-restricted-syntax': 'off', //ttt0 Probably put back, or at least configure it. Was added because of things like for (const verse of song.v) {
        'no-use-before-define': ['error', {'functions': false}],
        //'react-hooks/exhaustive-deps': ['error'],
        'arrow-body-style': 'off',
        'padded-blocks': 'off',

        'padding-line-between-statements': [
            'error',
            {'blankLine': 'always', 'prev': '*', 'next': 'function'},   //ttt1: add more
            {'blankLine': 'always', 'prev': 'function', 'next': '*'},
        ],

        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
    },
};
