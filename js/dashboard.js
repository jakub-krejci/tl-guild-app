import { supabase } from "../supabase.js";

async function loadPlayers() {
    const { data, error } = await supabase.from("users").select(`
    id,
    username,
    character:characters(name,class,role,level),
    dkp:dkp(dkp_total)
  `);

    if (error) return console.error(error);

    const tbody = document.querySelector("#players-table tbody");
    tbody.innerHTML = "";

    data.forEach((user) => {
        const character = user.character[0] || {};
        const dkp = user.dkp[0]?.dkp_total || 0;
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${user.username}</td>
      <td>${character.name || "-"}</td>
      <td>${character.class || "-"}</td>
      <td>${character.role || "-"}</td>
      <td>${character.level || "-"}</td>
      <td>${dkp}</td>
    `;
        tbody.appendChild(row);
    });
}

document
    .getElementById("create-character-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("char-name").value;
        const charClass = document.getElementById("char-class").value;
        const level = Number(document.getElementById("char-level").value);

        const token = localStorage.getItem("jwt_token");
        if (!token) return alert("Nejste přihlášen!");

        // Zavoláme backend endpoint pro vytvoření postavy
        await fetch(
            "https://tl-guild-backend.vercel.app/api/characters/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, class: charClass, level }),
            },
        );

        loadPlayers();
    });

loadPlayers();
