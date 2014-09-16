exports.config = {
  // If the Selenium server is running on the background
  // seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

  // If we want to start/stop Selenium at each test
  seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.42.2.jar',

  specs: [],

  capabilities: {
    'browserName': 'chrome'
  },
};
