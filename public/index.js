//choose button and add function
document.querySelector("#sort-button").addEventListener("click", () => showSortedArray());

//show sorted array
function showSortedArray() {

  let unsortedArray = document.getElementById("array-input").value.trim().split(" ");//get unsorted array from the input with id="array-input"
  let identifier = document.getElementById("identifier-input").value;//get sorting identifier value from input with id="identifier-input"
  
  //if the inputs not empty sort unsorted array and show sorted array and sorting identifier 
  if ( unsortedArray != "" & identifier != "") {
    let identifierSpan = document.querySelector("#identifier-output");//get value from input with id="identifier-output"
    let input = document.querySelector("#array-output");//get value fom input with if="#array-output"
    input.value = bubbleSort(unsortedArray);//value of the input = sorted array
    identifierSpan.innerText = identifier;//show identifier as text in the input
    identifierSpan.value = identifier;//value of the input = identifier value
  }

}

//bubble sorting
function bubbleSort(anyArray) {

  for (let i = 0; i < anyArray.length; i++) {//first loop
    for (let j = 0; j < anyArray.length - i - 1; j++) {//second loop
      if (anyArray[j] > anyArray[j + 1]) {//if previous element greater then next element
        //change places of the elements
        let temp = anyArray[j];
        anyArray[j] = anyArray[j + 1];
        anyArray[j + 1] = temp;
      }
    }
  }
  return anyArray;//return result

}
