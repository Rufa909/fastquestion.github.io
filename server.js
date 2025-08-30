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

// ✅ API kiểm tra user đã thi chưa
app.get("/check-user", (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).send("Thiếu username");

  const filePath = path.join(usersDir, `${username}.json`);
  if (fs.existsSync(filePath)) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

// ✅ API lưu kết quả
app.post("/save-result", (req, res) => {
  const data = req.body;
  if (!data.username) return res.status(400).send("Thiếu username");

  const filePath = path.join(usersDir, `${data.username}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.send({ message: "Đã lưu kết quả" });
});

// ✅ API lấy tất cả users
app.get("/users", (req, res) => {
  const files = fs.readdirSync(usersDir);
  const users = files.map(file => {
    const content = fs.readFileSync(path.join(usersDir, file));
    return JSON.parse(content);
  });

  // Tính điểm của mỗi user và sắp xếp
  users.sort((a, b) => {
    const correctAnswers = { q1:"B", q2:"C", q3:"C", q4:"A", q5:"D", q6:"B", q7:"D", q8:"B", q9:"C", q10:"A" };
    const scoreA = Object.entries(a.answers || {}).filter(([q, ans]) => ans === correctAnswers[q]).length;
    const scoreB = Object.entries(b.answers || {}).filter(([q, ans]) => ans === correctAnswers[q]).length;
    return scoreB - scoreA; // Giảm dần
  });

  res.json(users);
});


const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server chạy tại http://localhost:${PORT}`));
