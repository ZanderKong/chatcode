(function (global) {
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatInline(text) {
    return text
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function renderTableRow(row, cellTag) {
    const cells = row.split('|').filter(Boolean).map((cell) => cell.trim());
    const content = cells.map((cell) => `<${cellTag}>${formatInline(escapeHtml(cell))}</${cellTag}>`).join('');
    return `<tr>${content}</tr>`;
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    let html = '';
    let inList = false;
    let inBlockquote = false;
    let inCode = false;
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('```')) {
        if (!inCode) {
          html += '<pre><code>';
          inCode = true;
        } else {
          html += '</code></pre>';
          inCode = false;
        }
        continue;
      }

      if (inCode) {
        html += `${escapeHtml(line)}\n`;
        continue;
      }

      // Table detection
      const nextLine = lines[i + 1]?.trim() ?? '';
      if (!inTable && trimmed.includes('|') && /^\|?\s*:?[-]{3,}/.test(nextLine)) {
        html += '<table><thead>' + renderTableRow(trimmed, 'th') + '</thead><tbody>';
        i++; // skip separator line
        inTable = true;
        continue;
      }
      if (inTable) {
        if (!trimmed || !trimmed.includes('|')) {
          html += '</tbody></table>';
          inTable = false;
        } else {
          html += renderTableRow(trimmed, 'td');
          continue;
        }
      }

      if (!trimmed && inBlockquote) {
        html += '</blockquote>';
        inBlockquote = false;
        continue;
      }
      if (!trimmed && inList) {
        html += '</ul>';
        inList = false;
        continue;
      }
      if (!trimmed) {
        continue;
      }

      if (trimmed.startsWith('>')) {
        if (!inBlockquote) {
          html += '<blockquote>';
          inBlockquote = true;
        }
        html += formatInline(escapeHtml(trimmed.slice(1).trim()));
        continue;
      }

      if (/^[-*] /.test(trimmed)) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${formatInline(escapeHtml(trimmed.replace(/^[-*]\s+/, '')))}</li>`;
        continue;
      }

      if (/^#{3}\s+/.test(trimmed)) {
        html += `<h3>${formatInline(escapeHtml(trimmed.replace(/^#{3}\s+/, '')))}</h3>`;
        continue;
      }
      if (/^#{2}\s+/.test(trimmed)) {
        html += `<h2>${formatInline(escapeHtml(trimmed.replace(/^#{2}\s+/, '')))}</h2>`;
        continue;
      }
      if (/^#\s+/.test(trimmed)) {
        html += `<h1>${formatInline(escapeHtml(trimmed.replace(/^#\s+/, '')))}</h1>`;
        continue;
      }

      html += `<p>${formatInline(escapeHtml(trimmed))}</p>`;
    }

    if (inList) html += '</ul>';
    if (inBlockquote) html += '</blockquote>';
    if (inTable) html += '</tbody></table>';

    return html;
  }

  global.markedLite = { render: renderMarkdown };
})(window);
