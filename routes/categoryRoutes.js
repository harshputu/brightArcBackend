const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.put("/:urlKey", categoryController.updateCategory);
router.delete("/:categoryName", categoryController.deleteCategoryByName);

module.exports = router;