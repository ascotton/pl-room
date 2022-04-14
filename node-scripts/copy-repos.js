const fs = require("fs-extra");
const path = require("path");
const globby = require("globby");

const srcPath = path.join(__dirname, "..", "src");
const nodeModulesPath = path.join(__dirname, "..", "node_modules");

const repos = [
    {
        sourceDir: path.join(
            nodeModulesPath,
            "pl-components-ng2",
            "src",
            "lib"
        ),
        targetDir: path.join(srcPath, "lib-components"),
        files: "/**/*",
    },
    {
        sourceDir: path.join(
            nodeModulesPath,
            "pdfjs-dist",
            "build"
        ),
        targetDir: path.join(srcPath, "pdf-dist"),
        files: "/pdf.worker.js",
    },
];

async function main() {
    for (const repo of repos) {
        const { targetDir, sourceDir, files } = repo;
        await fs.remove(targetDir);
        const pattern = `${sourceDir}${files}`
        const filePaths = await globby(pattern);
        if(filePaths.length === 0) {
            throw new Error(`No files matched ${pattern}`)
        }
        for (const path of filePaths) {
            const destPath = path.replace(sourceDir, targetDir);
            await fs.copy(path, destPath);
        }
    }
}

main();
