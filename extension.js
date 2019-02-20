'use strict';
const vscode = require('vscode');


let insertText = (value) => {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showErrorMessage("Can't insert text");
		return;
	}

	let selection = editor.selection;

	let range = new vscode.Range(selection.start, selection.end);

	editor.edit((editBuilder) => {
		editBuilder.replace(range, value);
	});
};


let getImageTemplate = () => {
	return vscode.workspace.getConfiguration("staticSiteHero")["imagePathTemplate"];
}

let getFileTemplate = () => {
	return vscode.workspace.getConfiguration("staticSiteHero")["filePathTemplate"];;
}

let updateTemplateWithDate = template => {
	let today = new Date();
	let year = today.getFullYear();
	let month = ('0' + (today.getMonth() + 1)).slice(-2);

	template = template.replace("${year}", year);
	template = template.replace("${month}", month);

	return template;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "angularjs-es6-snippets" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let fileLinkDisposable = vscode.commands.registerCommand('extension.insertLink', () => {
		let linkTypeList = ['File', 'Image'];

		vscode.window.showQuickPick(linkTypeList, { placeHolder: 'Link Type' })
			.then(result => {
				if (result === 'File') {
					insertText("[Link Text](" + updateTemplateWithDate(getFileTemplate()) + ")");
				} else if (result === 'Image') {
					insertText("![Alt Text](" + updateTemplateWithDate(getImageTemplate()) + ")");
				}
			});
	});

	context.subscriptions.push(fileLinkDisposable);

	let figureDisposable = vscode.commands.registerCommand('extension.insertFigure', () => {
		vscode.window.showInformationMessage('Insert FigureTag Initiated.');
	});

	context.subscriptions.push(figureDisposable);
}


// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate,
	updateTemplateWithDate
}
