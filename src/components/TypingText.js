import React, { useEffect, useState, useMemo } from 'react';
import '../styles/typingText.css';

// Tracks which instances have already played their typing animation, so it only
// runs on first load and not again when the user navigates back (which remounts
// the component). Resets on a full page reload.
const typedIds = new Set();

const TypingText = ({ content, speed = 40, className = 'typing-text', id = 'default' }) => {
  // Normalise mixed string / { text, className } items into uniform segments.
  const segments = useMemo(
    () =>
      content.map((seg) =>
        typeof seg === 'string' ? { text: seg, className: null } : seg
      ),
    [content]
  );

  const totalLength = useMemo(
    () => segments.reduce((sum, s) => sum + s.text.length, 0),
    [segments]
  );

  // Start fully revealed if this instance already typed once this session.
  const [count, setCount] = useState(() => (typedIds.has(id) ? Infinity : 0));

  // Restart typing when content changes — unless it has already played.
  useEffect(() => {
    setCount(typedIds.has(id) ? totalLength : 0);
  }, [segments, id, totalLength]);

  useEffect(() => {
    if (count >= totalLength) {
      typedIds.add(id);
      return;
    }
    const timeout = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(timeout);
  }, [count, totalLength, speed, id]);

  // Render segments revealing the first `reveal` characters (null = the full
  // text). Each styled run stays a single span so .dev / .skill apply per word.
  const renderSegments = (reveal) => {
    let remaining = reveal;
    return segments.map((seg, i) => {
      const shown = reveal == null ? seg.text : seg.text.slice(0, Math.max(0, remaining));
      if (reveal != null) remaining -= seg.text.length;
      return seg.className ? (
        <span key={i} className={seg.className}>
          {shown}
        </span>
      ) : (
        <React.Fragment key={i}>{shown}</React.Fragment>
      );
    });
  };

  return (
    <p className={className}>
      {/* Ghost: full text, hidden — reserves the final height so the card
          doesn't grow line-by-line while typing. */}
      <span className="typing-ghost" aria-hidden="true">
        {renderSegments(null)}
      </span>
      {/* Visible typed text overlaid on top of the ghost. */}
      <span className="typing-visible">
        {renderSegments(count)}
        {count < totalLength && <span className="cursor" />}
      </span>
    </p>
  );
};

export default TypingText;
