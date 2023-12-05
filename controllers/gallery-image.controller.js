const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const bcrypt = require("bcrypt-nodejs");
const GalleryImage = require("../models/GalleryImage.js");

const getImages = async (req, res) => {
    const GalleryImages = await GalleryImage.find();
    res.status(200).json( GalleryImages );
    };
/*  */
const createImage = async (req, res) => {
  const { description } = req.body;
  const { image } = req.files;
   const result = await cloudinary.v2.uploader.upload(image.path);
   const newGalleryImage = new GalleryImage({
     description,
     public_id: result.public_id,
     image: result.secure_url,
   });
  
  fs.unlink(image.path);
  await newGalleryImage.save();
  console.log(req.files);
  res.status(200).json({ message: "Imagen creada correctamente", ok: true });
};

const updateImage= async (req, res) => {

  const { image_id } = req.params;
  const galleryImage = await GalleryImage.findById(image_id);
  const { image } = req.files;
  if (image) {
    await cloudinary.v2.api.delete_resources(galleryImage.public_id);
    const result = await cloudinary.v2.uploader.upload(image.path);
    galleryImage.public_id = result.public_id;
    galleryImage.image = result.secure_url;
    fs.unlink(image.path);
  }

  Object.keys(req.body).forEach((key) => {
    product[key] = req.body[key];
  });

  await galleryImage.save();
  res
    .status(200)
    .json({ message: "Imagen actualizada correctamente", ok: true });
   
}

const deleteImage = async (req, res) => {
    const { image_id } = req.params;
    const image = await GalleryImage.findById(image_id);
    console.log(image);
    await cloudinary.v2.api.delete_resources(image.public_id);

    await GalleryImage.findByIdAndDelete(image_id);
      res
      .status(200)
      .json({ message: "Imagen eliminada correctamente", ok: true });

};
/*  */


module.exports = {
  createImage,
  getImages,
  deleteImage,
  updateImage,
};
