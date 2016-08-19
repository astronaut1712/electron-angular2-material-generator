var yeoman = require("yeoman-generator");
var yosay = require("yosay");
var chalk = require("chalk");
var updateNotifier = require("update-notifier");

const packageJSON = require("../package.json");

const checkForUpdates = () => {
  const notifier = updateNotifier({
    pkg: packageJSON
  });

  let message = [];

  let retVal;

  if (notifier.update) {
    message.push("Update available: " + chalk.green.bold(notifier.update.latest) + chalk.gray(" (current: " + notifier.update.current + ")"));
    message.push("Run " + chalk.magenta("npm install -g " + packageJSON.name) + " to update.");
    retVal = yosay(message.join(" "), { maxLength: stringLength(message[0]) });
  }
  return retVal;
};

module.exports = yeoman.Base.extend({

  constructor: function() {

    yeoman.Base.apply(this, arguments);

    // This makes `appname` a required argument.
    this.argument('appname', { type: String, required: false });
    this.argument('description', { type: String, required: false });
  },

  prompting: function() {
    var done = this.async();
    var _this = this;
    var welcomeMessage = yosay("Welcome to the " + chalk.green("Electron Angular 2") + " Yeoman Generator (v" + packageJSON.version + ")");
    var updateMessage = checkForUpdates();

    // Have Yeoman greet the user
    if (updateMessage) {
      this.log(updateMessage);
    } else {
      this.log(welcomeMessage);
    }

    return this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'Your project name',
      default: this.appname // Default to current folder name
    }, {
      type: 'input',
      name: 'description',
      message: 'Description',
      default: ''
    }]).then(function(answers) {
      _this.props = answers; // to access props later use this.props.someOption;
      done();
    }.bind(this));
  },

  writing: function() {

    this.directory("./projectFiles/", ".");

    var templatesFolder = "./";

    this.fs.copyTpl(
      this.templatePath(templatesFolder + "configs/_gitignore"),
      this.destinationPath(".gitignore"), this.props
    );
    this.fs.copyTpl(
      this.templatePath(templatesFolder + "configs/package.json"),
      this.destinationPath("package.json"), this.props
    );

  },

  install: function() {
    var skipInstall = this.options["skip-install"];

    this.log("Project created successfully. Enjoy!");

    if (skipInstall) {
      this.log("Run 'npm run setup' to install all required dependencies. Check out the README file instructions");
    } else {
      this.log("Go grab a coffee, I'll start installing the dependencies... (which may take a while)");
      this.spawnCommand("npm", ["install"]);
    }
  }

});
