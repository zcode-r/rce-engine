import { Router } from "express"
import { createsubmission ,getsubmission} from "../controllers/submissionController.js"
import { protect } from "../middleware/protect.js"

const router = Router()

router.post('/submit',protect,createsubmission)
router.get('/:id',protect,getsubmission)

export default router