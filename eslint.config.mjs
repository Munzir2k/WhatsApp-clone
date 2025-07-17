/** @format */

// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
    // matches all files because it doesn't specify the `files` or `ignores` key
    {
        rules: {
            semi: "error",
        },
    },
]);
