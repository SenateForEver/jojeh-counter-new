import React, {useContext, useState, useEffect} from "react";
import firebase from "./firebase";
import fi from "firebase";
import moment from "jalali-moment";
import {ReactComponent as Icon} from "./arrow.svg";
import {toast} from "react-toastify";
import "./App.css";
import Modal, {ModalProvider, BaseModalBackground} from "styled-react-modal";
import styled from "styled-components";
import {MyContext} from "./Context";

const TableRow = ({
                      name,
                      count,
                      description,
                      date,
                      status,
                      isHeader = false,
                      isAdmin = false,
                      onClick
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
                <div onClick={onClick}>{!isHeader ?
                    <Icon className={`arrow-icon ${display && "active"}`}/> : isAdmin ? "+" : "#"}</div>
            </div>
            {!isHeader && display && <div className="row-description">{description}</div>}
        </div>
    );
};

const StyledModal = Modal.styled`
  max-width: 1100px;
  width: 90%;
  background-color: white;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  opacity: ${(props) => props.opacity};
  transition : all 0.3s ease-in-out;`;


const EditUserTab = ({close}) => {
    const db = firebase.firestore();
    const {fetchUsers, data} = useContext(MyContext)
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState("");
    const [fullName, setFullname] = useState("");
    const [role, setRole] = useState("");
    const roleId = {
        "بده": 1,
        "بگیر": 2,
    }
    const addUser = async (event) => {
        event.preventDefault()
        await db.collection("users").doc(user.id).set({
            address: address,
            "full name": fullName,
            "joje_count": 0,
            role: roleId[role] ?? 1,
        });
        fetchUsers();
        close();
    }
    const users = Object.keys(data.users).map(userId => data.users[userId]);

    return <div className="form-container">
        <div className="form-row">
            <label htmlFor="users">شخص</label>
            <select id="users" value={user?.id ?? ""} onChange={(e) => {
                const user = data.users[e.target.value];
                setUser(user)
                setFullname(user["full name"])
                setAddress(user["address"])
            }}>
                <option value="" disabled>انتخاب کن</option>
                {users.map((user) => <option key={user.id} value={user.id}>{user["full name"]}</option>)}
            </select>
        </div>
        <div className="form-row">
            <label htmlFor="fullname">نام کامل</label>
            <input type="text" id="fullname" disabled={user === null ? "disabled" : ""} value={fullName}
                   onChange={(e) => setFullname(e.target.value)}/>
        </div>
        <div className="form-row">
            <label htmlFor="address">آدرس</label>
            <input type="text" id="address" disabled={user === null ? "disabled" : ""} value={address}
                   onChange={(e) => setAddress(e.target.value)}/>
        </div>
        <div className="form-row">
            <label htmlFor="role">نقش</label>
            <input type="text" id="role" disabled value="بده"/>
        </div>
        <div className="form-row">
            <button onClick={addUser} disabled={user == null ? "disabled" : ""}>ارسال</button>
        </div>

    </div>
}

const UserTab = ({close,}) => {
    const db = firebase.firestore();
    const {fetchUsers} = useContext(MyContext)
    const [address, setAddress] = useState("");
    const [fullName, setFullname] = useState("");
    const [role, setRole] = useState("");
    const roleId = {
        "بده": 1,
        "بگیر": 2,
    }
    const addUser = async (event) => {
        event.preventDefault()
        await db.collection("users").add({
            address: address,
            "full name": fullName,
            "joje_count": 0,
            role: roleId[role] ?? 1,
        });
        fetchUsers();
        close();
    }
    return <div className="form-container">
        <div className="form-row">
            <label htmlFor="fullname">نام کامل</label>
            <input type="text" id="fullname" value={fullName} onChange={(e) => setFullname(e.target.value)}/>
        </div>
        <div className="form-row">
            <label htmlFor="address">آدرس</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)}/>
        </div>
        <div className="form-row">
            <label htmlFor="role">نقش</label>
            <input type="text" id="role" disabled value="بده"/>
        </div>
        <div className="form-row">
            <button onClick={addUser}>ارسال</button>
        </div>

    </div>
}
const ChickenTab = ({close}) => {
    const db = firebase.firestore();
    const {fetchChickens, data} = useContext(MyContext)
    const [count, setCount] = useState(0);
    const [unix, setUnix] = useState(null);

    const [userId, setUserId] = useState("");
    const [description, setDescription] = useState("");
    const addUser = async (event) => {
        if(userId === "") {
            return;
        }
        event.preventDefault()
        await db.collection("chickens").add({
            chicken_count: count,
            date: fi.firestore.Timestamp.fromMillis(unix ?? (new Date()).getTime()),
            description: description,
            status: false,
            user_id: userId,
        });
        fetchChickens();
        close();
    }
    useEffect(() => {
        window.$("#date").persianDatepicker({
            format: 'YYYY/MM/DD',
            onSelect: (unixDate) => {
                setUnix(unixDate)
                console.log(unixDate, fi.firestore, fi,);
            }
        });
    }, [])
    const users = Object.keys(data.users).map(userId => data.users[userId]);
    return <div className="form-container">
        <div className="form-row">
            <label htmlFor="users">شخص</label>
            <select id="users" value={userId} onChange={(e) => setUserId(e.target.value)}>
                {users.map((user) => <option key={user.id} value={user.id}>{user["full name"]}</option>)}
            </select>
        </div>
        <div className="form-row">
            <label htmlFor="description">توضیحات</label>
            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <div className="form-row">
            <label htmlFor="date">تاریخ</label>
            <input type="text" id="date"/>
        </div>
        <div className="form-row">
            <label htmlFor="count">تعداد</label>
            <input type="text" id="count" value={count} onChange={(e) => setCount(e.target.value)}/>
        </div>
        <div className="form-row">
            <button onClick={addUser}>ارسال</button>
        </div>

    </div>
}

function FancyModalButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [opacity, setOpacity] = useState(0);
    const [tab, setTab] = useState("")

    function toggleModal(e) {
        setOpacity(0);
        setIsOpen(!isOpen);
    }

    function afterOpen() {
        setTimeout(() => {
            setOpacity(1);
        }, 100);
    }

    function beforeClose() {
        return new Promise((resolve) => {
            setOpacity(0);
            setTimeout(resolve, 300);
        });
    }

    const ModalButtonWrapper = styled.div`
      width: 100%;
      display: flex;
      padding: 20px 0;
      justify-content: center;
    `
    const addUser = () => {
        setTab("user");
    }
    const editUser = () => {
        setTab("editUser");
    }
    const addChicken = () => {
        setTab("chickens");
    }
    return (
        <ModalButtonWrapper>
            <button onClick={toggleModal}>Open modal</button>
            <StyledModal
                isOpen={isOpen}
                afterOpen={afterOpen}
                beforeClose={beforeClose}
                onBackgroundClick={toggleModal}
                onEscapeKeydown={toggleModal}
                opacity={opacity}
                backgroundProps={{opacity}}
            >
                <button onClick={addUser}>Add User</button>
                <button onClick={addChicken}>Add Chicken</button>
                <button onClick={editUser}>Edit User</button>
                {tab === "user" && <UserTab close={() => setTab("")}/>}
                {tab === "chickens" && <ChickenTab close={() => setTab("")}/>}
                {tab === "editUser" && <EditUserTab close={() => setTab("")}/>}
                <button onClick={toggleModal}>Close me</button>
            </StyledModal>
        </ModalButtonWrapper>
    );
}

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${(props) => props.opacity};
  transition: all 0.3s ease-in-out;
`;

const MainApp = () => {
    const [count, setCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const {data, isLoading} = useContext(MyContext)
    console.log("object", data);

    // const data = { chickens: [0, 1, 2, 3] };
    const handleTableRowClick = () => {
        if (isAdmin) {
            return;
        }
        if (count === 8) {

            const answer = prompt("اسم خسیسه جمع رو بگو")
            if(!answer || answer.toLowerCase() !== "amin") {
                return;
            }
            toast.success(`حالا تو پاچه ملت بکن شیرینی رو`);
            setIsAdmin(true);
            return
        }
        setCount(count + 1);
        if (count > 3) {
            toast.dark(`${8 - count}  بار دیگه مونده`);
        }
    }

    return (
        <ModalProvider backgroundComponent={FadingBackground}>
            <div className="main">
                <h1>سنا برای همه، همه برای سنا</h1>
                {isAdmin && <FancyModalButton/>}
                <div className="table">
                    <TableRow
                        isHeader
                        name="نام"
                        description="برای چی"
                        count="چقدر باید به سلفه"
                        status="وضعیت"
                        date="تاریخ"
                        onClick={handleTableRowClick}
                        isAdmin={isAdmin}
                    />

                    <div>{isLoading && "loading"}</div>
                    {!isLoading &&
                    data.chickens.length > 0 &&
                    data.chickens.map((item) => (
                        <TableRow
                            count={item.chicken_count}
                            date={item.date.seconds}
                            name={item?.user?.["full name"]}
                            description={item.description}
                            key={item.id}
                        />
                    ))}
                </div>
            </div>
        </ModalProvider>
    );
};

export default MainApp;
