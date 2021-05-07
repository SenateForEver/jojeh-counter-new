import React, {useState, useEffect} from "react";
import firebase from "./firebase";

export const MyContext = React.createContext(null);

export const Provider = ({children}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        chickens: [],
        users: {},
        logs: {},
        roles: {},
        meetings: {},
    });
    const db = firebase.firestore();
    const fetchAll = async () => {
        setIsLoading(true);
        const data = {
            chickens: [],
            users: {},
            logs: {},
            roles: {},
            meetings: {},
        }
        let query = await db.collection("users").get();
        query.forEach((doc) => {
            data.users[doc.id] = {...doc.data(), id:doc.id};
        });
        query = await db.collection("chickens").get();
        let i = 0;
        query.forEach((doc) => {
            data.chickens.push({...doc.data(), id: doc.id});
            data.chickens[i++].user = data.users[doc.data().user_id];
        });

        query = await db.collection("logs").get();
        query.forEach((doc) => {
            data.logs[doc.id] = {...doc.data(), id: doc.id};
        });
        query = await db.collection("roles").get();
        query.forEach((doc) => {
            data.roles[doc.id] = {...doc.data(), id: doc.id};
        });
        query = await db.collection("meetings").get();
        query.forEach((doc) => {
            data.meetings[doc.id] = {...doc.data(), id: doc.id};
        });

        setData(data);
        setIsLoading(false);
    };
    const fetchUsers = async () => {
        const users = {};
        let query = await db.collection("users").get();
        query.forEach((doc) => {
            users[doc.id] = {...doc.data(), id:doc.id};
        });
        setData((data) => ({...data, users: users}));
    };
    const fetchChickens = async () => {
        const chickens = [];
        setIsLoading(true);
        let query = await db.collection("chickens").get();
        let i = 0;
        query.forEach((doc) => {
            chickens.push({...doc.data(), id:doc.id});
            chickens[i++].user = data.users[doc.data().user_id];
        });
        setData((data) => ({...data, chickens: chickens}));
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAll();
    }, []);
    return <MyContext.Provider value={{data, setData, isLoading, setIsLoading, fetchAll, fetchChickens, fetchUsers}}>
        {children}
    </MyContext.Provider>
}

