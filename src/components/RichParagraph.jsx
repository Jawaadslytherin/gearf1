import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * A contenteditable paragraph editor that supports inline hyperlinks.
 * Stores content as an HTML string (plain text + <a> tags only).
 */
export default function RichParagraph({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [toolbar, setToolbar] = useState(null); // { top, left, selectedText }
  const [linkInput, setLinkInput] = useState('');
  const savedRangeRef = useRef(null);

  // Sync external value → DOM (only when not focused)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement !== el && el.innerHTML !== value) {
      el.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    onChange(el.innerHTML);
  }, [onChange]);

  const saveRange = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreRange = useCallback(() => {
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setToolbar(null);
      return;
    }
    const text = sel.toString().trim();
    if (!text) { setToolbar(null); return; }

    saveRange();

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    setToolbar({
      top: rect.top - editorRect.top - 44,
      left: Math.max(0, rect.left - editorRect.left + rect.width / 2 - 120),
      selectedText: text,
    });
    setLinkInput('');
  }, [saveRange]);

  const handleKeyUp = useCallback((e) => {
    if (e.shiftKey) handleMouseUp();
  }, [handleMouseUp]);

  const applyLink = useCallback(() => {
    if (!linkInput.trim()) return;
    const url = linkInput.trim().startsWith('http') ? linkInput.trim() : `https://${linkInput.trim()}`;

    restoreRange();
    editorRef.current.focus();

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    document.execCommand('createLink', false, url);

    // Set target="_blank" and rel on newly created links
    editorRef.current.querySelectorAll('a').forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });

    onChange(editorRef.current.innerHTML);
    setToolbar(null);
    setLinkInput('');
  }, [linkInput, restoreRange, onChange]);

  const removeLink = useCallback(() => {
    restoreRange();
    editorRef.current.focus();
    document.execCommand('unlink', false, null);
    onChange(editorRef.current.innerHTML);
    setToolbar(null);
  }, [restoreRange, onChange]);

  const handleToolbarMouseDown = useCallback((e) => {
    e.preventDefault(); // prevent blur
  }, []);

  return (
    <div className="relative">
      {toolbar && (
        <div
          onMouseDown={handleToolbarMouseDown}
          style={{
            position: 'absolute',
            top: toolbar.top,
            left: toolbar.left,
            zIndex: 50,
            background: '#18181b',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            minWidth: '260px',
          }}
        >
          <input
            type="text"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') applyLink(); if (e.key === 'Escape') setToolbar(null); }}
            placeholder="https://example.com"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fafafa',
              fontSize: '13px',
              minWidth: 0,
            }}
            autoFocus
          />
          <button
            onClick={applyLink}
            style={{
              background: '#ef4444',
              border: 'none',
              borderRadius: '5px',
              color: '#fff',
              fontSize: '12px',
              padding: '4px 10px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Add link
          </button>
          <button
            onClick={removeLink}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '5px',
              color: '#a3a3a3',
              fontSize: '12px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
          <button
            onClick={() => setToolbar(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#737373',
              fontSize: '16px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 2px',
            }}
          >
            ×
          </button>
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onMouseUp={handleMouseUp}
        onKeyUp={handleKeyUp}
        onBlur={() => { onChange(editorRef.current?.innerHTML || ''); }}
        data-placeholder={placeholder}
        style={{
          minHeight: '96px',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.04)',
          color: '#fafafa',
          fontSize: '14px',
          lineHeight: '1.6',
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          resize: 'vertical',
          overflow: 'auto',
        }}
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #525252;
          pointer-events: none;
        }
        [contenteditable] a {
          color: #ef4444;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
