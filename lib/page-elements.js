/*
 className
 cssSelector
 id
 linkText
 name
 partialLinkText
 tagName
 xpath
 */

"use strict";
var By = require('webdriver-sync').By,
    path = require('path'),
    fs = require('fs');

var PageElement = function(context, json, parentPath) {
    if(context && json) {
        this._isArray = json instanceof Array;
        this._context = context;
        this._element = this._readTree(json);
        this._childs = {};
        this._selector = null;
        this._object = null;
        this._objects = null;
        this._parentPath = parentPath;
        this._path = null;
        if(!this._parentPath && typeof json === 'string') {
            this._path = json;
        }
    } else {
        throw new Error("Invalid number of arguments");
    }
    this._initObject();
    return this._object || this._objects;
};

PageElement.prototype._readTree = function(json) {
    json = json instanceof Array ? json[0] : json;
    if(typeof json === 'string') {
        return JSON.parse(fs.readFileSync(json, 'utf8'));
    } else {
        return json;
    }
};

PageElement.prototype._initObject = function() {
    var selector,
        that = this;

    if(this._element.hasOwnProperty('json')) {
        if (this._path && !this._parentPath) {
            this._path = path.dirname(this._path) + '/' + this._element['json'];
        } else {
            this._path = path.dirname(this._parentPath) + '/' + this._element['json'];
        }
        this._element = this._readTree(this._path);
    }
    for (var property in this._element) {
        if (this._element.hasOwnProperty(property)) {
            if(By[property]) {
                this._selector = property;
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
        this._objects = function() {
            var objs = that._find(that._context.findElements, selector);
            that._createChildNodes(objs);
            return objs;
        }
    } else {
        this._object = function() {
            var obj = that._find(that._context.findElement, selector);
            that._createChildNodes([obj]);
            return obj;
        }
    }
};

PageElement.prototype._find = function(finder, selector) {
    var elements = finder.call(this._context, selector);
    if(elements instanceof Array && elements.length === 0) {
        throw new Error('Unable to find elements with ' + this._selector + ' selector \'' +
                        this._element[this._selector] + '\'');
    }
    return elements;
};

PageElement.prototype._createChildNodes = function(elements) {
    var that = this;

    for(var child in this._childs) {
        if(this._childs.hasOwnProperty(child)) {
            (function (value) {
                elements.forEach(function(object) {
                    Object.defineProperty(object, child, {
                        get: function() {
                            return new PageElement(object, value, that._path ? that._path : that._parentPath);
                        }
                    });
                });
            })(this._childs[child]);
        }
    }
};

module.exports = PageElement;