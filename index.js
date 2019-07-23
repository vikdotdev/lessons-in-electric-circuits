const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

function createDir(bookPath, format) {
  const folderName = bookPath.replace(/html\/(\w)/, `${format}/$1`);
  shell.mkdir('-p', folderName);
}

function stripHead(file) {
  return shell.exec(`sed '/<head>/,/<\/head>/{//!d}' ${file}`);
}

function getHtmlFiles(bookPath) {
  return fs
    .readdirSync(path.resolve(bookPath))
    .filter(f => f.match('.html'))
    .map(f => `${bookPath}/${f}`)
    .map(stripHead)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .join(' ');
}

function makeEpub(bookPath, bookName) {
  const htmlFiles = getHtmlFiles(bookPath);
  createDir(bookPath);

  shell.exec(`pandoc ${path.resolve(htmlFiles)} -o ${bookName}.epub`)
}

stripHead('html/DC/DC_1.html');
//makeEpub('html/DC', 'DC - I');
