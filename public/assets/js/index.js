document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const noteForm = document.querySelector(".note-form");
  const noteTitle = document.querySelector(".note-title");
  const noteText = document.querySelector(".note-textarea");
  const saveNoteBtn = document.querySelector(".save-note");
  const newNoteBtn = document.querySelector(".new-note");
  const clearBtn = document.querySelector(".clear-btn");
  const noteList = document.querySelector("#list-group");

  let activeNote = {};

  const getNotes = () => {
    return fetch("/api/notes")
      .then((response) => response.json())
      .catch((err) => console.error(err));
  };

  const saveNote = (note) => {
    return fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));
  };

  const deleteNote = (id) => {
    return fetch(`/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));
  };

  const renderActiveNote = () => {
    if (activeNote.id) {
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      noteTitle.value = "";
      noteText.value = "";
    }
  };

  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    };

    saveNote(newNote).then(() => {
      activeNote = {};
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const handleNoteDelete = (id) => {
    deleteNote(id).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const handleNoteView = (note) => {
    activeNote = note;
    renderActiveNote();
  };

  const handleNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
  };

  const handleRenderNotes = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
      saveNoteBtn.style.display = "none";
    } else {
      saveNoteBtn.style.display = "block";
    }
  };

  const renderNoteList = (notes) => {
    noteList.innerHTML = "";

    notes.forEach((note) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");

      const span = document.createElement("span");
      span.textContent = note.title;
      span.addEventListener("click", () => handleNoteView(note));

      const deleteBtn = document.createElement("i");
      deleteBtn.className = "fas fa-trash-alt float-right text-danger delete-note";
      deleteBtn.addEventListener("click", () => handleNoteDelete(note.id));

      li.appendChild(span);
      li.appendChild(deleteBtn);

      noteList.appendChild(li);
    });
  };

  const getAndRenderNotes = () => {
    getNotes().then(renderNoteList);
  };

  saveNoteBtn.addEventListener("click", handleNoteSave);
  newNoteBtn.addEventListener("click", handleNewNoteView);
  noteForm.addEventListener("input", handleRenderNotes);

  getAndRenderNotes();
  renderActiveNote();
});
