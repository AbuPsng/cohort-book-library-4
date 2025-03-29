//**\*** BOOk LIBRARY **\***//

Book Explorer is a web application that allows users to browse, search, and sort books using the FreeAPI book database. Users can switch between grid and list layouts and navigate through paginated results.

//**\*** Features **\***//

Fetches book data from FreeAPI.

Pagination support.

Search books by title or author.

Sort books by title (ascending/descending) or published date.

Toggle between grid and list views.

//**\*** Technologies Used **\***//

HTML, CSS, JavaScript (Vanilla JS)

Fetch API

FreeAPI for book data

Code Structure

//**\*** DOM Selections **\***//

Elements such as search input, buttons, layout toggles, and the book container are selected for manipulation.

Functions

getBooksData(pageNo): Fetches books from the API and updates the UI.

renderBooks(bookList): Renders book data on the page.

searchBook(name): Filters books by title or author.

functionDebouncer(cb, delay): Implements debounce functionality to optimize search performance.

clearSearch(): Clears the search input and resets the book list.

sortBooks(sort): Sorts books by title or published date.

toggleLayout(layout): Toggles between grid and list layouts.

handlePrevClick() / handleNextClick(): Handles pagination.

//\***\* SCREENSHOT \*\***//
![alt text](<Screenshot (26).png>)

//\***\* Live link \*\***//
https://cohort-book-library-4.vercel.app/
