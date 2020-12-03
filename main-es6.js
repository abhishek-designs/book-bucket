// Book constructor to create books
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI constructor whose prototype methods are used to do actions related to the app UI
class UI {
  // Method to add the books into the UI
  addBooks(book) {
    // First selecting the parent container for all the books
    const bookList = document.querySelector(".book-list-content");
    // Creating a table row
    const row = document.createElement("tr");
    // Appending each book data into row
    row.innerHTML = `
            <td>${book.title}</td>  
            <td>${book.author}</td>  
            <td>${book.isbn}</td>  
            <td>
                <a href="#" class="btn btn-remove">
                    <i class="fa fa-times light"></i>
                </a>
            </td>  
        `;
    // Inserting the book data into the table list
    bookList.appendChild(row);
  }

  // Method to remove each book from the table UI
  removeBook(target) {
    // Accessing the remove btn through target
    if (target.classList.contains("btn-remove")) {
      // Remove the book row through DOM TRAVERSING
      target.parentElement.parentElement.remove();

      // After successful deletion show the message
      this.showMsg("Book removed successfully", "success");

      // Removing the book from the local storage also
      // To remove the book from the storage also we require a unique isbn no. from it
      Store.removeBooks(
        target.parentElement.previousElementSibling.textContent
      );
    }
  }

  // Method to show the message to the user according to the condition
  showMsg(message, msgClass) {
    // Create the message tab
    const msgTab = document.createElement("div");
    msgTab.className = "msg-tab";
    msgTab.classList.add(msgClass);
    msgTab.appendChild(document.createTextNode(message));
    // Accessing the parent container
    const container = document.querySelector(".container");
    // Setting the tab inside the UI
    container.appendChild(msgTab);
    // Slide in the tab
    msgTab.style.animationName = "slide-in";
    // Slide out the tab after 2 sec
    setTimeout(function () {
      msgTab.style.animationName = "slide-out";
    }, 2000);
  }

  // Method to empty the input fields
  emptyField() {
    document.querySelector(".title-field").value = "";
    document.querySelector(".author-field").value = "";
    document.querySelector(".isbn-field").value = "";
  }
}

// Store class which access the local storage
class Store {
  // Method to check the local storage and return the available array from it
  static checkStorage() {
    // Check if there is some books or not
    let books;
    if (localStorage.length === 0) {
      // There are no books in the storage
      books = [];
    } else {
      // There are some books in the storage
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  // Method to store the books into the local storage
  static storeBooks(book) {
    // Get the books after checking the storage
    const books = this.checkStorage();
    // Push the added book into the books
    books.push(book);
    // Store into the local storage
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Method to fetch the saved books in the local storage when page gets loaded
  static fetchBooks() {
    // Get the books after checking the storage
    const books = this.checkStorage();
    // Creating the UI instance also
    const ui = new UI();
    // Fetch each book from the storage through forEach
    books.forEach(function (book) {
      // Calling the UI addBooks() method to show the books in the UI
      ui.addBooks(book);
    });
  }

  // Method to remove the books from the storage also
  static removeBooks(isbn) {
    // We get the unique isbn no. of the book to be removed now we can loop through the
    // Books and splice that book from the array which has the same isbn no.

    // Firsly get the array of books from the local storage
    const books = this.checkStorage();
    // Looping through forEach and getting the index no. of the book which has same isbn no.
    books.forEach(function (book, index) {
      // Checking the book for the same isbn no.
      if (book.isbn === isbn) {
        // Remove this book
        books.splice(index, 1);
      }
    });

    // After the deletion once again storing the updated books array into the storage
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event listener to the form
const bookForm = document.querySelector("#book-input-form");
bookForm.addEventListener("submit", function (e) {
  // Prevent the default behaviour
  e.preventDefault();

  // Selectors
  const title = document.querySelector(".title-field").value,
    author = document.querySelector(".author-field").value,
    isbn = document.querySelector(".isbn-field").value;

  // Creating a book instance
  const book = new Book(title, author, isbn);

  // Creating a UI instance to control the UI related stuffs
  const ui = new UI();

  // Some validations
  if (title === "" || author === "" || isbn === "") {
    // If no value is inputted : FAILED
    // Show the message
    ui.showMsg("Book details not added", "failed");
  } else {
    // Add the books
    // Call the addBook() method of the UI
    ui.addBooks(book);
    // Method to store the books into the local storage through Store class
    Store.storeBooks(book);
    // Call the success message after addition : SUCCESS
    ui.showMsg("Books Added", "success");
    // Empty the fields after successful addition through emptyField method of UI
    ui.emptyField();
  }
});

// Now event listener to remove each book from the table through EVENT DELEGATION
const bookListTable = document.querySelector(".book-list");
bookListTable.addEventListener("click", function (e) {
  // Call the UI method which takes the target element which deletes the book row
  // Creating the UI instance first which calls the method
  const ui = new UI();
  ui.removeBook(e.target);
});

// Also the event listener to show the saved books when the DOM gets loaded
document.addEventListener("DOMContentLoaded", function (e) {
  // Calling the method of Store to fetch the saved books
  Store.fetchBooks();
});
