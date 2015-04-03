"use strict";
var By = require('selenium-webdriver').By;

var PageObject = function(context, json, isArray) {
    if(context && json) {
        this._isArray = isArray || false;
        this._context = context;
        this._element = this._readJSON(json);
        this._childs = {};
        this._selector = null;
        this._object = null;
        this._objects = null;
    } else {
        throw new Error("Invalid number of arguments");
    }
    this._initObject();
    this._createChildNodes();
    return this._object || this._objects;
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
                // TODO: read json
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
        this._objects = this._context.findElements(selector);
    } else {
        this._object = this._context.findElement(selector);
    }
};

PageObject.prototype._createChildNodes = function() {
    var that = this;

    for(var child in this._childs) {
        if(this._childs.hasOwnProperty(child)) {
            (function (value) {
                if(value instanceof Array) {
                    that._objects.forEach(function(object) {
                        Object.defineProperty(object, child, {
                            get: function() {
                                return PageObject(object, value, true);
                            }
                        });
                    });
                } else {
                    Object.defineProperty(that._object, child, {
                        get: function() {
                            return PageObject(that._object, value);
                        }
                    });
                }
            })(this._childs[child]);
        }
    }
};

module.exports = PageObject;