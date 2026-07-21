console.log("SCRIPT LOADED");


const tg = window.Telegram.WebApp;


tg.ready();
tg.expand();



console.log("Telegram OK");




// SEARCH

const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("searchBox");


console.log(
"searchButton:",
searchButton
);


console.log(
"searchBox:",
searchBox
);



if(searchButton && searchBox){


    searchButton.onclick = function(){


        console.log("SEARCH CLICK");


        searchBox.classList.toggle("hidden");


    };


}







// ADD BUTTON


const addUserBtn = document.getElementById("addUserBtn");
const addPanel = document.getElementById("addPanel");



console.log(
"addUserBtn:",
addUserBtn
);



console.log(
"addPanel:",
addPanel
);





if(addUserBtn && addPanel){


    addUserBtn.onclick = function(){


        console.log("ADD CLICK");


        addPanel.classList.toggle("active");


    };


}