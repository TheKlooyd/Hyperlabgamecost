import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import { ChatbotProvider } from "./context/ChatbotContext";

export default function App() {
  return (
    <AppProvider>
      <ChatbotProvider>
        <RouterProvider router={router} />
      </ChatbotProvider>
    </AppProvider>
  );
}