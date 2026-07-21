// =========================
// Telegram WebApp
// =========================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// =========================
// Elements
// =========================

const userPanel = document.getElementById("userPanel");
const adminPanel = document.getElementById("adminPanel");

const saveButton = document.getElementById("saveButton");

const tiktokInput = document.getElementById("tiktok");
const tiktokUrlInput = document.getElementById("tiktokUrl");

const usersDiv = document.getElementById("users");
const countDiv = document.getElementById("count");

const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("search");


// =========================
// Telegram User
// =========================

const telegramUser = tg.initDataUnsafe.user;


if(!telegramUser){

    alert("Откройте приложение через Telegram");

    throw new Error("No telegram user");

}



// =========================
// Admin
// =========================

const ADMIN_ID = 1192656796;



// =========================
// Interface
// =========================


if(telegramUser.id === ADMIN_ID){


    userPanel.style.display = "block";

    adminPanel.style.display = "block";


    loadUsers();



}
else{


    userPanel.innerHTML = `

    <div class="error">

    <h2>⛔ Доступ закрыт</h2>

    <p>
    Только администратор может добавлять участников.
    </p>

    </div>

    `;


}



// =========================
// Search
// =========================


if(searchButton){

searchButton.onclick = ()=>{


    searchBox.classList.toggle("hidden");


};


}



// =========================
// Add User
// =========================


if(saveButton){


saveButton.onclick = async ()=>{


let tiktok = tiktokInput.value.trim();

let url = tiktokUrlInput.value.trim();



if(tiktok.length < 2){

    alert("Введите TikTok");

    return;

}



saveButton.disabled = true;

saveButton.innerText="Сохранение...";



try{


let response = await fetch("/api/register",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


telegram_id:telegramUser.id,

username:telegramUser.username || "",

first_name:telegramUser.first_name || "",

last_name:telegramUser.last_name || "",

tiktok:tiktok,

tiktok_url:url


})


});



let data = await response.json();



if(data.success){


alert("✅ Участник добавлен");


location.reload();


}
else{


alert(data.error || "Ошибка");


}



}
catch(e){


console.log(e);


alert("Ошибка сервера");


}



saveButton.disabled=false;

saveButton.innerText="Добавить";



};



}




// =========================
// Load Users
// =========================


async function loadUsers(){


try{


let response = await fetch(
"/api/users?admin_id="+ADMIN_ID
);



let users = await response.json();



if(users.success === false){


usersDiv.innerHTML =
"<div class='error'>Доступ запрещён</div>";


return;


}



renderUsers(users);



}
catch(e){


console.log(e);


usersDiv.innerHTML =
"<div class='error'>Ошибка загрузки</div>";


}



}



// =========================
// Render
// =========================


function renderUsers(users){


usersDiv.innerHTML="";


countDiv.innerHTML =
users.length+" участников";



if(users.length===0){


usersDiv.innerHTML=
"<div class='error'>Пока нет участников</div>";


return;


}



users.forEach(user=>{


let card=document.createElement("div");


card.className="card";



card.innerHTML=`

<div class="avatar">
🎵
</div>


<h3>
${user[2] || user[1]}
</h3>


<div class="tiktok">

🎵 ${user[4]}

</div>


<a 
class="tiktok-button"
href="${user[5]}"
target="_blank">

Открыть TikTok

</a>



<p>
Telegram:
@${user[1] || "нет"}
</p>


<button class="delete">

🗑 Удалить

</button>


`;



card.querySelector(".delete")
.onclick=()=>{


deleteUser(user[0]);


};



usersDiv.appendChild(card);



});



}




// =========================
// Delete
// =========================


async function deleteUser(id){



if(!confirm("Удалить участника?")){

return;

}



try{


let response =
await fetch("/api/delete",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


admin_id:ADMIN_ID,

telegram_id:id


})


});



let result =
await response.json();



if(result.success){


loadUsers();


}
else{


alert(result.error || "Ошибка удаления");


}



}
catch(e){


console.log(e);


alert("Ошибка соединения");


}



}