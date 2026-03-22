import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import AppContent from "./AppContent";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>   
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
