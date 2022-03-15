import { useState, useEffect } from "react";

const FindPeople = () => {
    const [searchTerm, setSearchTerm] = useState();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        let abort = false;
        (async () => {
            if (!searchTerm) {
                try {
                    let lastUsers = await fetch("/last-users.json").then(
                        (resp) => {
                            return resp.json();
                        }
                    );
                    setUsers(lastUsers.users);
                } catch {
                    setError(true);
                }
            } else {
                try {
                    let searchedUsers = await fetch(
                        `/searched-users?search=${searchTerm}`
                    ).then((resp) => {
                        return resp.json();
                    });
                    if (!abort) {
                        setUsers(searchedUsers.users);
                    }
                } catch {
                    setError(true);
                }
            }

            return () => {
                abort = true;
            };
        })();
    }, [searchTerm]);

    return (
        <>
            <input
                type="text"
                name="searchTerm"
                onChange={({ target }) => setSearchTerm(target.value)}
            />
            <ul>
                {!users.length ? (
                    <p>Sorry, no users found 😭</p>
                ) : (
                    users.map((user) => {
                        return <li key={user.id}>{user.first}</li>;
                    })
                )}
            </ul>
        </>
    );
};

export default FindPeople;
