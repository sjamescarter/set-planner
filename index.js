document.addEventListener('DOMContentLoaded', init)

const dbURL = "http://localhost:3000/";
const songsURL = "http://localhost:3000/songs";
const setsURL = "http://localhost:3000/sets";
let activeSet;

function init() {
    modeHandler()
    searchHandler()
    // populateSongs()
    // populateSets()
}

// function populateSongs() {
//     fetch(son)
// }

// Handler Functions

function modeHandler() {
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
            clearHandler(e)
            const container = e.target.parentNode
            const searchBy = e.target[0].value
            const searchText = e.target[1].value
            console.log(searchText)
            // const clearUl = e.target.parentNode.querySelector('ul')
            // clearUl.innerHTML = ""
            
            get(`http://localhost:3000/${e.target.parentNode.id}`, searchBy, searchText, container)
    
            e.target.reset();
    })})
}

function clearHandler(e) {
    const clearUl = e.target.parentNode.querySelector('ul')
    clearUl.innerHTML = ""
}

// Callback Functions


function get(URL, searchBy, searchText, container) {
    fetch(URL)
    .then(response => response.json())
    .then(data => data.forEach((element) => {
        if(element[searchBy] === searchText){
            populate(element, container)
        } else if(searchText === "") {
            populate(element, container)
        }
    })) 
    .catch(error => alert(error))
}

function populate(element, container) {
    let newItem;
    container.id === 'songs' ? newItem = createSongCard(element) : newItem = createSetCard(element)
    container.querySelector('ul').appendChild(newItem)
}

function createSongCard(song) {
    const songCard = document.createElement('li')
    songCard.id = `songs/${song.id}`
    songCard.innerHTML = `
    <h3></h3>
    <button>+</button>
    `
    songCard.querySelector('h3').textContent = song.title
    //songCard.querySelector('h3').addEventListener('click', editSong)
    songCard.querySelector('button').addEventListener('click', updateSet)
    return songCard
}

function createSetCard(set) {
    const setCard = document.createElement('li')
    setCard.id = `sets/${set.id}`
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
    const setId = e.target.parentNode.id
    const editBox = document.querySelector('#set-list')
    editBox.innerHTML = `
    <div id="${setId}">
    <h3></h3>
    <h5></h5>
    <ol></ol>
    <button id='delete'>Delete Set</button>
    </div>
    `
    fetch(dbURL + setId)
    .then(response => response.json())
    .then(data => {
        editBox.querySelector('h3').textContent = data.venue
        editBox.querySelector('h5').textContent = data.date
        data.songs.forEach((songId) => addToSet(songId))
    })
    .catch(error => alert(error))
    activeSet = editBox
}

function addToSet(songId) {
    fetch(`${dbURL}${songId}`)
    .then(response => response.json())
    .then(data => displaySong(data))
    .catch(error => alert(error))
}

function displaySong(data) {
    const newSong = document.createElement('li')
    newSong.innerHTML = `
    <h4 id="${data.id}"></h4>
    <p></p>
    `
    newSong.querySelector('h4').textContent = data.title
    newSong.querySelector('p').textContent = data.key + " " + data.meter
    activeSet.querySelector('ol').appendChild(newSong)
}

function updateSet(e) {
    const songs = []
    activeSet.querySelectorAll('h4').forEach((element) => songs.push(`songs/${element.id}`))
    const songId = e.target.parentNode.id
    songs.push(songId)
    console.log(songs)
    const setId = activeSet.querySelector('div').id
    
    activeSet.querySelector('ol').innerHTML = ""

    fetch(dbURL + setId, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            songs: songs
        })
    })
    .then(response => response.json())
    .then(data => data.songs.forEach((id) => addToSet(id)))
}