import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const DoctorProfile = () => {
    const [editMode, setEditMode] = useState(false);
    const [moreButton, setMoreButton] = useState(false);
    const [doctor, setDoctor] = useState({});
    const [articles, setArticles] = useState([]);
    const { doctorId } = useParams();

    const prepareArticle = (array, doc) => {
        return array.map((item) => {
            return {
                ...item,
                first: doc.first,
                last: doc.last,
                specialties: doc.specialties,
            };
        });
    };

    useEffect(() => {
        (async () => {
            const resp = await fetch(`/doctor/${doctorId}.json`);
            const doctorInfo = await resp.json();
            setDoctor(doctorInfo);

            const respArticles = await fetch(
                `/doctor-articles/${doctorId}.json`
            );
            const docArticles = await respArticles.json();
            setArticles(prepareArticle(docArticles, doctorInfo));

            docArticles.filter(
                (article) => article.articleId === article.lowestId
            ).length
                ? setMoreButton(false)
                : setMoreButton(true);
        })();
    }, []);

    const userData = useSelector((state) => state.userData);

    if (userData.doctor && userData.id === doctor.id) {
        setEditMode(true);
    }
    console.log(articles);

    const handleClick = async () => {
        // need to pass doctorId and smallestId as paramsass
        const smallestId = articles[articles.length - 1].articleId;
        const data = await fetch(
            `/more-doctor-articles/${doctorId}/${smallestId}.json`
        );
        // const moreArticles = await data.json();
        // setArticles([...articles, ...moreArticles]);
        // moreArticles.filter((article) => article.articleId === article.lowestId)
        //     .length
        //     ? setMoreButton(false)
        //     : setMoreButton(true);
    };

    return (
        <div>
            doc profile
            <button onClick={handleClick}>more</button>
        </div>
    );
};

export default DoctorProfile;
