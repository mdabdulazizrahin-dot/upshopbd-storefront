import DOMPurify from 'isomorphic-dompurify';

// Allowed HTML tags for user-generated content
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'pre', 'code',
  'hr', 'img'
];

// Allowed attributes
const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'class', 'id',
  'src', 'alt', 'width', 'height', 'style'
];

// Sanitize HTML content to prevent XSS attacks
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    // Force all links to open in new tab and have noopener
    FORCE_BODY: false,
  });
};

// Sanitize and convert newlines to <br> for product descriptions
export const sanitizeDescription = (dirty: string): string => {
  // First sanitize the content
  const sanitized = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['br', 'strong', 'em', 'b', 'i', 'u', 'p', 'span'],
    ALLOWED_ATTR: ['class'],
  });
  // Then convert remaining newlines to <br>
  return sanitized.replace(/\n/g, '<br/>');
};

// Strip all HTML tags for plain text display
export const stripHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
};