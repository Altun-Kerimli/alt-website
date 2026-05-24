"use client";

import { useState, useEffect } from "react";

// --- MORSE DICTIONARIES ---
const MORSE_ENGLISH: Record<string, string> = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.", "H": "....", "I": "..", 
  "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", 
  "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----."
};

const MORSE_RUSSIAN: Record<string, string> = {
  "А": ".-", "Б": "-...", "В": ".--", "Г": "--.", "Д": "-..", "Е": ".", "Ё": ".", "Ж": "...-", "З": "--..", 
  "И": "..", "Й": ".---", "К": "-.-", "Л": ".-..", "М": "--", "Н": "-.", "О": "---", "П": ".--.", "Р": ".-.", 
  "С": "...", "Т": "-", "У": "..-", "Ф": "..-.", "Х": "....", "Ц": "-.-.", "Ч": "---.", "Ш": "----", "Щ": "--.-", 
  "Ъ": "-..-", "Ы": "-.--", "Ь": "-..-", "Э": "..-..", "Ю": "..--", "Я": ".-.-",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----."
};

const MORSE_TURKISH: Record<string, string> = {
  ...MORSE_ENGLISH, 
  "Ç": "-.-..", "Ğ": "--.-.", "Ö": "---.", "Ş": "----", "Ü": "..--", "İ": "..", "I": ".." 
};

const DICTIONARIES = {
  English: MORSE_ENGLISH,
  Russian: MORSE_RUSSIAN,
  Turkish: MORSE_TURKISH
};

type LanguageMode = "English" | "Russian" | "Turkish";
type ToolTab = "base" | "morse";

// Clipboard Utility Component
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      disabled={!text}
      className={`text-[10px] font-bold px-3 py-1 rounded transition-colors duration-200 uppercase tracking-wider ${
        copied 
          ? "bg-red-600 text-white border-transparent" 
          : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export default function DecoderPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ToolTab>("base");
  const [showInfo, setShowInfo] = useState(false);

  const [bases, setBases] = useState({ dec: "", bin: "", oct: "", hex: "" });
  const [language, setLanguage] = useState<LanguageMode>("English");
  const [morseMode, setMorseMode] = useState<"toMorse" | "toText">("toMorse");
  const [morseInput, setMorseInput] = useState("");
  const [morseOutput, setMorseOutput] = useState("");

  useEffect(() => setMounted(true), []);

  const handleBaseChange = (base: keyof typeof bases, value: string) => {
    if (!value.trim()) {
      setBases({ dec: "", bin: "", oct: "", hex: "" });
      return;
    }

    let parsed = NaN;
    try {
      if (base === 'dec' && /^\d+$/.test(value)) parsed = parseInt(value, 10);
      if (base === 'bin' && /^[01]+$/.test(value)) parsed = parseInt(value, 2);
      if (base === 'oct' && /^[0-7]+$/.test(value)) parsed = parseInt(value, 8);
      if (base === 'hex' && /^[0-9A-Fa-f]+$/.test(value)) parsed = parseInt(value, 16);

      if (!isNaN(parsed)) {
        setBases({
          dec: parsed.toString(10),
          bin: parsed.toString(2),
          oct: parsed.toString(8),
          hex: parsed.toString(16).toUpperCase()
        });
      } else {
        setBases((prev) => ({ ...prev, [base]: value }));
      }
    } catch {
      setBases((prev) => ({ ...prev, [base]: value }));
    }
  };

  useEffect(() => {
    if (!morseInput.trim()) {
      setMorseOutput("");
      return;
    }

    const dict = DICTIONARIES[language];
    
    if (morseMode === "toMorse") {
      const chars = morseInput.toUpperCase().split("");
      const translated = chars.map(char => {
        if (char === " ") return "/"; 
        return dict[char] || char; 
      }).join(" ");
      setMorseOutput(translated);
    } else {
      const revDict = Object.entries(dict).reduce((acc, [k, v]) => {
        acc[v] = k;
        return acc;
      }, {} as Record<string, string>);

      const words = morseInput.split(" / ");
      const translated = words.map(word => {
        const letters = word.trim().split(" ");
        return letters.map(l => revDict[l] || l).join("");
      }).join(" ");
      
      setMorseOutput(translated);
    }
  }, [morseInput, morseMode, language]);

  const currentDict = DICTIONARIES[language];
  const dictLetters = Object.entries(currentDict).filter(([k]) => !/^[0-9]+$/.test(k));
  const dictNumbers = Object.entries(currentDict).filter(([k]) => /^[0-9]+$/.test(k));

  if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-black mx-auto px-6 md:px-12 py-16 space-y-8">
      
      <header className="border-b border-black/10 dark:border-white/10 pb-5 flex flex-col gap-2 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-red-600 rounded-sm"></div> 
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white transition-colors">Tools <span className="text-neutral-300 dark:text-neutral-700">/</span> Decoder</h1>
        </div>
      </header>

      {/* --- TAB NAVIGATION --- */}
      <div className="grid grid-cols-2 border-b border-black/10 dark:border-white/10 font-bold text-sm w-full transition-colors">
        <button
          onClick={() => setActiveTab("base")}
          className={`text-center py-4 border-b-[3px] transition-all uppercase tracking-widest ${
            activeTab === "base"
              ? "border-red-600 text-red-600"
              : "border-transparent text-neutral-400 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20"
          }`}
        >
          Base Converter
        </button>
        <button
          onClick={() => setActiveTab("morse")}
          className={`text-center py-4 border-b-[3px] transition-all uppercase tracking-widest ${
            activeTab === "morse"
              ? "border-red-600 text-red-600"
              : "border-transparent text-neutral-400 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20"
          }`}
        >
          Morse Cipher
        </button>
      </div>

      {/* --- INFO TOGGLE CONTROL --- */}
      <div className="flex justify-end mt-2">
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={`text-[10px] font-bold px-3 py-1.5 transition-colors rounded uppercase tracking-wider ${
            showInfo 
              ? "bg-black dark:bg-white text-white dark:text-black border border-transparent" 
              : "bg-white dark:bg-black text-neutral-500 dark:text-neutral-400 border border-black/10 dark:border-white/10 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30"
          }`}
        >
          info
        </button>
      </div>

      {/* --- INFO MATRIX --- */}
      {showInfo && (
        <div className="p-6 border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm transition-colors">
          {activeTab === "base" ? (
            <div className="space-y-3 font-medium text-sm text-neutral-600 dark:text-neutral-400">
              <h3 className="text-black dark:text-white font-extrabold mb-3 border-b border-black/5 dark:border-white/10 pb-2 uppercase tracking-wider transition-colors">Numerical Radix Conversions</h3>
              <p>This tool translates data between structural numerical bases instantaneously.</p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li><strong className="text-black dark:text-white">Decimal (Base 10):</strong> Standard human counting system (0-9).</li>
                <li><strong className="text-black dark:text-white">Binary (Base 2):</strong> Core machine state logic (0, 1).</li>
                <li><strong className="text-black dark:text-white">Octal (Base 8):</strong> Legacy computing file permissions (0-7).</li>
                <li><strong className="text-black dark:text-white">Hexadecimal (Base 16):</strong> Modern memory addresses and color codes (0-9, A-F).</li>
              </ul>
            </div>
          ) : (
            <div className="font-medium text-sm text-neutral-600 dark:text-neutral-400 space-y-8">
              <div>
                <h3 className="text-black dark:text-white font-extrabold mb-4 border-b border-black/5 dark:border-white/10 pb-2 uppercase tracking-wider transition-colors">{language} Alphabet</h3>
                <div className="columns-2 sm:columns-3 md:columns-4 gap-x-12 space-y-2">
                  {dictLetters.map(([char, code]) => (
                  <div key={char} className="flex items-center justify-between gap-x-6 border-b border-black/5 dark:border-white/5 pb-1 break-inside-avoid">
                    <span className="text-black dark:text-white font-bold text-base">{char}</span>
                    <span className="font-mono tracking-[0.2em] font-bold text-red-600">{code}</span>
                  </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-black dark:text-white font-extrabold mb-4 border-b border-black/5 dark:border-white/10 pb-2 uppercase tracking-wider transition-colors">Numbers</h3>
                <div className="columns-2 sm:columns-3 md:columns-4 gap-x-12 space-y-2">
                  {dictNumbers.map(([char, code]) => (
                  <div key={char} className="flex items-center justify-between gap-x-6 border-b border-black/5 dark:border-white/5 pb-1 break-inside-avoid">
                    <span className="text-black dark:text-white font-bold text-base">{char}</span>
                    <span className="font-mono tracking-[0.2em] font-bold text-red-600">{code}</span>
                  </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="min-h-[400px]">
        
        {/* --- TAB 1: BASE CONVERTER --- */}
        {activeTab === "base" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider border-l-4 border-red-600 pl-3 transition-colors">Base Data Matrix</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-3 p-6 border border-black/5 dark:border-white/10 rounded-2xl bg-white dark:bg-black shadow-sm transition-colors">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Decimal (10)</label>
                  <CopyButton text={bases.dec} />
                </div>
                <input
                  type="text"
                  value={bases.dec}
                  onChange={(e) => handleBaseChange('dec', e.target.value)}
                  placeholder="255"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-mono font-bold text-black dark:text-white outline-none focus:border-red-600 dark:focus:border-red-600 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                />
              </div>
              
              <div className="space-y-3 p-6 border border-black/5 dark:border-white/10 rounded-2xl bg-white dark:bg-black shadow-sm transition-colors">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Binary (2)</label>
                  <CopyButton text={bases.bin} />
                </div>
                <input
                  type="text"
                  value={bases.bin}
                  onChange={(e) => handleBaseChange('bin', e.target.value)}
                  placeholder="11111111"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-mono font-bold text-black dark:text-white outline-none focus:border-red-600 dark:focus:border-red-600 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                />
              </div>
              
              <div className="space-y-3 p-6 border border-black/5 dark:border-white/10 rounded-2xl bg-white dark:bg-black shadow-sm transition-colors">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Octal (8)</label>
                  <CopyButton text={bases.oct} />
                </div>
                <input
                  type="text"
                  value={bases.oct}
                  onChange={(e) => handleBaseChange('oct', e.target.value)}
                  placeholder="377"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-mono font-bold text-black dark:text-white outline-none focus:border-red-600 dark:focus:border-red-600 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                />
              </div>
              
              <div className="space-y-3 p-6 border border-black/5 dark:border-white/10 rounded-2xl bg-white dark:bg-black shadow-sm transition-colors">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Hexadecimal (16)</label>
                  <CopyButton text={bases.hex} />
                </div>
                <input
                  type="text"
                  value={bases.hex}
                  onChange={(e) => handleBaseChange('hex', e.target.value)}
                  placeholder="FF"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-mono font-bold text-black dark:text-white outline-none focus:border-red-600 dark:focus:border-red-600 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-red-600/20 transition-all uppercase placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>
          </section>
        )}

        {/* --- TAB 2: MORSE CIPHER --- */}
        {activeTab === "morse" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-black/10 dark:border-white/10 pb-4 transition-colors">
              <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider border-l-4 border-red-600 pl-3">Cipher Engine</h2>
              
              <div className="flex gap-3">
                <select
                  value={language}
                  onChange={(e) => { setLanguage(e.target.value as LanguageMode); setMorseInput(""); }}
                  className="bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-black dark:text-white text-xs font-bold px-3 py-2 outline-none rounded-lg focus:border-red-600 transition-colors uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  <option value="English">ENG</option>
                  <option value="Russian">RUS</option>
                  <option value="Turkish">TUR</option>
                </select>

                <button 
                  onClick={() => { setMorseMode(morseMode === "toMorse" ? "toText" : "toMorse"); setMorseInput(""); }}
                  className="text-xs font-bold uppercase tracking-wider border border-black/10 dark:border-transparent bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-lg text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors shadow-sm"
                >
                  {morseMode === "toMorse" ? "Text → Morse" : "Morse → Text"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-3 p-6 border border-black/5 dark:border-white/10 rounded-2xl bg-white dark:bg-black shadow-sm flex flex-col h-full transition-colors">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                    {morseMode === "toMorse" ? `Input Text (${language})` : "Input Morse Code"}
                  </label>
                  <CopyButton text={morseInput} />
                </div>
                <textarea
                  value={morseInput}
                  onChange={(e) => setMorseInput(e.target.value)}
                  placeholder={morseMode === "toMorse" ? "Type payload here..." : ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-xl px-4 py-4 text-base font-mono font-bold text-black dark:text-white outline-none focus:border-red-600 dark:focus:border-red-600 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-red-600/20 transition-all flex-1 min-h-[200px] resize-none placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                />
              </div>

              <div className="space-y-3 p-6 border border-black/5 dark:border-white/10 rounded-2xl bg-white dark:bg-black shadow-sm flex flex-col h-full transition-colors">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                    {morseMode === "toMorse" ? "Output Morse Code" : `Output Text (${language})`}
                  </label>
                  <CopyButton text={morseOutput} />
                </div>
                <textarea
                  readOnly
                  value={morseOutput}
                  className="w-full bg-neutral-100 dark:bg-neutral-900/50 border border-black/5 dark:border-white/5 rounded-xl px-4 py-4 text-base font-mono font-bold text-neutral-950 dark:text-neutral-50 outline-none flex-1 min-h-[200px] resize-none cursor-not-allowed transition-colors"
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}