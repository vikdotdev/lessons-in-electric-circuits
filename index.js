const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

function stripHead(file) {
  return file.replace(/<title>.+<\/title>/gi, '');
}

function replaceImagePath(file) {
  return file.replace(/src="(\d+).(png|jpg)"/gi, 'src="html/DC/$1.$2"');
}

function getHtmlFiles(bookPath) {
  return fs
    .readdirSync(path.resolve(bookPath))
    .filter(f => f.match('.html'))
    .map(f => `${bookPath}/${f}`)
    .sort((a, b) => `${a}`.localeCompare(`${b}`, 'en', { numeric: true }));
}


function makeEpub(bookName) {
  const htmlFiles = getHtmlFiles(`html/${bookName}`);

  const tempFileContents = htmlFiles
    .map(f => fs.readFileSync(f, 'utf8'))
    .map(replaceImagePath)
    .map(stripHead);

  shell.mkdir('-p', `temp/${bookName}`);
  htmlFiles.forEach((filePath, i) => {
    const tmp = filePath.split('/');
    tmp[0] = 'temp';
    const newPath = tmp.join('/');
    console.log('newpath', newPath)
    fs.writeFileSync(newPath, tempFileContents[i]);
  });

  const tempFiles = getHtmlFiles(`temp/${bookName}`);

  shell.mkdir('epub');
  shell.exec(`pandoc --metadata title="${bookName}" ${path.resolve(tempFiles.join(' '))} -o epub/${bookName}.epub`, (code, stdout, stderr) => {
    console.log(`Exit code: ${code}`)
    console.log(`Out: ${stdout}`);
    console.log(`Err: ${stderr}`);
  });
}

makeEpub('DC');
