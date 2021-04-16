
document.querySelector("#sort-button").addEventListener("click", () => showSortedArray());
//when click selected button function showSortedArray() executes

//sort an array and show it in the same input
function showSortedArray() {
  let unsortedArray = document.getElementById("array-input").value.trim().split(" ");//get array values from first input  
  let identifier = document.getElementById("identifier-input").value;//get identifier value from second input

  if ( unsortedArray != "" & identifier != "") {//if values are not empty strings
    let arrayInput = document.querySelector("#array-input");//select first input
    arrayInput.value = bubbleSort(unsortedArray);//and set it's value to sorted array
  }

}

//function sorting an array with bubble sorting algorythm
function bubbleSort(anyArray) {

  for (let i = 0; i < anyArray.length; i++) {//first loop
    for (let j = 0; j < anyArray.length - i - 1; j++) {//second loop
      if (anyArray[j] > anyArray[j + 1]) { //if previous element greater than next
        let temp = anyArray[j];            //change element's places
        anyArray[j] = anyArray[j + 1];
        anyArray[j + 1] = temp;
      }
    }
  }
  return anyArray;//return sorted array

}
