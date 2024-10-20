//frontend/src/componenets/DayLogPage/DayLogPage.jsx
import "./DayLogPage.css";
import DayLogModal from "../DayLogModal";
import { useState, useRef, useEffect } from "react";
import { getDailyLogsAllThunk } from "../../redux/daylogs"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import DayLogCard from "../DayLogCard";
import CustomCalendar from "../CustomCalendar";


const hours = [
    "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
    "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
];

const DayLogPage = () => {
    const dispatch = useDispatch()
    const nav = useNavigate();
    const modalRef = useRef(null);
    const [showCreateDayLogModal, setShowCreateDayLogModal] = useState(false);
    const [showHour, setShowHour] = useState(12);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const sessionUser = useSelector((state) => state.session.user);
    const dayLogsArr = useSelector(state => state.daylogs.allDaylogs);


    const filteredAndSortedArray = dayLogsArr
        .filter(dayLog => dayLog.userId === sessionUser.id)

    useEffect(() => {
        dispatch(getDailyLogsAllThunk())
    }, [dispatch])

    useEffect(() => {
        console.log('+++++ => dayLogsArr updated ==> ', dayLogsArr);
    }, [dayLogsArr]);



    const handleHourClick = (hour) => {
        setShowHour(hour)
        setShowCreateDayLogModal(true)
    };

    const handleModalClose = () => {
        setShowCreateDayLogModal(false)
        setShowHour(null)
    };

    const handlePageClick = () => {
        setShowCreateDayLogModal(false);
    };

    useEffect(() => {
        if (showCreateDayLogModal) {
            document.addEventListener("mousedown", handlePageClick);
        } else {
            document.removeEventListener("mousedown", handlePageClick);
        }
        return () => {
            document.removeEventListener("mousedown", handlePageClick);
        };
    }, [showCreateDayLogModal]);

    const handleBackBtn = () => { nav(-1) };

    // const formattedDate = new Date().toLocaleDateString('en-US', {
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    // Handle date change from the calendar
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Function to find the logs for a specific hour
    const findLogForHour = (hourIndex) => {
        return filteredAndSortedArray
            .filter(log => {
                const logHour = new Date(log.timestamp).getHours();
                return logHour === hourIndex;
            })
            .map(log => log.name)
            .join(", ");
    };

    return (
        <div className="dayLogPage_div">
            <h3>DayLogPage.jsx</h3>
            <h3 >Email = {sessionUser?.email}</h3>

            <br />
            <br />

            <button
                className="blue"
                type="button"
                onClick={handleBackBtn}
            >
                BACK
            </button>
            <br />
            <br />

            <CustomCalendar
                value={selectedDate}
                onChange={handleDateChange} // Update selected date on calendar change
            />

            <div className="dp_header">
                <button
                    className="dph_btn black_font orange round"
                >
                    <i className="fa-solid fa-caret-left"></i>
                </button>
                <h2>{formattedDate}</h2>
                <button
                    className="black_font  orange dph_btn round"
                >
                    <i className="fa-solid fa-caret-right"></i>
                </button>
            </div>

            <div className="dp_grid center">
                {hours.map((hour, index) => (
                    <div
                        className="dpg_hour clickable"
                        key={index}
                        onClick={() => handleHourClick(hour)}
                    >
                        <div className="dpgh_label">{hour}</div>
                        <div className="dpgh_content">
                            {findLogForHour(index) || "click to enter food/exercise"}
                        </div>
                    </div>
                ))}
            </div>
            {showCreateDayLogModal && (
                <div ref={modalRef}>
                    <DayLogModal
                        onClose={handleModalClose}
                        onSubmit={handleHourClick}
                    />
                </div>
            )}
        </div>
    );
};
export default DayLogPage;
