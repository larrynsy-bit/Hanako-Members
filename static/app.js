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

const searchInput = document.getElementById("search");

const searchButton = document.getElementById("searchButton");

const searchBox = document.getElementById("searchBox");

// =========================
// Telegram User
// =========================

const telegramUser = tg.initDataUnsafe.user;

if (!telegramUser) {

    alert("Откройте приложение через Telegram.");

    throw new Error("Telegram user not found");

}

// =========================
// Admin ID
// =========================

// ОБЯЗАТЕЛЬНО ЗАМЕНИ НА СВОЙ ID
const ADMIN_ID = 1192656796;

// =========================
// Interface
// =========================

if (telegramUser.id === ADMIN_ID) {


    // Админ
    userPanel.style.display = "block";
    adminPanel.style.display = "block";

    searchButton.style.display = "block";

    loadUsers();

} else {

    // Обычный пользователь
    userPanel.innerHTML = `

        <div class="error">

            <h2>⛔ Доступ закрыт</h2>

            <p>
            Добавлять участников может только администратор.
            </p>

        </div>

    `;

    adminPanel.style.display = "none";

}

// =========================
// Search Button
// =========================

searchButton.addEventListener("click", ()=>{

    searchBox.classList.toggle("hidden");

});
// =========================
// Register User
// =========================

saveButton.addEventListener("click", async () => {

    const tiktok = tiktokInput.value.trim();

    const tiktokUrl = tiktokUrlInput.value.trim();

    if (tiktok.length < 2) {

        alert("Введите TikTok.");

        return;

    }

    saveButton.disabled = true;

    saveButton.innerText = "Сохранение...";

    try{

        const response = await fetch("/api/register",{

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
                tiktok_url:tiktokUrl

            })

        });

        const data = await response.json();

        if(data.success){

            userPanel.innerHTML=`

                <div class="success">

                    <h2>✅ Готово!</h2>

                    <br>

                    <p>Ваш TikTok успешно сохранён.</p>

                </div>

            `;

        }else{

            alert("Ошибка сохранения.");

        }

    }catch(e){

        console.log(e);

        alert("Ошибка соединения с сервером.");

    }

});
// =========================
// Load Users
// =========================

async function loadUsers(){

    try{

        const response = await fetch("/api/users?admin_id=" + ADMIN_ID);

        const users = await response.json();

        if(users.success === false){

            usersDiv.innerHTML = `
                <div class="error">
                    Доступ запрещён
                </div>
            `;
            return;
        }

        renderUsers(users);

    }catch(e){

        console.log(e);

        usersDiv.innerHTML = `
            <div class="error">
                Ошибка загрузки.
            </div>
        `;

    }

}

// =========================
// Render Users
// =========================

function renderUsers(users){

    usersDiv.innerHTML = "";

    countDiv.innerHTML = users.length + " участников";


    if(users.length === 0){

        usersDiv.innerHTML = `
            <div class="error">
                Пока нет участников
            </div>
        `;

        return;
    }


    users.forEach(user=>{


        usersDiv.innerHTML += `

        <div class="card">


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



            <button
            class="delete"
            onclick="deleteUser(${user[0]})">

            🗑 Удалить

            </button>


        </div>

        `;


    });

}
// =========================
// Delete User
// =========================

async function deleteUser(id){

    const ok = confirm("Удалить участника?");

    if(!ok){
        return;
    }

    try{

        const response = await fetch("/api/delete",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                admin_id:ADMIN_ID,

                telegram_id:id

            })

        });

        const result = await response.json();

        if(result.success){

            loadUsers();

        }else{

            alert(result.error || "Ошибка удаления.");

        }

    }catch(e){

        console.log(e);

        alert("Ошибка соединения.");

    }

}