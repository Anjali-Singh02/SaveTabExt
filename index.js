
const inputUrl = document.getElementById("inputUrl")
const saveInput = document.getElementById("saveInputBtn")
const saveTab = document.getElementById("saveTabBtn")
const deleteAllBtn = document.getElementById("deleteAllBtn");
const savedUrl = document.getElementById("savedUrl");

// Dialog box variables
let myDialog = document.getElementById("myDialog");
let yesButton = document.getElementById("yesButton");
let noButton = document.getElementById("noButton");


// ******************** render function ********************
const render = () => {
  let listItems = "";
  const lists = JSON.parse(localStorage.getItem('myUrl')) || [];
  for (let el in lists) {
    listItems += `<div>
                        <li class='flex justify-between text-xl text-cyan-700 underline' id='content'>
                            <a target='_blank' href='${lists[el]}'>
                                ${lists[el]}
                            </a>
                         <span class="flex justify-evenly">
                               
                                <button class="copybtn px-2" data-copy='${lists[el]}'> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="copybtn w-6 h-6" data-copy='${lists[el]}'>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                              </svg>
                               </button>
                                <button  class='deleteBtn px-2" data-delete='${lists[el]}'> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-delete='${lists[el]}' class="deleteBtn w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                               </button>
                         </span>
                            </li> 
                           
                    <div>`
  }
  savedUrl.innerHTML = listItems;
}


//  **************** saveInputBtn click event **************************
saveInput.addEventListener("click", function () {

  // console.log("Button clicked");
  if (!inputUrl.value.trim()) {
    return;
  }
  const array = JSON.parse(localStorage.getItem("myUrl")) || []
  array.unshift(inputUrl.value)
  inputUrl.value = ""
  localStorage.setItem("myUrl", JSON.stringify(array));
  render();
})

//  *************** Save tab click event
saveTab.addEventListener("click", function () {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const array = JSON.parse(localStorage.getItem("myUrl")) || []
    array.unshift(tabs[0].url)
    localStorage.setItem("myUrl", JSON.stringify(array))
    render()
  })

  // console.log(tabs)

})

// ********************** storing values from localstorage ********************
let urlFromLocalStorage = JSON.parse(localStorage.getItem("myUrl"))
// console.log(urlFromLocalStorage)
if (urlFromLocalStorage) {
  myUrl = urlFromLocalStorage
  render();
}

// ************************ Dialog box for delete confirmation ***************************
deleteAllBtn.addEventListener('click', function () {

  function showDialog() {
    myDialog.style.display = "block";
  }

  function hideDialog() {
    myDialog.style.display = "none";
  }

  function handleYesButtonClick() {
    // Code to delete the item goes here
    localStorage.clear();
    myUrl = []
    render(myUrl)
    hideDialog();
  }

  function handleNoButtonClick() {
    // Code to cancel the deletion goes here
    hideDialog();
  }

  yesButton.addEventListener("click", handleYesButtonClick);
  noButton.addEventListener("click", handleNoButtonClick);

  showDialog();
})


//  **********************  saved content *****************************

const dropTabsBtn = document.getElementById("dropTabsBtn")
dropTabsBtn.addEventListener("click", function () {
  let dropdownContent = this.nextElementSibling;
  if (dropdownContent.style.display === "block") {
    dropdownContent.style.display = "none"
  }
  else if (dropdownContent != null) {

    dropdownContent.style.display = "block"
  }
})


// *************** copy tab ******************* 

savedUrl.addEventListener('click', (event) => {
  // console.log("clicked on ", event.target.classList.contains("copybtn"));
  if (event.target.classList.contains("copybtn")) {
    const value = event.target.dataset.copy;
    console.log("value", value)

    navigator.clipboard.writeText(value).then(() =>
      console.log("successfully copied to clipboard")).catch(err => console.log(err));
  }
  if (event.target.classList.contains("deleteBtn")) {

    const value = event.target.dataset.delete;
    console.log("value", value)
    const array = JSON.parse(localStorage.getItem("myUrl")) || []
    const updatedList = array.filter(el => el !== value)
    console.log("successfully deleted", updatedList);

    localStorage.setItem("myUrl", JSON.stringify(updatedList))
    render();
  }

})