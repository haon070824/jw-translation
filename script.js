// 신권 용어 사전
const customTerms = {
    "エホバ": "여호와",
    "神": "하느님",
    "王国会館": "왕국회관",
    "奉仕": "봉사",
    "長老": "장로",
    "会衆": "회중",
    "イエス": "예수",
    "キリスト": "그리스도",
    "主権": "주권",
    "統治": "통치",
    "大祭司": "대제사장",
    "千年統治": "천년 통치",
    "パラダイス": "낙원",
    "兄弟": "형제",
    "姉妹": "자매",
    "祈り": "기도",
    "野外奉仕": "야외 봉사",
    "生活と奉仕の集会": "그리스도인 생활과 봉사 집회",
    "公開講演": "공개 강연",
    "割り当て": "과제",
    "聖句": "성구",
    "聖書": "성경",
    "祈りの終わり": "기도의 끝",
    "閉会の祈り": "마치는 기도",
    "開会の祈り": "시작하는 기도",
    "兄弟姉妹": "형제 자매",
    "地上": "땅",
    "神の王国": "하느님의 왕국",
    "神の目的": "하느님의 목적",
    "生活と奉仕": "생활과 봉사",
    "公開証言": "공개 증언",
    "証拠": "증거",
    "会議": "회의",
    "王国": "왕국",
    "主": "주",
    "学び": "공부",
    "弟子": "제자",
    "信仰": "신앙",
    "希望": "희망",
    "愛": "사랑"
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
            translatedText = translatedText.replace(new RegExp(term, 'g'), translation);
        }

        document.getElementById("translated-text").value = translatedText;
    } catch (error) {
        document.getElementById("translated-text").value = `번역 오류: ${error.message}`;
    }
}
