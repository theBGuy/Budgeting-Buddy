module.exports = {
    'extends': 'eslint:recommended',
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true,
        'node': true,
    },
    'overrides': [
    ],
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'windows'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always']
    }
};
