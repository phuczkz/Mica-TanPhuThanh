import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import AppContent from "./AppContent";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>   
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
