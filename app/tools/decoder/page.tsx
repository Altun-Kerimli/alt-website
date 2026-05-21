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
      className={`text-[9px] px-1.5 py-0.5 rounded transition ${copied ? "bg-neutral-200 text-neutral-900 font-bold" : "border border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-500"} disabled:opacity-20 disabled:cursor-not-allowed`}
    >
      {copied ? "[ COPIED ]" : "[ COPY ]"}
    </button>
  );
};

export default function DecoderPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ToolTab>("base");
  const [showInfo, setShowInfo] = useState(false);

  // --- BASE CONVERTER STATE ---
  const [bases, setBases] = useState({ dec: "", bin: "", oct: "", hex: "" });

  // --- MORSE CONVERTER STATE ---
  const [language, setLanguage] = useState<LanguageMode>("English");
  const [morseMode, setMorseMode] = useState<"toMorse" | "toText">("toMorse");
  const [morseInput, setMorseInput] = useState("");
  const [morseOutput, setMorseOutput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- BASE CONVERTER LOGIC ---
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

  // --- MORSE CONVERTER LOGIC ---
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

  // Derived arrays for the Morse Information Matrix
  const currentDict = DICTIONARIES[language];
  const dictLetters = Object.entries(currentDict).filter(([k]) => !/^[0-9]+$/.test(k));
  const dictNumbers = Object.entries(currentDict).filter(([k]) => /^[0-9]+$/.test(k));

  if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-12 space-y-8 mb-16">
      <header className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-mono font-bold tracking-tight">/tools/decoder</h1>
        <p className="text-xs text-neutral-500 mt-1">Numerical base conversion and cryptographic ciphers.</p>
      </header>

      {/* --- TAB NAVIGATION (Equal Width Forced via Grid) --- */}
      <div className="grid grid-cols-2 border-b border-neutral-800 font-mono text-xs w-full">
        <button
          onClick={() => setActiveTab("base")}
          className={`text-center py-3 border-b-2 transition uppercase tracking-wider ${
            activeTab === "base"
              ? "border-neutral-200 text-neutral-100 font-bold"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          [ Base Converter ]
        </button>
        <button
          onClick={() => setActiveTab("morse")}
          className={`text-center py-3 border-b-2 transition uppercase tracking-wider ${
            activeTab === "morse"
              ? "border-neutral-200 text-neutral-100 font-bold"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          [ Morse Cipher ]
        </button>
      </div>

      {/* --- INFO TOGGLE CONTROL --- */}
      <div className="flex justify-end -mt-4">
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={`text-[10px] font-mono px-2 py-1 border transition rounded ${showInfo ? "bg-neutral-800 text-neutral-100 border-neutral-600" : "bg-transparent text-neutral-500 border-neutral-800 hover:text-neutral-300"}`}
        >
          [ i ] SYSTEM DOCS
        </button>
      </div>

      {/* --- INFO MATRIX --- */}
      {showInfo && (
        <div className="p-5 border border-neutral-800 bg-neutral-900/40 rounded animate-in fade-in slide-in-from-top-2 duration-200">
          {activeTab === "base" ? (
            <div className="space-y-2 font-mono text-xs text-neutral-400">
              <h3 className="text-neutral-200 font-bold mb-3 border-b border-neutral-800 pb-1">Numerical Radix Conversions</h3>
              <p>This tool translates data between structural numerical bases instantaneously.</p>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li><strong className="text-neutral-300">Decimal (Base 10):</strong> Standard human counting system (0-9).</li>
                <li><strong className="text-neutral-300">Binary (Base 2):</strong> Core machine state logic (0, 1).</li>
                <li><strong className="text-neutral-300">Octal (Base 8):</strong> Legacy computing file permissions (0-7).</li>
                <li><strong className="text-neutral-300">Hexadecimal (Base 16):</strong> Modern memory addresses and color codes (0-9, A-F).</li>
              </ul>
            </div>
          ) : (
            <div className="font-mono text-xs text-neutral-400 space-y-6">
              <div>
                <h3 className="text-neutral-200 font-bold mb-3 border-b border-neutral-800 pb-1 uppercase">{language} Alphabet</h3>
                {/* Top-to-Bottom Flow using CSS Columns */}
                <div className="columns-2 sm:columns-3 md:columns-4 gap-x-12 space-y-1">
                  {dictLetters.map(([char, code]) => (
                  <div key={char} className="flex items-end gap-x-6 border-b border-neutral-800/50 pb-0.5 break-inside-avoid">
                    <span className="text-neutral-300 font-bold">{char}</span>
                    <span className="tracking-[0.2em]">{code}</span>
                  </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-neutral-200 font-bold mb-3 border-b border-neutral-800 pb-1">Numbers</h3>
                <div className="columns-2 sm:columns-3 md:columns-4 gap-x-12 space-y-1">
                  {dictNumbers.map(([char, code]) => (
                  <div key={char} className="flex items-end gap-x-6 border-b border-neutral-800/50 pb-0.5 break-inside-avoid">
                    <span className="text-neutral-300 font-bold">{char}</span>
                    <span className="tracking-[0.2em]">{code}</span>
                  </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="min-h-[400px]">
        {/* --- TAB 1: NUMERICAL BASE CONVERTER --- */}
        {activeTab === "base" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-sm font-mono text-neutral-400">Base Data Matrix</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500">Decimal (10)</label>
                  <CopyButton text={bases.dec} />
                </div>
                <input
                  type="text"
                  value={bases.dec}
                  onChange={(e) => handleBaseChange('dec', e.target.value)}
                  placeholder="255"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600 font-mono text-neutral-200 transition"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500">Binary (2)</label>
                  <CopyButton text={bases.bin} />
                </div>
                <input
                  type="text"
                  value={bases.bin}
                  onChange={(e) => handleBaseChange('bin', e.target.value)}
                  placeholder="11111111"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600 font-mono text-neutral-200 transition"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500">Octal (8)</label>
                  <CopyButton text={bases.oct} />
                </div>
                <input
                  type="text"
                  value={bases.oct}
                  onChange={(e) => handleBaseChange('oct', e.target.value)}
                  placeholder="377"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600 font-mono text-neutral-200 transition"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500">Hex (16)</label>
                  <CopyButton text={bases.hex} />
                </div>
                <input
                  type="text"
                  value={bases.hex}
                  onChange={(e) => handleBaseChange('hex', e.target.value)}
                  placeholder="FF"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600 font-mono text-neutral-200 transition uppercase"
                />
              </div>
            </div>
          </section>
        )}

        {/* --- TAB 2: MORSE CODE CIPHER --- */}
        {activeTab === "morse" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-end border-b border-neutral-800 pb-2">
              <h2 className="text-sm font-mono text-neutral-400">Morse Code Cipher</h2>
              
              <div className="flex gap-4">
                <select
                  value={language}
                  onChange={(e) => { setLanguage(e.target.value as LanguageMode); setMorseInput(""); }}
                  className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-mono px-2 py-1 outline-none rounded focus:border-neutral-600 transition"
                >
                  <option value="English">ENG</option>
                  <option value="Russian">RUS</option>
                  <option value="Turkish">TUR</option>
                </select>

                <button 
                  onClick={() => { setMorseMode(morseMode === "toMorse" ? "toText" : "toMorse"); setMorseInput(""); }}
                  className="text-[10px] font-mono border border-neutral-700 bg-neutral-800 px-2 py-1 rounded text-neutral-300 hover:bg-neutral-700 transition"
                >
                  {morseMode === "toMorse" ? "Text → Morse" : "Morse → Text"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500">
                    {morseMode === "toMorse" ? `Input Text (${language})` : "Input Morse Code (Use spaces between letters, / between words)"}
                  </label>
                  <CopyButton text={morseInput} />
                </div>
                <textarea
                  value={morseInput}
                  onChange={(e) => setMorseInput(e.target.value)}
                  placeholder={morseMode === "toMorse" ? "Type payload here..." : ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2 text-sm outline-none focus:border-neutral-600 font-mono text-neutral-200 transition min-h-[120px] resize-y"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500">
                    {morseMode === "toMorse" ? "Output Morse Code" : `Output Text (${language})`}
                  </label>
                  <CopyButton text={morseOutput} />
                </div>
                <textarea
                  readOnly
                  value={morseOutput}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-sm outline-none font-mono text-neutral-400 min-h-[120px] resize-y cursor-not-allowed"
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}