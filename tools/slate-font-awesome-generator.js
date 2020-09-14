const fse = require('fs-extra');
const klaw = require('klaw')

const sourceFolder = "./node_modules/@fortawesome/fontawesome-free";
const targetFolder = "."


klaw(sourceFolder + '/css').on('data', item => {
    if (item.stats.isFile() && item.path.endsWith('css')) {
        let splittedPath = item.path.split(/[\/\\]/);
        let filename = splittedPath[splittedPath.length - 1];

        fse.ensureDirSync(targetFolder);

        let data = fse.readFileSync(item.path, "utf8");
        data = data.replace(new RegExp('../webfonts/', 'g'), './fonts/');

        let out = generateHeader(filename) + data + generateFooter();
        let finalFileName = filename.replace('.css', '.html').replace('.min', '-min');

        fse.writeFileSync(`${targetFolder}/slate-fa5-${finalFileName}`, out);
    }
});

fse.copy(sourceFolder + '/webfonts', targetFolder + '/fonts', err => {
  if (err) return console.error(err)
});

function generateHeader(name) {
    let componentName = name.replace('.css', '').replace('.min', '-min');
    return `
<!--
@license Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
Copyright (c) 2020 Jean-François Le Foll "JeffLeFoll" for the Web Component encapsulation of Font Awesome 5 CSS code
@demo demo/index.html
-->
<dom-module id="slate-fa5-${componentName}"><template><style>\n`;
}

function generateFooter() {
    return `\n</style></template></dom-module>`;
}
