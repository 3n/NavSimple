/*
---

name: NavSimple
script: NavSimple.js
description: Scrolling Navigation for single-page sites.

requires:
  - Core/Class.Extras
  - Core/Element.Event
  - Core/Element.Dimensions
  - More/Fx.Scroll
  - More/Keyboard
  - More/Fx.Scroll
  - More/Events.Pseudos  

provides: [NavSimple]

authors:
  - Ian Collins

...
*/

Fx.implement(Events.prototype);

var NavSimple = new Class({
  
  Implements: [Options, Events], 
  
  options: {
    scrollElement: window,
    initialSection: 0,
    doInitialScroll: false,
    hashPathOnLoad: false,
    hashPathRegex: /^#[\w-]+$/,
    markReadDelay: 5000,
    activeSectionLinkClass: 'active',
    activeSectionClass: 'active',
    readClass: 'done',
    offset: {
      x : 0,
      y : -100
    }
  },
  
  initialize: function(sectionLinks, sections, options){
    this.setOptions(options);
    
    this.element = document.id(this.options.scrollElement);
    this.sectionLinks = $$(sectionLinks);
    this.sections = $$(sections);
    
    this.window_scroll = new Fx.Scroll(this.element, {
      offset : this.options.offset
    });
    
    this.currentSection = this.options.initialSection;
    if (this.options.doInitialScroll)
      this.toSection(this.currentSection);
    
    this.attach();
   
    if (this.options.hashPathOnLoad)
      this.detectHashPath();

    return this;
  },

  attach: function(){
    var thiz = this;
    
    this.sectionLinks.addEvent('click', function(e){
      e.preventDefault();
      thiz.toSection(thiz.sectionLinks.indexOf(this));
    });
    
    this.element.addEvent('scroll', function(){
      for (var i = 0; i < this.sections.length; i++){
        if (this.sections[i].getTop() > this.element.getScrollTop())
          break;
      }
      this.makeActive(i);
    }.bind(this));
    
    // todo keyboard
  },
  detach: function(){
    // todo
  },
  
  eventArgs: function(){
    return [
      this.sections[this.currentSection],
      this.sectionLinks[this.currentSection],
      this.currentSection,
      this
    ];
  },
  
  nextSection: function(){
    this.toSection((this.currentSection + 1).limit(0, this.sections.length-1), null, true);
    this.fireEvent('nextSection', [this.currentSection, this]);
  },
  previousSection: function(){
    this.toSection((this.currentSection - 1).limit(0, this.sections.length-1), null, true);
    this.fireEvent('previousSection', [this.currentSection, this]);
  },
  toSection: function(section, callback){
    if (section !== section.limit(0, this.sections.length - 1))
      return;
    
    this.currentSection = section;

    this.window_scroll.addEvent('complete:once', function(){
      this.fireEvent('scrollComplete', this.eventArgs());
      if (callback)
        callback();
    }.bind(this));      
      
    this.window_scroll.toElement(this.sections[section]);
  },
  
  makeActive: function(section){
    this.currentSection = section;
    
    window.clearTimeout(this.markReadTimer);
    this.markReadTimer = this.markRead.delay(this.options.markReadDelay, this, section);
    
    this.sectionLinks.removeClass(this.options.activeSectionLinkClass);
    this.sections.removeClass(this.options.activeSectionClass);
    
    if (this.sectionLinks[this.currentSection]) {
      this.sectionLinks[this.currentSection].addClass(this.options.activeSectionLinkClass);
      this.sections[this.currentSection].addClass(this.options.activeSectionClass);
      this.fireEvent('sectionActive', this.eventArgs());
    }
  },
  markRead: function(section){
    if (this.sectionLinks[section]){
      this.sectionLinks[section].addClass(this.options.readClass);     
      this.fireEvent('sectionRead', this.eventArgs());
    }
  },
  
  toSectionFromFromHash: function(hash){
    for (var i = 0; i < this.sectionLinks.length; i++){
      if (this.sectionLinks[i].get('href') == hash)
        this.toSection(i);
    }
  },
  
  detectHashPath: function(){
    var sectionHash = document.location.hash;
    if (sectionHash.test(this.options.hashPathRegex)){
      document.location.hash = "";
      this.toSectionFromFromHash(sectionHash);
    }
  }
  
});