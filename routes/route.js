const controller = require("../controllers/auth_controller");
const middleware = require("../middleware/auth_middleware");
const router = require("express").Router();


router.post("/auth/register", controller.register);
router.post("/auth/login", controller.login);

// Use middleware authentication
router.use(middleware.auth)

router.post("/me/:id", controller.getProfile);
router.post("/edit-profile/:id", controller.updateProfile);

module.exports = router;