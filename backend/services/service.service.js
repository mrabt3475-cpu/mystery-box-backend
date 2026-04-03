const Service = require('../models/Service.model');
const User = require('../models/user.model');
const crypto = require('crypto');

class ServiceService {
  // Create a new service (group/channel/bot)
  async createService(ownerId, data) {
    const { name, description, serviceType, cost, pointsRequired, joinMode, settings } = data;

    if (!['group', 'channel', 'bot'].includes(serviceType)) {
      throw new Error('Invalid service type');
    }

    const defaultCosts = { group: 100, channel: 150, bot: 200 };
    const serviceCost = cost || defaultCosts[serviceType];
    const inviteLink = crypto.randomBytes(16).toString('hex');

    const service = await Service.create({
      name, description, serviceType, owner: ownerId,
      cost: serviceCost,
      pointsRequired: pointsRequired || 0,
      joinMode: joinMode || 'free',
      inviteLink,
      settings: settings || this.getDefaultSettings(serviceType),
      members: [{ user: ownerId, role: 'owner' }]
    });

    return service;
  }

  getDefaultSettings(serviceType) {
    const base = { allowChat: true, allowGifts: true, slowMode: false, color: '#6366f1' };
    switch (serviceType) {
      case 'group': return { ...base, welcomeMessage: '', requireApproval: false, maxMembers: 500 };
      case 'channel': return { ...base, enableDonations: true, enableLiveStream: false, allowReactions: true };
      case 'bot': return { ...base, autoReply: true, games: true, commands: ['/help', '/stats', '/balance'], welcomeMessage: 'مرحباً!' };
      default: return base;
    }
  }

  async joinService(serviceId, userId) {
    const service = await Service.findById(serviceId);
    if (!service) throw new Error('Service not found');
    if (service.status !== 'active') throw new Error('Service is not active');

    const isMember = service.members.some(m => m.user.toString() === userId.toString());
    if (isMember) throw new Error('Already a member');

    const user = await User.findById(userId);
    if (service.pointsRequired > 0 && user.pointsBalance < service.pointsRequired) {
      throw new Error('Insufficient points');
    }

    if (service.pointsRequired > 0) {
      user.pointsBalance -= service.pointsRequired;
      await user.save();
    }

    service.members.push({ user: userId, role: 'member' });
    await service.save();
    return service;
  }

  async leaveService(serviceId, userId) {
    const service = await Service.findById(serviceId);
    if (!service) throw new Error('Service not found');
    if (service.owner.toString() === userId.toString()) throw new Error('Owner cannot leave');

    service.members = service.members.filter(m => m.user.toString() !== userId.toString());
    await service.save();
    return service;
  }

  async getUserServices(userId) {
    return await Service.find({ 'members.user': userId })
      .populate('owner', 'name username avatar')
      .sort({ createdAt: -1 });
  }

  async getServiceById(serviceId) {
    return await Service.findById(serviceId)
      .populate('owner', 'name username avatar')
      .populate('members.user', 'name username avatar');
  }

  async getServices(filters = {}, page = 1, limit = 12) {
    const query = { status: 'active' };
    if (filters.type) query.serviceType = filters.type;
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
    return { services, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}

module.exports = new ServiceService();
