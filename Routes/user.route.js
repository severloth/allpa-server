const Router = require("express");

const router = Router();
const {
  createProduct,
  deleteProduct,
  getProducts,
  updateImageProduct,
  updateProduct,

} = require("../controllers/user.controller.js");

const {
  getImages,
  createImage,
  updateImage,
  deleteImage,

  } = require("../controllers/gallery-image.controller.js");

const { asureAuth } = require("../middlewares/authenticated.js");
const configureCloudinary = require("../utils/cloudinary.js");


const multipart = require("connect-multiparty");

const md_upload = multipart({ uploadDir: "./uploads" });


router.post("/login", asureAuth);

router.get("/", getProducts);
router.get("/product/:product_id", getProducts);
router.post("/create", [configureCloudinary, md_upload], createProduct);
router.patch("/update/:product_id", [configureCloudinary, md_upload] , updateProduct);
router.patch("/updateimg/:product_id/:image_id", [configureCloudinary, md_upload] , updateImageProduct);
router.delete("/delete/:product_id", [configureCloudinary], deleteProduct);


router.get("/gallery", getImages);
router.post("/gallery/create", [configureCloudinary, md_upload], createImage);
router.patch("/gallery/update/:image_id", [configureCloudinary, md_upload] , updateImage);
router.delete("/gallery/delete/:image_id", [configureCloudinary], deleteImage);


module.exports = router;
