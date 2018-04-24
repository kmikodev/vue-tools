const inquirer = require('inquirer');
const files = require('./files');

const componentRouteQuestions = [
    {
        type: 'input',
        name: 'path',
        message: "Enter component path",
        validate: function (value) {
            if (value) {
                return true;
            }
            return 'Please enter component path';
        }
    },
    {
        type: 'input',
        name: 'routesFile',
        message: "Enter the routes file from package.json path",
        default: function () {
            return 'src/router/index.js';
        },
        validate: function (value) {
            if (value) {
                return true;
            }
            return 'Please the routes file from package.json path';
        }
    }
];

const componentQuestions = [
    {
        type: 'input',
        name: 'name',
        message: "Enter component name",
        validate: function (value) {

            if (value) {
                return true;
            }

            return 'Please enter component name';
        }
    },
    {
        type: 'list',
        name: 'isView',
        message: 'The component is a view',
        choices: [
            'yes',
            'no'
        ]
    },
];

const questions = [
    {
        type: 'list',
        name: 'generate',
        message: 'Select the type of item you want to generate',
        choices: [
            'component',
            new inquirer.Separator(),
            {
                name: 'service',
                disabled: 'Unavailable at this time'
            }
        ]
    },
];

const folderRootQuestion = [
    {
        type: 'input',
        name: 'folder',
        message: "Enter the component folder from package.json path",
        default: function () {
            return 'src/components';
        },
        validate: function (value) {
            if (value) {
                return true;
            }
            return 'Please the component folder from package.json path';
        }
    }
];

module.exports = {

    askGithubCredentials: () => {
        return inquirer.prompt(questions);
    },
    componentGenerate: () => {
        return inquirer.prompt(componentQuestions);
    },
    componentRoute: () => {
        return inquirer.prompt(componentRouteQuestions);
    },    
    componentFolder: () => {
        return inquirer.prompt(folderRootQuestion);
    }
}