/* Box Controller
const BoxService = require('./services/box.service');

const BoxController = () => {
  // Get all boxes
  getAllBoxs = async (req, res) ={try {
    const boxes = await BoxService.getAllBoxes();
    res.status(200).json(boxes);
  } catch (e) {
    res.status(500).json(error: e.message);
    }
  };

  // Get box by id
  getBoxById = async (req, res) =>try {
    const { boxId } = req.params;
    const box = await BoxService.getBoxById(boxId);
    if (box.error) {
      return res.status(400).json(box);
    }
    res.status(200).json(box);
  } catch (e) {
    res.status(500).json(error: e.message);
    }
  };

  // Open box (free with points)
  openBox = async (req, res) {try {
    const userId = req.user.id;
    const { boxId } = req.body;

    if (!userId || !boxId) {
      return res.status(401).json({error:'Unknown to authenticate'});
    }

    const result = await BoxService.openBox(userId, boxId);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(error: e.message);
    }
  };

  // Get user box history
  getBoxHistory = async (req, res) {try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const history = await BoxService.getBoxHistory(userId, limit);
    res.status(200).json(history);
  } catch (e) {
    res.status(500).json(error: e.message);
    }
  };

  // Get box prices in points
  getBoxPrices = async (req, res) =>try {
    const prices = await BoxService.getBoxPrices();
    res.status(200).json(prices);
  } catch (e) {
    res.status(500).json(error: e.message);
    }
  };

  return {
    getAllBoxs,
    getBoxById,
    openBox,
    getBoxHistory,
    getBoxPrices
  };
}
module.exports = BoxController;
