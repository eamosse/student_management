// utils/pagination.js

function getPaginationParams(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    return { skip, limit, page };
}

async function getPaginatedResults(Model, req) {
    const { skip, limit, page } = getPaginationParams(req);

    try {
        // Récupère les éléments paginés
        const results = await Model.find()
            .skip(skip)
            .limit(limit)
            .exec();

        // Récupère le nombre total d'éléments pour le calcul des pages
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
