document.addEventListener('DOMContentLoaded', init)

const dbURL = "http://localhost:3000/"
const songsURL = "http://localhost:3000/songs"
const setsURL = "http://localhost:3000/sets"

function init() {
    modeHandler()
    searchHandler()
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

function searchHandler() {
    const searchBar = document.querySelectorAll('form')

    searchBar.forEach((element) => {
        element.addEventListener('submit', (e) => {
            e.preventDefault();
            const container = e.target.parentNode
            const searchBy = e.target[0].value
            const searchText = e.target[1].value
            const clearUl = e.target.parentNode.querySelector('ul')
            clearUl.innerHTML = ""
            
            get(`http://localhost:3000/${e.target.parentNode.id}`, searchBy, searchText, container)
    
            e.target.reset();
    })})
}


// Callback Functions

function get(URL, searchBy, searchText, container) {
    fetch(URL)
    .then(response => response.json())
    .then(data => data.forEach((element) => {
        if(element[searchBy] === searchText){
            populate(element, container)
        }}))
    .catch(error => alert(error))
}

function populate(element, container) {
    let newItem;
    container.id === 'songs' ? newItem = createSongCard(element) : newItem = createSetCard(element)
    container.querySelector('ul').appendChild(newItem)
}

function createSongCard(song) {
    const songCard = document.createElement('li')
    songCard.id = `song-${song.id}`
    songCard.innerHTML = `
    <h3></h3>
    <button>+</button>
    `
    songCard.querySelector('h3').textContent = song.title
    //songCard.querySelector('h3').addEventListener('click', editSong)
    //songCard.querySelector('button').addEventListener('click', addToList)
    return songCard
}

function createSetCard(set) {
    const setCard = document.createElement('li')
    setCard.id = `set-${set.id}`
    setCard.innerHTML = `
    <h3></h3>
    <h5></h5>
    `
    setCard.querySelector('h3').textContent = set.venue
    setCard.querySelector('h5').textContent = set.date
    setCard.querySelector('h3').addEventListener('click', editSet)
    return setCard
}

function editSet(e) {
    console.log(e.target.parentNode.id)
}
