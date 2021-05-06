import React, { useEffect, useState } from "react";
import firebase from "./firebase";
import moment from "jalali-moment";
import {ReactComponent as Icon} from "./arrow.svg";
import "./App.css";

const TableRow = ({
                    name,
                    count,
                    description,
                    date,
                    status,
                    isHeader = false,
                  }) => {
  let d = date;
  if (typeof date === "number") {
    d = moment(new Date(date * 1000))
        .locale("fa")
        .format("YYYY/MM/DD");
  }
  const [display, setDisplay] = useState(false);
  const toggleDescription = () => {
    setDisplay(!display);
  }
  return (
      <div onClick={toggleDescription} className={`table-row ${isHeader && "is-head"}`}>
        <div className="row-columns">
          <div>{name}</div>
          <div>{count}</div>
          <div>{d}</div>
          <div>{status ? "داده" : "نداده"}</div>
          <div>{!isHeader && <Icon className={`arrow-icon ${display && "active"}`}/>}</div>
        </div>
        {!isHeader && display && <div className="row-description">{description}</div>}
      </div>
  );
};

const MainApp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    chickens: [],
    users: {},
    logs: {},
    roles: {},
    meetings: {},
  });

  const fetchChickens = async (db, setData) => {
    setIsLoading(true);
    let query = await db.collection("users").get();
    query.forEach((doc) => {
      data.users[doc.id] = doc.data();
    });
    query = await db.collection("chickens").get();
    let i = 0;
    query.forEach((doc) => {
      data.chickens.push(doc.data());
      data.chickens[i++].user = data.users[doc.data().user_id];
    });

    query = await db.collection("logs").get();
    query.forEach((doc) => {
      data.logs[doc.id] = doc.data();
    });
    query = await db.collection("roles").get();
    query.forEach((doc) => {
      data.roles[doc.id] = doc.data();
    });
    query = await db.collection("meetings").get();
    query.forEach((doc) => {
      data.meetings[doc.id] = doc.data();
    });

    setData(data);
    setIsLoading(false);
  };

  const db = firebase.firestore();

  useEffect(() => {
    fetchChickens(db, setData);
  }, []);

  console.log("object", data);

  // const data = { chickens: [0, 1, 2, 3] };

  return (
      <div className="main">
        <h1>سنا برای همه، همه برای سنا</h1>
        <div className="table">
          <TableRow
              isHeader
              name="نام"
              description="برای چی"
              count="چقدر باید به سلفه"
              status="وضعیت"
              date="تاریخ"
          />

          <div>{isLoading && "loading"}</div>
          {!isLoading &&
          data.chickens.length > 0 &&
          data.chickens.map((item) => (
              <TableRow
                  count={item.chicken_count}
                  date={item.date.seconds}
                  name={item.user["full name"]}
                  description={item.description}
                  key={item.id}
              />
          ))}
        </div>
      </div>
  );
};

export default MainApp;
