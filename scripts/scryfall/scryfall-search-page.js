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
    const found = data.deckList.find(card => card.cardName === cardName) !== undefined;
    console.log("Checking if card in list:", found);
    return found;
}
    

function storageChangeEvent(changes, area) {
    console.log(`Change event fired in ${area} storage`);

    const storageChanges = Object.keys(changes);

    for (const deckList of storageChanges) {
        if (deckList === 'deckList') {
            
            //If an item is removed
            if (changes[deckList].oldValue.length > changes[deckList].newValue.length) {
                //assume change here
                
                let key_check = []
                for (let i = 0; i<changes[deckList].newValue.length;i++){
                    key_check.push(changes[deckList].newValue[i].cardName)
                }
                console.log(`${key_check}`)
                let ourSet = changes[deckList].oldValue.filter((crd) => !key_check.includes(crd.cardName))
                console.log(`ourset: ${ourSet}`)
                
                // for (let i = 0; i<changes[deckList].newValue.length;i++){
                for (let i = 0; i<ourSet.length;i++){
                    console.log(ourSet[i].cardName.replaceAll(" ", "-"))
                    const classList = document.getElementsByClassName(ourSet[i].cardName.replaceAll(" ", "-"))
                    for (const element of classList) {
                        element.textContent = `💡 Add to Tabber 💡`;
                    };
                };

            }

            if (changes[deckList].oldValue.length < changes[deckList].newValue.length) {
                //assume change here
                
                let key_check = []
                for (let i = 0; i<changes[deckList].oldValue.length;i++){
                    key_check.push(changes[deckList].oldValue[i].cardName)
                }
                console.log(`${key_check}`)
                let ourSet = changes[deckList].newValue.filter((crd) => !key_check.includes(crd.cardName))
                console.log(`ourset: ${ourSet}`)
                
                for (let i = 0; i<ourSet.length;i++){
                    const classList = document.getElementsByClassName(ourSet[i].cardName.replaceAll(" ", "-"))
                    for (const element of classList){
                        element.textContent = `➕ Add one more ➕`;
                    };
                };

            }





            
        }
    }
}

chrome.storage.onChanged.addListener(storageChangeEvent);
// inject buttons to all cards in grid

// find out what view we are in
// images, checklist, text-only, full
// &as=grid, &as=checklist, &=text, &as=full

//get current url
url = window.location.href;

if (url.includes("as=grid") || (url.includes("sets") && !url.includes("as=")) || (url.includes("search") && !url.includes("as="))) {
    // get all card divs
    const cardDivs = document.querySelectorAll(".card-grid-item");
    console.log(cardDivs);

    //TODO: Empty card divs shouldn't get a button 
    cardDivs.forEach(cardDiv => {
        if (!cardDiv.classList.contains("flexbox-spacer")) {
            const button = document.createElement("button");
            const cardName = cardDiv.querySelector(".card-grid-item-invisible-label").textContent;
            button.classList.add("button-n");
        
            //Adding cardName to the id list
            button.classList.add(`${cardName.replaceAll(" ","-")}`);

            // Check here to see if it's already in the list
            checkList(cardName).then(inList => {
                if (!inList){
                    button.textContent = `💡 Add to Tabber 💡`
                } else {
                    button.textContent = `➕ Add one more ➕`
                }
            });
            
            button.style.alignSelf = "center";
            button.style.margin = "auto";
            button.style.display = "block";
            button.addEventListener("click", () => {
                addToDeckList(cardName);
            });
            cardDiv.appendChild(button);
        }
        
    });
} else if (url.includes("as=checklist")) {

    const checklist = document.getElementById("js-checklist");
    const tableHead = checklist.getElementsByTagName("thead")[0].querySelector("tr");
    
    const newRow = document.createElement("th");
    newRow.classList.add("tabber-column");
    const title = document.createElement("p");
    title.textContent = "+ Tabber";
    newRow.appendChild(title);
    tableHead.appendChild(newRow);

    document.querySelector("tbody").querySelectorAll("tr").forEach(tr => {

        const newButtonWrapper = document.createElement("td");
        const newButton = document.createElement("button");
        newButtonWrapper.appendChild(newButton);
        newButton.classList.add("button-n");

        const cardName = tr.querySelectorAll("td")[2].textContent;
        newButton.classList.add(`${cardName.replaceAll(" ","-")}`);
        checkList(cardName).then(inList => {
            if (!inList){
                newButton.textContent = `💡 Add to Tabber 💡`
            } else {
                newButton.textContent = `➕ Add one more ➕`
            }
        });

        
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
        button.classList.add(`${cardName.replaceAll(" ","-")}`);
        button.classList.add("button-n");
        checkList(cardName).then(inList => {
            if (!inList){
                button.textContent = `💡 Add to Tabber 💡`
            } else {
                button.textContent = `➕ Add one more ➕`
            }
        });
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
