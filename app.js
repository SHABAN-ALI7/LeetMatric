document.addEventListener("DOMContentLoaded", function(){


    const searchButton = document.getElementById("search-btn");
    const searchInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-conteiner");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const hardLabel = document.querySelector("#hard-label");
    const easyLabel = document.querySelector("#easy-label");
    const mediumLabel = document.querySelector("#medium-label");
    const cardStatsContainer = document.querySelector(".stats-card");


    function validateUsername(username){
        if(username.trim() === ""){
            alert("username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{4,20}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
            return false;
        }
        return true;
    }


    async function fetchUserData(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try {
            searchButton.innerText = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            const data = await response.json();

            if(data.status == `error`){
                // throw new Error("Unable to fetch user data");

                statsContainer.innerHTML = '<p>User Does not Exist </p>';
                 
            }
            console.log(data);
            displayUserData(data);
            
        } catch (error) {
            statsContainer.innerHTML = `<p>No data found </p>`;
        }finally{
            searchButton.disabled = false;
            searchButton.innerText = "Search";
        }

    }

    function progressdata(solved, total, circle, label){
        const progress = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progress}%`);
        label.innerText = `${solved}/${total}`;

    }


    function displayUserData(data){
        const totalQues = data.totalQuestions;
        const totalHard = data.totalHard;
        const totalMedium = data.totalMedium;
        const totalEasy = data.totalEasy;
        const totalSolved = data.totalSolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;
        const easySolved = data.easySolved;
        const rank = data.ranking;

        progressdata(easySolved, totalEasy, easyProgressCircle, easyLabel);
        progressdata(mediumSolved, totalMedium, mediumProgressCircle, mediumLabel);
        progressdata(hardSolved, totalHard, hardProgressCircle, hardLabel);

        const cardsdata = [
            {
                label: "Overall Submissions",
                value:totalSolved
            },
            {
                label: "Overall Questions",
                value:totalQues
            },
            {
                label: "Rank",
                value: rank
            }
        ];

        cardStatsContainer.innerHTML = cardsdata.map(
            data => 
                `
                <div class="card">
                <div class="card-body">
                <h5 class="card-title">${data.label}</h5>
                <p class="card-text">${data.value}</p>
                </div>
                </div>`
        ).join("");
        

    };

    searchButton.addEventListener('click', function(){
        const username = searchInput.value;
        if(validateUsername(username)){
            fetchUserData(username);
        };
    })

})