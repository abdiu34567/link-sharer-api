const mongoose = require("mongoose");
const { URL } = require("url");

const LinkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String], // An array of strings
      default: [],
    },
    // This will be automatically generated!
    domain: {
      type: String,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Mongoose "pre-save hook" to automatically extract the domain before saving
LinkSchema.pre("save", function (next) {
  if (this.isModified("url")) {
    try {
      const parsedUrl = new URL(this.url);
      this.domain = parsedUrl.hostname.replace("www.", ""); // e.g., 'docs.google.com' or 'figma.com'
    } catch (error) {
      // Handle invalid URL if necessary, or let validation catch it
      console.error("Invalid URL for domain extraction:", this.url);
    }
  }
  next();
});

const Link = mongoose.model("Link", LinkSchema);

module.exports = Link;
