/**
 * Converts response data to a general format for REST API responses.
 * @param {boolean} success - Indicates if the operation was successful.
 * @param {string} message - A descriptive message about the response.
 * @param {object} [data] - The data to include in the response (optional).
 * @returns {object} - The formatted response object.
 */
function formatResponse(success, message, data = null) {
    return {
        success,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Generates a response for a list operation with pagination.
 * @param {Array} data - The list of resources.
 * @param {number} total - The total number of resources available.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of items per page.
 * @returns {object} - The formatted response object.
 */
function listResponse(data, total, page, limit) {
    return formatResponse(true, 'Resources listed successfully.', {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit) || 0,
        items: data,
    });
}

/**
 * Generates a response for a detail operation.
 * @param {object} data - The detailed resource data.
 * @returns {object} - The formatted response object.
 */
function detailResponse(data) {
    return formatResponse(true, 'Resource retrieved successfully.', data);
}

/**
 * Generates a response for a create operation.
 * @param {object} data - The created resource data.
 * @returns {object} - The formatted response object.
 */
function createResponse(data) {
    return formatResponse(true, 'Resource created successfully.', data);
}

/**
 * Generates a response for an update operation.
 * @param {object} data - The updated resource data.
 * @returns {object} - The formatted response object.
 */
function updateResponse(data) {
    return formatResponse(true, 'Resource updated successfully.', data);
}

/**
 * Generates a response for a delete operation.
 * @returns {object} - The formatted response object.
 */
function deleteResponse() {
    return formatResponse(true, 'Resource deleted successfully.');
}

/**
 * Generates a response for a 4xx client error.
 * @param {string} message 
 * @returns {object} 
 */
function clientErrorResponse(message) {
    return formatResponse(false, message);
}

module.exports = {
    formatResponse,
    listResponse,
    detailResponse,
    createResponse,
    updateResponse,
    deleteResponse,
    clientErrorResponse,
};
