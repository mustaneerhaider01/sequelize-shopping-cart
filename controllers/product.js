const { Products, sequelize } = require("../models");

module.exports = {
  addProduct: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const {
        body: { title, price, image, description },
        currDate,
      } = req;

      const createdProduct = await Products.create(
        {
          title,
          price: parseFloat(price),
          image,
          description,
          createdAt: currDate,
          updatedAt: currDate,
        },
        { transaction },
      );

      await transaction.commit();

      res.send({
        status: 201,
        success: true,
        message: "Product created",
        data: {
          product: createdProduct,
        },
      });
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  },
  getAll: async (req, res, next) => {
    try {
      let products = await Products.findAll();

      products = products.map((product) => ({
        ...product.get({ plain: true }),
        price: parseFloat(product.price),
      }));

      res.send({
        status: 200,
        success: true,
        message: "Products fetched",
        data: {
          products,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const { productId } = req.params;

      let product = await Products.getOne(productId);

      product = {
        ...product.get({ plain: true }),
        price: parseFloat(product.price),
      };

      res.send({
        status: 200,
        success: true,
        message: "Product fetched",
        data: {
          product,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  deleteProduct: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { productId },
        currDate,
      } = req;

      const product = await Products.getOne(productId, transaction);

      await product.update(
        {
          archived: true,
          updatedAt: currDate,
        },
        { transaction },
      );

      await transaction.commit();

      res.send({
        status: 200,
        success: true,
        message: "Product deleted",
      });
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  },
};
