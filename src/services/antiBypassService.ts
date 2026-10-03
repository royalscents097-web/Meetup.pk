export interface BypassScanResult {
  isFlagged: boolean;
  patternsDetected: string[];
}

export class AntiBypassService {
  // Regex to detect 11-digit Pakistani phone numbers and international variations
  private static PK_PHONE_REGEX = /(?:\+?92\s?|0)3\d{2}[-\s]?\d{7}/gi;

  // Regex to detect IBAN or bank account sequences
  private static IBAN_REGEX = /PK\d{2}[A-Z]{4}\d{16}/gi;

  // Keywords suggesting off-platform payment or contact diversion
  private static BYPASS_KEYWORDS = [
    'pay me directly',
    'pay directly',
    'whatsapp me and pay',
    'outside meetup',
    'send via jazzcash directly',
    'easypaisa direct',
    'account number',
    'iban',
    'pay cash directly to me',
    'contact me on insta to book',
    'avoid platform fee',
    'bypass meetup',
    'dm on whatsapp for price'
  ];

  public static scanText(text: string): BypassScanResult {
    const patterns: string[] = [];

    if (this.PK_PHONE_REGEX.test(text)) {
      patterns.push('Pakistani Phone Number Detected');
    }

    if (this.IBAN_REGEX.test(text)) {
      patterns.push('Bank IBAN Pattern Detected');
    }

    const lower = text.toLowerCase();
    for (const kw of this.BYPASS_KEYWORDS) {
      if (lower.includes(kw)) {
        patterns.push(`Bypass Keyword: "${kw}"`);
      }
    }

    return {
      isFlagged: patterns.length > 0,
      patternsDetected: patterns
    };
  }
}
