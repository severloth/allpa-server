const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const bcrypt = require("bcrypt-nodejs");
const Product = require("../models/Product.js");

const getProducts = async (req, res) => {
  if (req.params.product_id) {
    const product = await Product.findById(req.params.product_id);
    res.status(200).json( product );
  }else{

 
  const Products = await Product.find();
  res.status(200).json( Products );
}
};
/*  */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let images = req.files.images;

    if (!Array.isArray(images)) {
      images = [images];
    }

    const uploadPromises = images.map(async (image) => {
      try {
        const result = await cloudinary.v2.uploader.upload(image.path);
        return { public_id: result.public_id, secure_url: result.secure_url };
      } catch (uploadError) {
        console.error("Error al subir imagen a Cloudinary:", uploadError);
        throw uploadError;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Elimina archivos temporales después de subir a Cloudinary
    images.forEach((image) => {
      fs.unlink(image.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error al eliminar archivo local:", unlinkError);
        }
      });
    });

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images: uploadedImages,
    });

    await newProduct.save();

    res.status(200).json({ message: "Producto creado correctamente", ok: true });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ message: "Error interno del servidor", ok: false });
  }
};

const updateImageProduct = async (req, res) => {
  try {
    const { product_id, image_id } = req.params;
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado", ok: false });
    }

    const { images } = req.files;
    const public_ids = product.images.map((image) => image.public_id);
    const imageFiltered = product.images.find((image) => image._id == image_id);
    const img = {};
 

    await cloudinary.v2.api.delete_resources(imageFiltered.public_id);
    await cloudinary.v2.uploader.upload(images.path, (error, result) => {
      if (error) {
        console.error("Error al subir imagen a Cloudinary:", error);
        throw error;
      }
      console.log(result);
      img.public_id = result.public_id;
      img.secure_url = result.secure_url;
      fs.unlink(images.path);
    
    

    });
 

    //save product
    await Product.findByIdAndUpdate(
      product_id,
      { images: img },
      { new: true }
    );
    res.status(200).json({ message: "Producto actualizado correctamente", ok: true });
  
    
   } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor", ok: false });
   }
 };

const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado", ok: false });
    }

    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });

    await product.save();

    res.status(200).json({ message: "Producto actualizado correctamente", ok: true });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor", ok: false });
  }
};


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
  updateImageProduct,
  updateProduct,
};
