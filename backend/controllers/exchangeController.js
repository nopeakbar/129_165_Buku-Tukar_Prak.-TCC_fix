import Exchange from '../models/Exchange.js';
import Book     from '../models/Book.js';
import User     from '../models/User.js';

/**
 * POST /exchanges
 * Buat permintaan tukar buku
 */
export const requestExchange = async (req, res) => {
  const requesterId    = req.userId;
  const { offeredBookId, requestedBookId, messages, location, meetingDatetime } = req.body;

  try {
    console.log('📤 Creating exchange request:', {
      requesterId,
      offeredBookId,
      requestedBookId,
      messages,
      location,
      meetingDatetime
    });

    // verifikasi buku yang ditawarkan milik requester
    const offeredBook = await Book.findOne({
      where: { id: offeredBookId, userId: requesterId }
    });
    if (!offeredBook) {
      return res.status(400).json({
        status: 'Error',
        message: 'Buku yang ditawarkan tidak ditemukan atau bukan milik Anda'
      });
    }

    // verifikasi buku diminta ada & ambil owner
    const requestedBook = await Book.findByPk(requestedBookId);
    if (!requestedBook) {
      return res.status(400).json({
        status: 'Error',
        message: 'Buku yang diminta tidak ditemukan'
      });
    }
    const ownerId = requestedBook.userId;

    const exchange = await Exchange.create({
      requesterId,
      ownerId,
      offeredBookId,
      requestedBookId,
      messages: messages || null,
      location: location || null,
      meetingDatetime: meetingDatetime || null,
      status: 'pending'
    });

    console.log('✅ Exchange created:', exchange.id);

    return res.status(201).json({
      status: 'Success',
      message: 'Permintaan tukar berhasil dibuat',
      data: exchange
    });
  } catch (error) {
    console.error('❌ Exchange creation error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal membuat permintaan tukar',
      error: error.message
    });
  }
};

/**
 * GET /exchanges/received
 * Ambil semua request masuk (pending) untuk buku user
 */
export const getReceivedExchanges = async (req, res) => {
  const ownerId = req.userId;
  
  try {
    console.log('📥 Fetching received exchanges for user:', ownerId);

    // First, get exchanges with basic info
    const exchanges = await Exchange.findAll({
      where: { ownerId, status: 'pending' },
      order: [['createdAt', 'DESC']]
    });

    console.log('📊 Found exchanges:', exchanges.length);

    // If no exchanges, return empty array
    if (exchanges.length === 0) {
      return res.status(200).json({ 
        status: 'Success', 
        data: [] 
      });
    }

    // Manually fetch related data to avoid JOIN issues
    const enrichedExchanges = await Promise.all(
      exchanges.map(async (exchange) => {
        try {
          // Get offered book
          const offeredBook = await Book.findByPk(exchange.offeredBookId);
          
          // Get requested book  
          const requestedBook = await Book.findByPk(exchange.requestedBookId);
          
          // Get requester info
          const requester = await User.findByPk(exchange.requesterId, {
            attributes: ['id', 'username', 'avatarUrl']
          });

          return {
            ...exchange.toJSON(),
            offeredBook: offeredBook ? offeredBook.toJSON() : null,
            requestedBook: requestedBook ? requestedBook.toJSON() : null,
            requester: requester ? requester.toJSON() : null
          };
        } catch (err) {
          console.error('Error enriching exchange:', err);
          return exchange.toJSON();
        }
      })
    );

    return res.status(200).json({ 
      status: 'Success', 
      data: enrichedExchanges 
    });

  } catch (error) {
    console.error('❌ Get received exchanges error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengambil permintaan tukar masuk',
      error: error.message
    });
  }
};

/**
 * GET /exchanges/sent
 * Ambil semua request yang dibuat user (sudah atau belum diproses)
 */
export const getMyExchangeRequests = async (req, res) => {
  const requesterId = req.userId;
  
  try {
    console.log('📤 Fetching sent exchanges for user:', requesterId);

    // Get exchanges
    const exchanges = await Exchange.findAll({
      where: { requesterId },
      order: [['createdAt', 'DESC']]
    });

    console.log('📊 Found sent exchanges:', exchanges.length);

    if (exchanges.length === 0) {
      return res.status(200).json({ 
        status: 'Success', 
        data: [] 
      });
    }

    // Manually fetch related data
    const enrichedExchanges = await Promise.all(
      exchanges.map(async (exchange) => {
        try {
          const offeredBook = await Book.findByPk(exchange.offeredBookId);
          const requestedBook = await Book.findByPk(exchange.requestedBookId);
          const owner = await User.findByPk(exchange.ownerId, {
            attributes: ['id', 'username', 'avatarUrl']
          });

          return {
            ...exchange.toJSON(),
            offeredBook: offeredBook ? offeredBook.toJSON() : null,
            requestedBook: requestedBook ? requestedBook.toJSON() : null,
            owner: owner ? owner.toJSON() : null
          };
        } catch (err) {
          console.error('Error enriching sent exchange:', err);
          return exchange.toJSON();
        }
      })
    );

    return res.status(200).json({ 
      status: 'Success', 
      data: enrichedExchanges 
    });

  } catch (error) {
    console.error('❌ Get sent exchanges error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengambil permintaan tukar Anda',
      error: error.message
    });
  }
};

/**
 * PUT /exchanges/:id
 * Update status permintaan tukar (accept/decline)
 */
export const updateExchangeStatus = async (req, res) => {
  const exchangeId = Number(req.params.id);
  const userId     = req.userId;
  const { status } = req.body;

  console.log('🔄 Updating exchange status:', { exchangeId, userId, status });

  if (!['accepted','declined'].includes(status)) {
    return res.status(400).json({
      status: 'Error',
      message: "Status harus 'accepted' atau 'declined'"
    });
  }

  try {
    const exchange = await Exchange.findByPk(exchangeId);
    if (!exchange) {
      return res.status(404).json({ 
        status: 'Error', 
        message: 'Permintaan tukar tidak ditemukan' 
      });
    }
    
    if (exchange.ownerId !== userId) {
      return res.status(403).json({ 
        status: 'Error', 
        message: 'Anda tidak berhak mengubah status ini' 
      });
    }

    exchange.status = status;
    await exchange.save();

    console.log('✅ Exchange status updated:', exchangeId, status);

    return res.status(200).json({
      status: 'Success',
      message: 'Status permintaan tukar berhasil diupdate',
      data: exchange
    });
  } catch (error) {
    console.error('❌ Update exchange status error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengupdate status tukar',
      error: error.message
    });
  }
};