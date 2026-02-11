import { supabase } from './supabase.js'; // cesta k supabase.js

document.addEventListener('DOMContentLoaded', () => {

  const token = localStorage.getItem('jwt_token');
  if (!token) {
    alert('Nejste přihlášeni! Přihlaste se přes Discord.');
    window.location.href = '/index.html';
  }

  // --- Načtení hráčů ---
  async function loadPlayers() {
    try {
      const { data, error } = await supabase.from('users').select(`
        id,
        username,
        character:characters(name,class,guild_role,level),
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
          <td>${character.guild_role || '-'}</td>
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

  // --- Vytvoření postavy ---
  const form = document.getElementById('create-character-form');
  form.addEventListener('submit', async (e) => {
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
      form.reset();
      loadPlayers();

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // --- Odhlášení ---
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/index.html';
  });

  loadPlayers();
});
