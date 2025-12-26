import { WordRotate } from "./magicui/word-rotate";

 
export function WordRotateDemo() {
  return (
    <WordRotate
      className="md:text-4xl font-bold text-black dark:text-white"
      words={["Local and global procurment.", "Elite training.","Tailored solutions.","IT consulting."]}
    />
  );
}
