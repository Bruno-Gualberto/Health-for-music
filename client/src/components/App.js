import { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userData } from "../redux/userData/slice";

// import Uploader from "./Uploader";
import Header from "./Header";
import Home from "./Home";
import Articles from "./Articles";
import Footer from "./Footer";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const resp = await fetch("/user.json");
            const data = await resp.json();
            dispatch(userData(data));
        })();
    }, []);

    return (
        <>
            <Header />
            <BrowserRouter>
                <Route exact path="/articles">
                    <Articles />
                </Route>
                <Route exact path="/">
                    <Home />
                </Route>
            </BrowserRouter>
            <Footer />
        </>
    );
};

export default App;
