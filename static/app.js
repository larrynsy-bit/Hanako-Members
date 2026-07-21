const tg = window.Telegram.WebApp;


tg.ready();
tg.expand();



const ADMIN_ID = 1192656796; // <-- сюда свой ID



const user = tg.initDataUnsafe.user;



let myID = user ? user.id : 0;



const userPanel = document.getElementById("userPanel");

const saveButton = document.getElementById("saveButton");

const usersBox = document.getElementById("users");

const count = document.getElementById("count");



if(myID === ADMIN_ID){

    userPanel.classList.remove("hidden");

}




// =================
// поиск
// =================


document
.getElementById("searchButton")
.onclick=()=>{


document
.getElementById("searchBox")
.classList.toggle("hidden");


};






// =================
// загрузка
// =================


async function loadUsers(){


let res = await fetch(
`/api/users?admin_id=${myID}`
);


let data = await res.json();



usersBox.innerHTML="";



if(!Array.isArray(data))
return;



count.innerHTML =
data.length+" участников";



data.forEach(u=>{


let card=document.createElement("div");


card.className="user-card";



card.innerHTML=`


<img src="${u.avatar || 
'https://i.imgur.com/6VBx3io.png'}">



<div>


<h3>
${u.first_name || ""}
${u.last_name || ""}
</h3>


<p>
@${u.username || "user"}
</p>



<a href="${u.tiktok_url}" target="_blank">

🎵 ${u.tiktok}

</a>


</div>



<button class="delete">
❌
</button>


`;





card
.querySelector(".delete")
.onclick=async()=>{


await fetch("/api/delete",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

admin_id:myID,

telegram_id:u.telegram_id


})


});


loadUsers();


};




usersBox.appendChild(card);



});



}





// =================
// добавить
// =================


saveButton.onclick=async()=>{


let nick =
document.getElementById("tiktok").value;


let url =
document.getElementById("tiktokUrl").value;



if(!nick)
return alert("Введите ник");



await fetch("/api/register",{


method:"POST",

headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({


admin_id:myID,


telegram_id:Date.now(),


username:nick.replace("@",""),


first_name:nick,


tiktok:nick,


tiktok_url:url,


avatar:user.photo_url || ""


})


});



document
.getElementById("tiktok")
.value="";


document
.getElementById("tiktokUrl")
.value="";



loadUsers();



};





// поиск


document
.getElementById("search")
.oninput=async(e)=>{


let text=e.target.value;


let res=await fetch(

`/api/search?admin_id=${myID}&text=${text}`

);


let data=await res.json();


usersBox.innerHTML="";


data.forEach(u=>{


usersBox.innerHTML+=`

<div class="user-card">

<h3>
${u.tiktok}
</h3>

</div>

`;


});


};






loadUsers();