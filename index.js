document.addEventListener('DOMContentLoaded', init)

const songsURL = "http://localhost:3000/songs"
const setsURL = "http://localhost:3000/sets"

function init() {
    modeHandler()
    songSearchHandler()
    // setSearchHandler()
    // populateSongs()
    // populateSets()
}

// Handler Functions

function modeHandler(){
    const select = document.querySelector('#mode')
    const plan = document.querySelectorAll('.plan')
    const live = document.querySelector('.live')
    
    select.addEventListener('change', () => {
        if(select.value === "live") {
            plan.forEach(element => {
                element.style.display = "none"                
            });
            live.style.display = "block"
        } else {
            plan.forEach(element => {
                element.style.display = "block"                
            });
            live.style.display = "none"
        }
    })
}

function songSearchHandler() {
    const songSearchBar = document.querySelector('#song-search')

    songSearchBar.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchBy = songSearchBar[0].value
        const searchText = songSearchBar[1].value
        const clearSongs = document.querySelector('#song-list')
        clearSongs.innerHTML = ""
        
        get(songsURL, searchBy, searchText)

        songSearchBar.reset();
    })
}

// Callback Functions

function get(URL, searchBy, searchText) {
    fetch(URL)
    .then(response => response.json())
    .then(data => data.forEach((element) => {
        if(element[searchBy] === searchText){
            populate(element)
        }}))
    .catch(error => alert(error))
}

function populate(song) {
    const songList = document.querySelector('#song-list')
    const newSong = createSongCard(song)
    songList.appendChild(newSong)
}

function createSongCard(song) {
    const songCard = document.createElement('li')
    songCard.innerHTML = `
    <h3></h3>
    <button>+</button>
    `
    songCard.querySelector('h3').textContent = song.title
    //songCard.querySelector('h3').addEventListener('click', editSong)
    //songCard.querySelector('button').addEventListener('click', addToList)
    return songCard
}