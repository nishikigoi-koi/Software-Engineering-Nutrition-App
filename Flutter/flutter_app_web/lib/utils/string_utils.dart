class StringUtils {
  // Format words like ToTitleCase in C#. e.g john -> John
  static String capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);
}