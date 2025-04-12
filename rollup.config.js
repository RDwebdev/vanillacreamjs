// rollup.config.js
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/vanillacream.js",
  output: [
    {
      file: "dist/vanillacream.js",
      format: "umd",
      name: "VanillaCreamJS"
    },
    {
      file: "dist/vanillacream.min.js",
      format: "umd",
      name: "VanillaCreamJS",
      plugins: [terser()]
    }
  ]
};
