// Query Optimization Helpers
// Improve database query performance

const mongoose = require('mongoose');

// Optimize query with select, lean, and pagination
const optimizeQuery = (query, options = {}) => {
  const {
    select = '',
    lean = true,
    populate = [],
    page = 1,
    limit = 20,
    sort = { createdAt: -1 }
  } = options;

  // Apply select
  if (select) {
    query = query.select(select);
  }

  // Use lean for better performance (no Mongoose documents)
  if (lean) {
    query = query.lean();
  }

  // Apply populate
  if (populate.length > 0) {
    populate.forEach(p => {
      if (typeof p === 'string') {
        query = query.populate(p);
      } else {
        query = query.populate(p.path, p.select);
      }
    });
  }

  // Apply pagination
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // Apply sort
  query = query.sort(sort);

  return query;
};

// Batch operations for better performance
const batchOperation = async (Model, items, operation = 'create') => {
  const batchSize = 100;
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    switch (operation) {
      case 'create':
        const created = await Model.insertMany(batch, { ordered: false });
        results.push(...created);
        break;
      case 'update':
        await Model.updateMany(
          { _id: { $in: batch.map(b => b._id) } },
          { $set: batch[0] },
          { ordered: false }
        );
        break;
    }
  }

  return results;
};

// Aggregation pipeline for complex queries
const buildAggregationPipeline = (match, sort = {}, project = {}) => {
  const pipeline = [];

  // Match stage
  if (Object.keys(match).length > 0) {
    pipeline.push({ $match: match });
  }

  // Sort stage
  if (Object.keys(sort).length > 0) {
    pipeline.push({ $sort: sort });
  }

  // Project stage
  if (Object.keys(project).length > 0) {
    pipeline.push({ $project: project });
  }

  return pipeline;
};

// Use explain() to analyze query performance
const explainQuery = async (Model, query) => {
  return query.explain('executionStats');
};

module.exports = {
  optimizeQuery,
  batchOperation,
  buildAggregationPipeline,
  explainQuery
};