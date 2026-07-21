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

const saveButton = document.getElementById("saveButton");

const tiktokInput = document.getElementById("tiktok");
const tiktokUrlInput = document.getElementById("tiktokUrl");

const usersDiv = document.getElementById("users");
const countDiv = document.getElementById("count");

const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("search");

const avatar = document.getElementById("avatar");
const name = document.getElementById("name");
const username = document.getElementById("username");


// =========================
// Telegram User
// =========================

const telegramUser = tg.initDataUnsafe.user;


if(!telegramUser){

    alert("Откройте приложение через Telegram");

    throw new Error("No telegram user");

}



// =========================
// Config
// =========================

const ADMIN_ID = 1192656796;



// =========================
// Profile
// =========================

name.innerHTML =
telegramUser.first_name || "User";


username.innerHTML =
telegramUser.username
?
"@" + telegramUser.username
:
"";


// если Telegram отдаёт фото

if(telegramUser.photo_url){

    avatar.src = telegramUser.photo_url;

}




// =========================
// Admin check
// =========================

const isAdmin =
telegramUser.id === ADMIN_ID;



if(isAdmin){

    userPanel.style.display="block";

}



// всем загружаем список

loadUsers();





// =========================
// Search open
// =========================


searchButton.onclick=()=>{

    searchBox.classList.toggle("hidden");

    if(!searchBox.classList.contains("hidden")){

        searchInput.focus();

    }

};





// =========================
// Search
// =========================

searchInput.addEventListener("input",()=>{

    let text =
    searchInput.value.toLowerCase();


    document
    .querySelectorAll(".card")
    .forEach(card=>{


        if(card.innerText
        .toLowerCase()
        .includes(text)){


            card.style.display="block";


        }
        else{


            card.style.display="none";


        }


    });



});







// =========================
// Add User
// =========================


if(saveButton){


saveButton.onclick=async()=>{


let tiktok =
tiktokInput.value.trim();


let url =
tiktokUrlInput.value.trim();



if(!tiktok){

    alert("Введите TikTok");

    return;

}



saveButton.disabled=true;

saveButton.innerText="Добавление...";



try{


let response =
await fetch("/api/register",{


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

tiktok_url:url,

photo_url:telegramUser.photo_url || ""


})


});



let data =
await response.json();



if(data.success){


alert("✅ Добавлено");


loadUsers();


tiktokInput.value="";
tiktokUrlInput.value="";


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


let response =
await fetch("/api/users");



let users =
await response.json();



if(!Array.isArray(users)){


users=[];


}



renderUsers(users);



}
catch(e){


console.log(e);


usersDiv.innerHTML=
`
<div class="error">
Ошибка загрузки
</div>
`;


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
`
<div class="error">
Пока нет участников
</div>
`;

return;

}



users.forEach(user=>{


let card =
document.createElement("div");


card.className="card";



card.innerHTML=`

<div class="avatar">

<img src="${user[6] || '/static/default.png'}">

</div>


<h3>
${user[2] || "User"}
</h3>


<div class="username">
@${user[1] || ""}
</div>


<a 
href="${user[5]}"
target="_blank"
class="tiktok-button">

🎵 TikTok

</a>


${isAdmin ? 
`
<button class="delete">

🗑

</button>
`
:
""}



`;





if(isAdmin){


card
.querySelector(".delete")
.onclick=()=>{

deleteUser(user[0]);

};


}



usersDiv.appendChild(card);



});


}







// =========================
// Delete
// =========================


async function deleteUser(id){


if(!confirm("Удалить?"))

return;



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



let data =
await response.json();



if(data.success){


loadUsers();


}
else{


alert(data.error);


}



}