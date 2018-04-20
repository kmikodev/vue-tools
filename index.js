#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const inquirer = require('./lib/inquirer');
const ejs = require('ejs');

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
clear();

console.log(
    chalk.yellow(
        figlet.textSync('Vue Cli', { horizontalLayout: 'full' })
    )
);

let findCount = 5;
let rootPath = '';

const run = async () => {
    const options = await inquirer.askGithubCredentials();
    switch (options.generate) {
        case 'component':
            options.componentProperties = await componentFlow();
            generateComponent(options);
            break;
    }
}

componentFlow = async () => {
    let componentProperties = await inquirer.componentGenerate();
    componentProperties.isView = componentProperties.isView === 'yes';
    if (componentProperties.isView) {
        const path = await inquirer.componentRoute();
        componentProperties.path = path.path;
    }
    const componentFolder = await inquirer.componentFolder();
    componentProperties = Object.assign(componentProperties, componentFolder);
    return componentProperties;
}

generateComponent = (properties) => {
    const template = fs.readFileSync(__dirname + '/templates/_component.html', 'utf8', (err, data) => {
        if (err) throw err;
    });
    const parseProp = properties.componentProperties;

    const html = template
        .replace(/<%= kebabName %>/g, _.kebabCase(parseProp.name))
        .replace(/<%= camelName %>/g, _.camelCase(parseProp.name))
        .replace(/<%= name %>/g, parseProp.name);

    createComponentFile(html, parseProp);
    return html;
}

createComponentFile = async (html, properties) => {
   
    const filelist = _.without(fs.readdirSync('.'), );
    findPackageJson('.', properties, html);

}

findPackageJson = async (_path, properties, html) => {
    console.log( chalk.yellow(
        figlet.textSync('properties', { horizontalLayout: 'full' })
    ));
    console.log(properties)
    const componentFileName = `${_.upperFirst(_.camelCase(properties.name))}.vue`;    
    const filelist = _.without(fs.readdirSync(_path), );
    if (!findCount || findCount < 0) process.exit(1);
    findCount--;
    if (filelist.indexOf('package.json') !== -1) {
        // find component folder
        if (fs.existsSync(`${_path}/${properties.folder}`)) {
            fs.writeFileSync(`${_path}/${properties.folder}/${componentFileName}`, html);
        }
    }
    else {
        findPackageJson(_path + '/..');
    }
}


run();