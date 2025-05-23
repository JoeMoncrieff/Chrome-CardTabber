async function removeOneFromDeckList(cardName) {
    const data = await chrome.storage.local.get("deckList");
    const deckList = data.deckList || [];
    //Remove the card from the decklist if the quantity is 1
    if (deckList.find(card => card.cardName === cardName).quantity === 1) {
      deckList.splice(deckList.findIndex(card => card.cardName === cardName), 1);
    } else {
      deckList.find(card => card.cardName === cardName).quantity -= 1;
    }
    await chrome.storage.local.set({deckList: deckList});
}
  
  
async function addToDeckList(cardName) {
    const data = await chrome.storage.local.get("deckList");
    const deckList = data.deckList || [];
    let isInList = await checkList(cardName);
    if (!isInList) {
      //add the card to the decklist
      deckList.push({cardName: cardName, quantity: 1});
      await chrome.storage.local.set({deckList: deckList});
    } else {
      //update the quantity
      deckList.find(card => card.cardName === cardName).quantity += 1;
      await chrome.storage.local.set({deckList: deckList});
    }
}
  
async function checkList(cardName) {
    const data = await chrome.storage.local.get("deckList");
    // Check if deckList is undefined or empty
    if (!data.deckList) {
    console.log("no decklist");
    await chrome.storage.local.set({"deckList": []});
    console.log("init decklist... done");
    return false;
    }
    // Check if cardName exists in the deckList
    // Check if cardName exists in the deckList
    const found = data.deckList.find(card => card.cardName === cardName) !== undefined;
    console.log("Checking if card in list:", found);
    return found;
}
    
  
// inject buttons to all cards in grid

// find out what view we are in
// images, checklist, text-only, full
// &as=grid, &as=checklist, &=text, &as=full

//get current url
url = window.location.href;

if (url.includes("as=grid")) {
    // get all card divs
    const cardDivs = document.querySelectorAll(".card-grid-item");
    console.log(cardDivs);
    cardDivs.forEach(cardDiv => {
        const button = document.createElement("button");
        button.classList.add("button-n");
        button.textContent = `💡 Add to Tabber 💡`;
        button.style.alignSelf = "center";
        button.style.margin = "auto";
        button.style.display = "block";
        button.addEventListener("click", () => {
            const cardName = cardDiv.querySelector(".card-grid-item-invisible-label").textContent;
            addToDeckList(cardName);
        });
        cardDiv.appendChild(button);
    });
} else if (url.includes("as=checklist")) {
    console.log("got here");
    const checklist = document.getElementById("js-checklist");
    const tableHead = checklist.getElementsByTagName("thead")[0].querySelector("tr");
    
    const newRow = document.createElement("th");
    newRow.classList.add("tabber-column");
    const title = document.createElement("p");
    title.textContent = "+ Tabber";
    newRow.appendChild(title);
    tableHead.appendChild(newRow);

    document.querySelector("tbody").querySelectorAll("tr").forEach(tr => {
        console.log(tr);
        const newButtonWrapper = document.createElement("td");
        const newButton = document.createElement("button");
        newButtonWrapper.appendChild(newButton);
        newButton.classList.add("button-n");
        newButton.textContent = "+ Tabber";
        const cardName = tr.querySelectorAll("td")[2].textContent;
        newButton.addEventListener("click", () => {
            addToDeckList(cardName);
        });
        tr.appendChild(newButtonWrapper);
    });

    
} else if (url.includes("as=text")) {
    const cardDivs = document.querySelectorAll(".card-text.text-grid-item");

    cardDivs.forEach(cardDiv => {
        const button = document.createElement("button");
        button.classList.add("button-n");
        button.textContent = `💡 Add to Tabber 💡`;
        button.style.alignSelf = "center";
        button.style.margin = "auto";
        button.style.display = "block";
        button.style.float = "bottom";
        button.style.position = "relative";
        button.addEventListener("click", () => {
            const cardName = cardDiv.querySelector("h6").textContent;
            addToDeckList(cardName);
        });

        cardDiv.appendChild(button);
    });
    
} else if (url.includes("as=full") || url.includes("/card/")) {
    const cardDivs = document.querySelectorAll(".card-profile");
    cardDivs.forEach(cardDiv => {
        const actions_section = cardDiv.querySelector(".card-actions");

        //Get card name here.
        const name_section = cardDiv.querySelectorAll(".card-text-card-name");
        let nameArr = []
        name_section.forEach(nameWrapper => {
        nameArr.push(nameWrapper.textContent.trim())
        });

        console.log(nameArr)
        let cardName = nameArr.join(" // ")

        console.log(cardName)
        
        
        const button = document.createElement("button");
        button.classList.add("button-n");
        button.textContent = `💡 Add to Tabber 💡`;
        button.style.alignSelf = "center";
        button.style.margin = "auto";
        button.addEventListener("click", () => {
            addToDeckList(cardName);
        });

        actions_section.appendChild(button);
    });
} else {
    const cardDivs = document.querySelectorAll(".card-grid-item");
    console.log(cardDivs);
    cardDivs.forEach(cardDiv => {
        const button = document.createElement("button");
        button.classList.add("button-n");
        button.textContent = `💡 Add to Tabber 💡`;
        button.style.alignSelf = "center";
        button.style.margin = "auto";
        button.style.display = "block";
        button.addEventListener("click", () => {
            const cardName = cardDiv.querySelector(".card-grid-item-invisible-label").textContent;
            addToDeckList(cardName);
        });
        cardDiv.appendChild(button);
    });
}
