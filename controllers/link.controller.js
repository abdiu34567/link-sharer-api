const Link = require("../models/link.model");

// @desc    Create a new link
// @route   POST /api/links
exports.createLink = async (req, res) => {
  try {
    const { url, title, description, tags } = req.body;

    if (!url || !title) {
      return res.status(400).json({ message: "URL and Title are required" });
    }

    const newLink = new Link({
      url,
      title,
      description,
      tags,
    });

    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all links, with search and filtering
// @route   GET /api/links
// exports.getLinks = async (req, res) => {
//   try {
//     const { search, domain } = req.query;
//     let query = {};

//     // If a search term is provided, look in title, description, and tags
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: "i" } }, // 'i' for case-insensitive
//         { description: { $regex: search, $options: "i" } },
//         { tags: { $regex: search, $options: "i" } },
//         { url: { $regex: search, $options: "i" } },
//       ];
//     }

//     // If a domain is provided, add it to the query
//     if (domain) {
//       query.domain = domain;
//     }

//     const links = await Link.find(query).sort({ createdAt: -1 }); // Newest first
//     res.status(200).json(links);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// @desc    Get all links, with search, filtering, and pagination
// @route   GET /api/links
exports.getLinks = async (req, res) => {
  try {
    const { search, domain, page = 1, limit = 25 } = req.query; // Default to page 1, 25 items
    let query = {};

    // Build search/filter query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { url: { $regex: search, $options: "i" } },
      ];
    }
    if (domain) {
      query.domain = domain;
    }

    // Get the total number of documents that match the query
    const totalLinks = await Link.countDocuments(query);

    // Find the links for the current page
    const links = await Link.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1) // Ensure limit is a number
      .skip((page - 1) * limit) // The core of pagination
      .exec();

    // Send back the data along with pagination info
    res.status(200).json({
      links,
      totalPages: Math.ceil(totalLinks / limit),
      currentPage: parseInt(page),
      totalLinks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a link by ID
// @route   DELETE /api/links/:id
exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    await link.remove();
    res.status(200).json({ message: "Link removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
