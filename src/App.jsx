import React, { useState } from 'react'
import { produce } from 'immer'

function Toolbar({ onAdd, onReplaceFirst, onInsertSecond, onReverse }) {
  return (
    <div className="toolbar card">
      <div className="inputs">
        <input id="name-input" placeholder="Artist name" />
        <input id="style-input" placeholder="Style (e.g., Cubism)" />
      </div>
      <div className="buttons">
        <button onClick={() => {
          const name = document.getElementById('name-input').value.trim()
          const style = document.getElementById('style-input').value.trim()
          onAdd(name, style)
          if (name && style) {
            document.getElementById('name-input').value = ''
            document.getElementById('style-input').value = ''
          }
        }}>Add</button>
        <button onClick={onReplaceFirst}>Replace First</button>
        <button onClick={onInsertSecond}>Insert at 2nd</button>
        <button onClick={onReverse}>Reverse</button>
      </div>
    </div>
  )
}

function ArtistItem({ artist, onToggle, onToggleImmer, onRemove }) {
  return (
    <li className="artist card">
      <div className="artist-main">
        <div>
          <div className="artist-name">{artist.name}</div>
          <div className="artist-sub">{artist.style}</div>
        </div>
        <div className="artist-status">{artist.seen ? 'seen' : 'new'}</div>
      </div>
      <div className="buttons">
        <button onClick={() => onToggle(artist.id)}>Toggle</button>
        <button onClick={() => onToggleImmer(artist.id)}>Toggle (Immer)</button>
        <button className="danger" onClick={() => onRemove(artist.id)}>Remove</button>
      </div>
    </li>
  )
}

export default function App() {
  const [artists, setArtists] = useState([
    { id: 1, name: 'Picasso', style: 'Cubism', seen: true },
    { id: 2, name: 'Van Gogh', style: 'Post‑Impressionism', seen: false },
  ])

  const [nextId, setNextId] = useState(3)

  // Add new artist (immutable add with spread)
  const addArtist = (name, style) => {
    if (!name || !style) return
    setArtists([...artists, { id: nextId, name, style, seen: false }])
    setNextId(nextId + 1)
  }

  // Remove by id (filter)
  const removeArtist = (id) => {
    setArtists(artists.filter(a => a.id !== id))
  }

  // Toggle "seen" (map + spread, updating nested object)
  const toggleSeen = (id) => {
    setArtists(artists.map(a => a.id === id ? { ...a, seen: !a.seen } : a))
  }

  // Replace first element (map + index check)
  const replaceFirst = () => {
    if (artists.length === 0) return
    setArtists(artists.map((a, i) => i === 0 ? { ...a, name: 'Updated Artist', style: 'New Style' } : a))
  }

  // Insert into position 1 using slice
  const insertAtSecond = () => {
    const newArtist = { id: nextId, name: 'Inserted', style: 'Surrealism', seen: false }
    setNextId(nextId + 1)
    setArtists([
      ...artists.slice(0, 1),
      newArtist,
      ...artists.slice(1),
    ])
  }

  // Reverse safely (copy first)
  const reverseOrder = () => {
    const copy = [...artists]
    copy.reverse()
    setArtists(copy)
  }

  // Immer example for toggling
  const toggleWithImmer = (id) => {
    setArtists(produce(artists, draft => {
      const found = draft.find(a => a.id === id)
      if (found) found.seen = !found.seen
    }))
  }

  return (
    <div className="container">
      <header>
        <h1>🎨 Artists Manager</h1>
        <p className="subtitle">Practice immutable array updates in React 19</p>
      </header>

      <Toolbar
        onAdd={addArtist}
        onReplaceFirst={replaceFirst}
        onInsertSecond={insertAtSecond}
        onReverse={reverseOrder}
      />

      <section className="list card">
        <h2>Artists</h2>
        <ul>
          {artists.map(a => (
            <ArtistItem
              key={a.id}
              artist={a}
              onToggle={toggleSeen}
              onToggleImmer={toggleWithImmer}
              onRemove={removeArtist}
            />
          ))}
        </ul>
      </section>

      <section className="learn card">
        <h2>What you can try</h2>
        <ul className="bullets">
          <li>Add, remove, replace, insert, and reverse without mutating.</li>
          <li>Toggle item fields both with classic immutable patterns and with Immer.</li>
          <li>Open the DevTools and verify renders & state changes.</li>
        </ul>
      </section>
    </div>
  )
}
