var URL = 'https://google.com';

var assert = require('assert'),
    PageObject = require('../lib/page-object'),
    wd = require('webdriver-sync');

describe('Page object library tests', function() {
    var driver;

    this.timeout(20000);

    before(function () {
        driver = new wd.PhantomJSDriver();
        driver.manage().timeouts().implicitlyWait(5, wd.TimeUnit.SECONDS);
        driver.get(URL);
    });

    describe('Root page object selectors', function () {
        var tests = [
                ['class', 'Name'],
                ['css', 'Selector'],
                ['id'],
                ['json'],
                ['name'],
                ['xpath'],
                ['tag', 'Name']
            ];

        tests.forEach(function (test) {
            var name = test.join(' ').toLowerCase(),
                file = './test/elements/selectors/' + test.join('') + '.json';

            it('should find root element by ' + name, function () {
                var page = new PageObject(driver, file);
                assert.ok(page());
            });
        });
    });

    describe('Multiple child elements selectors', function() {
        var file = './test/elements/google.json';

        it('should find multiple child elements by json', function() {
            var page = new PageObject(driver, file);
            assert.ok(page().elementsByJson().length > 0);
        });

        it('should find multiple child elements by tag name', function() {
            var page = new PageObject(driver, file);
            assert.ok(page().elementsByTagName().length > 0);
        });

        it('should find multiple child elements by tag name from json child', function() {
            var page = new PageObject(driver, file);
            assert.ok(page().child().elementsByTagName().length > 0);
        });
    });

    describe('Multiple elements child selectors', function() {
        var file = './test/elements/google.json';

        it('should find multiple elements child by tag name', function() {
            var page = new PageObject(driver, file);
            assert.ok(page().elements()[0].child());
        });

        it('should find multiple elements child by json', function() {
            var page = new PageObject(driver, file);
            assert.ok(page().elements()[0].jsonchild());
        });
    });

    after(function () {
        driver.quit();
    });
});