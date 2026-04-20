import { useParams } from "react-router-dom";

const useChatId = () => {
  const params = useParams<{ chatId?: string }>();
  const chatId = params.chatId || null;
  return chatId;
}; // Custom hook to extract the chatId from the URL parameters. It uses the useParams hook from react-router-dom to get the current route parameters and returns the chatId if it exists, or null if it doesn't.

export default useChatId;
