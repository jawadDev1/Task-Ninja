import { Router } from 'express';
import userRouter from './user.routes.js'
import taskRouter from './task.routes.js'
import categoryRouter from './category.routes.js'


const router = Router()

router.use("/user", userRouter);
router.use("/task", taskRouter)
router.use("/category", categoryRouter)

export default router;