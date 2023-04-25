const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

// createProduct
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

// getAllProducts
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

// getSingleProduct
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate("reviews");
  if (!product)
    throw new CustomError.NotFoundError(`No prodcut with id: ${productId}`);
  res.status(StatusCodes.OK).json({ product });
};

//updateProduct
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product)
    throw new CustomError.NotFoundError(`No prodcut with id: ${productId}`);
  res.status(StatusCodes.OK).json({ product });
};
//deleteProduct
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });
  if (!product)
    throw new CustomError.NotFoundError(`No prodcut with id: ${productId}`);
  await product.remove();

  res.status(StatusCodes.OK).json({ msg: "Product deleted successfully" });
};

//uploadImage
const uploadImage = async (req, res) => {
  if (!req.files) throw new CustomError.BadRequestError("No image uploaded");
  const productImages = req.files?.image;
  const uploadPath = path.join(__dirname, "../public/uploads/");
  const timestamp = Date.now();
  let imagePath = null;
  const maxSize = 1024 * 1024;
  const results = [];

  if (!Array.isArray(productImages)) {
    if (!productImages.mimetype.startsWith("image"))
      throw new CustomError.BadRequestError("Please upload an Image");

    if (productImages.size > maxSize)
      throw new CustomError.BadRequestError(
        "Please upload image smaller than 1MB"
      );

    imagePath = path.join(uploadPath, `${timestamp} ${productImages.name}`);

    await productImages.mv(imagePath);
    const result = `/uploads/${productImages.name}`;
    results.push(result);
  }

  if (Array.isArray(productImages)) {
    const moveFiles = productImages.map(async (productImage) => {
      if (!productImage.mimetype.startsWith("image"))
        throw new CustomError.BadRequestError(
          "One of the files uploaded is not an Image"
        );

      if (productImage.size > maxSize)
        throw new CustomError.BadRequestError(
          "One of the files uploaded is larger than 1MB"
        );

      imagePath = path.join(uploadPath, `${timestamp} ${productImage.name}`);
      await productImage.mv(imagePath);
      const result = `/uploads/${productImage.name}`;
      results.push(result);
    });
    await Promise.all(moveFiles);
  }
  res.status(StatusCodes.OK).json({ images: results });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
