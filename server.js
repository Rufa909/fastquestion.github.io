const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const usersDir = path.join(__dirname, "users");

// Đảm bảo thư mục users tồn tại
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir);
}

// API lưu kết quả
app.post("/save-result", (req, res) => {
  const data = req.body;
  if (!data.username) return res.status(400).send("Thiếu username");

  const filePath = path.join(usersDir, `${data.username}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.send({ message: "Đã lưu kết quả" });
});

// API lấy tất cả users
app.get("/users", (req, res) => {
  const files = fs.readdirSync(usersDir);
  const users = files.map(file => {
    const content = fs.readFileSync(path.join(usersDir, file));
    return JSON.parse(content);
  });
  res.json(users);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
