// This script is used to display the deck list in the popup

import colours from "./colours.js";

/*
let currentBg = colours.listbg2

function toggleBg(cardDiv) {
    if (currentBg === colours.listbg1) {
        cardDiv.style.backgroundColor = colours.listbg2;
        currentBg = colours.listbg2;
    } else {
        cardDiv.style.backgroundColor = colours.listbg1;
        currentBg = colours.listbg1;
    }
}
*/



chrome.storage.local.get("deckList").then(data => {
    const deckList = document.getElementById("deck-list");
    
    // each element in a div that has the card name and also a button to remove the card from the deckList 
    // and also remove it from the popup display
    data.deckList.forEach(card => {
        const cardDiv = document.createElement("div");
        //cardDiv.style.backgroundColor = colours.listbg2;
        //toggleBg(cardDiv);
        cardDiv.classList.add("card-div");
        cardDiv.style.display = "flex";
        const paragraph = document.createElement("p");
        paragraph.style.color = colours.text;
        paragraph.classList.add("card-name");
        paragraph.textContent = card;
        // align remove button to stick onto the right wall of the cardDiv      
        const removeButton = document.createElement("button");
        removeButton.classList.add("card-remove-button");
        removeButton.textContent = "\u{274C}";
        //needs to refresh the popup to remove the card from the display
        removeButton.addEventListener("click", () => {
            chrome.storage.local.get("deckList").then(data => {
                data.deckList = data.deckList.filter(c => c !== card);
                chrome.storage.local.set({"deckList": data.deckList});
                location.reload();
            });
        });
        cardDiv.appendChild(paragraph);
        cardDiv.appendChild(removeButton);
        deckList.appendChild(cardDiv);
        //add dotted line to the bottom of the cardDiv
        cardDiv.style.borderBottom = "3px dotted " + colours.background;
    });
});

// add a button to the bottom of the deck list that will copy the deckList from the chrome storage to the clipboard
const copyButton = document.getElementById("copy-deck-list");
copyButton.textContent = "\u{1F4DD} Copy To Clipboard \u{1F4DD}";
copyButton.addEventListener("click", () => {
    chrome.storage.local.get("deckList").then(data => {
        const deckList = data.deckList.join("\n");
        navigator.clipboard.writeText(deckList);
    });
});

const clearButton = document.getElementById("clear-deck-list");
clearButton.textContent = "\u{1F5D1} Clear All \u{1F5D1}";
clearButton.addEventListener("click", () => {
    chrome.storage.local.set({"deckList": []});
    location.reload();
});

const downloadButton = document.getElementById("download-deck-list");
downloadButton.textContent = "\u{1F4E5} Download TXT \u{1F4E5}";
downloadButton.addEventListener("click", () => {
    chrome.storage.local.get("deckList").then(data => {
        const deckList = data.deckList.join("\n");
        const blob = new Blob([deckList], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "deckList.txt";
        a.click();
    });
});
