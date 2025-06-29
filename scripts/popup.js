// scripts/popup.js
// This script is used to display the deck list in the popup

import colours from "./colours.js";
import { addToDeckList, removeOneFromDeckList } from "./general/cardActions.js";
chrome.storage.local.get("deckList").then(data => {
    const deckList = document.getElementById("deck-list");
    
    // each element in a div that has the card name and also a button to remove the card from the deckList 
    // and also remove it from the popup display
    console.log(data);
    if (data.deckList != null){
        data.deckList.forEach(card => {
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card-div");
            cardDiv.style.display = "flex";
            const paragraph = document.createElement("p");
            paragraph.style.color = colours.text;
            paragraph.classList.add("card-name");
            console.log(card);
            paragraph.textContent = card.quantity + "x " + card.cardName +" "+  card.set +" "+ card.setNo;
            // align remove button to stick onto the right wall of the cardDiv      
            const removeButton = document.createElement("button");
            removeButton.classList.add("card-remove-button");
            removeButton.textContent = "\u{274C}";
            //needs to refresh the popup to remove the card from the display
            
            removeButton.addEventListener("click", () => {
                
                chrome.storage.local.get("deckList").then(data => {
                    data.deckList = data.deckList.filter(c => !(c.cardName === card.cardName && c.set === card.set && c.setNo === card.setNo)); // Edited
                    chrome.storage.local.set({"deckList": data.deckList});
                    location.reload();
                });
                
            });

            const addOneButton = document.createElement("button");
            addOneButton.classList.add("card-remove-button");
            addOneButton.textContent = "\u{2795}";
            addOneButton.addEventListener("click", () => {
                addToDeckList(card.cardName, card.set, card.setNo);
                location.reload();
            });
            const removeOneButton = document.createElement("button");
            removeOneButton.classList.add("card-remove-button");
            removeOneButton.textContent = "\u{2796}";
            removeOneButton.addEventListener("click", () => {
                removeOneFromDeckList(card.cardName, card.set, card.setNo);
                location.reload();
            });

            
            cardDiv.appendChild(paragraph);
            cardDiv.appendChild(removeButton);
            cardDiv.appendChild(addOneButton);
            cardDiv.appendChild(removeOneButton);
            deckList.appendChild(cardDiv);
            //add dotted line to the bottom of the cardDiv
            //cardDiv.style.borderBottom = "3px dotted " + colours.background;
        });
    };
});

// add a button to the bottom of the deck list that will copy the deckList from the chrome storage to the clipboard
const copyButton = document.getElementById("copy-deck-list");
copyButton.textContent = "\u{1F4DD}";
copyButton.addEventListener("click", () => {
    let toCopy = "";
    chrome.storage.local.get("deckList").then(data => {
        data.deckList.forEach(card => {
            toCopy += card.quantity + "x " + card.cardName + " (" + card.set + ") (" + card.setNo + ")" + "\n"
        });
        navigator.clipboard.writeText(toCopy);
    });
});

const clearButton = document.getElementById("clear-deck-list");
clearButton.textContent = "\u{1F5D1}";
clearButton.addEventListener("click", () => {
    //TODO: Maybe write better popup confirm here. provisional for now
    if (confirm("Are you sure you want to delete your list?")){
        chrome.storage.local.set({"deckList": []});
        location.reload();
    }
});


//Todo once quantities are added, add and if to check 1 or n.
const downloadButton = document.getElementById("download-deck-list");
downloadButton.textContent = "\u{1F4E5}";
downloadButton.addEventListener("click", () => {
    let toDownload = "";
    chrome.storage.local.get("deckList").then(data => {
        data.deckList.forEach(card => {
            toDownload += card.quantity + "x " + card.cardName + " (" + card.set + ") (" + card.setNo + ")" + "\n";
        });
        const blob = new Blob([toDownload], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "deckList.txt";
        a.click();
    });
});