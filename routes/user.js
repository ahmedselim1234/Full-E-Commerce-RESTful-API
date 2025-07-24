const express = require("express");

const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");
const userController = require("../controllers/user");

const {
  updateME,
  createUserValidator,
  updateUserValidator,
  changeUserPassValidator,
  deleteUserValidator,
  getUserValidator,
  changeMyPassword,
} = require("../util/userValidation");

const router = express.Router();

// --------------------------------------
// Logged-in User Routes
// --------------------------------------
router.use(requireAuth);

router.get("/getme", userController.getLoggedUserData, userController.getSpeceficUser);
router.put("/updateMe", updateME, userController.updateLoggedUserInfo);
router.put("/changeMyPassword", changeMyPassword, userController.updateLoggedUserPassword);

// --------------------------------------
// Admin & Manager Routes
// --------------------------------------
router.use(roles.allowedTo("admin", "manager"));

router.get("/", userController.getUsers);

// Only Admin
router.use(roles.allowedTo("admin"));

router.post(
  "/",
  userController.userProfileImage,
  userController.resizeImage,
  createUserValidator,
  userController.createUser
);

router
  .route("/:id")
  .get(getUserValidator, userController.getSpeceficUser)
  .put(
    userController.userProfileImage,
    userController.resizeImage,
    updateUserValidator,
    userController.updateUser
  )
  .delete(deleteUserValidator, userController.deleteUser);

router.put(
  "/changepassword/:id",
  changeUserPassValidator,
  userController.changeUserPassword
);

module.exports = router;



// const express = require("express");
// const requireAuth = require("../middleware/isAuth");
// const roles = require("../middleware/role");
// const userController = require("../controllers/user");

// const {
//   updateME,
//   createUserValidator,
//   updateUserValidator,
//   changeUserPassValidator,
//   deleteUserValidator,
//   getUserValidator,
//   changeMyPassword
// } = require("../util/userValidation");

// const router = express.Router();

// // user
// router.get(
//   "/getme",
//   requireAuth,
//   userController.getLoggedUserData,
//   userController.getSpeceficUser
// );
// router.put(
//   "/updateMe",
//   requireAuth,
//   updateME,
//   userController.updateLoggedUserInfo
// );

// router
//   .route("/changeMyPassword")
//   .put(requireAuth,changeMyPassword, userController.updateLoggedUserPassword);

// // admin or manager
// router
//   .route("/")
//   .post(
//     requireAuth,
//     roles.allowedTo("admin"),
//     userController.userProfileImage,
//     userController.resizeImage,
//     createUserValidator,
//     userController.createUser
//   )
//   .get(
//     requireAuth,
//     roles.allowedTo("admin", "manager"),
//     userController.getUsers
//   );

// router
//   .route("/:id")
//   .get(
//     requireAuth,
//     roles.allowedTo("admin"),
//     getUserValidator,
//     userController.getSpeceficUser
//   )
//   .put(
//     requireAuth,
//     roles.allowedTo("admin"),
//     userController.userProfileImage,
//     userController.resizeImage,
//     updateUserValidator,
//     userController.updateUser
//   )
//   .delete(
//     requireAuth,
//     roles.allowedTo("admin"),
//     deleteUserValidator,
//     userController.deleteUser
//   );

// router
//   .route("/changepassword/:id")
//   .put(
//     requireAuth,
//     roles.allowedTo("admin"),
//     changeUserPassValidator,
//     userController.changeUserPassword
//   );

// module.exports = router;
