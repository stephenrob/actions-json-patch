const core = require('@actions/core');
const yaml = require('js-yaml');
const { applyOperation } = require('fast-json-patch');
const fs = require('fs');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const file = core.getInput('file');
    const op = core.getInput('op');
    const path = core.getInput('path');
    const value = core.getInput('value');
    const outputFormat = core.getInput('output')
    
    let fileContents = fs.readFileSync(file, 'utf-8');
    let config = yaml.load(fileContents);

    let operation = {
      op: op,
      path: path,
      value: value
    }

    let document = applyOperation(config, operation).newDocument;

    switch (outputFormat) {
      case 'yaml':
        let yamlStr = yaml.dump(document);
        fs.writeFileSync(file, yamlStr, 'utf-8');
        break;
      case 'json':
        let data = JSON.stringify(document, null, 2)
        fs.writeFileSync(file, data, 'utf-8')
        break;
      default:
        break;
    }

    

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
