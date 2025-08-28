import React, { useState, useEffect, useRef } from 'react';
import { isRomaji as isRomajiText, toKana, toRomaji } from 'wanakana';
import KonnichiwaTypewriter from  "./KonnichiwaTypewriter"

// Data for Hiragana and Katakana characters.
const hiragana = [
  // Basic vowels
  { char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" }, { char: "え", romaji: "e" }, { char: "お", romaji: "o" },
  // K-row
  { char: "か", romaji: "ka" }, { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" }, { char: "こ", romaji: "ko" },
  // S-row
  { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" }, { char: "す", romaji: "su" }, { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" },
  // T-row
  { char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" }, { char: "て", romaji: "te" }, { char: "と", romaji: "to" },
  // N-row
  { char: "な", romaji: "na" }, { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" }, { char: "ね", romaji: "ne" }, { char: "の", romaji: "no" },
  // H-row
  { char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" }, { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" }, { char: "ほ", romaji: "ho" },
  // M-row
  { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" }, { char: "め", romaji: "me" }, { char: "も", romaji: "mo" },
  // Y-row
  { char: "や", romaji: "ya" }, { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" },
  // R-row
  { char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" }, { char: "れ", romaji: "re" }, { char: "ろ", romaji: "ro" },
  // W-row
  { char: "わ", romaji: "wa" }, { char: "を", romaji: "wo" },
  // N
  { char: "ん", romaji: "n" },
  // Dakuten (voiced)
  { char: "が", romaji: "ga" }, { char: "ぎ", romaji: "gi" }, { char: "ぐ", romaji: "gu" }, { char: "げ", romaji: "ge" }, { char: "ご", romaji: "go" },
  { char: "ざ", romaji: "za" }, { char: "じ", romaji: "ji" }, { char: "ず", romaji: "zu" }, { char: "ぜ", romaji: "ze" }, { char: "ぞ", romaji: "zo" },
  { char: "だ", romaji: "da" }, { char: "ぢ", romaji: "ji" }, { char: "づ", romaji: "zu" }, { char: "で", romaji: "de" }, { char: "ど", romaji: "do" },
  { char: "ば", romaji: "ba" }, { char: "び", romaji: "bi" }, { char: "ぶ", romaji: "bu" }, { char: "べ", romaji: "be" }, { char: "ぼ", romaji: "bo" },
  { char: "ぱ", romaji: "pa" }, { char: "ぴ", romaji: "pi" }, { char: "ぷ", romaji: "pu" }, { char: "ぺ", romaji: "pe" }, { char: "ぽ", romaji: "po" },
  // Combo sounds (yōon)
  { char: "きゃ", romaji: "kya" }, { char: "きゅ", romaji: "kyu" }, { char: "きょ", romaji: "kyo" },
  { char: "しゃ", romaji: "sha" }, { char: "しゅ", romaji: "shu" }, { char: "しょ", romaji: "sho" },
  { char: "ちゃ", romaji: "cha" }, { char: "ちゅ", romaji: "chu" }, { char: "ちょ", romaji: "cho" },
  { char: "にゃ", romaji: "nya" }, { char: "にゅ", romaji: "nyu" }, { char: "にょ", romaji: "nyo" },
  { char: "ひゃ", romaji: "hya" }, { char: "ひゅ", romaji: "hyu" }, { char: "ひょ", romaji: "hyo" },
  { char: "みゃ", romaji: "mya" }, { char: "みゅ", romaji: "myu" }, { char: "みょ", romaji: "myo" },
  { char: "りゃ", romaji: "rya" }, { char: "りゅ", romaji: "ryu" }, { char: "りょ", romaji: "ryo" },
  // Dakuten combos
  { char: "ぎゃ", romaji: "gya" }, { char: "ぎゅ", romaji: "gyu" }, { char: "ぎょ", romaji: "gyo" },
  { char: "じゃ", romaji: "ja" }, { char: "じゅ", romaji: "ju" }, { char: "じょ", romaji: "jo" },
  { char: "びゃ", romaji: "bya" }, { char: "びゅ", romaji: "byu" }, { char: "びょ", romaji: "byo" },
  { char: "ぴゃ", romaji: "pya" }, { char: "ぴゅ", romaji: "pyu" }, { char: "ぴょ", romaji: "pyo" },
];

const katakana = [
  // Basic vowels
  { char: "ア", romaji: "a" }, { char: "イ", romaji: "i" }, { char: "ウ", romaji: "u" }, { char: "エ", romaji: "e" }, { char: "オ", romaji: "o" },
  // K-row
  { char: "カ", romaji: "ka" }, { char: "キ", romaji: "ki" }, { char: "ク", romaji: "ku" }, { char: "ケ", romaji: "ke" }, { char: "コ", romaji: "ko" },
  // S-row
  { char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" }, { char: "ス", romaji: "su" }, { char: "セ", romaji: "se" }, { char: "ソ", romaji: "so" },
  // T-row
  { char: "タ", romaji: "ta" }, { char: "チ", romaji: "chi" }, { char: "ツ", romaji: "tsu" }, { char: "テ", romaji: "te" }, { char: "ト", romaji: "to" },
  // N-row
  { char: "ナ", romaji: "na" }, { char: "ニ", romaji: "ni" }, { char: "ヌ", romaji: "nu" }, { char: "ネ", romaji: "ne" }, { char: "ノ", romaji: "no" },
  // H-row
  { char: "ハ", romaji: "ha" }, { char: "ヒ", romaji: "hi" }, { char: "フ", romaji: "fu" }, { char: "ヘ", romaji: "he" }, { char: "ホ", romaji: "ho" },
  // M-row
  { char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" }, { char: "ム", romaji: "mu" }, { char: "メ", romaji: "me" }, { char: "モ", romaji: "mo" },
  // Y-row
  { char: "ヤ", romaji: "ya" }, { char: "ユ", romaji: "yu" }, { char: "ヨ", romaji: "yo" },
  // R-row
  { char: "ラ", romaji: "ra" }, { char: "リ", romaji: "ri" }, { char: "ル", romaji: "ru" }, { char: "レ", romaji: "re" }, { char: "ロ", romaji: "ro" },
  // W-row
  { char: "ワ", romaji: "wa" }, { char: "ヲ", romaji: "wo" },
  // N
  { char: "ン", romaji: "n" },
  // Dakuten (voiced)
  { char: "ガ", romaji: "ga" }, { char: "ギ", romaji: "gi" }, { char: "グ", romaji: "gu" }, { char: "ゲ", romaji: "ge" }, { char: "ゴ", romaji: "go" },
  { char: "ザ", romaji: "za" }, { char: "ジ", romaji: "ji" }, { char: "ズ", romaji: "zu" }, { char: "ゼ", romaji: "ze" }, { char: "ゾ", romaji: "zo" },
  { char: "ダ", romaji: "da" }, { char: "ヂ", romaji: "ji" }, { char: "ヅ", romaji: "zu" }, { char: "デ", romaji: "de" }, { char: "ド", romaji: "do" },
  { char: "バ", romaji: "ba" }, { char: "ビ", romaji: "bi" }, { char: "ブ", romaji: "bu" }, { char: "ベ", romaji: "be" }, { char: "ボ", romaji: "bo" },
  { char: "パ", romaji: "pa" }, { char: "ピ", romaji: "pi" }, { char: "プ", romaji: "pu" }, { char: "ペ", romaji: "pe" }, { char: "ポ", romaji: "po" },
  // Combo sounds (yōon)
  { char: "キャ", romaji: "kya" }, { char: "キュ", romaji: "kyu" }, { char: "キョ", romaji: "kyo" },
  { char: "シャ", romaji: "sha" }, { char: "シュ", romaji: "shu" }, { char: "ショ", romaji: "sho" },
  { char: "チャ", romaji: "cha" }, { char: "チュ", romaji: "chu" }, { char: "チョ", romaji: "cho" },
  { char: "ニャ", romaji: "nya" }, { char: "ニュ", romaji: "nyu" }, { char: "ニョ", romaji: "nyo" },
  { char: "ヒャ", romaji: "hya" }, { char: "ヒュ", romaji: "hyu" }, { char: "ヒョ", romaji: "hyo" },
  { char: "ミャ", romaji: "mya" }, { char: "ミュ", romaji: "myu" }, { char: "ミョ", romaji: "myo" },
  { char: "リャ", romaji: "rya" }, { char: "リュ", romaji: "ryu" }, { char: "リョ", romaji: "ryo" },
  // Dakuten combos
  { char: "ギャ", romaji: "gya" }, { char: "ギュ", romaji: "gyu" }, { char: "ギョ", romaji: "gyo" },
  { char: "ジャ", romaji: "ja" }, { char: "ジュ", romaji: "ju" }, { char: "ジョ", romaji: "jo" },
  { char: "ビャ", romaji: "bya" }, { char: "ビュ", romaji: "byu" }, { char: "ビョ", romaji: "byo" },
  { char: "ピャ", romaji: "pya" }, { char: "ピュ", romaji: "pyu" }, { char: "ピョ", romaji: "pyo" },
];

// Utility function to shuffle an array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Flashcard component with a flip animation
const Flashcard = ({ card, isFlipped, mode }) => {
  const frontContent = mode === 'charToRomaji' ? card.char : card.romaji;
  const backContent = mode === 'charToRomaji' ? card.romaji : card.char;

  return (
    <div className="w-80 h-96 [perspective:1000px] cursor-pointer">
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Card Front */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center [backface-visibility:hidden]">
          <span className="text-8xl font-bold text-gray-800 select-none">{frontContent}</span>
        </div>
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full bg-indigo-500 rounded-xl shadow-lg flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <span className="text-5xl font-bold text-white select-none">{backContent}</span>
        </div>
      </div>
    </div>
  );
};

// Flashcard section component
const FlashcardSection = ({ alphabet, mode, onRestart }) => {
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    // Shuffle the deck whenever the alphabet or mode changes
    setDeck(shuffleArray(alphabet));
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  }, [alphabet, mode]);

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleNextCard = () => {
    setIsFlipped(false); // Reset flip state for the next card
    setTimeout(() => {
      if (currentIndex < deck.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setSessionCompleted(true);
      }
    }, 300); // Wait for the flip animation to finish
  };

  if (sessionCompleted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 animate-fadeIn">
        <h2 className="text-4xl font-bold text-gray-800">Session Complete!</h2>
        <p className="text-lg text-gray-600 text-center max-w-sm">
          You've gone through all the characters. Great job!
        </p>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          Start New Session
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 h-full">
      {deck.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-indigo-500" />
        </div>
      ) : (
        <>
      <div className="relative">
        <Flashcard card={deck[currentIndex]} isFlipped={isFlipped} mode={mode} />
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
        <button
          onClick={handleFlip}
          className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-full shadow-lg hover:bg-purple-600 transition duration-300 transform hover:scale-105"
        >
          {isFlipped ? 'Hide Answer' : 'Show Answer'}
        </button>
        <button
          onClick={handleNextCard}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105"
        >
          {currentIndex < deck.length - 1 ? 'Next Card' : 'Finish Session'}
        </button>
      </div>
      <div className="text-sm text-gray-500 mt-4">
        Card {currentIndex + 1} of {deck.length}
      </div>
        </>
      )}
    </div>
  );
};

// Translation section component
const TranslationSection = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef(null);

  // Detect if input is Romaji using wanakana
  const isRomaji = (text) => isRomajiText(text, { allowPunctuation: true, allowSpace: true });

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (text.trim() === '') {
      setTranslatedText('');
      return;
    }

    // Debounce the API call
    debounceTimeout.current = setTimeout(() => {
      translate(text);
    }, 500); // 500ms debounce time
  };

  const translate = async (text) => {
    setIsLoading(true);
    const romajiInput = isRomaji(text);
    // If Romaji -> convert to kana and translate ja->en
    // If English -> translate en->ja, then convert result to romaji
    const sourceLang = romajiInput ? 'ja' : 'en';
    const targetLang = romajiInput ? 'en' : 'ja';

    let retryCount = 0;
    const maxRetries = 5;
    const initialDelay = 1000;

    while (retryCount < maxRetries) {
        try {
            const url = `https://libretranslate.com/translate`;
            const payload = {
                q: romajiInput ? toKana(text) : text,
                source: sourceLang,
                target: targetLang,
                format: 'text',
                api_key: '' // LibreTranslate is free for up to 20k characters/day without a key
            };

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                // Handle non-2xx responses
                if (response.status === 429) {
                    throw new Error('Too many requests, retrying...');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Handle the case where the translation result is unexpectedly empty
            if (data && data.translatedText) {
                const output = romajiInput ? data.translatedText : toRomaji(data.translatedText);
                setTranslatedText(output);
            } else {
                setTranslatedText('Translation not found. Please try again.');
            }
            break; // Exit the loop on success
        } catch (error) {
            console.error('Translation error:', error);
            // Exponential backoff
            const delay = initialDelay * Math.pow(2, retryCount);
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay));
            retryCount++;
        }
    }
    setIsLoading(false);

    if (retryCount === maxRetries) {
        setTranslatedText('Failed to translate after multiple retries. Please check your network connection.');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center space-y-6 h-full p-4">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Translation</h2>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <textarea
          className="w-full h-32 p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="Enter text here..."
          value={inputText}
          onChange={handleInputChange}
        />
        <div className="mt-4 flex items-center justify-between text-gray-600 font-medium">
          <p>
            Language Detected: <span className="font-bold text-indigo-600">{isRomaji(inputText) ? 'English' : 'Japanese'}</span>
          </p>
          <p>
            Translating to: <span className="font-bold text-indigo-600">{isRomaji(inputText) ? 'Japanese' : 'English'}</span>
          </p>
        </div>
      </div>
      <div className="w-full max-w-2xl bg-gray-100 rounded-xl shadow-inner p-6 min-h-[100px] flex items-center justify-center">
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-500" />
        ) : (
          <p className="text-xl text-gray-800 text-center select-text">{translatedText}</p>
        )}
      </div>
    </div>
  );
};

// Main App component
export default function App() {
  const [view, setView] = useState('flashcards');
  const [alphabet, setAlphabet] = useState(hiragana);
  const [mode, setMode] = useState('charToRomaji'); // 'charToRomaji' or 'romajiToChar'

  // Function to restart the flashcard session
  const handleRestartSession = () => {
    // This will trigger the useEffect in FlashcardSection to re-shuffle and reset
    setAlphabet(prev => [...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header and Navigation */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-indigo-600 mb-2">Japanese Learning Hub</h1>
          <p className="text-lg text-gray-500">Your practice for Hiragana, Katakana, and translation.</p>
          <KonnichiwaTypewriter />
          <nav className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setView('flashcards')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                view === 'flashcards' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setView('translator')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                view === 'translator' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              Translator
            </button>
          </nav>
        </header>

        {/* Dynamic Content Section */}
        <main className="min-h-[500px] flex items-center justify-center bg-gray-200 rounded-2xl shadow-inner p-6">
          {view === 'flashcards' ? (
            <div className="flex flex-col items-center w-full space-y-6">
              {/* Flashcard Options */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setAlphabet(hiragana)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                      alphabet === hiragana ? 'bg-blue-500 text-white shadow' : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Hiragana
                  </button>
                  <button
                    onClick={() => setAlphabet(katakana)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                      alphabet === katakana ? 'bg-blue-500 text-white shadow' : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Katakana
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setMode('charToRomaji')}
                    className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                      mode === 'charToRomaji' ? 'bg-blue-500 text-white shadow' : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Character → Romaji
                  </button>
                  <button
                    onClick={() => setMode('romajiToChar')}
                    className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                      mode === 'romajiToChar' ? 'bg-blue-500 text-white shadow' : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Romaji → Character
                  </button>
                </div>
              </div>
              <FlashcardSection alphabet={alphabet} mode={mode} onRestart={handleRestartSession} />
            </div>
          ) : (
            <TranslationSection />
          )}
          
        </main>
        <footer className="mt-12 rounded-t-2xl">
  <div className="flex flex-col items-center justify-center py-6 space-y-3 text-sm text-gray-600">
    <p>
      Developed with ❤️ by{" "}
      <span className="font-semibold text-gray-800">Hithesh N Poojary </span>
    </p>

    <div className="flex space-x-4">
      <a
        href="https://github.com/HitheshPoojary187"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-3 py-1.5 bg-white shadow-md rounded-full text-indigo-600 hover:text-white hover:bg-indigo-600 transition duration-300 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path d="M12 .5C5.648.5.5 5.647.5 12c0 5.086 3.292 9.396 7.868 10.918.575.106.787-.25.787-.556v-2.06c-3.2.695-3.87-1.538-3.87-1.538-.523-1.33-1.28-1.686-1.28-1.686-1.046-.715.08-.7.08-.7 1.155.082 1.763 1.186 1.763 1.186 1.029 1.762 2.699 1.253 3.357.958.104-.746.402-1.253.73-1.541-2.554-.291-5.238-1.277-5.238-5.683 0-1.256.45-2.283 1.186-3.088-.12-.29-.514-1.463.112-3.052 0 0 .966-.309 3.165 1.179a11.02 11.02 0 012.88-.387c.977.004 1.963.132 2.88.387 2.198-1.488 3.163-1.179 3.163-1.179.628 1.589.234 2.762.114 3.052.738.805 1.185 1.832 1.185 3.088 0 4.418-2.688 5.388-5.253 5.672.41.354.776 1.055.776 2.126v3.146c0 .31.21.668.793.554C20.713 21.39 24 17.08 24 12c0-6.353-5.148-11.5-12-11.5z" />
        </svg>
        GitHub
      </a>
    </div>
  </div>
</footer>

      </div>
    </div>
  );
}

