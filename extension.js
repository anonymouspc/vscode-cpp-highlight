const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    let colors = ["yellow", "green.bold", "blue.bold"];

    for (let color of colors) {
        // Set file path.
        const keywordsPath = path.join(context.extensionPath, 'keywords', `${color}.txt`);
        const syntaxPath   = path.join(context.extensionPath, 'syntaxes', 'cpp.tmLanguage.json');

        // Read keywords file.
        let data          = fs.readFileSync(keywordsPath, 'utf8');
        let keywords      = data.split(/\r?\n/).filter(line => line.trim() !== '');
        let keywordsRegex = '\\b(' + keywords.join('|') + ')\\b';

        // Read syntax file.
        let syntax = JSON.parse(fs.readFileSync(syntaxPath, 'utf8'));
        syntax.patterns = syntax.patterns.map(pattern => {
            if (pattern.name == `cpp_highlight.${color}`) {
                pattern.match = keywordsRegex;
            }
            return pattern;
        });

        // Write syntax file.
        fs.writeFileSync(syntaxPath, JSON.stringify(syntax, null, 2));
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
