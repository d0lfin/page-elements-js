# page-object-js

[![Build status](https://travis-ci.org/d0lfin/page-object-js.svg?branch=master)](https://travis-ci.org/d0lfin/page-object-js)

Realisation of page object pattern for nodejs.

# install

With [npm](http://npmjs.org) do:

```
npm install page-object-js
```

# usage

Create json file with structure of your page, for example "page.json":
```
{
  "tagName": "body",
  "header": {
    "json": "elements/header.json"
  },
  "body": {
    "className": "content",
    "buttons": [{
      "json": "elements/button.json"
    }]
  },
  "footer": {
    "cssSelector": "#footer",
    "links": [{
      "xpath": ".//div[contains(@class, 'link')]"
    }]
  }
}
```
Near this file create folder "elements" with files "header.json" and "button.json". For example "header.json":
```
{
  "id": "header",
  "logo": {
    "tagName": "img"
  },
  "form": {
    "tagName": "form",
    "login": {
      "name": "login",
    },
    "password": {
      "name": "password",
    },
    "button": {
      "tagName": "button"
    }
  }
}
```
Now create file with your test, for example "test.js":
```javascript
var PageObject = require('page-object-js'),
    wd = require('webdriver-sync'),
    driver = new wd.PhantomJSDriver(),
    file = 'page.json',
    page = new PageObject(driver, file);

driver.manage().timeouts().implicitlyWait(5, wd.TimeUnit.SECONDS);
driver.get('http://yourhost');
```
Next, if you want to send keys to password field in your login for, you need to write next string:
```javascript
page().header().form().password().sendKeys('some text');
```
If you want to click on each link in your footer write:
```javascript
var links = page().footer().links();
links.forEach(function(link) {
  link.click();
});
```

# how it works
When you create instance of PageObject class, it read tree of your page structure and try to find next keywords: className, cssSelector, id, linkText, name, partialLinkText, tagName, xpath, json. Each of this using by webdriver for "findElement" method like selector, except last word - "json". This word using for include other files with html structure in current tree. All other words using like names for element childrens. Also you can set array for child fild, then webdriver use method "findElements" for this child.
