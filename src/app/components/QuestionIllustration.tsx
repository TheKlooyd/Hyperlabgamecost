import type { Stage } from "../data/gameData";

const QUESTION_IMAGES = [
  "questions_img/Gemini_Generated_Image_7n9fe77n9fe77n9f.png",
  "questions_img/Gemini_Generated_Image_ash4wpash4wpash4.png",
  "questions_img/Gemini_Generated_Image_bdsh4bdsh4bdsh4b.png",
  "questions_img/Gemini_Generated_Image_gfbwbzgfbwbzgfbw.png",
  "questions_img/Gemini_Generated_Image_xhedxnxhedxnxhed.png",
  "questions_img/Gemini_Generated_Image_zffnpwzffnpwzffn.png",
].map(p => `${import.meta.env.BASE_URL}${p}`);

function pickImage(question: string): string {
  let hash = 0;
  for (let i = 0; i < question.length; i++) {
    hash = (hash * 31 + question.charCodeAt(i)) & 0xffff;
  }
  return QUESTION_IMAGES[hash % QUESTION_IMAGES.length];
}

interface QuestionIllustrationProps {
  question: string;
  stage: Pick<Stage, "id" | "title" | "color" | "bgColor" | "borderColor">;
}

export function QuestionIllustration({ question, stage }: QuestionIllustrationProps) {
  const src = pickImage(question);

  return (
    <div
      className="mb-4 overflow-hidden rounded-2xl"
      style={{
        border: `1px solid ${stage.borderColor}`,
      }}
    >
      <img
        src={src}
        alt="Ilustración de la pregunta"
        style={{
          display: "block",
          width: "100%",
          aspectRatio: "16 / 9",
          objectFit: "cover",
        }}
      />
    </div>
  );
}