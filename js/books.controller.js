'use strict'

function onInit() {
  renderFilterByQueryStringParams()
  renderBooks()
}

function renderBooks() {
  var books = getBooks()
  var strHtml = books
    .map(
      (book) =>
        `<tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.price}</td>
        <td> <button read-btn onclick="onReadBook('${book.id}')">Read</button></td>
        <td> <button update-btn onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td> <button delete-btn onclick="onRemoveBook('${book.id}')">Delete</button></td>
        </tr>    `
    )
    .join('')

  const elTableBody = document.querySelector('.table-body')
  elTableBody.innerHTML = strHtml
}

function onNextPage() {
  nextPage()
  renderBooks()
  if ((gPageIdx + 1) * PAGE_SIZE >= gBooks.length) {
    document.querySelector('.next').setAttribute('disabled', '')
  }
  if (gPageIdx !== 0) {
    document.querySelector('.prev').removeAttribute('disabled')
  }
}

function onPrevPage() {
  prevPage()
  renderBooks()
  if (gPageIdx - 1 < 0) {
    document.querySelector('.prev').setAttribute('disabled', '')
  }
  if (gPageIdx * PAGE_SIZE < gBooks.length) {
    document.querySelector('.next').removeAttribute('disabled')
  }
}

function flashMsg(msg) {
  const elUserMessage = document.querySelector('.user-msg')
  elUserMessage.innerText = msg
  elUserMessage.classList.add('open')
  setTimeout(() => {
    elUserMessage.classList.remove('open')
  }, 3000)
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
  flashMsg('Book deleted')
}

function onAddBook() {
  var name = prompt('Enter the name of the book')
  var price = +prompt('Enter the price of the book')

  if (name && price) {
    const book = addBook(name, price)
    renderBooks()
    flashMsg(`Book Added (${book.id})`)
  }
}

function onUpdateBook(bookId) {
  const bookPrice = +prompt("Enter the book's new price")
  updateBook(bookId, bookPrice)
  renderBooks()
  flashMsg(`Book Updated (${bookId})`)
}

function onReadBook(bookId) {
  const book = getBookById(bookId)
  var elModal = document.querySelector('.modal')
  const strHTML = `<h3>${book.title}</h3>
      <h4>Price:${book.price} </h4>
      <h5>Car Description</h5>
      <p>${book.desc}</p>
      <h6>Rating</h6>
      <div class="rating">
        <button class="minus1" onclick="onRatingDec('${bookId}')">-</button>
        <div class="rating-display">${book.rate}</div>
        <button class="add1" onclick="onRatingInc('${bookId}')">+</button>
      </div>

      <button onclick="onCloseModal()">Close</button>`

  elModal.innerHTML = strHTML
  elModal.classList.add('open')
}

function onCloseModal() {
  document.querySelector('.modal').classList.remove('open')
}

function onRatingDec(bookId) {
  const newRating = ratingDec(bookId)
  if (newRating !== null) {
    const elRatingDisplay = document.querySelector('.rating-display')
    elRatingDisplay.innerText = `${newRating}`
  }
}

function onRatingInc(bookId) {
  const newRating = ratingInc(bookId)
  if (newRating !== null) {
    const elRatingDisplay = document.querySelector('.rating-display')
    elRatingDisplay.innerText = `${newRating}`
  }
}

function onRateChange(value) {
  document.querySelector('.min-range-value').innerText = value
}

function onPriceChange(value) {
  document.querySelector('.max-price-value').innerText = value
}

function renderFilterByQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const filterBy = {
    minRate: queryStringParams.get('minRate') || '',
    maxPrice: +queryStringParams.get('maxPrice') || 0,
  }

  if (!filterBy.minRate && !filterBy.maxPrice) return

  document.querySelector('.rate-slider').value = filterBy.minRate
  // document.querySelector('.min-range-value').innerText = value

  document.querySelector('.price-slider').value = filterBy.maxPrice
  // document.querySelector('.max-price-value').innerText = value

  setBookFilter(filterBy)
}

function onSetFilterBy(filterBy) {
  filterBy = setBookFilter(filterBy)
  renderBooks()

  const queryStringParams = `?minRate=${filterBy.minRate}&maxPrice=${filterBy.maxPrice}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}
