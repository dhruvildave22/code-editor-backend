const {
  loginUser,
  createCandidate,
  createModerator,
} = require('../controllers/user-controller');
const {
  authenticate,
  adminOrModeratorAuth,
  adminAuth,
} = require('../middlewares/auth-middleware');
const validate = require('../middlewares/validation-middleware');
const {
  loginSchema,
  createCandidateSchema,
  createModeratorSchema,
} = require('../validations/user-validation');

const express = require('express');
const router = express.Router();

router.post(
  '/moderators',
  authenticate,
  adminAuth,
  validate(createModeratorSchema),
  createModerator
);
router.post('/login', validate(loginSchema), loginUser);
router.post(
  '/candidates',
  authenticate,
  adminOrModeratorAuth,
  validate(createCandidateSchema),
  createCandidate
);

module.exports = router;
