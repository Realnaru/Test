
document.querySelector("#sort-button").addEventListener("click", () => showSortedArray());


function showSortedArray() {

  let unsortedArray = document.getElementById("array-input").value.trim().split(" ");
  let identifier = document.getElementById("identifier-input").value;

  if ( unsortedArray != "" & identifier != "") {
    let identifierSpan = document.querySelector("#identifier-output");
    let input = document.querySelector("#array-output");
    input.value = bubbleSort(unsortedArray);
    identifierSpan.innerText = identifier;
    identifierSpan.value = identifier;
  }

}

function bubbleSort(anyArray) {

  for (let i = 0; i < anyArray.length; i++) {
    for (let j = 0; j < anyArray.length - i - 1; j++) {
      if (anyArray[j] > anyArray[j + 1]) {
        let temp = anyArray[j];
        anyArray[j] = anyArray[j + 1];
        anyArray[j + 1] = temp;
      }
    }
  }
  return anyArray;

}
