describe 'Protractor Demo', ->
  it 'should add one and two', ->
    browser.get('http://juliemr.github.io/protractor-demo/')
    element(from.model('first')).sendKeys(1)
    element(from.model('second')).sendKeys(2)

    element(from.id('gobutton')).click()

    expect(element(from.binding('latest')).getText()).toEqual('3')
