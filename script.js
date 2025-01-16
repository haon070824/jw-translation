// 신권 용어 사전
const customTerms = {
    "王国会館": "왕국회관",
    "奉仕": "봉사",
    "長老": "장로",
    "会衆": "회중"
};

let isListening = false;
let recognition;

// 음성 인식 객체 초기화 (한 번만 실행)
function initSpeechRecognition() {
    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "ja-JP";

        recognition.onstart = () => {
            document.getElementById("input-text").value = "음성을 듣는 중...";
        };

        recognition.onresult = (event) => {
            const japaneseText = event.results[0][0].transcript;
            document.getElementById("input-text").value = japaneseText;

            // 번역 호출
            translateText(japaneseText);
        };

        recognition.onend = () => {
            if (isListening) {
                recognition.start(); // 다시 시작
            }
        };

        recognition.onerror = (event) => {
            document.getElementById("input-text").value = `오류 발생: ${event.error}`;
            if (isListening) {
                recognition.start(); // 오류 발생 시도 재시작
            }
        };
    }
}

// 음성 인식 시작
document.getElementById("start-button").addEventListener("click", () => {
    isListening = true;
    initSpeechRecognition(); // 초기화 호출
    recognition.start();

    document.getElementById("start-button").disabled = true;
    document.getElementById("stop-button").disabled = false;
});

// 음성 인식 중지
document.getElementById("stop-button").addEventListener("click", () => {
    isListening = false;
    recognition.stop();

    document.getElementById("start-button").disabled = false;
    document.getElementById("stop-button").disabled = true;
});

// 번역 기능
async function translateText(japaneseText) {
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=ko&dt=t&q=${encodeURIComponent(japaneseText)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        let translatedText = data[0][0][0];

        // 신권 용어 변환
        for (const [term, translation] of Object.entries(customTerms)) {
            translatedText = translatedText.replace(term, translation);
        }

        document.getElementById("translated-text").value = translatedText;
    } catch (error) {
        document.getElementById("translated-text").value = `번역 오류: ${error.message}`;
    }
}
