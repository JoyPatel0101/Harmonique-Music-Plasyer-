let data = "";
let songs_details = [];   //All songs details which in playlist
async function fetchData() {
    try {
        const response = await fetch("./music_data.json"); // Wait for the fetch to complete
        data = await response.json(); // Wait for the JSON to be parsed
        songs_details = data["Arijit Singh"];
    } catch (error) {
        console.error("Error fetching JSON:", error);
    }
}
fetchData();

let now_container = ".main_playlist";
let this_play = document.getElementById("play_this");   //Audio tag.
let now_play = -1;   //index of playing song in playlist. 
let path = "";
let this_song = "";   //which playing now.
let this_time = "";   //Time of playing song.
let progress_bar = document.querySelector("#progress_bar");
let isPlay = false;

let body = document.querySelector("body");
body.addEventListener('click', function (e) {
    if (e.target.classList.contains("load")) {
        let card = e.target.closest(".card");
        let name = card.querySelector("h4").innerHTML;
        songs_details = data[name];
        const slides = makeSlides(songs_details);

        let playlist_pic = document.querySelector(".playlist_pic");

        let playlist_heading = document.querySelector(".playlist_heading h1");
        let song_list = document.querySelector(".song_list");

        playlist_pic.src = `images/Album_Thumbnail/${name}.webp`;
        playlist_heading.textContent = name;
        song_list.innerHTML = slides;
    }

    else if (e.target.classList.contains("song")) {
        now_container = ".main_playlist"
        let song_div = e.target.closest(".song");
        this_song = song_div.querySelector(".song_name").textContent;
        this_time = song_div.querySelector(".song_time").textContent;

        let playlist_heading = e.target.closest(".song_list").closest(".music_conatiner").querySelector(".playlist_heading").textContent.trim();
        songs_details = data[playlist_heading];

        songs_details.forEach((song, index) => {
            if (song["name"] == this_song) {
                now_play = index;
                path = song["path"];
            }
        });
        playThis(this_song, this_time, path);

        if (isPlay) {
            song_div.querySelector(".song_play").src = "images/pause.png";
        }
        else {
            song_div.querySelector(".song_play").src = "images/play_button.png";
        }

    }

    else if (e.target.classList.contains("playlist_song")) {
        let playlist_song = e.target;
        this_song = e.target.querySelector(".song_name").textContent;
        this_time = e.target.querySelector(".song_time").textContent;
        path = e.target.querySelector(".song_name").dataset.src;
        playThis(this_song, this_time, path);

        playlist_song_list = e.target.closest(".top-rated-card").querySelector(".playlist_song_list");
        let playlist_heading = e.target.closest(".top-rated-card").querySelector(".top_playlist_heading").textContent;

        if (playlist_heading == "TOP 20 GLOBAL") {
            now_container = ".top_20_global";
        }
        else if (playlist_heading == "TOP 20 INDIA") {
            now_container = ".top_20_india";
        }
        else if (playlist_heading == "TOP 20 ENGLISH") {
            now_container = ".top_20_english";
        }
        else if (playlist_heading == "TOP 20 HINDI") {
            now_container = ".top_20_hindi";
        }
        else if (playlist_heading == "TOP 20 RELEASE") {
            now_container = ".top_20_release";
        }

        song_list = playlist_song_list.querySelectorAll(".playlist_song");


        songs_details = [];
        removeActive();
        song_list.forEach((element, index) => {
            let obj = {};
            obj.name = element.querySelector(".song_name").textContent;
            obj.path = element.querySelector(".song_name").dataset.src;
            obj.time = element.querySelector(".song_time").textContent;

            songs_details.push(obj);

            if (element == playlist_song) {
                now_play = index;
                element.classList.add("active");
                if (isPlay) {
                    element.querySelector(".song_play").src = "images/pause.png";
                }
                else {
                    element.querySelector(".song_play").src = "images/play_button.png";
                }
            }
        });
    }

})



function playThis(song_name, song_time, path) {
    this_play = document.getElementById("play_this");
    let original_path = "audio" + decodeURIComponent(this_play.src).split("/audio")[1];

    document.querySelector(".current_title").textContent = song_name;
    document.querySelector(".end_time").textContent = song_time;

    if (original_path != path) {
        this_play.src = path;
        this_play.play();
        isPlay = true;
    }
    else if (original_path == path && isPlay == true) {
        this_play.pause();
        isPlay = false;
    }
    else if (original_path == path && isPlay == false) {
        this_play.play();
        isPlay = true;
    }
    else {
        console.log("Something Wen't Wrong");
    }
    removeActive()
    setActive(now_play);
    setPlayerBox();
}

function setPlayerBox() {
    operator = document.querySelector("#operator");

    if (isPlay) {
        operator.classList.remove("bx-play");
        operator.classList.add("bx-pause");
        operator.setAttribute("value", "play");
    }
    else {
        operator.classList.remove("bx-pause");
        operator.classList.add("bx-play");
        operator.setAttribute("value", "pause");
    }
}

// --controlling of bottom play/pause button--
function setOperator(evt) {
    if (evt.getAttribute("value") == "play") {
        evt.classList.remove("bx-pause");
        evt.classList.add("bx-play");
        evt.setAttribute("value", "pause");
        this_play.pause();
        isPlay = false;
        setActive(now_play);
    }
    else {
        if (this_play != undefined) {
            evt.classList.remove("bx-play");
            evt.classList.add("bx-pause");
            evt.setAttribute("value", "play");
            this_play.play();
            isPlay = true;
            setActive(now_play);
        }
        else {
            console.log("Playing nothing");
        }
    }
}

function setPrev(evt) {
    if (now_play != -1) {
        if (now_play == 0) {
            now_play = (songs_details.length - 1);
        }
        else {
            now_play -= 1;
        }
        play_by_index(now_play);
    }
    else {
        console.log("Playing nothing")
    }
}

function setNext(evt) {
    if (now_play != -1) {
        if (now_play == (songs_details.length - 1)) {
            now_play = 0;
        }
        else {
            now_play += 1;
        }
        play_by_index(now_play);
    }
    else {
        console.log("Playing nothing")
    }
}

function play_by_index(index) {
    this_song = songs_details[index]["name"];
    this_time = songs_details[index]["time"];
    path = songs_details[index]["path"];
    playThis(this_song, this_time, path);
}

function setActive(index) {
    let song_det;
    if (now_container == ".main_playlist") {
        song_det = document.querySelectorAll(now_container + " .song");
    }
    else {
        song_det = document.querySelectorAll(now_container + " .playlist_song");
    }

    
    song_det.forEach((song, i) => {
        if ((song.classList.contains("active")) && (i != index)) {
            song.classList.remove("active");
            song.querySelector(".song_play").src = "images/play_button.png";
        }
        if (i == index) {
            song.classList.add("active");
            song.querySelector(".song_play").src = "images/pause.png";
        }

        // use when operate by bottom play/pause button.
        if(!isPlay){
            song.querySelector(".song_play").src = "images/play_button.png";
        }
    });
}

function removeActive() {
    let active_class = Array.from(document.querySelectorAll(".active"));
    active_class.forEach((element) => {
        element.querySelector(".song_play").src = "images/play_button.png";
        element.classList.remove("active");
    })
}

this_play.addEventListener("timeupdate", function () {
    let mins = Math.floor(this_play.currentTime / 60);
    let secs = Math.floor(this_play.currentTime % 60);
    let format_time = `${mins}:${secs < 10 ? "0" + secs : secs}`;
    document.querySelector(".current_time").textContent = format_time;

    let progress = (this_play.currentTime / this_play.duration) * 100;
    progress_bar.value = progress;

})

progress_bar.addEventListener("input", function () {
    let new_value = progress_bar.value;
    let new_time = ((new_value / 100) * this_play.duration);
    this_play.currentTime = new_time;
})


function makeSlides(songs) {
    songs = Array.from(songs);
    let HTML = "";
    songs.forEach(song => {
        HTML += `<div class="song">
        <img class="song_pic" src="${song.pic}" alt="song_1">
        <span class="song_name">${song.name}</span>
        <span class="song_time">${song.time}</span>
        <img class="song_play" src="images/play_button.png" alt="play/pause">
    </div>`
    });
    return HTML;
}


function toggleMenu() {
    document.getElementById("menu").classList.toggle("show");
}

// Close the dropdown if clicked outside
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-btn')) {
        document.getElementById("menu").classList.remove("show");
    }
}

// for scroalling singer list.
let singer_prev = document.getElementById("singer_left");
let singer_next = document.getElementById("singer_right");
let singer_song = document.getElementsByClassName("popular-singers")[0];
singer_prev.addEventListener('click', () => {
    singer_song.scrollLeft -= 325;
})
singer_next.addEventListener('click', () => {
    singer_song.scrollLeft += 325;
})

// for scroalling categories list.
let categories_prev = document.getElementById("categories_left");
let categories_next = document.getElementById("categories_right");
let categories_song = document.getElementsByClassName("categories")[0];
categories_prev.addEventListener('click', () => {
    categories_song.scrollLeft -= 325;
})
categories_next.addEventListener('click', () => {
    categories_song.scrollLeft += 325;
})

// for scroalling Top rated list.
let top_prev = document.getElementById("top_left");
let top_next = document.getElementById("top_right");
let top_song = document.getElementsByClassName("top-playlists")[0];
top_prev.addEventListener('click', () => {
    top_song.scrollLeft -= 362;
})
top_next.addEventListener('click', () => {
    top_song.scrollLeft += 362;
})