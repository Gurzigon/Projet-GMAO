import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import Router from "./Router.tsx"
import { AuthProvider } from "./utils/authContext.tsx";
// import { fetchCsrfToken } from "./utils/csrf.ts"
import { SocketProvider } from "./utils/SocketContext.tsx";


const container = document.getElementById("root")
if (!container) {
  throw new Error("Root container missing in index.html")
}

const queryClient = new QueryClient();



export function App (){

  // const [csrfReady, setCsrfReady] = useState(false);

  // useEffect(() => {
  //   fetchCsrfToken()
  //     .then(() => setCsrfReady(true))
  //     .catch(() => {
  //       console.error("Erreur récupération CSRF token");
  //       setCsrfReady(true); // pour ne pas bloquer l'app
  //     });
  // }, []);

  // if (!csrfReady) {
  //   return <div>Chargement...</div>; // loader pendant la récupération
  // }

  // --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}

  return(
  <QueryClientProvider client={queryClient}>
    {/* <JotaiProvider> */}
    <AuthProvider>
      <BrowserRouter>
       <SocketProvider>
          <Router />
       </SocketProvider>
      </BrowserRouter>
    </AuthProvider>
      
    {/* </JotaiProvider> */}
  </QueryClientProvider>)
} 

createRoot(container).render(
  <App />
)