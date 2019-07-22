const path = require('path');
const fs = require('fs');
const TurndownService = require('turndown')

function makeMarkdown(chapterPath) { // ex. html/DC
  const turndownService = new TurndownService({
    codeBlockStyle: 'fenced',
  });

  turndownService.remove('head');

  const htmlFiles = fs.readdirSync(path.resolve(chapterPath));

  const markdown = htmlFiles.map(fileName => {
    const content = fs.readFileSync(`html/DC/${fileName}`, 'utf8');
    return turndownService.turndown(content);
  });

  const folderName = chapterPath.replace(/html\/(\w)/, 'markdown/$1');
  fs.mkdirSync(path.resolve('markdown'))
  fs.mkdirSync(path.resolve(folderName));

  markdown.forEach((data, i) => {
    const fileName = htmlFiles[i].substr(0, htmlFiles[i].length - 5);
    fs.writeFileSync(path.resolve(`${folderName}/${fileName}.md`), data);
  });
}

makeMarkdown('html/DC');

function makeEpub() {
}

