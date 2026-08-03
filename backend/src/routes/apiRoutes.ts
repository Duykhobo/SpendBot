import { Router } from 'express';
import expenseController from '../controllers/ExpenseController';
import reminderController from '../controllers/ReminderController';
import authController from '../controllers/AuthController';
import { authMiddleware } from '../utils/authMiddleware';

const router = Router();

// Route Auth (Public)
router.post('/auth/telegram', authController.login.bind(authController));

// Các Routes được bảo vệ bởi JWT
router.get('/expenses', authMiddleware, expenseController.getExpensesAPI.bind(expenseController));
router.get('/reminders', authMiddleware, reminderController.getRemindersAPI.bind(reminderController));

export default router;
