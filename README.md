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
    * ~~Arena cards add weird in the search page - Seems to align with functionality~~
    * ~~"Add to Tabber" buttons populate empty grids in grid view~~ Fixed
    * Images sometimes come in different languages than english? -- Look into How I url trim.
    * ~~**Text Only mode**~~ **_===Dropped===_**
        * "Add to Tabber" buttons aren't aligned in the text only mode
        * The whole box is an `<a>` element meaning clicking the button also takes you to the page with the card on it.
        * Polling user groups and was 11-0 with 11 saying they don't use text only. Since I'm making this for my friends might as well pull the plug on text only.
    
2. General
    * Content scripts can't utilise modules as they're supposed to be standalone annoying since they share functionality.

3. Popup.js
    * ~~`location.reload()` resets where you were on the page annoying when you're at a scrollable amount of cards.~~

### User feedback first round

* ~~Hard to tell if card is added w/o opening pop-up (maybe alter buttons to show)~~
    * changed button but mb could change background around card in some views.
* ~~Wished that card would have an image pop up in the list view window - Potential DB integration for this one?.~~
    * See if img link in all modes. Issues with text only mode... just drop support?
* ~~Confirmation prompt for clearing list - easy to click on accident~~
    * provisional fix for now.
* ~~When page isn't fully populated "Phantom buttons" appear that do nothing~~ Fixed

### User feedback second round

* ~~Visual indication of card in list --> Soft glow~~
* A way to keep track of what Moxfield deck you're working on so you don't accidentally add ~~more ~~ the same cards.
    * How to access list, not a separate rawtext url. only get list in readable form when you go `more` --> `export` and then you can see decklist in download options on form 
        * you can get list from navigating to {decklistURL}/edit but a little nervous this is going to get permissions patched at some point...
    * Extra: Version and exact card match?
    * Look into private/unlisted decks.
* _Shudders_ additional **tabs** wanted.