function validateProduct(req, res, next) {
  const { name, price } = req.body;

  if (typeof name !== "string" || name.trim().length < 3) {
    return res.status(400).json({
      message: "Product name must contain at least 3 characters.",
    });
  }

  if (
    price === undefined ||
    price === null ||
    price === "" ||
    !Number.isFinite(Number(price)) ||
    Number(price) <= 0
  ) {
    return res.status(400).json({
      message: "Price must be a valid positive number.",
    });
  }

  next();
}

module.exports = validateProduct;