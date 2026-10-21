import mammoth from "mammoth";
import { extractText } from "unpdf";
import { ResumeImportUnsupportedFileError } from "./error/ResumeImportUnsupportedFileError";

const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function extractResumeText(
  content: Uint8Array,
  mimeType: string,
  filename: string,
): Promise<string> {
  const lowerFilename = filename.toLowerCase();

  if (mimeType === "application/pdf" || lowerFilename.endsWith(".pdf")) {
    const { text } = await extractText(content, { mergePages: true });
    return text;
  }

  if (mimeType === DOCX_MIME_TYPE || lowerFilename.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer: Buffer.from(content) });
    return value;
  }

  if (mimeType === "application/msword" || lowerFilename.endsWith(".doc")) {
    throw new ResumeImportUnsupportedFileError();
  }

  return new TextDecoder().decode(content);
}
