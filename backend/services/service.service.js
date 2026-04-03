const Service = require('../models/Service.model');
const User = require('../models/user.model');
const crypto = require('crypto');

class ServiceService {
  // Create a new service
  async createService(ownerId, data) {
    const { name, description, serviceType, cost, pointsRequired, joinMode, settings } = data;

    // Validate service type
    if (!['group', 'channel', 'bot'].includes(serviceType)) {
      throw new Error('Invalid service type');
    }

    // Calculate cost based on type
    const defaultCosts = {
      group: 100,
      channel: 150,
      bot: 200
    };

    const serviceCost = cost || defaultCosts[serviceType];

    // Generate invite link
    const inviteLink = crypto.randomBytes(16).toString('hex');

    const service = await Service.create({
      name,
      description,
      serviceType,
      owner: ownerId,
      cost: serviceCost,
      pointsRequired: pointsRequired || 0,
      joinMode: joinMode || 'free',
      inviteLink,
      settings: settings || this.getDefaultSettings(serviceType),
      members: [{ user: ownerId, role: 'owner' }]
    });

    return service;
  }

  // Get default settings for each type
  getDefaultSettings(serviceType) {
    const baseSettings = {
      allowChat: true,
      allowGifts: true,
      slowMode: false,
      color: '#6366f1'
    };

    switch (serviceType) {
      case 'group':
        return {
          ...baseSettings,
          welcomeMessage: '',
          requireApproval: false,
          maxMembers: 500
        };
      case 'channel':
        return {
          ...baseSettings,
          enableDonations: true,
          enableLiveStream: false,
          allowReactions: true
        };
      case 'bot':
        return {
          ...baseSettings,
          autoReply: true,
          games: true,
          commands: ['/help', '/stats', '/balance'],
          welcomeMessage: 'مرحباً! أنا بوت جديد'
        };
      default:
        return baseSettings;
    }
  }

  // Join a service
  async joinService(serviceId, userId) {
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    if (service.status !== 'active') {
      throw new Error('Service is not active');
    }

    // Check if already member
    const isMember = service.members.some(m => m.user.toString() === userId.toString());
    if (isMember) {
      throw new Error('Already a member');
    }

    const user = await User.findById(userId);

    // Check points required
    if (service.pointsRequired > 0 && user.pointsBalance < service.pointsRequired) {
      throw new Error('Insufficient points');
    }

    // Deduct points if required
    if (service.pointsRequired > 0) {
      user.pointsBalance -= service.pointsRequired;
      await user.save();
    }

    // Add member
    service.members.push({ user: userId, role: 'member' });
    await service.save();

    return service;
  }

  // Leave a service
  async leaveService(serviceId, userId) {
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    // Check if owner
    if (service.owner.toString() === userId.toString()) {
      throw new Error('Owner cannot leave');
    }

    service.members = service.members.filter(m => m.user.toString() !== userId.toString());
    await service.save();

    return service;
  }

  // Get user's services
  async getUserServices(userId) {
    return await Service.find({ 'members.user': userId })
      .populate('owner', 'name username avatar')
      .sort({ createdAt: -1 });
  }

  // Get service by ID
  async getServiceById(serviceId) {
    return await Service.findById(serviceId)
      .populate('owner', 'name username avatar')
      .populate('members.user', 'name username avatar');
  }

  // Update service
  async updateService(serviceId, ownerId, updates) {
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    if (service.owner.toString() !== ownerId.toString()) {
      throw new Error('Not authorized');
    }

    Object.assign(service, updates);
    await service.save();

    return service;
  }

  // Delete service
  async deleteService(serviceId, ownerId) {
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    if (service.owner.toString() !== ownerId.toString()) {
      throw new Error('Not authorized');
    }

    await Service.findByIdAndDelete(serviceId);
    return true;
  }

  // Add post to service
  async addPost(serviceId, userId, content) {
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    const isMember = service.members.some(m => m.user.toString() === userId.toString());
    if (!isMember) {
      throw new Error('Not a member');
    }

    service.posts.push({
      author: userId,
      content,
      createdAt: new Date()
    });

    await service.save();
    return service;
  }

  // Get services with pagination
  async getServices(filters = {}, page = 1, limit = 12) {
    const query = { status: 'active' };
    
    if (filters.type) {
      query.serviceType = filters.type;
    }
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .populate('owner', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Service.countDocuments(query);

    return {
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new ServiceService();
