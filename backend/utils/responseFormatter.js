// Response Formatter
const formatSuccess = (data, message = null, meta = null) => {
  const response = {
    success: true,
    data
  };
  
  if (message) response.message = message;
  if (meta) response.meta = meta;
  
  return response;
};

const formatError = (error, statusCode = 500) => {
  return {
    success: false,
    error: error.message || 'حدث خطأ',
    statusCode
  };
};

const formatPaginated = (data, pagination) => {
  return {
    success: true,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 20)),
      hasNext: (pagination.page || 1) < Math.ceil((pagination.total || 0) / (pagination.limit || 20)),
      hasPrev: (pagination.page || 1) > 1
    }
  };
};

module.exports = {
  formatSuccess,
  formatError,
  formatPaginated
};
