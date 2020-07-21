const { Router } = require("express");

const router = Router();

router.get("/", function (req, res) {
  res.json({
    success: true,
    response: "HELLO",
  });
});

module.exports = router;
