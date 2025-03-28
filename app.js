//***** DOM Selections ******/

//nav
const searchInputElement = document.querySelector("#searchInput");
const clearBtn = document.querySelector("#clearBtn");

const selectElement = document.querySelector("#select");
const gridLayoutBtn = document.querySelector("#gridBtn");
const listLayoutBtn = document.querySelector("#listBtn");
console.log(selectElement.value);
//container
const bookContainer = document.querySelector("#bookContainer");

//pagination
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const pageNoPara = document.querySelector("#pageNo");

//***** variable declaration ******/

let currentPage = 1;
const totalPage = undefined;
let currentPageBooks = [];

//*****functions ******/

async function getBooksData(pageNo = 1) {
  const url = `https://api.freeapi.app/api/v1/public/books?page=${pageNo}&limit=${10}`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);

    const data = await response.json();

    if (!data.success) {
      throw new Error("Error while fetching data");
    }
    console.log(data);
    currentPageBooks = data.data.data;
    renderBooks(currentPageBooks);

    //setting page no
    pageNoPara.innerText = data.data.page;
    currentPage = data.data.page;

    // Remove previous event listeners before adding new ones
    prevBtn.removeEventListener("click", handlePrevClick);
    nextBtn.removeEventListener("click", handleNextClick);

    //adding prev funcion based on page no
    if (!data.data.previousPage) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
      prevBtn.addEventListener("click", handlePrevClick);
    }

    //adding next funcion based on page no
    if (!data.data.nextPage) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
      nextBtn.addEventListener("click", handleNextClick);
    }
  } catch (error) {
    alert("Error while fetching data");
  }
}

function renderBooks(bookList) {
  bookContainer.innerHTML = "";

  bookHolderClass = bookContainer.classList.contains("grid")
    ? "bookHolderGrid"
    : "bookHolderList";

  bookList.forEach((book) => {
    const authorsArray = book?.volumeInfo?.authors?.slice(0, 3).join(", ");
    const title = book?.volumeInfo?.title;
    const publishedDate = book?.volumeInfo?.publishedDate;
    const publisher = book?.volumeInfo?.publisher;
    const imageUrl =
      book?.volumeInfo?.imageLinks?.thumbnail ||
      book?.volumeInfo?.imageLinks?.smallThumbnail ||
      "";

    const bookHolder = document.createElement("a");
    bookHolder.href = book?.volumeInfo?.infoLink;
    bookHolder.target = "_blank";
    bookHolder.classList.add(bookHolderClass);
    bookHolder.id = "bookHolder";

    const stringBookElement = `
    <div class="imageContainer">
    <img class="image" src="${imageUrl}" alt="${title} book cover"
            loading="lazy"/>
    </div>
    <div class="bookDetailsHolder">
    <h2 id="bookTitle">${title}</h2>
    <div class="bookMeta">
    <h3 id="bookAuthor">Author:${authorsArray}</h3>
    <p id="bookPublisher">Publisher: ${publisher}</p>
    </div>
    <p id="bookPublishedDate">Date: ${publishedDate}</p>
    </div>`;

    bookHolder.innerHTML = stringBookElement;
    bookContainer.appendChild(bookHolder);
  });
}

function searchBook(name) {
  let foundBooks = [];

  currentPageBooks.forEach((book) => {
    if (book.volumeInfo.title.toLowerCase().includes(name.toLowerCase())) {
      foundBooks.push(book);
      return;
    }
    book.volumeInfo.authors.forEach(
      (author) => author.includes(name) && foundBooks.push(book)
    );
  });

  if (foundBooks.length <= 0) {
    renderBooks(currentPageBooks);
    return;
  }
  renderBooks(foundBooks);
}

function functionDebouncer(cb, delay) {
  let id = null;
  return function (...args) {
    clearTimeout(id);

    id = setTimeout(() => {
      cb.apply(this, args);
    }, delay * 1000);
  };
}

function clearSearch() {
  searchInputElement.value = "";
  renderBooks(currentPageBooks);
}

function sortBooks(sort) {
  let sortedBooks = [...currentPageBooks];
  if (sort === "publishedDate") {
    sortedBooks.sort(
      (a, b) =>
        new Date(b.volumeInfo.publishedDate) -
        new Date(a.volumeInfo.publishedDate)
    );
  } else if (sort === "increasing") {
    sortedBooks.sort((a, b) =>
      a.volumeInfo.title.localeCompare(b.volumeInfo.title)
    );
  } else if (sort === "descending") {
    sortedBooks.sort((a, b) =>
      b.volumeInfo.title.localeCompare(a.volumeInfo.title)
    );
  }
  renderBooks(sortedBooks);
}

function toggleLayout(layout) {
  const bookHolderArray = document.querySelectorAll("#bookHolder");
  if (layout === "grid") {
    gridLayoutBtn.classList.add("select");
    listLayoutBtn.classList.remove("select");
    bookContainer.classList.remove("list");
    bookContainer.classList.add("grid");

    bookHolderArray.forEach((bookHolder) => {
      bookHolder.classList.remove("bookHolderList");
      bookHolder.classList.add("bookHolderGrid");
    });
  } else {
    listLayoutBtn.classList.add("select");
    gridLayoutBtn.classList.remove("select");
    bookContainer.classList.remove("grid");
    bookContainer.classList.add("list");

    bookHolderArray.forEach((bookHolder) => {
      bookHolder.classList.remove("bookHolderGrid");
      bookHolder.classList.add("bookHolderList");
    });
  }
}

function handlePrevClick() {
  getBooksData(currentPage - 1);
}

function handleNextClick() {
  getBooksData(currentPage + 1);
}

const debouneSearch = functionDebouncer(searchBook, 1);

getBooksData();

//***** Adding functions to respective element  ******/

searchInputElement.addEventListener("input", (e) => {
  debouneSearch(e.target.value);
});

clearBtn.addEventListener("click", clearSearch);

selectElement.addEventListener("change", function () {
  console.log("eun");
  let selectedValue = this.value;
  sortBooks(selectedValue);
});

gridLayoutBtn.addEventListener("click", () => {
  toggleLayout("grid");
});

listLayoutBtn.addEventListener("click", () => {
  toggleLayout("list");
});
