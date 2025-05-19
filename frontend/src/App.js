import { Route, Routes, useNavigate, useLocation, Navigate } from "react-router-dom"; // Add Navigate
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Welcome from "./components/welcome/Welcome";
import Login from "./components/auth/login/Login";
import Register from "./components/auth/register/Register";
import UserDashboard from "./components/dashBoards/UserDashboard/UserDashboard";
import SupplierDashboard from "./components/dashBoards/supplierDashboard/SupplierDashboard";
import ManageBookings from "./components/dashBoards/UserDashboard/manageBookings/ManageBookings";
import AddSlots from "./components/dashBoards/supplierDashboard/inventory/AddSlots";
import UpdateQuantity from "./components/dashBoards/supplierDashboard/inventory/UpdateQuantity";
import ViewOrders from "./components/dashBoards/supplierDashboard/orders/ViewOrders";
import ViewHistory from "./components/dashBoards/supplierDashboard/ViewHistory/ViewHistory";
import GasSuppliers from "./components/dashBoards/UserDashboard/gasSuppliers/GasSuppliers";
import AccountSettings from "./components/dashBoards/UserDashboard/AccountSettings";
import BookGas from "./components/dashBoards/UserDashboard/BookGas";
import PaymentStatus from "./components/dashBoards/UserDashboard/PaymentStatus";
import Cookies from "js-cookie";
import "./App.css";
import SupplierAccountSettings from "./components/dashBoards/supplierDashboard/SupplierAccountSettings";
import NotFound from "./components/NotFound";
import userBg from './assets/blurred-gas.png';
import burningStove from './assets/dancing-blue-flames.jpg';

const ProtectedRoute = ({ children, redirectTo = "/" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = Cookies.get("authTokenUser");
    const fuelStation =  Cookies.get("authToken");

    useEffect(() => {
        if (!user && !fuelStation) {
            navigate(redirectTo, { replace: true });
        } else if (
            location.pathname === "/user/login" ||
            location.pathname === "/supplier/login" ||
            location.pathname === "/admin/login" ||
            location.pathname === "/user/register" ||
            location.pathname === "/supplier/register"
        ) {
            const target = user ? "/user/dashboard" : "/supplier/dashboard";
            navigate(target, { replace: true });
        }
    }, [user, fuelStation, navigate, location.pathname, redirectTo]);

    return user || fuelStation ? children : null;
};

const PublicRoute = ({ children }) => {
    const navigate = useNavigate();
    const user = localStorage.getItem("user");
    const fuelStation = localStorage.getItem("fuelStation");
console.log("User:", user);
    console.log("Fuel Station:", fuelStation);
    useEffect(() => {
        if (user) {
            navigate("/user/dashboard", { replace: true });
        } else if (fuelStation) {
            navigate("/supplier/dashboard", { replace: true });
        }
    }, [user, fuelStation, navigate]);

    return !user && !fuelStation ? children : null;
};

function App() {
    const location = useLocation();
    const isUserRoute = location.pathname.includes("user") || location.pathname.includes("book");
    
    return (
        <div className="app-main-bg"style={
                            isUserRoute
                    ? { background: `url(${burningStove}) center center/cover no-repeat`, position: 'relative', overflow: 'hidden' }
                    : {background: `url(${burningStove}) center center/cover no-repeat`, position: 'relative', overflow: 'hidden'}
            }>
            {isUserRoute && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 0
                }} />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
<Routes>
                <Route path="/" element={  <PublicRoute>  <Welcome /> </PublicRoute>} />
                <Route path="user">
                    <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
                </Route>
                <Route path="supplier">
                    <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
                </Route>
                <Route path="admin">
                    <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
                </Route>
                <Route path="user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="user/gas-suppliers" element={<ProtectedRoute><GasSuppliers /></ProtectedRoute>} />
                <Route path="user/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
                <Route path="user/manage-bookings" element={<ProtectedRoute><ManageBookings /></ProtectedRoute>} />
                <Route path="supplier/dashboard" element={<ProtectedRoute redirectTo="/"><SupplierDashboard /></ProtectedRoute>} />
                <Route path="/supplier/account-settings" element={<ProtectedRoute redirectTo="/"><SupplierAccountSettings /></ProtectedRoute>} />
                <Route path="/supplier/add-slots" element={<ProtectedRoute redirectTo="/"><AddSlots /></ProtectedRoute>} /> {/* New route */}
                <Route path="/supplier/update-quantity" element={<ProtectedRoute redirectTo="/"><UpdateQuantity /></ProtectedRoute>} /> {/* Replaced /seller/update */}
                <Route path="/supplier/orders" element={<ProtectedRoute redirectTo="/"><ViewOrders /></ProtectedRoute>} />
                <Route path="/supplier/history" element={<ProtectedRoute redirectTo="/"><ViewHistory /></ProtectedRoute>} />
                <Route path="/book/:stationId" element={<ProtectedRoute><BookGas /></ProtectedRoute>} />
                <Route path="/booking-success" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />


                    {/* Redirect for restricted previous screen */}
                    <Route
                        path="/book/:stationId"
                        element={<ProtectedRoute><Navigate to="/user/dashboard" replace /></ProtectedRoute>}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            </div>
        </div>
    );
}

const LogoutSeller = () => {
    const navigate = useNavigate();
    localStorage.removeItem("fuelStation");
    Cookies.remove("authToken");
    Cookies.remove("authTokenSupplierId");
        Cookies.remove("authTokenSellerId");
    toast.success("Logged Out");
    useEffect(() => {
        navigate("/");
    }, [navigate]);
};

const LogoutUser = () => {
    const navigate = useNavigate();
    localStorage.removeItem("user");
    Cookies.remove("authTokenUser");
    Cookies.remove("authTokenUserId");
    toast.success("Logged Out");
    useEffect(() => {
        navigate("/");
    }, [navigate]);
};

export default App;
export { LogoutSeller, LogoutUser };