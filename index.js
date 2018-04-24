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
let html = '';
let properties = {};
const run = async () => {
    properties = await inquirer.askGithubCredentials();
    switch (properties.generate) {
        case 'component':
            properties.componentProperties = await componentFlow();
            generateComponent();
            break;
    }
}

componentFlow = async () => {
    debugger
    let componentProperties = await inquirer.componentGenerate();
    componentProperties.isView = componentProperties.isView === 'yes';
    if (componentProperties.isView) {
        const path = await inquirer.componentRoute();
        componentProperties = Object.assign(componentProperties, path);;
    }
    const componentFolder = await inquirer.componentFolder();
    componentProperties = Object.assign(componentProperties, componentFolder);
    return componentProperties;
}

generateComponent = () => {
    const template = fs.readFileSync(__dirname + '/templates/_component.html', 'utf8', (err, data) => {
        if (err) throw err;
    });
    const parseProp = properties.componentProperties;

    html = template
        .replace(/<%= kebabName %>/g, _.kebabCase(parseProp.name))
        .replace(/<%= camelName %>/g, _.upperFirst(_.camelCase(parseProp.name)))
        .replace(/<%= name %>/g, parseProp.name);

    createFiles(parseProp);
}

createFiles = async () => {
    const filelist = _.without(fs.readdirSync('.'), );
    findPackageJson('.', createComponentFile);
    findPackageJson('.', addRoute);
}

createComponentFile = (_path) => {
    const _prop = properties.componentProperties;
    const componentFileName = `${_.upperFirst(_.camelCase(_prop.name))}.vue`;
    if (fs.existsSync(`${_path}/${_prop.folder}`)) {
        fs.writeFileSync(`${_path}/${_prop.folder}/${componentFileName}`, html);
    } else {
        console.error(`${_path}/${_prop.folder} not exist`);
    }
}

findPackageJson = async (_path, callback) => {
    const filelist = _.without(fs.readdirSync(_path), );
    if (!findCount || findCount < 0) process.exit(1);
    findCount--;
    if (filelist.indexOf('package.json') !== -1) {
        // find component folder
        callback(_path);
    }
    else {
        findPackageJson(_path + '/..');
    }
}

addRoute = async (_path) => {
    const _prop = properties.componentProperties;
    if (fs.existsSync(`${_path}/${_prop.routesFile}`)) {
        var routesContent = fs.readFileSync(`${_path}/${_prop.routesFile}`, 'utf8');
        var routes = /\[(?:[^\]\['"]+|'[^']*'|"[^"]*")*\]/g.exec(routesContent)[0];
        const newRoute = `,
    {
      path: '/${_.kebabCase(_prop.path)}',
      name: '${_.upperFirst(_.camelCase(_prop.name))}',
      component: ${_.upperFirst(_.camelCase(_prop.name))}
    }
  `;
        const position = routes.lastIndexOf(']');
        var output = [routes.slice(0, position), newRoute, routes.slice(position)].join('');
        routesContent = routesContent.replace(routes, output);

        routesContent = routesContent.replace('\'vue-router\'', `'vue-router'
import ${_.upperFirst(_.camelCase(_prop.name))} from '@${_prop.folder.replace('src','')}/${_.upperFirst(_.camelCase(_prop.name))}'`)
        fs.writeFileSync(`${_path}/${_prop.routesFile}`, routesContent);

    } else {
        console.error(`${_path}/${_prop.routesFile} not exist`);
    }
}

run();