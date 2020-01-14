const cmark = require('@mvasilkov/cmark-gfm')
const { createMacro } = require('babel-plugin-macros')

const defaultOptions = {
    react: true,
    extensions: {
        // autolink: true,
        table: true,
        tasklist: true,
    },
}

function getOptions(opt) {
    if (opt) return Object.assign({}, defaultOptions, opt.evaluate().value)
    return defaultOptions
}

const getFilename = (function () {
    let n = -1

    return function getFilename() {
        ++n
        return `gfm.${n}.js`
    }
})()

function render(babel) {
    return function _render(string, options) {
        string = cmark.renderHtmlSync(string, options)

        const { ast } = babel.transformSync(
            `<React.Fragment>${string}</React.Fragment>`,
            {
                ast: true,
                code: false,
                filename: getFilename(),
            })

        return ast.program.body.filter(a => a.type != 'ImportDeclaration')
    }
}

function replaceFunction(argumentsPaths, render) {
    const string = argumentsPaths[0].evaluate().value
    const options = getOptions(argumentsPaths[1])
    argumentsPaths[0].parentPath.replaceWithMultiple(render(string, options))
}

function replaceTagged(quasiPath, render) {
    const string = quasiPath.parentPath.get('quasi').evaluate().value
    quasiPath.parentPath.replaceWithMultiple(render(string, defaultOptions))
}

function gfm({ references, state, babel }) {
    const _render = render(babel)

    references.default.forEach(function ({ parentPath }) {
        switch (parentPath.type) {
            case 'CallExpression':
                replaceFunction(parentPath.get('arguments'), _render)
                break

            case 'TaggedTemplateExpression':
                replaceTagged(parentPath.get('quasi'), _render)
                break

            default:
                throw Error(`Can only be used as tagged template expression or function call. You tried ${parentPath.type}.`)
        }
    })
}

module.exports = createMacro(gfm)
