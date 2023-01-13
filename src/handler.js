/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid')
const books = require('./book')

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const bookNameValid =
    typeof name !== 'undefined' && name.length !== 0 && name.trim() !== ''
  if (!bookNameValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(32)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }
  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBook = (request, h) => {
  const filterBooks = books.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher
  }))

  const params = request.query

  if (params) {
    if (params.name !== undefined) {
      const name = params.name.toLowerCase()
      const book = filterBooks.filter((n) => n.name.toLowerCase().match(name) !== null)
      if (book) {
        return {
          status: 'success',
          data: {
            books: book
          }
        }
      }
    }

    if (params.reading !== undefined) {
      const readingBook = []
      if (params.reading === '0') {
        books.forEach((n) => {
          if (!n.reading) readingBook.push(n)
        })
      } else if (params.reading === '1') {
        books.forEach((n) => {
          if (n.reading) readingBook.push(n)
        })
      } else {
        books.forEach((n) => {
          readingBook.push(n)
        })
      }
      const filterReadingBook = readingBook.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher
      }))
      return {
        status: 'success',
        data: {
          books: filterReadingBook
        }
      }
    }
    if (params.finished !== undefined) {
      const finishedBooks = []
      if (params.finished === '0') {
        books.forEach((n) => {
          if (!n.finished) finishedBooks.push(n)
        })
      } else if (params.finished === '1') {
        books.forEach((n) => {
          if (n.finished) finishedBooks.push(n)
        })
      } else {
        books.forEach((n) => {
          finishedBooks.push(n)
        })
      }
      const filterReadingBook = finishedBooks.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher
      }))
      return {
        status: 'success',
        data: {
          books: filterReadingBook
        }
      }
    }
  }
  return {
    status: 'success',
    data: {
      books: filterBooks
    }
  }
}

const getBookById = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookById = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const bookNameValid =
    typeof name !== 'undefined' && name.length !== 0 && name.trim() !== ''

  if (!bookNameValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookById = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBook,
  getAllBook,
  getBookById,
  editBookById,
  deleteBookById
}
