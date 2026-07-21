console.log("APP JS LOADED");


// ======================
// Telegram
// ======================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


const telegramUser = tg.initDataUnsafe.user;


let admin_id = null;


if(telegramUser){

    admin_id = telegramUser.id;

    console.log(
        "USER:",
        telegramUser
    );

}





// ======================
// ELEMENTS
// ======================


const searchButton =
document.getElementById(
    "searchButton"
);


const searchBox =
document.getElementById(
    "searchBox"
);



const addUserBtn =
document.getElementById(
    "addUserBtn"
);



const addPanel =
document.getElementById(
    "addPanel"
);



const saveBtn =
document.getElementById(
    "saveBtn"
);



const usersBox =
document.getElementById(
    "users"
);



const count =
document.getElementById(
    "count"
);





console.log(
"ADD BUTTON",
addUserBtn
);





// ======================
// SEARCH BUTTON
// ======================


if(searchButton){


searchButton.onclick = ()=>{


    searchBox.classList.toggle(
        "hidden"
    );


};


}






// ======================
// OPEN ADD PANEL
// ======================


if(addUserBtn){


addUserBtn.onclick = ()=>{


    console.log(
        "ADD CLICK"
    );


    addPanel.classList.toggle(
        "hidden"
    );


};


}






// ======================
// SAVE USER
// ======================


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





    console.log(
        data
    );





    const response =
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
    await response.json();




    console.log(
        result
    );




    if(result.success){


        alert(
            "Участник добавлен"
        );


        document.getElementById(
            "nickname"
        ).value="";


        document.getElementById(
            "tiktok"
        ).value="";


        document.getElementById(
            "tiktokUrl"
        ).value="";



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







// ======================
// LOAD USERS
// ======================


async function loadUsers(){


if(!admin_id)
return;



const response =
await fetch(
"/api/users?admin_id="+admin_id
);



const data =
await response.json();



console.log(
data
);




if(!data.success)
return;




usersBox.innerHTML="";



data.users.forEach(
(user)=>{


usersBox.innerHTML += `


<div class="user-card">


<img 
class="avatar"
src="${user.avatar || '/static/default.png'}"
>


<div>


<h3>
${user.first_name}
</h3>


<a 
href="${user.tiktok_url}"
target="_blank"
>


🎵 ${user.tiktok}


</a>


</div>


</div>


`;


});




count.innerText =
data.users.length +
" участников";



}





// START

loadUsers();