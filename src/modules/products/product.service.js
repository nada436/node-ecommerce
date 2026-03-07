import Product from "./product.model.js";
import productValidation from "./product.validation.js";
import { Category } from "../categories/category.model.js";
const getAllProducts = async (req, res) => {
  const {
    name,
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    page = 1,
    limit = 10,
  } = req.query;
  let skip = (page - 1) * limit;

  const filter = {};
  if (name) filter.name = { $regex: name, $options: "i" };
  if (categoryId) filter.categoryId = categoryId;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);

  if (inStock === "true") {
    filter.stock = { $gt: 0 };
  }
  const products = await Product.find(filter)
    .populate("categoryId", "category_name category_description")
    .skip(Number(skip))
    .limit(Number(limit));
  const total = await Product.countDocuments(filter);
  if (products.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No products found at the moment",
    });
  }
  res.status(200).json({
    status: "success",
    page: Number(page),
    results: products.length,
    totalProducts: total,
    message: "Products retrieved successfully",
    data: {
      products,
    },
  });
};

const createProduct = async (req, res) => {
  const validatedData = productValidation.parse(req.body);
  const {
    name,
    description,
    price,
    categoryId,
    stock = 0,
    image = "",
  } = validatedData;

  const categoryExists = await Category.findById(validatedData.categoryId);
  if (!categoryExists)
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid categoryId" });
  const product = await Product.create({
    name,
    description,
    price,
    categoryId,
    stock,
    image,
  });

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: { product },
  });
};

const updateProduct = async (req, res) => {
  const updateSchema = productValidation.partial();
  const validatedUpdates = updateSchema.parse(req.body);

  const { id } = req.params;
  const updates = validatedUpdates;

  const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
    projection: { __v: 0 },
  });

  if (!updatedProduct) {
    return res.status(404).json({
      status: "fail",
      message: "No product found with this ID",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: { updatedProduct },
  });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete({ _id: id });

  if (!deletedProduct) {
    return res.status(404).json({
      status: "fail",
      message: "No product found with this ID",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: { deletedProduct },
  });
};

export { getAllProducts, createProduct, updateProduct, deleteProduct };
