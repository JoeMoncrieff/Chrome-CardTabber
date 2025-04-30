const actions_section = document.querySelector(".card-actions");
//Get card name here.
const name_section = document.querySelectorAll(".card-text-card-name");
let nameArr = []
name_section.forEach(nameWrapper => {
  nameArr.push(nameWrapper.textContent.trim())
});

console.log(nameArr)
let cardName = nameArr.join(" // ")

console.log(cardName)

// Checking the initialisation of the decklist here so that it doesn't override the existing list.
chrome.storage.local.get("deckList").then(data => {
  if (!data.deckList) {
    chrome.storage.local.set({"deckList":[]}).then(console.log("no decklist detected, initialising decklist... done"))
  } else {
    console.log("decklist detected. maintaining old list")
  }
});

//Checks the list to see if we've already added it before.
async function checkList() {
  const data = await chrome.storage.local.get("deckList");
  // Check if deckList is undefined or empty
  if (!data.deckList) {
    console.log("no decklist");
    await chrome.storage.local.set({"deckList": []});
    console.log("init decklist... done");
    return false;
  }
  
  // Check if cardName exists in the deckList
  const found = data.deckList.includes(cardName);
  console.log("Checking if card in list:", found);
  return found;
}

// `document.querySelector` may return null if the selector doesn't match anything.
if (actions_section) {
  
  const badge = document.createElement("button");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("button-n");
  badge.textContent = `💡 Add to Tabber 💡`;


  badge.addEventListener("click", async function(){
    let isInList = await checkList();
    console.log("isInList", isInList);
    if (!isInList) {
      console.log("card not in list");
      chrome.storage.local.get("deckList").then((data) => {
        // Create new array from existing deckList and add new card
        const new_array = [...data.deckList, cardName];
        chrome.storage.local.set({"deckList": new_array}).then(() => console.log("Updated deck list:", new_array));
      });
    } else {
      console.log("card already in list");
      chrome.storage.local.get("deckList").then(data => console.log("Current deck list:", data.deckList));
    }
  });
  actions_section.appendChild(badge);
}
