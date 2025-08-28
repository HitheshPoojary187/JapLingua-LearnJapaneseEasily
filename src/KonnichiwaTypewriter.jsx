import React, { useEffect, useState } from "react";

const KonnichiwaTypewriter = () => {
  const phrases = ["こんにちは", " Konnichiwa"];
  const [text, setText] = useState("");
  const [line, setLine] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typeSpeed = 120;
  const deleteSpeed = 60;
  const pauseDelay = 1000;

  useEffect(() => {
    let timeout;

    if (!isDeleting && text.length < phrases[line].length) {
      // typing forward
      timeout = setTimeout(() => {
        setText(phrases[line].slice(0, text.length + 1));
      }, typeSpeed);
    } else if (!isDeleting && text.length === phrases[line].length) {
      // pause before deleting or moving to next
      timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
    } else if (isDeleting && text.length > 0) {
      // deleting backwards
      timeout = setTimeout(() => {
        setText(phrases[line].slice(0, text.length - 1));
      }, deleteSpeed);
    } else if (isDeleting && text.length === 0) {
      // finished deleting → move to next line or loop back
      setIsDeleting(false);
      setLine((line + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, line, phrases]);

  return (
    <div style={{ fontFamily: "monospace", fontSize: "2rem", fontWeight: "bold" }}>
      {text}
      <span
        style={{
          display: "inline-block",
          width: "0.1em",
          backgroundColor: "black",
          marginLeft: "2px",
          animation: "blink 1s steps(1) infinite",
        }}
      ></span>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50.1%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default KonnichiwaTypewriter;
