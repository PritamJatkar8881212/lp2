function loadSongs() {
    fetch('/api/songs')
        .then(res => res.json())
        .then(data => {
            document.getElementById("count").innerText = `Total Songs: ${data.count}`;
            const tbody = document.querySelector("#songsTable tbody");
            tbody.innerHTML = "";
            data.songs.forEach(song => {
                const row = document.createElement("tr");
                row.innerHTML = `
          <td>${song.Songname}</td>
          <td>${song.Film}</td>
          <td>${song.Music_director}</td>
          <td>${song.Singer}</td>
          <td>${song.Actor || '-'}</td>
          <td>${song.Actress || '-'}</td>
          <td>
            <button onclick="deleteSong('${song._id}')">❌</button>
            <button onclick="updateSong('${song._id}')">✏️</button>
          </td>
        `;
                tbody.appendChild(row);
            });
        });
}

function deleteSong(id) {
    fetch(`/api/songs/${id}`, { method: 'DELETE' })
        .then(() => loadSongs());
}

function updateSong(id) {
    const actor = prompt("Enter Actor:");
    const actress = prompt("Enter Actress:");
    if (actor && actress) {
        fetch(`/api/songs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Actor: actor, Actress: actress })
        }).then(() => loadSongs());
    }
}

document.getElementById("addForm").addEventListener("submit", e => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        form.reset();
        loadSongs();
    });
});

loadSongs();
