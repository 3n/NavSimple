/*
---

name: NavSimple
script: NavSimple.js
description: Scrolling Navigation for single-page sites.

requires:
  - Core/Class.Extras
  - Core/Element.Event

provides: [NavSimple]

authors:
  - Ian Collins

...
*/

var NavSimple = new Class({
  
  Implements: [Options, Events], 
  
  options : {
  },
  
  initialize: function(options){
    this.setOptions(options);
  }
  
});