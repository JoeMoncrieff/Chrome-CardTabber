# Card Tabber

The aim of Card Tabber is to take cards from scryfall websites and add them to a list for later use. The idea is that it'll speed up deck brainstorming and construction.

## Installing and building the extension

1. Open up google chrome
2. head to [chrome://extensions/](chrome://extensions/)
3. If it's not already on, toggle the developer mode at the top
4. Click the "load unpacked" button in the top left of the page
5. Navigate to this project folder and select it.
6. Once the extension is loaded, pin this to your extensions bar at the top.
7. This extension currently operates only on [www.scryfall.com](www.scryfall.com/) so browse that website to find cards.

### Functionality to add

* potential style swap between 
    * "1x cardName"
    * "1 cardName"
    * "cardName"
* Implementation of MTGgoldfish
    * add from event decklists as well?
* Adding card set information (printing)
* Removing the Arena tag from cards or look into whether it's a supported format or not.

### Known issues

1. **Scryfall**
    * Arena cards add weird in the search page

    * "Add to Tabber" buttons aren't aligned in the text only mode
2. General
    * Content scripts can't utilise modules as they're supposed to be standalone annoying since they share functionality.
