const path = require('path');
const fs = require('fs');
const shell = require('shelljs');


function stripHead(file) {
  console.log(file);
  return shell.exec(`sed '/<head>/,/<\/head>/d' ${file}`, (code, stdout, stderr) => {
    console.log(`Exit code: ${code}`)
    console.log(`Out: ${stdout}`);
    console.log(`Err: ${stderr}`);
  });
}

function getHtmlFiles(bookPath) {
  return fs
    .readdirSync(path.resolve(bookPath))
    .filter(f => f.match('.html'))
    .map(f => `${bookPath}/${f}`)
    .sort((a, b) => `${a}`.localeCompare(`${b}`, 'en', { numeric: true }))
    .join(' ');
}

function makeEpub(bookPath, bookName) {
  const htmlFiles = getHtmlFiles(bookPath);
  shell.mkdir('epub');

  shell.exec(`pandoc ${path.resolve(htmlFiles)} -o epub/${bookName}.epub`, (code, stdout, stderr) => {
    console.log(`Exit code: ${code}`)
    console.log(`Out: ${stdout}`);
    console.log(`Err: ${stderr}`);
  });
}

//stripHead('html/DC/DC_1.html');
makeEpub('html/DC', 'DC-I');
