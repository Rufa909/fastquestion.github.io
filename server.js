const express = require("express");
const app = express();
const fs = require("fs").promises;
const path = require("path");

// Middleware để phục vụ file tĩnh và xử lý JSON
app.use(express.static("public"));
app.use(express.json());

// API: Lấy thời gian server
app.get("/api/time", (req, res) => {
  res.json({ currentTime: new Date().toISOString() });
});

// ====== Thêm phần quản lý người dùng bắt đầu thi và nộp bài ======

// Tạo thư mục 'users' nếu chưa có
const usersDir = path.join(__dirname, "users");
fs.mkdir(usersDir, { recursive: true }).catch((err) =>
  console.error("Không thể tạo thư mục 'users':", err)
);

// API: Người dùng bắt đầu thi
app.post("/start-exam", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Thiếu username" });

  const filePath = path.join(usersDir, `${username}.json`);
  const userData = {
    username,
    startedAt: new Date(),
    answers: {},
    submitted: false,
  };

  try {
    await fs.writeFile(filePath, JSON.stringify(userData, null, 2));
    res.json({ message: "Đã lưu người dùng", user: userData });
  } catch (error) {
    console.error("Lỗi khi lưu người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API: Người dùng nộp bài
app.post("/submit-exam", async (req, res) => {
  const { username, answers } = req.body;
  if (!username || !answers)
    return res.status(400).json({ message: "Thiếu thông tin" });

  const filePath = path.join(usersDir, `${username}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(data);

    userData.answers = answers;
    userData.submitted = true;
    userData.submittedAt = new Date();

    await fs.writeFile(filePath, JSON.stringify(userData, null, 2));

    res.json({ message: "Đã lưu bài làm", user: userData });
  } catch (error) {
    console.error("Lỗi khi nộp bài:", error);
    if (error.code === "ENOENT") {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API: Xem danh sách người dùng đã làm bài
app.get("/users", async (req, res) => {
  try {
    const files = await fs.readdir(usersDir);
    const users = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(usersDir, file), "utf-8");
        return JSON.parse(content);
      })
    );
    res.json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==========================================================

// Cổng server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
