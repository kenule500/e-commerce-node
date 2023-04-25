const Review = require("../models/Review");
const Product = require("..//models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

// Create Review
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProd = await Product.findOne({ _id: productId });
  if (!isValidProd)
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);

  const isReviewSubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (isReviewSubmitted)
    throw new CustomError.BadRequestError(
      `Already submitted reviews for this product`
    );
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

// Get all Review
const getAllReview = async (req, res) => {
  const review = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });

  res.status(StatusCodes.OK).json({ review, count: review.length });
};

// Single Review
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId }).populate({
    path: "product",
    select: "name company price",
  });

  if (!review)
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  res.status(StatusCodes.OK).json({ review });
};

// Update Review
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review)
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

// delete Review
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review)
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);

  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Success!, review removed" });
};

// Get Single Product Reviews
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
