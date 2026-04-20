//strict mode
"use strict";

// light and dark theme toggle------------------------------------------------------------------------
    let toggle = document.getElementById("theme-toggle");
    let body = document.querySelector("body");
    let footerSvg = document.querySelectorAll("footer svg");
    let allergySvg = document.querySelectorAll("#allergies svg");
    let footerLinks = document.querySelectorAll("footer a");
    let header = document.querySelector("h1");

    toggle.addEventListener("click", function(){
        if(this.classList.toggle("dark-mode")){
                        body.style.background = "#292929";
            body.style.color = "#fff";
            header.style.color = "#b48482";
            toggle.style.fill = "#5d797e";
            toggle.style.background = "#dab0a8";
            for (let i = 0; i < footerSvg.length; i++){
            footerSvg[i].style.stroke= "#fff";
            }
            allergySvg[1].style.fill= "#fff";
            allergySvg[2].style.fill= "#fff";
            allergySvg[4].style.fill= "#fff";
            for(let i = 0; i < footerLinks.length; i++){
            footerLinks[i].style.color = "#fff";
            }
        }else{
            body.style.background = "#fff";
            body.style.color = "#292929";
            header.style.color = "#5d797e";
            toggle.style.fill = "#dab0a8";
            toggle.style.background = "#5d797e"
            for (let i = 0; i < footerSvg.length; i++){
            footerSvg[i].style.stroke= "#292929";
            };
            allergySvg[1].style.fill= "#292929";
            allergySvg[2].style.fill= "#292929";
            allergySvg[4].style.fill= "#292929";
            for(let i = 0; i < footerLinks.length; i++){
            footerLinks[i].style.color = "#292929";
        }
    }
    });

//carousel pictures----------------------------------------------------------------------------------
  $("#carousel").slick({
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false,
    fade: true,
    speed: 800
  });

// accordion dropdown --------------------------------------------------------------------------------
  $( function() {
    $( "#accordion" ).accordion({
      collapsible: true,
      icons: false,
      active: false
    });
  } );

// a variable to hold the selected allergies (this was inside the userAllergies function originally)
let selected = [];

//store allergy preferences --------------------------------------------------------------------------
function userAllergies(){
//grabbing the checkboxes
const checkboxes = document.querySelectorAll("#allergies input[type='checkbox']");
console.log(checkboxes); //this was my check

//load any saved preferences
const savedPref = JSON.parse(localStorage.getItem("allergyPref")) || [];

//putting the input value into an array when the box is checked
for(let i = 0; i < checkboxes.length; i++){
  //rechecks any boxes that were previously checked
  if(savedPref.indexOf(checkboxes[i].value) !== -1){
    checkboxes[i].checked = true;
  }else{
    checkboxes[i].checked = false
  }

  //checks for any new checked allergies
  checkboxes[i].addEventListener("change", function(){
    
    for(let j = 0; j < checkboxes.length; j++){
      if (checkboxes[j].checked){
        selected.push(checkboxes[j].value);
      }
    }

    //saving the preferences to local storage
    localStorage.setItem("allergyPref", JSON.stringify(selected));

    //checking the selections
    console.log(selected);
  });
}
}

//runs the function and pushes options to the local storage
userAllergies();

// MENU________________________________________________________________________________________________________________________________
// this array holds all the filtered items
let filteredItems = [];

// this array is holding all the menu items
let allItems = [];

// this array is holding the chosen allergens the user wants to avoid - I have this created above
// let selected = [];

// grab the menu space in html
let filteredMenu = document.getElementById("filteredMenu");

// the display function for the menu items (all or filtered)
function menuDisplay(items){
  console.log("This is the full menu: ", items);

  let output = "";

  // creating a card for each menu item
  for(let item of items){
    output += `
    <section>
    <img src= "${item.img}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>${item.price}</p>
    </section>
    `;
  }

  filteredMenu.innerHTML = output;
}

// this function checks each item to see if any of the filters match the chosen ones
// if an item does have a match, it is NOT returned
// if the item does NOT include the selected filters, then it can be returned
function applyFilters(){

  // if no filters selected → show all items
  if(selected.length === 0){
    filteredItems = allItems;
  } 
  else {
    filteredItems = allItems.filter(item => {
      // keep item only if it does NOT contain selected allergens
      return !selected.some(tag => item.contains.includes(tag));
    });
  }

  menuDisplay(filteredItems);

   // save filters to localStorage
  localStorage.setItem("allergyPref", JSON.stringify(selected));
  // save the current filtered menu to local storage
  localStorage.setItem("filteredMenu", JSON.stringify(filteredItems));
}


// this function listens for a checkbox being checked
$("input[type=checkbox]").change(function (){

  // figure out which checkboxes are checked
  let checkbox = $(this);
  let filter = checkbox.val();

  if(checkbox.is(":checked")){
    // add selected filter to the filtered array
    selected.push(filter);
  } 
  else {
    // remove unchecked filter
    selected = selected.filter(tag => tag !== filter);
  }

  // reapply filters every time
  applyFilters();
});

window.onload = function(){
  fetch("menu.json")
    .then(response => response.json())
    .then(items => {
      allItems = items.goods;

      // loads the filters that the user had selected the last time they were on the site
      const savedFilters = JSON.parse(localStorage.getItem("allergyPref")) || [];
      selected = savedFilters;

      // loads the filtered menu items that the user was viewing last time
      const savedFiltered = JSON.parse(localStorage.getItem("filteredMenu"));

      // setup checkboxes
      userAllergies();

      if(savedFiltered && savedFilters.length > 0){
        // show saved filtered menu results when the page reloads
        filteredItems = savedFiltered;
        menuDisplay(filteredItems);
      } else {
        // if no filters are detected, run the filtering function again and display all the items
        // or if the menu doesn't save, the function will run automatically and filter the options
        applyFilters();
      }
    });
};