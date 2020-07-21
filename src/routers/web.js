const { Router } = require("express");
const multer = require("multer");
const checkLogin = require("../apps/middlewares/check-login");
const checkLogout = require("../apps/middlewares/check-logout");
const Joi = require("@hapi/joi");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "/tmp");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  }),
});

const {
  AdminController,
  ProductController,
  ClientController,
  AjaxController,
} = require("../apps/controllers");
const { func } = require("@hapi/joi");
const router = Router();

router
  .route("/login")
  .get(checkLogin, AdminController.login)
  .post(checkLogin, AdminController.postLogin);

router.get("/logout", AdminController.logout);

router.use("/admin", checkLogout);
router.get("/admin/dashboard", AdminController.dashboard);
router
  .route("/admin/products/edit/:id")
  .get(ProductController.edit)
  .post(upload.single("prd_image"), ProductController.update);

router.get("/admin/products", ProductController.index);
router.get("/admin/products/delete/:id", ProductController.destroy);
router
  .route("/admin/products/add")
  .get(ProductController.add)
  .post(upload.single("prd_image"), ProductController.store);

router.get("/", ClientController.home);
router.get("/cart", ClientController.cart);
router.get("/product-detail-:id", ClientController.productDetail);
router.post("/product-detail-:id/comments", ClientController.addComment);
router.get("/category-:id", ClientController.category);

router.post("/add-to-cart", ClientController.addToCart);

router.post("/ajax/get-comment-product", AjaxController.getComemntForProduct);
router.post("/ajax/update-cart", AjaxController.updateCart);
router.post("/ajax/delete-cart", AjaxController.deleteCart);

router.post("/cart/order", ClientController.order);
router.post("/cart/order-success", ClientController.orderSuccess);

router.get("/search", ClientController.search);

router.get("/error", async function (req, res, next) {
  const bodySchema = Joi.object({
    a: Joi.string().required(),
  });
  try {
    const value = await bodySchema.validateAsync({ a: "10" });

    if (value.a !== 10) {
      throw new Error("a is not aqua 10");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
