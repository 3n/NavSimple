NavSimple
=========

A MooTools class for handling navigation on long, single-page sites. You specify your
section elements and (optionally) the navigation links that go along with them. 
NavSimple will let the user scroll to the appropriate section in a variety of ways 
including clicking your links and keyboard commands. Whether the user simple scrolls
or uses the navigation elements, the current section is always known and can be
visualized by you. NavSimple will even fire an event when it thinks the user has
"read" a given section.

![Screenshot](http://idisk.me.com/iancollins/Public/Pictures/Skitch/BankSimple_%7C_Home-20101201-232519.png)


How to use
----------

	var ns = new NavSimple();

That's the most basic usage, and will assume a certain page structure (HTML5 header,
section and footer elements). To customize, use the options detailed below.


Keyboard Navigation
-------------------

By default, the following keyboard shortcuts are activated:

* j, space: next section
* k, shift+space: previous section 
* esc: first section
* 0-9: that section

Each of these can be turned off/on using options.


NavSimple Method: constructor
-----------------------------

	new NavSimple([options]);

#### Options

* active: (boolean: defaults to true) active or not on instantiation,
* scrollElement: (element: defaults to window) element to scroll.
* sections: (mixed: defaults to 'header,section,footer') CSS selector or elements for your sections.
* initialSection: (number: defaults to 0) initial active section.
* doInitialScroll: (boolean: defaults to false) scroll to initialSection on creation. 
* keyboardNav: (boolean: defaults to true) activate keyboard commands j and k.
* keyboardNavEsc: (boolean: defaults to true) use escape key to go to the top.
* keyboardNavSpace: (boolean: defaults to true) use space and shift+space to navigate sections.
* keyboardNavNumbers: (boolean: defaults to true) use number keys to go to sections 0-9.
* markReadDelay: (number: defaults to 5000) how long to wait before marking a section as read.
* activeSectionLinkClass: (string: defaults to 'active') class to apply to active section link.
* activeSectionClass: (string: defaults to 'active') class to apply to active section.
* readClass: (string: defaults to 'done') class to apply to read section.
* foldRatio: (number: defaults to 0.6) where the page fold is for switching active sections.
* offset: (object: defaults to { x : 0, y : -100 }) offsets for scrolling.
* hashPathOnLoad: (boolean: defaults to false) looks at browser hash and scrolls to appropriate section.
* hashPathRegex: (regexp: defaults to /^#[\w-]+$/) test for url hash you want to scroll on.
* findSectionIndexFromHash: (function) a function that takes a hash string and 
  outputs the appropriate section for that hash string. By default it picks the section 
  with a matching id. Arguments: hash string and NavSimple instance.

#### Events

All events are passed: the current section element, the current section index and 
the NavSimple instance.

* nextSection: next section was scrolled to based on user command.
* previousSection: previous section was scrolled to based on user command.
* scrollComplete: duh.
* sectionActive: section became the active section.
* sectionRead: section was read (remained active section for specified duration).


NavSimple Method: activate
--------------------------

Activates the NavSimple instance.

#### Syntax

	ns.activate();
	

NavSimple Method: deactivate
----------------------------

Deactivates the NavSimple instance.

#### Syntax

	ns.deactivate();
	

NavSimple Method: nextSection
-----------------------------

Navigates to next section.

#### Syntax

	ns.nextSection();


NavSimple Method: previousSection
---------------------------------

Navigates to previous section.

#### Syntax

	ns.previousSection();


NavSimple Method: toSection
---------------------------

Navigates to section at specified index. Fires optional callback on scroll completion.

#### Syntax

	ns.toSection(index[, callback]);
