import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    fontFaily: {
      sans: ['YanoljaYacheR', 'sans-serif'],
      YanoljaYacheR: '"YanoljaYacheR"'
    }
  },
  preflight: {
    // Import external stylesheet
    '@import': `url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap')`,
    // Declare font face
    '@font-face': [{
      'font-family': 'YanoljaYacheR',
      src: "url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/YanoljaYacheR.woff') format('woff')",
      'font-weight': 'normal',
      'font-style': 'normal'
    }
    ],
  },
} as Options;
