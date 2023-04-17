'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 5

var gBooks
var gPageIdx = 0
var gFilterBy = { minRate: 0, maxPrice: 100, searchQuery: new RegExp('', '') }
_createBooks()

function nextPage() {
  gPageIdx++
  console.log(gPageIdx)
}
function prevPage() {
  if (gPageIdx !== 0) gPageIdx--
}
function getBooks() {
  var books = gBooks.filter(
    (book) =>
      book.rate >= gFilterBy.minRate &&
      book.price <= gFilterBy.maxPrice &&
      gFilterBy.searchQuery.test(book.title)
  )
  const startIdx = gPageIdx * PAGE_SIZE
  const res = books.slice(startIdx, startIdx + PAGE_SIZE)
  setNextPrevId(res)
  return res
}

function _createBook(title, price = getRandomIntInclusive(1, 100)) {
  return {
    title,
    id: makeId(),
    price,
    desc: makeLorem(30),
    rate: 0,
  }
}

function _createBooks() {
  var books = loadFromStorage(STORAGE_KEY)
  if (!books || !books.length) {
    books = [
      _createBook('Harry Potter'),
      _createBook('The King and The Baby'),
      _createBook('The Little Cat'),
      _createBook('1984'),
      _createBook('To Kill a Mockingbird'),
      _createBook('The Great Gatsby'),
      _createBook('The Catcher in the Rye'),
      _createBook('The Lord of the Rings'),
      _createBook("The Hitchhiker's Guide to the Galaxy"),
      _createBook('Pride and Prejudice'),
      _createBook('The Hunger Games'),
      _createBook("Harry Potter and the Philosopher's Stone"),
      _createBook('The Da Vinci Code'),
    ]
  }
  gBooks = books
  _saveBooksToStorage()
}

function _saveBooksToStorage() {
  saveToStorage(STORAGE_KEY, gBooks)
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex((book) => bookId === book.id)
  gBooks.splice(bookIdx, 1)
  _saveBooksToStorage()
}

function addBook(name, price) {
  const book = _createBook(name, price)
  gBooks.push(book)
  _saveBooksToStorage()
  return book
}

function updateBook(bookId, bookPrice) {
  const book = gBooks.find((book) => book.id === bookId)
  book.price = bookPrice
}

function getBookById(bookId) {
  const book = gBooks.find((book) => bookId === book.id)
  return book
}

function ratingDec(bookId) {
  const book = getBookById(bookId)
  if (book.rate !== 0) {
    const newRating = --book.rate
    _saveBooksToStorage()
    return newRating
  }
  return null
}

function ratingInc(bookId) {
  const book = getBookById(bookId)
  if (book.rate !== 10) {
    const newRating = ++book.rate
    _saveBooksToStorage()
    return newRating
  }
  return null
}

function setBookFilter(filterBy) {
  if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
  if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
  if (filterBy.searchQuery !== undefined)
    gFilterBy.searchQuery = new RegExp(filterBy.searchQuery, 'i')

  return gFilterBy
}

function setNextPrevId(books) {
  for (var i = 0; i < books.length; i++) {
    if (i !== books.length - 1) {
      books[i].nextBookId = books[i + 1].id
    }
    if (i !== 0) {
      books[i].prevBookId = books[i - 1].id
    }
  }
}
