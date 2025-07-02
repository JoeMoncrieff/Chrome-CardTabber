async function removeOneFromDeckList(cardName, set, setNo) {
  const data = await chrome.storage.local.get("deckList");
  const deckList = data.deckList || [];
  //Remove the card from the decklist if the quantity is 1
  if (deckList.find(card => card.cardName === cardName && card.set === set && card.setNo === setNo).quantity === 1) {
    deckList.splice(deckList.findIndex(card => card.cardName === cardName && card.set === set && card.setNo === setNo), 1);
  } else {
    deckList.find(card => card.cardName === cardName && card.set === set && card.setNo === setNo).quantity -= 1;
  }
  await chrome.storage.local.set({deckList: deckList});
}

  
async function addToDeckList(cardName, set, setNo, artUrl=null) {
    const data = await chrome.storage.local.get("deckList");
    const deckList = data.deckList || [];
    let isInList = await checkList(cardName,set,setNo);
    if (!isInList) {
      //add the card to the decklist
      deckList.push({cardName: cardName, quantity: 1, set: set, setNo: setNo,artUrl:artUrl});
      
      await chrome.storage.local.set({deckList: deckList});
    } else {
      //update the quantity
      deckList.find(card => card.cardName === cardName && card.set === set && card.setNo === setNo).quantity += 1;
      await chrome.storage.local.set({deckList: deckList});
    }
}
  
async function checkList(cardName, set, setNo) {
    const data = await chrome.storage.local.get("deckList");
    // Check if deckList is undefined or empty
    if (!data.deckList) {
    
    await chrome.storage.local.set({"deckList": []});
    
    return false;
    }
    // Check if cardName exists in the deckList
    const found = data.deckList.find(card => card.cardName === cardName && card.set === set && card.setNo === setNo) !== undefined;
    
    return found;
}

//Helper function
function make_card_tag(cardName,set,setNo) {
    return `${cardName} ${set} ${setNo}`.replaceAll(/[^a-zA-Z0-9]/g,"-").replaceAll(" ","-");

}
function get_card_tag(cardName,set,setNo) {
    return document.querySelectorAll(`.${make_card_tag(cardName,set,setNo)}`);
}

//Button helper function
function createAddTabberButton(cardName,set,setNo,artUrl=null)
{
    const button = document.createElement("button");
    button.classList.add("button-n");

    //Adding cardName to the id list
    button.classList.add(make_card_tag(cardName,set,setNo));

    // Check here to see if it's already in the list
    checkList(cardName,set,setNo).then(inList => {
        if (!inList){
            button.textContent = `💡 Add to Tabber 💡`
        } else {
            button.textContent = `➕ Add one more ➕`
        }
    });

    button.addEventListener("click", () => {
        addToDeckList(cardName, set, setNo, artUrl);
        button.style.background = "#000000";
        setTimeout(function(){button.style.background = "#fff"}, 20)
    });

    return button
}

function storageChangeEvent(changes, area) {
    

    const storageChanges = Object.keys(changes);

    for (const deckList of storageChanges) {
        if (deckList === 'deckList') {
            
            //If an item is removed
            if (changes[deckList].oldValue.length > changes[deckList].newValue.length) {
                //assume change here
                
                let key_check = []
                for (let i = 0; i<changes[deckList].newValue.length;i++){
                    key_check.push(`${changes[deckList].newValue[i].cardName}${changes[deckList].newValue[i].set}${changes[deckList].newValue[i].setNo}`) //Edited
                }
                
                let ourSet = changes[deckList].oldValue.filter((crd) => !key_check.includes(`${crd.cardName}${crd.set}${crd.setNo}`)) //Edited
                

                // for (let i = 0; i<changes[deckList].newValue.length;i++){
                for (let i = 0; i<ourSet.length;i++){
                    
                    const classList = get_card_tag(ourSet[i].cardName, ourSet[i].set, ourSet[i].setNo);
                    for (const element of classList) {
                        element.textContent = `💡 Add to Tabber 💡`;
                    };
                };

            }

            if (changes[deckList].oldValue.length < changes[deckList].newValue.length) {
                //assume change here
                
                let key_check = []
                for (let i = 0; i<changes[deckList].oldValue.length;i++){
                    key_check.push(`${changes[deckList].oldValue[i].cardName}${changes[deckList].oldValue[i].set}${changes[deckList].oldValue[i].setNo}`)
                }
                
                let ourSet = changes[deckList].newValue.filter((crd) => !key_check.includes(`${crd.cardName}${crd.set}${crd.setNo}`))
                
                
                for (let i = 0; i<ourSet.length;i++){
                    
                    const classList = get_card_tag(ourSet[i].cardName, ourSet[i].set, ourSet[i].setNo);
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
    

    //TODO: Empty card divs shouldn't get a button 
    cardDivs.forEach(cardDiv => {
        if (!cardDiv.classList.contains("flexbox-spacer")) {
            const cardName = cardDiv.querySelector(".card-grid-item-invisible-label").textContent;
            const cardUrlSplit = cardDiv.getElementsByTagName('a')[0].href.split("https://scryfall.com/card/")[1].split("/");
            const set = cardUrlSplit[0];
            const setNo = cardUrlSplit[1];
            const artUrl = cardDiv.querySelector("img").src

            button = createAddTabberButton(cardName,set,setNo,artUrl);
            
            //Unique button init for this specific layout
            button.style.alignSelf = "center";
            button.style.margin = "auto";
            button.style.display = "block";

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
        
        const cardName = tr.querySelectorAll("td")[2].textContent;
        const cardUrlSplit = tr.querySelectorAll("td")[0].querySelectorAll("a")[0].href.split("https://scryfall.com/card/")[1].split("/");
        const set = cardUrlSplit[0];
        const setNo = cardUrlSplit[1];
        const artUrl = tr.getAttribute("data-card-image-front")
        
        const button = createAddTabberButton(cardName,set,setNo,artUrl);
        newButtonWrapper.appendChild(button);

        tr.appendChild(newButtonWrapper);
    });

    
} else if (url.includes("as=text")) {
    const cardDivs = document.querySelectorAll(".card-text.text-grid-item");

    cardDivs.forEach(cardDiv => {
        
        const cardName = cardDiv.querySelector("h6").textContent.split("{")[0].trim();
        const cardUrlSplit = cardDiv.href.split("https://scryfall.com/card/")[1].split("/");
        const set = cardUrlSplit[0];
        const setNo = cardUrlSplit[1];

        const button = createAddTabberButton(cardName,set,setNo);
       
        //Unique styles
        button.style.alignSelf = "center";
        button.style.margin = "auto";
        button.style.display = "block";
        button.style.float = "bottom";
        button.style.position = "relative";

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
        let cardName = nameArr.join(" // ")

        
        const set = cardDiv.querySelector(".prints-current-set").href.split("https://scryfall.com/sets/")[1]
        const setNo = cardDiv.querySelector(".prints-current-set-details").textContent.split("·")[0].trim().replace("#","");
        const artUrl = cardDiv.querySelector("img").src;

        const button = createAddTabberButton(cardName,set,setNo,artUrl);
        button.style.alignSelf = "center";
        button.style.margin = "auto";

        actions_section.appendChild(button);
    });
}