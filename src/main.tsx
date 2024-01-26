import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import "./index.css";
import "./assets/fonts/DesignerVN-Poppins-Regular.ttf";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
