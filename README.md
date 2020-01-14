gfm.macro
===

GitHub Flavored Markdown Babel macro converts Markdown to JSX at compile time using the [cmark-gfm](https://github.com/github/cmark-gfm) C library.

[![npm][npm-image]][npm-url]

---

Installation
---

```sh
yarn add gfm.macro babel-plugin-macros
```

Add macros to your Babel configuration:

```json
{
  "plugins": ["macros"]
}
```

Usage
---

```javascript
import gfm from 'gfm.macro'

const jsx = gfm`
GitHub Flavored Markdown
===
`

const withOptions = gfm(`
<button>GitHub Flavored Button</button>
`, { unsafe: true })
```

Options
---

The default options are as follows:

```javascript
const defaultOptions = {
    react: true,
    extensions: {
        table: true,
        tasklist: true,
    },
}
```

[npm-image]: https://img.shields.io/npm/v/gfm.macro.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/gfm.macro
