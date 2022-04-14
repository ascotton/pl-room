const path = require('path')
const globby = require('globby')
const fs = require('fs-extra')
const SVGO = require('svgo')
const _template = require('lodash.template')

const rootPath = path.join(__dirname, '..', '..');
const nodeModulesPath = path.join(rootPath, "node_modules");
const buildPath = path.join(rootPath, 'build')
const srcPath = path.join(rootPath, 'src')

const SERVICE_TEMPLATE_SRC = path.join(__dirname, 'svg_service.template');
const SERVICE_TEMPLATE_DEST = path.join(srcPath, 'build', 'svg-inline-ng-plugin.service.ts');

const plComponentsGlob = path.join(
    nodeModulesPath,
    'pl-components-ng2',
    'build',
    'assets',
    'svg',
    '*.svg'
)
const srcGlob = path.join(srcPath, 'assets', 'svg', '*.svg')
const buildGlob = path.join(buildPath, 'assets', 'svg', '*.svg')

const svgo = new SVGO({
    plugins: [
        {
            cleanupIDs: false,
        }
    ]
})

async function main () {
    const globs = [
        plComponentsGlob,
        srcGlob,
        buildGlob,
    ]

    let svgs = {}

    for (const glob of globs) {
        const globSvgs = await getSvgsMap(glob)
        for (const key of Object.keys(globSvgs)) {
            if (!svgs[key]) {
                svgs[key] = globSvgs[key]
            }
        }
    }

    await buildTemplate(svgs)
}

async function getSvgsMap(glob) {
    const filePaths = await globby(glob)

    let svgs = {}

    for (const path of filePaths) {
        const svgString = await processSvg(path)
        const name = getSvgName(path)

        svgs[name] = svgString
    }

    return svgs
}

async function processSvg(path) {
    const contents = await fs.readFile(path)
    const { data } = await svgo.optimize(contents, { path })
    return data
}

function getSvgName(path) {
    const filename = path.split('/');
    return filename[filename.length-1].split('.')[0];
}

async function buildTemplate(svgs) {
    const templateData = await fs.readFile(SERVICE_TEMPLATE_SRC, 'utf8')
    const compiled_template = _template(templateData);

    const svgBuffers = {}

    for (const key of Object.keys(svgs)) {
        svgBuffers[key] = {
            contents: Buffer.from(svgs[key])
        }
    }

    const result = compiled_template({ svgs: svgBuffers });

    await fs.writeFileSync(SERVICE_TEMPLATE_DEST, result);
}

main()
