/*
Decklist
[ {
"cardName": "cardName",
"quantity": n
]
*/
export async function removeOneFromDeckList(cardName) {
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


export async function addToDeckList(cardName) {
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
  