// Important: this file is not the compiled version
// of 'coffee-test.coffee'. It's a standalone test
// written in JavaScript.

describe('Protractor Demo homepage', function () {
  it('should have a title', function () {
    browser.get('http://juliemr.github.io/protractor-demo/');
    expect(browser.getTitle()).toEqual('Super Calculator');
  });
});
