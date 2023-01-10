document.addEventListener('DOMContentLoaded', init)

const dbURL = "http://localhost:3000/";
let activeSet, activeSong;

function init() {
    // modeHandler();
    searchHandler();
    document.getElementById("new-song").addEventListener('click', createNewSong);
    document.getElementById("new-set").addEventListener('click', createNewSet);
    document.getElementById("song-search-button").click();
    document.getElementById("set-search-button").click();

}

function createNewSong(e) {
    clearHandler(e)
    const newSongForm = document.createElement('form')
    newSongForm.id = "songs/"
    newSongForm.innerHTML = `
    <label for="title">Song Title</label><br>
    <input type="text" name="title" class="info" required /><br>
    <label for="author">Author</label><br>
    <input type="text" name="author" class="info" required /><br>
    <label for="key">Key</label><br>
    <input type="text" name="key" class="info" value="C" /><br>
    <label for="meter">Meter</label><br>
    <input type="text" name="meter" class="info" value="4/4" /><br>
    <label for="chords">Chord Chart URL</label><br>
    <input type="text" name="chords" class="info" value="http://" /><br><br>
    <input type="submit" value="Submit"/>
    `
    newSongForm.addEventListener('submit', makeObject)
    const editBox = document.querySelector('#song-list')
    editBox.appendChild(newSongForm)
}

function createNewSet(e) {
    clearHandler(e)
    const newSetForm = document.createElement('form')
    newSetForm.id = "sets/"
    newSetForm.innerHTML = `
    <label for="date">Date</label><br>
    <input type="date" name="date" class="info" /><br>
    <label for="venue">Venue</label><br>
    <input type="text" name="venue" class="info" required/><br><br>
    <input type="submit" value="Submit"/>
    `
    newSetForm.addEventListener('submit', makeObject)
    const editBox = document.querySelector('#set-list')
    editBox.appendChild(newSetForm)
}

// Handler Functions

// function modeHandler() {
//     const select = document.querySelector('#mode')
//     const plan = document.querySelectorAll('.plan')
//     const live = document.querySelector('.live')
    
//     select.addEventListener('change', () => {
//         if(select.value === "live") {
//             plan.forEach(element => {
//                 element.style.display = "none"                
//             });
//             live.style.display = "block"
//         } else {
//             plan.forEach(element => {
//                 element.style.display = "block"                
//             });
//             live.style.display = "none"
//         }
//     })
// }

function searchHandler() {
    const searchBar = document.querySelectorAll('form')

    searchBar.forEach((element) => {
        element.addEventListener('submit', (e) => {
            e.preventDefault();
            clearHandler(e)
            const container = e.target.parentNode
            const id = container.id
            const searchBy = e.target[0].value
            const searchText = e.target[1].value
            const callback = (data) => data.forEach((element) => {
                if(element[searchBy] === searchText){
                    populate(element, container)
                } else if(searchText === "") {
                    populate(element, container)
                }})

            getRequest(id, callback)
    
            e.target.reset();
        })
    })
}

function clearHandler(e) {
    const clearUl = e.target.parentNode.querySelector('ul')
    clearUl.innerHTML = ""
}

function deleteHandler(e) {
    const objToDelete = e.target.parentNode
    const id = objToDelete.id
    deleteRequest(id)
    objToDelete.parentNode.removeChild(objToDelete)
}

// Callback Functions

function makeObject(e){
    e.preventDefault()
    const form = e.target
    const info = form.querySelectorAll('.info')
    const container = form.parentNode.parentNode
    const id = `${form.parentNode.parentNode.id}/`
    const newObj = {}
    info.forEach((element) => newObj[element.name] = element.value)
    form.parentNode.removeChild(form)

    postRequest(id, populate, newObj, container)
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
    <h3 class="cursor"></h3>
    <button>+</button>
    `
    songCard.querySelector('h3').textContent = song.title
    songCard.querySelector('h3').addEventListener('click', editSong)
    songCard.querySelector('button').addEventListener('click', addSong)
    return songCard
}

function createSetCard(set) {
    const setCard = document.createElement('li')
    setCard.id = `sets/${set.id}`
    setCard.innerHTML = `
    <h3 class="cursor"></h3>
    <h5></h5>
    `
    setCard.querySelector('h3').textContent = set.venue
    setCard.querySelector('h5').textContent = set.date
    setCard.querySelector('h3').addEventListener('click', editSet)
    return setCard
}

// Edit set functions

function editSet(e) {
    const setId = e.target.parentNode.id
    const editBox = document.querySelector('#set-list')
    editBox.innerHTML = `
    <div id="${setId}">
    <h3></h3>
    <h5></h5>
    <ul></ul>
    <button id='done'>Done</button>
    <button id='delete'>Delete Set</button>
    </div>
    `
    editBox.querySelector('#done').addEventListener('click', done)
    editBox.querySelector('#delete').addEventListener('click', deleteHandler)
    
    const callback = (data) => {
        editBox.querySelector('h3').textContent = data.venue
        editBox.querySelector('h5').textContent = data.date
        data.songs.forEach((songId) => getSong(songId))
    }
    
    getRequest(setId, callback)
    activeSet = editBox
}

function getSong(songId) {
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
    <button>-</button>
    `
    newSong.querySelector('h4').textContent = data.title
    newSong.querySelector('p').textContent = data.key + " " + data.meter
    newSong.querySelector('button').addEventListener('click', deleteSong)
    activeSet.querySelector('ul').appendChild(newSong)
}

function addSong(e) {
    const songs = []
    activeSet.querySelectorAll('h4').forEach((element) => songs.push(`songs/${element.id}`))
    const songId = e.target.parentNode.id
    songs.push(songId)
    updateSet(songs)
}

function deleteSong(e) {
    const song = e.target.parentNode
    song.parentNode.removeChild(song)
    const songs = []
    activeSet.querySelectorAll('h4').forEach((element) => songs.push(`songs/${element.id}`))
    updateSet(songs)
}

function updateSet(songs) {
    const setId = activeSet.querySelector('div').id
    activeSet.querySelector('ul').innerHTML = ""
    const callback = (data) => data.songs.forEach((id) => getSong(id))
    patchRequest(setId, callback, "songs", songs)
}

// Edit song functions

function editSong(e) {
    const songId = e.target.parentNode.id
    getRequest(songId, createEditWindow)
}

function edit(e) {
    const editItem = e.target
    const songId = editItem.parentNode.id
    const currentText = editItem.textContent
    editItem.innerHTML = `
    <form>
    <label for="${editItem.id}">${editItem.id}</label>
    <input id="new-text" type="text" name="${editItem.id}" value="${currentText}" />
    <input type="submit" value="Save" />
    </form>
    `
    activeSong.querySelectorAll('form').forEach(form => form.addEventListener('submit', updateSong))
}

function updateSong(e) {
    e.preventDefault();
    const songId = e.target.parentNode.parentNode.id
    const key = e.target.querySelector('label').textContent
    const value = e.target.querySelector('input').value
    patchRequest(songId, createEditWindow, key, value)
}

function createEditWindow(song) {
    const songId = `songs/${song.id}`
    const editBox = document.querySelector('#song-list')
    editBox.innerHTML = `
    <div id="${songId}">
    <h3 id="title" class="cursor"></h3>
    <h5 id="author" class="cursor"></h5>
    <p id="key" class="cursor"></p>
    <p id="meter" class="cursor"></p>
    <p id="chords" class="cursor"></p>
    <button id='done'>Done</button>
    <button id='add'>Add to Set</button>
    <button id='delete'>Delete Song</button>
    </div>
    `

    editBox.querySelector('h3').textContent = song.title
    editBox.querySelector('h5').textContent = song.author
    editBox.querySelector('#key').textContent = song.key
    editBox.querySelector('#meter').textContent = song.meter
    editBox.querySelector('#chords').textContent = song.chords

    editBox.querySelector('h3').addEventListener('click', edit)
    editBox.querySelector('h5').addEventListener('click', edit)
    editBox.querySelectorAll('p').forEach(p => p.addEventListener('click', edit))
    editBox.querySelector('#done').addEventListener('click', done)
    editBox.querySelector('#add').addEventListener('click', addSong)
    editBox.querySelector('#delete').addEventListener('click', deleteHandler)
    
    activeSong = editBox
}

function done(e) {
    const songSearch = document.querySelector('#song-search-button')
    const setSearch = document.querySelector('#set-search-button')
    e.target.parentNode.parentNode.id === "song-list" ? songSearch.click() : setSearch.click()
}

// Fetch functions

function getRequest(id, callback) {
    fetch(dbURL + id)
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => console.log(error))
}

function postRequest(id, callback, obj, container) {
    fetch(dbURL + id, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => callback(data, container))
    .catch(error => alert(error))
}

function patchRequest(id, callback, key, value) {
    fetch(dbURL + id, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            [key]: value
        })
    })
    .then(response => response.json())
    .then(data => callback(data))
}

function deleteRequest(id) {
    fetch(dbURL + id, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
    }})
    .catch(error => alert(error))
}