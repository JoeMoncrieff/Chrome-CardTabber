// This script is used to display the deck list in the popup

chrome.storage.local.get("deckList").then(data => {
    const deckList = document.getElementById("deck-list");
    // each element in a div that has the card name and also a button to remove the card from the deckList 
    // and also remove it from the popup display
    data.deckList.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.style.display = "flex";
        const paragraph = document.createElement("p");
        paragraph.style.float = "left"
        paragraph.style.width = "80%";
        paragraph.textContent = card;
        // align remove button to stick onto the right wall of the cardDiv      
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove"
        removeButton.style.marginRight = "10px";
        removeButton.style.marginLeft = "5px";
        removeButton.style.float = "right";
        removeButton.style.width = "20%";
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
