// utils/pagination.js

function getPaginationParams(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    return { skip, limit, page };
}

async function getPaginatedResults(Model, req, populateFields = []) {
    const { skip, limit, page } = getPaginationParams(req);

    try {
        let query = Model.find().skip(skip).limit(limit);
        populateFields.forEach(field => {
            query = query.populate(field);
        });

        const results = await query.exec();
        const totalItems = await Model.countDocuments();

        return {
            results,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        };
    } catch (err) {
        throw new Error(`Error fetching paginated results: ${err.message}`);
    }
}
module.exports = { getPaginatedResults };
