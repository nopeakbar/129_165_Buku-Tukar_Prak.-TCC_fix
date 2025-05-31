import ExchangeHistory from '../models/ExchangeHistory.js';
import Exchange        from '../models/Exchange.js';

/**
 * POST /exchanges/history
 * Tambah entri history dan tandai exchange sebagai completed
 */
export const addExchangeHistory = async (req, res) => {
  const { exchangeRequestId } = req.body;
  
  try {
    console.log('📚 Adding exchange to history:', exchangeRequestId);

    const exchange = await Exchange.findByPk(exchangeRequestId);
    if (!exchange) {
      return res.status(404).json({
        status: 'Error',
        message: 'Exchange request tidak ditemukan'
      });
    }

    const history = await ExchangeHistory.create({
      exchangeRequestId,
      completed_at: new Date()
    });

    exchange.status = 'completed';
    await exchange.save();

    console.log('✅ Exchange added to history:', history.id);

    return res.status(201).json({
      status: 'Success',
      message: 'Exchange berhasil diselesaikan dan dicatat di history',
      data: history
    });
  } catch (error) {
    console.error('❌ Add exchange history error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mencatat exchange history',
      error: error.message
    });
  }
};

/**
 * GET /exchanges/history
 * Ambil semua history
 */
export const getAllExchangeHistory = async (req, res) => {
  try {
    console.log('📚 Fetching exchange history...');

    const histories = await ExchangeHistory.findAll({
      order: [['completed_at', 'DESC']]
    });

    console.log('📊 Found history entries:', histories.length);

    if (histories.length === 0) {
      return res.status(200).json({ 
        status: 'Success', 
        data: [] 
      });
    }

    // Manually fetch related exchange data to avoid JOIN issues
    const enrichedHistories = await Promise.all(
      histories.map(async (history) => {
        try {
          const exchange = await Exchange.findByPk(history.exchangeRequestId);
          
          return {
            ...history.toJSON(),
            exchange: exchange ? {
              id: exchange.id,
              requesterId: exchange.requesterId,
              ownerId: exchange.ownerId,
              status: exchange.status
            } : null
          };
        } catch (err) {
          console.error('Error enriching history:', err);
          return history.toJSON();
        }
      })
    );

    return res.status(200).json({ 
      status: 'Success', 
      data: enrichedHistories 
    });

  } catch (error) {
    console.error('❌ Get exchange history error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengambil exchange history',
      error: error.message
    });
  }
};

/**
 * GET /exchanges/history/:id
 * Ambil 1 history by ID
 */
export const getExchangeHistoryById = async (req, res) => {
  const id = Number(req.params.id);
  
  try {
    console.log('📚 Fetching exchange history by ID:', id);

    const history = await ExchangeHistory.findByPk(id);
    
    if (!history) {
      return res.status(404).json({
        status: 'Error',
        message: 'History tidak ditemukan'
      });
    }

    // Manually fetch related exchange
    const exchange = await Exchange.findByPk(history.exchangeRequestId);

    const enrichedHistory = {
      ...history.toJSON(),
      exchange: exchange ? {
        id: exchange.id,
        requesterId: exchange.requesterId,
        ownerId: exchange.ownerId,
        status: exchange.status
      } : null
    };

    return res.status(200).json({ 
      status: 'Success', 
      data: enrichedHistory 
    });

  } catch (error) {
    console.error('❌ Get exchange history by ID error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengambil exchange history',
      error: error.message
    });
  }
};