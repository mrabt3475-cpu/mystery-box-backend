/* Points Controller
const PointsService = require('./services/points.service');

export const PointsController = () => {
  // Get user points history
  getPointsHistory = async (req, res) =>try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const history = await PointsService.getPointsHistory(userId, limit);
    res.status(200).json(history);
  } catch (e) {
    res.status(500).json(error: e.message);
    }
  };

  return {
    getPointsHistory
  };
}
module.exports = PointsController;
