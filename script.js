// ===== Data =====
const myLibrary = [];

// Constructor
function Book({ title, author, pages, read }) {
  this.id = crypto.randomUUID(); // stable unique id
  this.title = title;
  this.author = author;
  this.pages = Number(pages);
  this.read = Boolean(read);
}

// Prototype method to toggle read status
Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// Helper: create + store in array
function addBookToLibrary({ title, author, pages, read }) {
  const book = new Book({ title, author, pages, read });
  myLibrary.push(book);
  return book;
}

// ===== DOM =====
const libraryEl = document.querySelector("#library");
const newBookBtn = document.querySelector("#newBookBtn");

const dialog = document.querySelector("#bookDialog");
const form = document.querySelector("#bookForm");
const cancelBtn = document.querySelector("#cancelBtn");

// Render function: UI is recreated from data (single source of truth)
function renderLibrary() {
  libraryEl.innerHTML = "";

  if (myLibrary.length === 0) {
    libraryEl.innerHTML = `<p style="color:#444">No books yet. Click “New Book”.</p>`;
    return;
  }

  for (const book of myLibrary) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = book.id; // link DOM -> data

    const badgeClass = book.read ? "read" : "unread";
    const badgeText = book.read ? "Read" : "Not read";

    card.innerHTML = `
      <span class="badge ${badgeClass}">${badgeText}</span>
      <h3>${escapeHTML(book.title)}</h3>
      <p class="meta">Author: ${escapeHTML(book.author)}</p>
      <p class="meta">Pages: ${book.pages}</p>

      <div class="row">
        <button class="toggleReadBtn" type="button">Toggle Read</button>
        <button class="removeBtn" type="button">Remove</button>
      </div>
    `;

    libraryEl.appendChild(card);
  }
}

// Event delegation for buttons inside the library container
libraryEl.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const bookId = card.dataset.id;
  const book = myLibrary.find((b) => b.id === bookId);
  if (!book) return;

  if (e.target.closest(".removeBtn")) {
    removeBookById(bookId);
    renderLibrary();
  }

  if (e.target.closest(".toggleReadBtn")) {
    book.toggleRead();
    renderLibrary();
  }
});

function removeBookById(id) {
  const index = myLibrary.findIndex((b) => b.id === id);
  if (index !== -1) myLibrary.splice(index, 1);
}

// ===== Dialog / Form =====
newBookBtn.addEventListener("click", () => {
  form.reset();
  dialog.showModal();
});

cancelBtn.addEventListener("click", () => {
  dialog.close();
});

form.addEventListener("submit", (e) => {
  // Prevent default "send to server" behavior
  e.preventDefault();

  const formData = new FormData(form);
  const title = formData.get("title").trim();
  const author = formData.get("author").trim();
  const pages = formData.get("pages");
  const read = formData.get("read") === "on";

  addBookToLibrary({ title, author, pages, read });
  renderLibrary();
  dialog.close();
});

// ===== Seed data (optional for testing) =====
addBookToLibrary({ title: "Clean Code", author: "Robert C. Martin", pages: 464, read: true });
addBookToLibrary({ title: "Eloquent JavaScript", author: "Marijn Haverbeke", pages: 472, read: false });
renderLibrary();

// ===== tiny helper =====
// Stops users from injecting HTML into your page via form inputs
function escapeHTML(str) {
    return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}