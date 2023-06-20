const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notes = JSON.parse(data);
      const newNote = req.body;
      newNote.id = Date.now().toString(); // Generate a unique id for each note
      notes.push(newNote);

      fs.writeFile('./db.json', JSON.stringify(notes, null, 2), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
        } else {
          res.status(200).json(newNote);
        }
      });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let notes = JSON.parse(data);
      notes = notes.filter((note) => note.id !== req.params.id);

      fs.writeFile('./db.json', JSON.stringify(notes, null, 2), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
