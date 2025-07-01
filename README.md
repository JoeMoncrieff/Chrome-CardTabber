# Card Tabber

The aim of Card Tabber is to take cards from scryfall websites and add them to a list for later use. The idea is that it'll speed up deck brainstorming and construction.

## Installing and building the extension

1. Open up google chrome
2. head to [chrome://extensions/](chrome://extensions/)
3. If it's not already on, toggle the developer mode at the top
4. Click the "load unpacked" button in the top left of the page
5. Navigate to this project folder and select it.
6. Once the extension is loaded, pin this to your extensions bar at the top.
7. This extension currently operates only on [www.scryfall.com/card/](www.scryfall.com/card/) pages so head to one and press the button(s) under the card images.
8. If you're not familiar with Magic: The Gathering you can just type any letter into the the search bar to test functionality.

### Functionality to add

* Button animations
    * ~~Buttons indicate cards that have already been added~~
    * ~~"onClick" resonsiveness~~
        * Initial onclick Logic implented. See if it can be prettied
    * ~~consolidate button animation code~~
* Implementation of MTGgoldfish
    * add from event decklists as well?
    * would have to add a default printing if that was the case maybe.
* ~~Adding card set information (printing)~~
* ~~Removing the Arena tag from cards or look into whether it's a supported format or not.~~

### Known issues

1. **Scryfall**
    * Arena cards add weird in the search page - Seems to align with functionality
    *  ~~"Add to Tabber" buttons populate empty grids in grid view~~ Fixed
    
    * **Text Only mode**
        * "Add to Tabber" buttons aren't aligned in the text only mode
        * The whole box is an `<a>` element meaning clicking the button also takes you to the page with the card on it.
    
2. General
    * Content scripts can't utilise modules as they're supposed to be standalone annoying since they share functionality.


### User testing first round

* ~~Hard to tell if card is added w/o opening pop-up (maybe alter buttons to show)~~
    * changed button but mb could change background around card in some views.
* Wished that card would have an image pop up in the list view window - Potential DB integration for this one?.
* ~~Confirmation prompt for clearing list - easy to click on accident~~
    * provisional fix for now.
* ~~When page isn't fully populated "Phantom buttons" appear that do nothing~~ Fixed