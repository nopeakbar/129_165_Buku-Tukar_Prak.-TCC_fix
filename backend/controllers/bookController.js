import User from '../models/User.js';
import Book from '../models/Book.js';

/**
 * POST /books
 * Tambah buku baru milik user yang sedang login
 */
export const addBook = async (req, res) => {
  const userId = req.userId;
  const { title, author, genre, condition, description, imageUrl } = req.body;

  try {
    const book = await Book.create({
      title,
      author,
      genre,
      condition,
      description,
      imageUrl,
      userId
    });
    return res
      .status(201)
      .json({ status: 'Success', message: 'Buku berhasil ditambahkan', data: book });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 'Error', message: 'Gagal menambahkan buku', error: error.message });
  }
};

/**
 * GET /books
 * Ambil semua buku
 */
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: {
        model: User,
        as: 'owner',
        attributes: ['id', 'username', 'email', 'avatarUrl']
      },
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({ status: 'Success', data: books });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 'Error', message: 'Gagal mengambil buku', error: error.message });
  }
};
/**
 * PUT /books/:id
 * Update buku by ID (hanya owner)
 */
export const updateBook = async (req, res) => {
  const bookId = Number(req.params.id);
  const userId = req.userId;
  const { title, author, genre, condition, description, imageUrl } = req.body;

  try {
    const book = await Book.findOne({ where: { id: bookId, userId } });
    if (!book) {
      return res.status(404).json({
        status: 'Error',
        message: 'Buku tidak ditemukan atau bukan milik Anda'
      });
    }

    // update hanya field yang ada di body
    if (title != null)       book.title       = title;
    if (author != null)      book.author      = author;
    if (genre != null)       book.genre       = genre;
    if (condition != null)   book.condition   = condition;
    if (description != null) book.description = description;
    if (imageUrl != null)    book.imageUrl    = imageUrl;

    await book.save();
    return res.status(200).json({
      status: 'Success',
      message: 'Buku berhasil diupdate',
      data: book
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 'Error', message: 'Gagal mengupdate buku', error: error.message });
  }
};

/**
 * DELETE /books/:id
 * Hapus buku by ID (hanya owner)
 */
export const deleteBook = async (req, res) => {
  const bookId = Number(req.params.id);
  const userId = req.userId;

  try {
    const book = await Book.findOne({ where: { id: bookId, userId } });
    if (!book) {
      return res.status(404).json({
        status: 'Error',
        message: 'Buku tidak ditemukan atau bukan milik Anda'
      });
    }
    await book.destroy();
    return res.status(200).json({ status: 'Success', message: 'Buku berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 'Error', message: 'Gagal menghapus buku', error: error.message });
  }
};

export const getBookDetail = async (req, res) => {
  const bookId = Number(req.params.id)
  if (isNaN(bookId)) {
    return res
      .status(400)
      .json({ status: 'Error', message: 'ID buku tidak valid' })
  }

  try {
    const book = await Book.findByPk(bookId, {
      include: {
        model: User,
        as: 'owner',
        attributes: ['id', 'username', 'email', 'avatarUrl']
      }
    })
    if (!book) {
      return res
        .status(404)
        .json({ status: 'Error', message: 'Buku tidak ditemukan' })
    }
    return res
      .status(200)
      .json({ status: 'Success', data: book })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ status: 'Error', message: 'Gagal mengambil detail buku', error: error.message })
  }
}

/**
 * GET /books/me
 * Ambil buku milik user yg login
 */
export const getMyBooks = async (req, res) => {
  // pastikan userId selalu number
  const userId = Number(req.userId)
  if (isNaN(userId)) {
    return res
      .status(400)
      .json({ status: 'Error', message: 'User ID tidak valid' })
  }

  try {
    const books = await Book.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    })
    return res
      .status(200)
      .json({ status: 'Success', data: books })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ status: 'Error', message: 'Gagal mengambil buku Anda', error: error.message })
  }
}