import serviceService from './service.service.js';

export const serviceController = {
  async createService(req, res) {
    try {
      const result = await serviceService.createService(req.user._id, req.body);
      if (!result.success) return res.status(400).json(result);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async getService(req, res) {
    try {
      const { id } = req.params;
      const result = await serviceService.getServiceById(id);
      if (!result.success) return res.status(404).json(result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async getServiceBySlug(req, res) {
    try {
      const { slug } = req.params;
      const result = await serviceService.getServiceBySlug(slug);
      if (!result.success) return res.status(404).json(result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async getServices(req, res) {
    try {
      const filters = {
        page: req.query.page || 1,
        limit: req.query.limit || 12,
        sort: req.query.sort || '-createdAt',
        serviceType: req.query.type,
        owner: req.query.owner,
        search: req.query.search
      };
      const result = await serviceService.getServices(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async getMyServices(req, res) {
    try {
      const result = await serviceService.getUserServices(req.user._id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async updateService(req, res) {
    try {
      const { id } = req.params;
      const result = await serviceService.updateService(id, req.user._id, req.body);
      if (!result.success) return res.status(400).json(result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async deleteService(req, res) {
    try {
      const { id } = req.params;
      const result = await serviceService.deleteService(id, req.user._id);
      if (!result.success) return res.status(400).json(result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async extendService(req, res) {
    try {
      const { id } = req.params;
      const { days } = req.body;
      const result = await serviceService.extendService(id, req.user._id, days);
      if (!result.success) return res.status(400).json(result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async joinService(req, res) {
    try {
      const { id } = req.params;
      const result = await serviceService.joinService(id, req.user._id);
      if (!result.success) return res.status(400).json(result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async leaveService(req, res) {
    try {
      const { id } = req.params;
      const result = await serviceService.leaveService(id, req.user._id);
      if (!result.success) return res.status(400).json(result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
