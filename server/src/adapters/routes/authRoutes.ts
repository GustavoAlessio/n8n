import { Router } from 'express';
import { register, login } from '../controllers/AuthController';

const router = Router();

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/auth/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/auth/login', login);

export default router;
