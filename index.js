document.addEventListener('DOMContentLoaded', init)

const songsURL = "http://localhost:3000/songs"
const setsURL = " http://localhost:3000/sets"

function init() {
    modeHandler()
    songSearchHandler()
    setSearchHandler()
    populateSongs()
    populateSets()
}