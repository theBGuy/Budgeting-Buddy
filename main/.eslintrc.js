module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "semi": ["error", "always"]
    },
    "overrides": [],
};
