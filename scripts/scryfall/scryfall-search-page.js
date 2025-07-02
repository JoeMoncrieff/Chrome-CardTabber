async function removeOneFromDeckList(cardName, set, setNo) {
  const data = await chrome.storage.local.get("deckList");
  const deckList = data.deckList || [];
  var deletedAll = false;
  //Remove the card from the decklist if the quantity is 1
  if (deckList.find(card => card.cardName === cardName && card.set === set && card.setNo === setNo).quantity === 1) {
    deckList.splice(deckList.findIndex(card => card.cardName === cardName && card.set === set && card.setNo === setNo), 1);
    deletedAll = true;
  } else {
    deckList.find(card => card.cardName === cardName && card.set === set && card.setNo === setNo).quantity -= 1;
  }
  await chrome.storage.local.set({deckList: deckList});
  return deletedAll;
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
function make_card_tag(cardName,set,setNo,isDiv = false) {
    let returnString = `${cardName} ${set} ${setNo}`.replaceAll(/[^a-zA-Z0-9]/g,"-").replaceAll(" ","-");
    if (isDiv) {
        returnString += "-div";
    }
    return returnString;

}
function get_card_tag(cardName,set,setNo,isDiv = false) {
    return document.querySelectorAll(`.${make_card_tag(cardName,set,setNo,isDiv)}`);
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
                
                
                let key_check = []
                for (let i = 0; i<changes[deckList].newValue.length;i++){
                    key_check.push(`${changes[deckList].newValue[i].cardName}${changes[deckList].newValue[i].set}${changes[deckList].newValue[i].setNo}`) //Edited
                }
                
                let ourSet = changes[deckList].oldValue.filter((crd) => !key_check.includes(`${crd.cardName}${crd.set}${crd.setNo}`)) //Edited
                

                for (let i = 0; i<ourSet.length;i++){
                    
                    const classList = get_card_tag(ourSet[i].cardName, ourSet[i].set, ourSet[i].setNo);
                    for (const element of classList) {
                        element.textContent = `💡 Add to Tabber 💡`;
                    };

                    const cardDiv = get_card_tag(ourSet[i].cardName, ourSet[i].set, ourSet[i].setNo,true);
                    let url = window.location.href;
                    for (const divider of cardDiv){
                        if (url.includes("as=grid") 
                            || (url.includes("sets") && !url.includes("as=")) 
                            || (url.includes("search") && !url.includes("as="))) {
                                
                            divider.querySelector("img").style.boxShadow = "0px 0px black"
                        } else if (url.includes("as=checklist")) {
                            divider.style.background = "";
                        } else if (url.includes("as=full") || url.includes("/card/")) {
                            divider.querySelector("img").style.boxShadow = "0px 0px black"
                        }
                        
                    };
                };
            }

            if (changes[deckList].oldValue.length < changes[deckList].newValue.length) {
                
                
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

                    const cardDiv = get_card_tag(ourSet[i].cardName, ourSet[i].set, ourSet[i].setNo,true);
                    let url = window.location.href;
                    for (const divider of cardDiv){
                        if (url.includes("as=grid") 
                            || (url.includes("sets") && !url.includes("as=")) 
                            || (url.includes("search") && !url.includes("as="))) {
    
                            divider.querySelector("img").style.boxShadow = "0px 10px 2px rgba(0, 180, 0, 0.6)"

                        } else if (url.includes("as=checklist")) {
                            divider.style.background = "rgba(0, 180, 0, 0.3)"
                        } else if (url.includes("as=full") || url.includes("/card/")) {
                            divider.querySelector("img").style.boxShadow = "0px 20px 2px rgba(0, 180, 0, 0.6)"
                        }
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
            
            //Card highlighting logic
            cardDiv.classList.add(make_card_tag(cardName,set,setNo,true));

            button = createAddTabberButton(cardName,set,setNo,artUrl);

            //Check if card is in list and if so then add a little shadow.
            checkList(cardName,set,setNo).then(inList => {
                if (inList) {cardDiv.querySelector("img").style.boxShadow = "0px 10px 2px rgba(0, 180, 0, 0.6)";}
            });


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

        tr.classList.add(make_card_tag(cardName,set,setNo,true));
        checkList(cardName,set,setNo).then(inList => {
            if (inList) {tr.style.background = "rgba(0, 180, 0, 0.3)";};
        });

        const button = createAddTabberButton(cardName,set,setNo,artUrl);
        newButtonWrapper.appendChild(button);

        tr.appendChild(newButtonWrapper);
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
        
        cardDiv.classList.add(make_card_tag(cardName,set,setNo,true));

        checkList(cardName,set,setNo).then(inList => {
            if (inList) {cardDiv.querySelector("img").style.boxShadow = "0px 20px 2px rgba(0, 180, 0, 0.6)";};
        });

        const button = createAddTabberButton(cardName,set,setNo,artUrl);
        button.style.alignSelf = "center";
        button.style.margin = "auto";

        actions_section.appendChild(button);
    });
} 

/*
//====Code Remains in case i return to this but dropped support due to lack of image functionality.====
else if (url.includes("as=text")) {

    
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
}
*/