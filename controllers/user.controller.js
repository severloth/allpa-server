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
    const { name, description, price, category, color, nameEnglish, descriptionEnglish, categoryEnglish, colorEnglish } = req.body;
    let images = req.files.images;
    console.log(images);

    const uploadedImages = [];

    // Sube las imágenes a Cloudinary
    console.log(images);
    if(images){
      if (!Array.isArray(images)) {
        images = [images];
      }

    /* const uploadPromises = images.map(async (image) => {
      try {
        const result = await cloudinary.v2.uploader.upload(image.path);
        return { public_id: result.public_id, secure_url: result.secure_url };
      } catch (uploadError) {
        console.error("Error al subir imagen a Cloudinary:", uploadError);
        throw uploadError;
      } 
    });


    uploadedImages = await Promise.all(uploadPromises);

    // Elimina archivos temporales después de subir a Cloudinary
    console.time("Eliminación de archivos locales");
    images.forEach((image) => {
      fs.unlink(image.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error al eliminar archivo local:", unlinkError);
        }
      });
    });
    console.timeEnd("Eliminación de archivos locales"); */

  }


    
    
    console.time("Creación de producto");
    const newProduct = new Product({
      productId: new Date().getTime(),
      name,
      description,
      price,
      category,
      images: images,
      color,
      nameEnglish,
      descriptionEnglish,
      categoryEnglish,
      colorEnglish,
    });

    await newProduct.save();
    console.timeEnd("Creación de producto");

    res.status(200).json({ message: "Producto creado correctamente", ok: true });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ message: "Error interno del servidor", ok: false });
  }
};

const updateImageProduct = async (req, res) => {
  try {
    const { product_id, image_id } = req.params;
    const { imageUnit } = req.files;
    const product = await Product.findById(product_id);
    console.log("Hay que actualizar la imagen");
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado", ok: false });
    }
    const imageFiltered = product.images.find((image) => image._id == image_id);
    console.log(imageFiltered);
     if(imageUnit){
        await cloudinary.v2.api.delete_resources(imageFiltered.public_id);
        const public =  await cloudinary.v2.uploader.upload(imageUnit.path);
        product.images = product.images.map((image) => {
          if (image._id == image_id) { 
            image.public_id = public.public_id;
            image.secure_url = public.secure_url;
          }
          return image;
        });
        fs.unlink(imageUnit.path);
        
        await product.save();
        res.status(200).json({ message: "Imagen actualizada correctamente", ok: true });
      
  
     } else{
       res.status(500).json({ message: "Error interno del servidor", ok: false });
  
     }
    const img = {};
 
  
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

    for (const image of product.images) {
      if(image.public_id){
      await cloudinary.v2.api.delete_resources(image.public_id);
      }
      else if(image.path){
        const path = image.path;

        fs.unlinkSync(path);
      }

    }


    await Product.findByIdAndDelete(product_id);
      res
      .status(200)
      .json({ message: "Producto eliminado correctamente", ok: true });

};

const createImg = async (req, res) =>{ 
  const { product_id } = req.params;
  const product = await Product.findById(product_id);
  const { imageUnit }  = req.files;

  if(imageUnit){
    const public =  await cloudinary.v2.uploader.upload(imageUnit.path);
    const img = {};
    img.public_id = public.public_id;
    img.secure_url = public.secure_url;
    fs.unlink(imageUnit.path);
    product.images.push(img);
    await product.save();
    res.status(200).json({ message: "Imagen creada correctamente", ok: true });

  } else{
    res.status(500).json({ message: "Error interno del servidor", ok: false });

  }


    

}
/*  */


module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateImageProduct,
  updateProduct,
  createImg,
};
