let state = {
  name: "",
  examId: "testtt", // ID bài kiểm tra (thay đổi nếu là bài khác)
  examStarted: false,
  timeLeft: 10, // 5 phút (bỏ qua nếu không cần)
  correctAnswers: {
    q1: "B",
    q2: "C",
    q3: "C",
    q4: "A",
    q5: "D",
    q6: "B",
    q7: "D",
    q8: "B",
    q9: "C",
    q10: "A"
  },
  userAnswers: {}
};

// Khi trang load, kiểm tra nếu bài này đã làm rồi
window.onload = function () {
  if (localStorage.getItem(state.examId) === "submitted") {
    document.body.innerHTML = `
      <div style="text-align:center; padding: 20px;">
        <h2>Bạn đã hoàn thành bài kiểm tra này!</h2>
        <a href="xemlaidiem.html">Xem lại điểm</a>
      </div>
    `;
    return;
  }
};

// Kiểm tra có phải mobile
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Bắt fullscreen trên PC
async function enterFullscreen() {
  const docEl = document.documentElement;
  if (docEl.requestFullscreen) {
    await docEl.requestFullscreen();
  } else if (docEl.webkitRequestFullscreen) {
    await docEl.webkitRequestFullscreen();
  }
}

// Khi bấm nút "Bắt đầu"
async function startExam() {
  state.name = document.getElementById("nameInput").value.trim();
  if (!state.name) {
    alert("Vui lòng nhập tên!");
    return;
  }

  // Kiểm tra nếu đã làm bài
  if (localStorage.getItem(state.examId) === "submitted") {
    alert("Bạn đã làm bài kiểm tra này rồi!");
    return;
  }

  if (isMobile()) {
    // Trên mobile: phải xoay ngang
    if (window.innerWidth < window.innerHeight) {
      alert("Vui lòng xoay ngang màn hình để tiếp tục.");
      return;
    }
  } else {
    // Trên PC: bắt buộc fullscreen
    await enterFullscreen();
  }

  // Hiển thị màn hình làm bài
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("examScreen").style.display = "block";
  state.examStarted = true;
  startTimer();
}

// Đếm ngược thời gian
function startTimer() {
  const timerEl = document.getElementById("timer");
  const interval = setInterval(() => {
    if (state.timeLeft <= 0 || !state.examStarted) {
      clearInterval(interval);
      submitExam();
      return;
    }
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    timerEl.textContent = `Thời gian: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    state.timeLeft--;
  }, 1000);
}

function getUserAnswers() {
  const userAnswers = {};
  for (let question in state.correctAnswers) {
    const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
    if (selectedOption) {
      userAnswers[question] = selectedOption.value;
    }
  }
  return userAnswers;
}

function gradeExam(userAnswers) {
  let correctCount = 0;
  for (let question in state.correctAnswers) {
    if (userAnswers[question] === state.correctAnswers[question]) {
      correctCount++;
    }
  }
  return correctCount;
}

function showResult(correctCount) {
  const totalQuestions = Object.keys(state.correctAnswers).length;
  const resultMessage = `${state.name}, bạn đã trả lời đúng ${correctCount}/${totalQuestions} câu!`;

  // Hiển thị kết quả
  document.getElementById("resultMessage").innerText = resultMessage;
  document.getElementById("examScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";
}

// Nộp bài
async function submitExam() {
  if (!state.examStarted) return;

  state.examStarted = false;

  const userAnswers = getUserAnswers();
  state.userAnswers = userAnswers;
  const correctCount = gradeExam(userAnswers);

  // Hiển thị kết quả
  showResult(correctCount);

  const newResult = {
    username: state.name,
    score: correctCount,
    totalQuestions: Object.keys(state.correctAnswers).length,
    answers: userAnswers,
    startedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString()
  };

  try {
    await fetch("/save-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newResult)
    });
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
  }

  // Đánh dấu đã làm bài trong localStorage
  localStorage.setItem(state.examId, "submitted");

  // Ẩn màn hình làm bài, hiện kết quả
  document.getElementById("examScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";
}

// Nếu thoát fullscreen (PC) hoặc rời tab thì tự động nộp bài
document.addEventListener("fullscreenchange", () => {
  if (state.examStarted && !document.fullscreenElement && !isMobile()) {
    submitExam();
  }
});

// Xử lý khi chuyển tab (blur) hoặc mất focus
window.addEventListener("blur", () => {
  if (state.examStarted) {
    submitExam();
  }
});

// Cảnh báo hoặc tự động nộp bài khi người dùng cố gắng thoát trang
window.addEventListener("beforeunload", (event) => {
  if (state.examStarted) {
    submitExam();
    event.preventDefault();
  }
});

// Nộp bài khi bấm nút
document.getElementById("submitBtn").addEventListener("click", submitExam);

function restartExam() {
  location.reload();
}

function showAllResults() {
  window.location.href = "xemlaidiem.html";
}
