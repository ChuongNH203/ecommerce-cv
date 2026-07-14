const { Op } = require('sequelize');

/**
 * Converts request query parameters to a general format for pagination responses.
 * @param {object} req - The Express request object.
 * @returns {object} - The formatted pagination object.
 */
exports.parsePagination = (req) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };
};


exports.parseFilter = (req, opts = null) => {
    opts = {
        search_keys: [],
        filter_keys: [],
        ...opts
    }
    const filter = {};
    if (opts.search_keys){
        const search = req.query.search || null;
        if (search) {
            opts.search_keys.forEach((key) => {
                filter[key] = {
                    [Op.like]: `%${search}%`
                };
            });
        }
    } 
    if (opts.filter_keys){
        opts.filter_keys.forEach((key) => {
            const value = req.query[key] || null;
            if (value) filter[key] = value;
        });
    }
    return filter;
};