const router = require('express').Router()
const adminController = require('../controller/admin')



router.get("/admin-dashboard",adminController.getAdminDash );
router.get("/admin-addGames",adminController.getAdminAddGames );
router.get("/admin-games",adminController.getAdminGames );
router.post("/add-game",adminController.postAdminAddGames)




module.exports = router;