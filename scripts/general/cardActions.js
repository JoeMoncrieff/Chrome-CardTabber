// scripts/general/cardActions.js
/*
Decklist
[ {
"cardName": "cardName",
"quantity": n,
"set": "set",
"setNo": "setNo"
]
*/
export async function removeOneFromDeckList(cardName, set, setNo) {
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


export async function addToDeckList(cardName, set, setNo) {
    const data = await chrome.storage.local.get("deckList");
    const deckList = data.deckList || [];
    let isInList = await checkList(cardName, set, setNo);
    if (!isInList) {
      //add the card to the decklist
      deckList.push({cardName: cardName, quantity: 1, set: set, setNo: setNo});
      await chrome.storage.local.set({deckList: deckList});
    } else {
      //update the quantity
      deckList.find(card => card.cardName === cardName && card.set === set && card.setNo === setNo).quantity += 1; // Edited
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
  const found = data.deckList.find(card => card.cardName === cardName && card.set === set && card.setNo === setNo) !== undefined; // Edited
  
  return found;
  }