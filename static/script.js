console.log("JS ЗАГРУЖЕН");
// =========================
// Telegram WebApp
// =========================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// =========================
// Telegram user
// =========================

const user = tg.initDataUnsafe.user;

let admin_id = null;


if(user){

    admin_id = user.id;

}



// =========================
// Elements
// =========================

const addBtn =
document.getElementById("addUserBtn");


const addPanel =
document.getElementById("addPanel");


const saveBtn =
document.getElementById("saveBtn");


const usersBox =
document.getElementById("users");


const count =
document.getElementById("count");


const searchButton =
document.getElementById("searchButton");


const searchBox =
document.getElementById("searchBox");


const searchInput =
document.getElementById("search");



// =========================
// Open add panel
// =========================


if(addBtn){

addBtn.onclick = ()=>{


    addPanel.classList.toggle(
        "hidden"
    );


};


}




// =========================
// Save user
// =========================


if(saveBtn){


saveBtn.onclick = async ()=>{


    const nickname =
    document.getElementById(
        "nickname"
    ).value;



    const tiktok =
    document.getElementById(
        "tiktok"
    ).value;



    const tiktokUrl =
    document.getElementById(
        "tiktokUrl"
    ).value;



    if(!nickname || !tiktok){


        alert(
            "Заполни поля"
        );

        return;

    }




    const data = {


        telegram_id:
        admin_id,


        username:
        nickname,


        first_name:
        nickname,


        last_name:"",


        tiktok:
        tiktok,


        tiktok_url:
        tiktokUrl,


        avatar:""


    };





    const res =
    await fetch(
        "/api/register",
        {


            method:"POST",


            headers:{


                "Content-Type":
                "application/json"


            },


            body:
            JSON.stringify(data)


        }
    );



    const result =
    await res.json();



    console.log(result);



    if(result.success){


        alert(
            "Участник добавлен"
        );


        addPanel.classList.add(
            "hidden"
        );


        loadUsers();


    }
    else{


        alert(
            result.error
        );


    }



};


}




// =========================
// Load users
// =========================


async function loadUsers(){


if(!admin_id)
return;



const res =
await fetch(
"/api/users?admin_id="+admin_id
);



const data =
await res.json();



if(!data.success)
return;



usersBox.innerHTML="";



data.users.forEach(user=>{


    const card =
    document.createElement(
        "div"
    );


    card.className =
    "user-card";



    card.innerHTML = `


    <img 
    class="avatar"
    src="${user.avatar || '/static/default.png'}"
    >


    <div>

    <h3>
    ${user.first_name}
    </h3>


    <a href="${user.tiktok_url}" target="_blank">

    🎵 ${user.tiktok}

    </a>


    </div>


    `;



    usersBox.appendChild(
        card
    );



});



count.innerText =
data.users.length +
" участников";



}



// =========================
// Search
// =========================


if(searchButton){


searchButton.onclick=()=>{


searchBox.classList.toggle(
"hidden"
);


};


}




if(searchInput){


searchInput.oninput = async ()=>{


const text =
searchInput.value;



if(text.length < 1){

loadUsers();

return;

}



const res =
await fetch(
`/api/search?admin_id=${admin_id}&text=${text}`
);



const data =
await res.json();



usersBox.innerHTML="";



(data.users || []).forEach(user=>{


usersBox.innerHTML += `


<div class="user-card">


<h3>
${user.first_name}
</h3>


<a href="${user.tiktok_url}" target="_blank">

🎵 ${user.tiktok}

</a>


</div>


`;


});


};


}




// =========================
// Start
// =========================

loadUsers();