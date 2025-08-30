let examSubmitted = "test1";
let timeLeft = 450; // 7 phút
let examStarted = false;
let examEnded = false;

let submitting = false;

// Đáp án đúng
const correctAnswers = {
  q1: "C",
  q2: "D",
  q3: "B",
  q4: "A",
  q5: "A",
  q6: "B",
  q7: "C",
  q8: "A",
  q9: "A",
  q10: "D",
  q11: "C",
  q12: "D",
  q13: "D",
  q14: "C",
  q15: "C",
};

let isAllowedToStart = false;

// Thời gian cho phép vào làm bài (theo giờ Server)
// const ALLOW_START_HOUR = 0; // x giờ sáng
// const ALLOW_START_MINUTE_START = 0; // từ phút thứ xx của giờ
// const ALLOW_START_MINUTE_END = 59; // đến phút thứ xx của giờ

window.onload = async function () {
  // tam thoi hide
  //document.getElementById("boxBtnStart").style.display = "none";

  // if (localStorage.getItem(examSubmitted) === "true") {
  //   document.body.innerHTML = `<form id="outputForm">
  //       <div class="form-control">
  //           <label for="title"><h1>Bài Trắc Nghiệm</h1></label>
  //           <label type="text">Bạn đã hoàn thành bài kiểm tra. Không thể làm lại.</label>
  //       </div>
  //       <div class="back">
  //         <a href="dsketqua.html" style="color: black; cursor: pointer;"">Danh sách</a>
  //       </div>
        
  //   </form>`;
  //   return;
  // }
  // Chỉ kiểm tra một lần khi trang load
  // const allow = await checkAllowStartFromServer();
  // console.log("Trạng thái cho phép làm bài: ", allow); // Debug trạng thái

  isAllowedToStart = allow; // Lưu trạng thái giờ để không bị thay đổi
  const startButton = document.getElementById("startBtn");
  // startButton.disabled = !allow; // Enable/Disable nút Start dựa vào giờ server

  await loadUsers();
};

function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function handleStartExam() {
  // if (!isAllowedToStart) {
  //   alert("Đã hết giờ cho phép làm bài!");
  //   return;
  // }

  const userInput = document.getElementById("hovaten");
  const username = userInput.value.trim();
  if (!username) {
    alert("Bạn cần nhập tên!");
    return;
  }

  try {
    await fetch("/start-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    localStorage.setItem("username", username); // Lưu tên người dùng để submit bài sau
    if (isIOS()) {
      if (window.orientation !== 90 && window.orientation !== -90) {
        alert("Vui lòng xoay ngang thiết bị để bắt đầu làm bài.");
        return; // Không gọi startExam nếu chưa xoay ngang
      }
      startExam();
    } else {
      await enterFullScreen();
      startExam();
    }
  } catch (error) {
    console.error("Lỗi khi gửi start-exam:", error);
    alert("Không thể bắt đầu bài thi.");
  }
}

async function getServerTime() {
  try {
    const response = await fetch("https://demotestexam.glitch.me/api/time"); // API Server trả giờ thực
    const data = await response.json();
    console.log("Thời gian server: ", data.datetime); // In ra thời gian từ server
    const serverDate = new Date(data.datetime);

    // Chuyển đổi sang múi giờ Việt Nam nếu cần
    const vietnamTime = new Date(
      serverDate.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    console.log("Giờ server (Việt Nam): ", vietnamTime); // In ra giờ Việt Nam
    return vietnamTime; // Trả về giờ đã chuyển đổi
  } catch (error) {
    console.error("Không lấy được giờ server:", error);
    return null;
  }
}

async function checkAllowStartFromServer() {
  const serverDate = await getServerTime();
  if (!serverDate) return false; // Nếu không lấy được giờ thì không cho phép

  const hour = serverDate.getHours();
  const minute = serverDate.getMinutes();
  console.log(`Giờ server: ${hour}:${minute}`); // In ra giờ và phút từ server để debug

  // Kiểm tra giờ server có nằm trong khoảng cho phép hay không
  if (
    hour === ALLOW_START_HOUR &&
    minute >= ALLOW_START_MINUTE_START &&
    minute <= ALLOW_START_MINUTE_END
  ) {
    console.log("Giờ vào làm bài hợp lệ");
    return true;
  } else {
    console.log("Giờ vào làm bài không hợp lệ", hour, minute);
    document.getElementById("startBtn").innerHTML =
      "Chưa đến thời gian hoặc đã hết thời gian vào làm bài!";
    return false;
  }
}

function enterFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    return elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    // Firefox
    return elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    // Chrome, Safari
    return elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    // IE/Edge
    return elem.msRequestFullscreen();
  }
  return Promise.reject("Fullscreen API không hỗ trợ.");
}

function startExam() {
  examStarted = true;
  document.getElementById("boxBtnStart").style.display = "none";
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("examScreen").classList.remove("hidden");

  startTimer();
}

function startTimer() {
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    if (examEnded) {
      clearInterval(interval);
      return;
    }
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `Thời gian: ${minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(interval);
      alert("Hết thời gian! Bài kiểm tra sẽ được nộp.");
      submitExam();
    }
  }, 1000);
}

window.onbeforeunload = function () {
  if (examStarted && !examEnded) {
    return "Bạn chưa hoàn thành bài kiểm tra. Bạn có chắc chắn muốn thoát?";
  }
};

window.addEventListener("orientationchange", async function () {
  const isLandscape = window.orientation === 90 || window.orientation === -90;

  if (isIOS()) {
    if (isLandscape && !examStarted && !examEnded) {
      const allow = await checkAllowStartFromServer();
      if (allow) {
        startExam();
      } else {
        alert("Chưa đến giờ làm bài hoặc đã quá giờ.");
      }
    } else {
      alert("Vui lòng xoay ngang thiết bị để bắt đầu.");
    }
  }
});

document.addEventListener("fullscreenchange", () => {
  if (examStarted && !examEnded && !document.fullscreenElement) {
    alert("Bạn đã thoát toàn màn hình! Bài kiểm tra sẽ bị nộp.");
    submitExam();
  }
});

document.addEventListener("visibilitychange", function () {
  if (examStarted && !examEnded && document.hidden) {
    alert(
      "Bạn đã chuyển tab hoặc thu nhỏ trình duyệt! Bài kiểm tra sẽ bị nộp."
    );
    submitExam();
  }
});

function getUserAnswers() {
  const userAnswers = {};

  // Duyệt qua tất cả các câu hỏi trong bài kiểm tra
  Object.keys(correctAnswers).forEach((question) => {
    const selected = document.querySelector(
      `input[name="${question}"]:checked`
    );
    if (selected) {
      // Nếu người dùng đã chọn đáp án, lưu vào object userAnswers
      userAnswers[question] = selected.value;
    }
  });

  return userAnswers;
}

async function submitExam() {
  if (examEnded || submitting) return;
  submitting = true; // Ngăn submit lặp lại
  examEnded = true;
  window.onbeforeunload = null;

  // 1. Ẩn giao diện làm bài và đồng hồ
  document.getElementById("examScreen").classList.add("hidden");
  document.getElementById("timer").style.display = "none";

  // 2. Tính điểm
  const scoreResult = gradeExam();
  const username = localStorage.getItem("username");

  // 3. Gửi dữ liệu lên server
  await fetch("/submit-exam", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      answers: getUserAnswers(),
      score: scoreResult.correct,
    }),
  });

  localStorage.setItem(examSubmitted, "true");

  // 4. Hiện thông báo
  alert(
    `Bài kiểm tra đã được nộp!\nBạn trả lời đúng ${scoreResult.correct}/${scoreResult.total} câu.`
  );

  // 5. Gửi form (nếu có)
  document.getElementById("examForm").submit();
}

function gradeExam() {
  let correct = 0;
  let total = Object.keys(correctAnswers).length;

  for (const question in correctAnswers) {
    const selected = document.querySelector(
      `input[name="${question}"]:checked`
    );
    if (selected && selected.value === correctAnswers[question]) {
      correct++;
    }
  }
  return { correct, total };
}

async function loadUsers() {
  const response = await fetch("/users");
  const users = await response.json();

  const table = document.getElementById("usersTable");
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td>${
        user.startedAt ? new Date(user.startedAt).toLocaleString() : ""
      }</td>
      <td>${
        user.submittedAt ? new Date(user.submittedAt).toLocaleString() : ""
      }</td>
      <td>${user.score != null ? user.score : "Chưa nộp"}</td>
    `;
    table.appendChild(row);
  });
}
