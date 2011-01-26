/*
---

name: NavSimple
script: NavSimple.js
description: A MooTools class for handling navigation on long, single-page sites.

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
    active: true,
    scrollElement: window,
    sections: 'header,section,footer',
    initialSection: 0,
    keyboardNav: true,
    keyboardNavEsc: true,
    keyboardNavSpace: true,
    keyboardNavNumbers: true,
    doInitialScroll: false,
    markReadDelay: 5000,
    scrollThrottle: 100,
    activeSectionLinkClass: 'active',
    activeSectionClass: 'active',
    readClass: 'done',
    foldRatio: 0.6,
    offset: {
      x : 0,
      y : -100
    },
    hashPathOnLoad: false,
    hashPathRegex: /^#[\w-]+$/,
    hashLoadDelay: 100,
    findSectionIndexFromHash: function(hash, ns){
      for (var i = 0; i < ns.sections.length; i++){
        if (hash.replace('#','') == ns.sections[i].get('id'))
          return i;
      }
      return 0;
    }
  },
  
  initialize: function(options){
    this.setOptions(options);
    
    this.element = document.id(this.options.scrollElement);
    this.sections = $$(this.options.sections);
    this.sectionLinks = $$(this.options.sectionLinks);    
    
    this.window_scroll = new Fx.Scroll(this.element, {
      offset : this.options.offset
    });
    
    this.setHeights();
    
    this.currentSection = this.options.initialSection;
    if (this.options.active && this.options.doInitialScroll)
      this.toSection(this.currentSection);
    
    if (this.options.active)
      this.activate();
   
    if (this.options.hashPathOnLoad)
      this.detectHashPath();

    return this;
  },

  setHeights: function(){
    this.sectionTops = this.sections.map(function(section){ return section.getTop(); });
    this.elementHeight = this.element.getHeight();
  },
  
  activate: function(){
    if (!this.active){
      this.active = true;
      this.attach();
    }
  },
  deactivate: function(){
    this.active = false;
    this.detach();
  },

  attach: function(){
    var thiz = this;
    
    this.sectionLinkClick = function(e){
      e.preventDefault();
      thiz.toSection(thiz.sectionLinks.indexOf(this));
    };
    this.sectionLinks.addEvent('click', this.sectionLinkClick);
    
    
    this.scrollEvent = function(){
      var elementScroll = this.element.getScrollTop();
      for (var i = this.sections.length; i--;) {
        if (this.sectionTops[i] < (elementScroll + (this.elementHeight * this.options.foldRatio))
            && (i === 0 || this.sectionTops[i-1] <= elementScroll))
          break;
      }
      this.makeActive(i);
    }.bind(this).throttle(this.options.scrollThrottle);
    this.element.addEvent('scroll', this.scrollEvent);
    
    if (this.options.keyboardNav){
      this.keyboard = new Keyboard({
        active: true,
        events : {
          'j': this.nextSection.bind(this),
          'k': this.previousSection.bind(this)
        }
      });
      
      if (this.options.keyboardNavSpace){
        this.keyboard.addEvents({
          'space'       : function(e) { e.preventDefault(); this.nextSection(); }.bind(this),
          'shift+space' : function(e) { e.preventDefault(); this.previousSection(); }.bind(this)   
        });
      }
      
      if (this.options.keyboardNavEsc)
        this.keyboard.addEvent('esc', this.toSection.pass(0, this));
      
      if (this.options.keyboardNavNumbers){
        this.sections.length.times(function(i){
          this.keyboard.addEvent(i.toString(), this.toSection.pass(i, this));
        }, this);
      }
    }
  },
  detach: function(){
    this.sectionLinks.removeEvent('click', this.sectionLinkClick);
    this.element.removeEvent('scroll', this.scrollEvent);
    if (this.keyboard) this.keyboard.deactivate();
  },
  
  eventArgs: function(){
    return [
      this.sections[this.currentSection],
      this.currentSection,
      this
    ];
  },
  
  nextSection: function(){
    this.toSection((this.currentSection + 1).limit(0, this.sections.length-1), null, true);
    this.fireEvent('nextSection', this.eventArgs());
  },
  previousSection: function(){
    this.toSection((this.currentSection - 1).limit(0, this.sections.length-1), null, true);
    this.fireEvent('previousSection', this.eventArgs());
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
    this.toSection( this.options.findSectionIndexFromHash(hash, this) );
  },
  
  detectHashPath: function(){
    var sectionHash = document.location.hash;
    if (sectionHash.test(this.options.hashPathRegex)){
      document.location.hash = "#";
      this.toSectionFromFromHash.delay(this.options.hashLoadDelay, this, sectionHash);
    }
  }
  
});

if (!Function.throttle){
  Function.implement({
    throttle: function(waitTime){
      var self = this,
  			args = (arguments.length > 1) ? Array.slice(arguments, 1) : null;

      self.throttleLastCall = new Date().getTime() - waitTime;
      return function(){
        if (new Date().getTime() - self.throttleLastCall > waitTime){
          self.throttleLastCall = new Date().getTime();
          self();
        }
      };
    }
  });
}