let currentQuestionIndex = 0;
let state = {
  name: "",
  examId: "Exam0209", // ID bài kiểm tra
  examStarted: false,
  timeLeft: 300,
  questions: [
    {
      quiz_id: 1,
      question:
        "Ai là người đọc bản Tuyên ngôn Độc lập ngày 2/9/1945 tại Quảng trường Ba Đình?",
      answers: [
        "Trường Chinh",
        "Chủ tịch Hồ Chí Minh",
        "Võ Nguyên Giáp",
        "Phạm Văn Đồng",
      ],
    },
    {
      quiz_id: 2,
      question:
        "Vị tướng nào được xem là “Tổng tư lệnh đầu tiên” của Quân đội nhân dân Việt Nam?",
      answers: [
        "Lê Trọng Tấn",
        "Võ Nguyên Giáp",
        "Nguyễn Huệ",
        "Trần Hưng Đạo",
      ],
    },
    {
      quiz_id: 3,
      question:
        "Ai là người viết bản Tuyên ngôn Độc lập cùng Chủ tịch Hồ Chí Minh?",
      answers: [
        "Trường Chinh",
        "Chủ tịch Hồ Chí Minh",
        "Võ Nguyên Giáp",
        "Phạm Văn Đồng",
      ],
    },
    {
      quiz_id: 4,
      question:
        "Tổ chức nào được thành lập vào tháng 5/1941, đóng vai trò lãnh đạo Cách mạng Tháng Tám?",
      answers: [
        "Đảng Cộng sản Việt Nam",
        "Mặt trận Việt Minh",
        "Quân đội nhân dân Việt Nam",
        "Hội Liên hiệp Phụ nữ Việt Nam",
      ],
    },
    {
      quiz_id: 5,
      question:
        "Nhân vật nào từng là Tổng Bí thư Đảng Cộng sản Đông Dương trước Cách mạng Tháng Tám?",
      answers: [
        "Trường Chinh",
        "Chủ tịch Hồ Chí Minh",
        "Nguyễn Văn Linh",
        "Nguyễn Văn Cừ",
      ],
    },
    {
      quiz_id: 6,
      question:
        "Ai là người phụ trách công tác tuyên truyền trong thời kỳ tiền khởi nghĩa?",
      answers: ["Trần Phú", "Tố Hữu", "Nguyễn Lương Bằng", "Phạm Văn Đồng"],
    },
    {
      quiz_id: 7,
      question:
        "Nhân vật nào từng giữ chức Chủ tịch Quốc hội đầu tiên của nước Việt Nam Dân chủ Cộng hòa?",
      answers: [
        "Nguyễn Văn Tố",
        "Trường Chinh",
        "Tôn Đức Thắng",
        "Bùi Bằng Đoàn",
      ],
    },
    {
      quiz_id: 8,
      question:
        "Nhân vật nào từng giữ chức Bộ trưởng Bộ Nội vụ trong Chính phủ lâm thời năm 1945?",
      answers: [
        "Trần Huy Liệu",
        "Huỳnh Thúc Kháng",
        "Phan Kế Toại",
        "Nguyễn Văn Tố",
      ],
    },
    {
      quiz_id: 9,
      question:
        "Nhà cách mạng nào từng bị thực dân Pháp xử tử tại Hóc Môn, được xem là biểu tượng của tinh thần bất khuất Nam Bộ?",
      answers: ["Võ Thị Sáu", "Lê Văn Tám", "Nguyễn Văn Trỗi", "Trần Văn Ơn"],
    },
    {
      quiz_id: 10,
      question:
        "Nhân vật nào được giao nhiệm vụ tiếp quản Hà Nội sau Cách mạng Tháng Tám?",
      answers: [
        "Vũ Đình Huỳnh",
        "Phạm Ngọc Thạch",
        "Hoàng Quốc Việt",
        "Nguyễn Văn Trân",
      ],
    },
  ],
  results: [
    {
      quiz_id: 1,
      answer: "Chủ tịch Hồ Chí Minh",
    },
    {
      quiz_id: 2,
      answer: "Võ Nguyên Giáp",
    },
    {
      quiz_id: 3,
      answer: "Trường Chinh",
    },
    {
      quiz_id: 4,
      answer: "Mặt trận Việt Minh",
    },
    {
      quiz_id: 5,
      answer: "Nguyễn Văn Cừ",
    },
    {
      quiz_id: 6,
      answer: "Tố Hữu",
    },
    {
      quiz_id: 7,
      answer: "Bùi Bằng Đoàn",
    },
    {
      quiz_id: 8,
      answer: "Huỳnh Thúc Kháng",
    },
    {
      quiz_id: 9,
      answer: "Nguyễn Văn Trỗi",
    },
    {
      quiz_id: 10,
      answer: "Vũ Đình Huỳnh",
    },
  ],
  userAnswers: {},
};

window.onload = function () {
  if (localStorage.getItem(state.examId) === "submitted") {
    document.getElementById("bg-QK").style.display = "block";
    document.body.innerHTML = `
      <div id="startScreen" style= " ">
        <h1>QUICK QUIZZ</h1>
        <h2 style="padding: 20px; color: red;">Bạn đã hoàn thành bài quick quizz này rồi! <br> Chúc bạn có ngày 2/9 thật vui vẻ!</h2>
        <a href="xemlaidiem.html"">Xem lại điểm</a>
      </div>
    `;
    return;
  }
  document.getElementById("bg-QK").style.display = "none";
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
  document.getElementById("bg-QK").style.display = "block";
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("examScreen").style.display = "block";
  state.examStarted = true;
  startTimer();
  renderCurrentQuestion();
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
    timerEl.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    state.timeLeft--;
  }, 1000);
}

function getUserAnswers() {
  return { ...state.userAnswers }; // clone để tránh tham chiếu trực tiếp
}


function gradeExam(userAnswers) {
  return state.results.reduce((count, res) => {
    return count + (userAnswers[res.quiz_id] === res.answer ? 1 : 0);
  }, 0);
}



function renderCurrentQuestion() {
  const container = document.getElementById("questions");
  const q = state.questions[currentQuestionIndex];
  const selectedAnswer = state.userAnswers[q.quiz_id];

  container.innerHTML = `
    <div class="quiz_question">
      <p><b>Câu ${currentQuestionIndex + 1}:</b> ${q.question}</p>
      <ul>
        ${q.answers
          .map(
            (ans, idx) => `
          <li class="answer-item ${
            selectedAnswer === ans ? "selected" : ""
          }" data-answer="${ans}">
            <span>${String.fromCharCode(65 + idx)}.</span>
            <span class="quiz_answer_item">${ans}</span>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `;

  // Gắn sự kiện click cho các <li>
  const liElements = container.querySelectorAll(".answer-item");
  liElements.forEach((li) => {
    li.addEventListener("click", () => {
      const answer = li.getAttribute("data-answer");
      state.userAnswers[q.quiz_id] = answer;

      // Xóa class selected cũ và thêm mới
      liElements.forEach((el) => el.classList.remove("selected"));
      li.classList.add("selected");
    });
  });

  // Gắn sự kiện Prev / Next
  document.getElementById("quiz_prev")?.addEventListener("click", prevQuestion);
  document.getElementById("quiz_next")?.addEventListener("click", nextQuestion);
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderCurrentQuestion();
  }
}

function nextQuestion() {
  if (currentQuestionIndex < state.questions.length - 1) {
    currentQuestionIndex++;
    renderCurrentQuestion();
  }
}

function showResult(correctCount) {
  const totalQuestions = state.results.length;
  const resultMessage = `Chúc mừng ${state.name}, bạn đã trả lời đúng ${correctCount}/${totalQuestions} câu!`;

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
    totalQuestions: state.results.length,
    answers: userAnswers,
    startedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
  };

  try {
    await fetch("/save-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newResult),
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
    state.examStarted = false;
    const userAnswers = getUserAnswers();
    const correctCount = gradeExam(userAnswers);

    const payload = {
      username: state.name,
      score: correctCount,
      totalQuestions: state.results.length,
      answers: userAnswers,
      startedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    };

    // Dùng sendBeacon để gửi dữ liệu trước khi thoát
    navigator.sendBeacon("/save-result", JSON.stringify(payload));
  }
});


// Nộp bài khi bấm nút
document.getElementById("submitBtn").addEventListener("click", submitExam);

function showAllResults() {
  window.location.href = "xemlaidiem.html";
}
