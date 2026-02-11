import { supabase } from '../supabase.js';

// --- 1️⃣ Získání JWT tokenu z localStorage ---
const token = localStorage.getItem('jwt_token');
if (!token) {
  alert('Nejste přihlášen! Prosím přihlaste se přes Discord.');
  window.location.href = '/index.html';
}

// --- 2️⃣ Funkce pro načtení hráčů ---
async function loadPlayers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        character:characters(name,class,role,level),
        dkp:dkp(dkp_total)
      `);

    if (error) throw error;

    const tbody = document.querySelector('#players-table tbody');
    tbody.innerHTML = '';

    data.forEach(user => {
      const character = user.character[0] || {};
      const dkp = user.dkp[0]?.dkp_total || 0;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${character.name || '-'}</td>
        <td>${character.class || '-'}</td>
        <td>${character.role || '-'}</td>
        <td>${character.level || '-'}</td>
        <td>${dkp}</td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    alert('Chyba při načítání hráčů');
  }
}

// --- 3️⃣ Funkce pro vytvoření postavy ---
document.getElementById('create-character-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('char-name').value;
  const charClass = document.getElementById('char-class').value;
  const level = Number(document.getElementById('char-level').value);

  try {
    const response = await fetch('https://tl-guild-backend.vercel.app/api/characters/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, class: charClass, level })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Chyba při vytváření postavy');

    alert('Postava byla vytvořena!');
    e.target.reset();
    loadPlayers();

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

// --- 4️⃣ Načtení hráčů při otevření stránky ---
loadPlayers();
