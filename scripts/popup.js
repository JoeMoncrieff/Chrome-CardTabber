// This script is used to display the deck list in the popup

let currentBg = "lightgrey"
function toggleBg(cardDiv) {
    if (currentBg === "lightgrey") {
        cardDiv.style.backgroundColor = "white";
        currentBg = "white";
    } else {
        cardDiv.style.backgroundColor = "lightgrey";
        currentBg = "lightgrey";
    }
}

chrome.storage.local.get("deckList").then(data => {
    const deckList = document.getElementById("deck-list");
    
    // each element in a div that has the card name and also a button to remove the card from the deckList 
    // and also remove it from the popup display
    data.deckList.forEach(card => {
        const cardDiv = document.createElement("div");
        toggleBg(cardDiv);
        cardDiv.classList.add("card-div");
        cardDiv.style.display = "flex";
        const paragraph = document.createElement("p");
        paragraph.style.float = "left"
        paragraph.style.width = "80%";
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
    });
});

// add a button to the bottom of the deck list that will copy the deckList from the chrome storage to the clipboard
const copyButton = document.createElement("button");
copyButton.textContent = "Copy Deck List";
copyButton.addEventListener("click", () => {
    chrome.storage.local.get("deckList").then(data => {
        const deckList = data.deckList.join("\n");
        navigator.clipboard.writeText(deckList);
    });
});

// add the copy button to the bottom of the deck list
const deckList = document.getElementById("deck-list");
deckList.appendChild(copyButton);
