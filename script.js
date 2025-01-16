let isTranslating = false;

const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');

// 번역 시작
startButton.addEventListener('click', () => {
  isTranslating = true;
  startButton.disabled = true;
  stopButton.disabled = false;
  startTranslationLoop();
});

// 번역 중지
stopButton.addEventListener('click', () => {
  isTranslating = false;
  startButton.disabled = false;
  stopButton.disabled = true;
});

// 번역 루프 실행
async function startTranslationLoop() {
  while (isTranslating) {
    try {
      const result = await listenAndTranslate();
      displayTranslation(result);
    } catch (error) {
      console.error("번역 중 오류 발생:", error);
    }
  }
}

// 음성 인식 및 번역 (기존 함수)
async function listenAndTranslate() {
  // 음성 인식 코드
  const speechText = await recognizeSpeech(); // 음성 인식
  const translatedText = await translateText(speechText, 'ja', 'ko'); // 번역
  return translatedText;
}

// 번역 결과 화면에 표시 (기존 함수)
function displayTranslation(text) {
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = text;
}
