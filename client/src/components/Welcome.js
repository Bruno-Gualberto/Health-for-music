import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./Registration";
import Logo from "./Logo";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Header

const Welcome = () => {
    return (
        <div>
            <Header />
            <Logo />
            <BrowserRouter>
                <Route exact path="/login">
                    <h1>Welcome!</h1>
                    <Login />
                </Route>
                <Route exact path="/reset-password">
                    <ResetPassword />
                </Route>
                <Route exact path="/">
                    <h1>Welcome!</h1>
                    <Registration />
                </Route>
            </BrowserRouter>
        </div>
    );
}

export default Welcome;