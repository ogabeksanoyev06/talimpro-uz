import VueKatex from "@hsorby/vue3-katex";

import "katex/dist/katex.min.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueKatex, {
    mhchem: true,
    displayMode: true,
    globalOptions: {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\begin{equation}", right: "\\end{equation}", display: true },
        { left: "\\begin{align}", right: "\\end{align}", display: true },
        { left: "\\begin{align*}", right: "\\end{align*}", display: true },
        { left: "\\begin{eqnarray}", right: "\\end{eqnarray}", display: true },
        { left: "\\begin{eqnarray*}", right: "\\end{eqnarray*}", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
      macros: {
        "\\par": "\\newline",
        "\\ul": "",
        "\\space": " ",
        $: "",
      },
      strict: false,
      errorColor: "#cc0000",
    },
  });
});
