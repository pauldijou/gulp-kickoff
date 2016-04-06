var fs = require('fs');
var path = require('path');
var preprocess = require('preprocess');
var findit = require('findit');
var inquirer = require('inquirer');
var versions = require('./versions.js');

var processedDirs = ['gulp', 'scripts', 'styles', 'test'];

var context = {
  dependencies: {less: true},
  modules: [],
  files: []
};

var prompts = [
  // {
  //   type: 'input',
  //   name: 'name',
  //   message: 'What\'s the name of your project?',
  //   default: path.basename(path.join(__dirname, '..'))
  // },
  // {
  //   type: 'checkbox',
  //   name: 'styles',
  //   message: 'Which CSS preprocessors do you want to use?',
  //   choices: ['SCSS', 'LESS', 'Stylus']
  // },
  // {
  //   type: 'checkbox',
  //   name: 'scripts',
  //   message: 'Which JavaScript preprocessors do you want to use?',
  //   choices: ['CoffeeScript', 'Typescript']
  // },
  // {
  //   type: 'checkbox',
  //   name: 'frameworks',
  //   message: 'Are you using one or more of those frameworks?',
  //   choices: ['AngularJS']
  // },
  // {
  //   type: 'confirm',
  //   name: 'svgIcons',
  //   message: 'Do you want to use inline SVG for your icons?'
  // }
];

inquirer.prompt(prompts, function (answers) {
  console.log(answers);

  context.name = answers.name || 'my-new-project';
  // answers.styles.forEach(addDependency);
  // answers.scripts.forEach(addDependency);
  // answers.frameworks.forEach(addDependency);

  updatePackage();
  writeFiles();
  clean();
});

function addDependency(dependencyName) {
  context.dependencies[dependencyName] = true;
}

function add(type, name) {
  if (context[type].indexOf(name) === -1) {
    context[type].push(name);
  }
}

function addModule(moduleName) {
  add('modules', moduleName);
}

function updatePackage() {
  var packageJsonFileName = 'package.json';
  var packageJson = readJSON(packageJsonFileName);

  // Reset all stuff related to gulp-kickoff
  packageJson.name = context.name;
  packageJson.repository.url = '';
  packageJson.scripts = {};
  packageJson.devDependencies = {};

  context.modules.forEach(function (moduleName) {
    packageJson.devDependencies[moduleName] = versions[moduleName];
  });
  console.log('Update package.json');
  console.log(packageJson);
  // writeJSON(packageJsonFileName, packageJson);
}

function addFile(fileName) {
  add('files', fileName);
}

function writeFiles() {
  processedDirs.forEach(function (dirName) {
    var finder = findit(dirName);

    finder.on('file', function (fileName, stat) {
      writeFile(fileName);
    });
  });
}

function writeFile(fileName) {
  if (context.files.indexOf(fileName) !== -1) {
    console.log('preprocess', fileName);
    // preprocess.preprocessFileSync(fileName, fileName, context.dependencies);
  } else {
    console.log('remove', fileName);
    // fs.unlink(fileName);
  }
}

function readJSON(fileName) {
  return JSON.parse(fs.readFileSync(fileName));
}

function writeJSON(fileName, value) {
  return fs.writeFileSync(fileName, JSON.stringify(value, null, '  '));
}

function clean() {
  // fs.rmdirSync('kickoff');
}
