const fs = require('fs');
const path = require('path');

function readNotes() {
  const notesData = fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8');
  return JSON.parse(notesData);
}

function writeNotes(notes) {
  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), 'utf8');
}

module.exports = (app) => {
  app.get('/api/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
  });

  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = readNotes();
    newNote.id = Date.now();
    notes.push(newNote);
    writeNotes(notes);
    res.json(newNote);
  });

  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const notes = readNotes();
    const updatedNotes = notes.filter((note) => note.id !== parseInt(noteId));
    writeNotes(updatedNotes);
    res.json({ message: 'Note deleted' });
  });
};
