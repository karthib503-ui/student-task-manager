// ============================================================
// TASK ROUTES
// Routes map HTTP methods + URL paths to controller functions.
// Pattern:  router.METHOD('/path', [middleware], controller)
//
// REST API design:
//   GET    /tasks           → list all
//   GET    /tasks/stats     → dashboard summary
//   GET    /tasks/:id       → get one
//   POST   /tasks           → create new
//   PUT    /tasks/:id       → replace/update
//   PATCH  /tasks/:id/complete → partial update (mark done)
//   DELETE /tasks/:id       → remove
// ============================================================

const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/taskController");

const router = express.Router();

// -------------------------------------------------------
// VALIDATION MIDDLEWARE
// express-validator rules run BEFORE the controller.
// They attach any errors to the request object.
// The controller then checks for those errors.
// -------------------------------------------------------
const taskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 100 })
    .withMessage("Title must be 100 characters or less."),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be 500 characters or less."),
];

// IMPORTANT: /stats must come BEFORE /:id so Express doesn't
// treat the word "stats" as an id parameter.
router.get("/stats", controller.getStats);

router.get("/", controller.getAllTasks);
router.get("/:id", controller.getTaskById);
router.post("/", taskValidation, controller.createTask);
router.put("/:id", taskValidation, controller.updateTask);
router.patch("/:id/complete", controller.completeTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;
