import { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userData } from "../redux/userData/slice";

import Header from "./Header";
import Home from "./Home";
import Articles from "./Articles";
import SingleArticle from "./SingleArticle";
import Doctors from "./Doctors";
import DoctorProfile from "./DoctorProfile";
import Profile from "./Profile";
import CreateEditArticle from "./CreateEditArticle";
import PrivateChat from "./PrivateChat";

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
                <Route exact path="/private-chat/:otherUserId">
                    <PrivateChat />
                </Route>
                <Route exact path="/create-edit-article/:articleId">
                    <CreateEditArticle />
                </Route>
                <Route exact path="/create-edit-article">
                    <CreateEditArticle />
                </Route>
                <Route exact path="/profile">
                    <Profile />
                </Route>
                <Route exact path="/doctor/:doctorId">
                    <DoctorProfile />
                </Route>
                <Route exact path="/doctors">
                    <Doctors />
                </Route>
                <Route exact path="/article/:articleId">
                    <SingleArticle />
                </Route>
                <Route exact path="/articles">
                    <Articles />
                </Route>
                <Route exact path="/">
                    <Home />
                </Route>
            </BrowserRouter>
        </>
    );
};

export default App;
