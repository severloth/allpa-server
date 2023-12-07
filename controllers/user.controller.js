const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const bcrypt = require("bcrypt-nodejs");
const Product = require("../models/Product.js");

const getProducts = async (req, res) => {
  const Products = await Product.find();
  res.status(200).json( Products );
};
/*  */
const createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const { image } = req.files;
   const result = await cloudinary.v2.uploader.upload(image.path);
   const newProduct = new Product({
     name,
     description,
     price,
     category,
     public_id: result.public_id,
     image: result.secure_url,
   });
  
 
  await newProduct.save();
  fs.unlink(image.path);
  console.log(req.files);
  res.status(200).json({ message: "Producto creado correctamente", ok: true });
};

const updateProduct= async (req, res) => {

  const { product_id } = req.params;
  const product = await Product.findById(product_id);
  const { image } = req.files;
  if (image) {
    await cloudinary.v2.api.delete_resources(product.public_id);
    const result = await cloudinary.v2.uploader.upload(image.path);
    product.public_id = result.public_id;
    product.image = result.secure_url;

  }

  Object.keys(req.body).forEach((key) => {
    product[key] = req.body[key];
  });

  await product.save();
  fs.unlink(image.path);
  res
    .status(200)
    .json({ message: "Producto actualizado correctamente", ok: true });
   
}

const deleteProduct = async (req, res) => {
    const { product_id } = req.params;
    const product = await Product.findById(product_id);
    console.log(product);
    await cloudinary.v2.api.delete_resources(product.public_id);

    await Product.findByIdAndDelete(product_id);
      res
      .status(200)
      .json({ message: "Producto eliminado correctamente", ok: true });

};
/*  */


module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
};
