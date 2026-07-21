// Telegram

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();




// =======================
// SEARCH BUTTON
// =======================


const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("searchBox");


if(searchButton){

    searchButton.addEventListener("click",()=>{

        console.log("search click");


        searchBox.classList.toggle("hidden");


    });

}






// =======================
// ADD USER BUTTON
// =======================


const addUserBtn = document.getElementById("addUserBtn");
const addPanel = document.getElementById("addPanel");


if(addUserBtn){


    addUserBtn.addEventListener("click",()=>{


        console.log("add click");


        addPanel.classList.toggle("active");


    });


}







// =======================
// SAVE BUTTON
// =======================


const saveBtn = document.getElementById("saveBtn");


if(saveBtn){


saveBtn.addEventListener("click",()=>{


let nickname =
document.getElementById("nickname").value;


let tiktok =
document.getElementById("tiktok").value;


let url =
document.getElementById("tiktokUrl").value;



console.log(
nickname,
tiktok,
url
);



if(!nickname || !tiktok || !url){


alert("Заполни все поля");


return;


}



alert("Участник добавлен");



});

}