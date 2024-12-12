

export function updateLocalStorageList(itemId, listKey, isAdding) {
    const existingList = JSON.parse(localStorage.getItem(listKey)) || [];
    let updatedList;

    if (isAdding) {
        updatedList = [...existingList, { id: itemId }];
    } else {
        updatedList = existingList.filter(item => item.id !== itemId);
    }

    localStorage.setItem(listKey, JSON.stringify(updatedList));
    return updatedList;
}


