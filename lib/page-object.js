"use strict";
var By = require('selenium-webdriver').By;

var PageObject = function(context, json, isArray) {
    if(context && json) {
        this._isArray = isArray || false;
        this._driver = context;
        this._element = this._readJSON(json);
        this._childs = {};
        this._selector = null;
        this._object = null;
    } else {
        throw new Error("Invalid number of arguments");
    }
    this._initObject();
    this._createChildNodes();
    return this._object;
};

PageObject.prototype._readJSON = function(json) {
    if(json instanceof String) {
        return require(json);
    } else {
        return json;
    }
};

PageObject.prototype._initObject = function() {
    var selector;

    for (var property in this._element) {
        if (this._element.hasOwnProperty(property)) {
            if(By.hasOwnProperty(property)) {
                this._selector = property;
            } else if(property === "json"){

            } else {
                this._childs[property] = this._element[property];
            }
        }
    }
    if (!this._selector) {
        throw new Error('There is no selector for block');
    } else {
        selector = By[this._selector](this._element[this._selector]);
    }
    if(this._isArray) {
        this._object = this._driver.findElements(selector);
    } else {
        this._object = this._driver.findElement(selector);
    }
};

PageObject.prototype._createChildNodes = function() {

};

module.exports = PageObject;