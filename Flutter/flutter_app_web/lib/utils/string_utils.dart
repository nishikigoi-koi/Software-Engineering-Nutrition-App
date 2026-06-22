class StringUtils {
  // Format words like ToTitleCase in C#. e.g john -> John
  static String capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

  // Convert U+2122 (trademark unicode) into "(TM)"
  static String pdfSafe(String text) => text.replaceAll('™', '(TM)');
}