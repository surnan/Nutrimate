// frontend/src/componenets/DayLogPageForm/DayLogPageForm.jsx
import "./DayLogPageForm.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { postDailyLogsOneThunk, updateDailyLogsOneThunk, deleteDailyLogsThunkById, getDailyLogsOneThunk } from "../../redux/daylogs"
import { capitalizeFirstLetter, isEmpty, formatDatetimeLocal } from '../../utils/MyFunctions'
import DeleteModal from "../DeleteModal/DeleteModal";
import WorkoutCard from "../WorkoutCard";


function DayLogPageForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { id } = useParams();
    const dayLogId = parseInt(id);

    const { newDayLog, newWorkoutObj, newGrubObj, currentDayLog } = location.state || {};
    const sessionUser = useSelector((state) => state.session.user);
    const dayLogObj = useSelector((state) => state.daylogs.single)

    const initialForm = {
        timestamp: Date(),
        name: "",
        calories: "",
        units: "",
        unitType: "",
        userId: "",
        grubId: "",
        workoutId: ""
    };

    const [showDeleteModal, setShowDeletetModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (!newDayLog && dayLogObj) {
            setForm({
                name: dayLogObj.name || newWorkoutObj?.name || newGrubObj?.name || "",
                timestamp: dayLogObj.timestamp || Date.now(),
                calories: dayLogObj.calories || "",
                units: dayLogObj.units || "",
                unitType: dayLogObj.unitType || "",
                grubId: dayLogObj.grubId || newGrubObj?.id || null,
                workoutId: dayLogObj.workoutId || newWorkoutObj?.id || null,
                userId: dayLogObj.userId || sessionUser?.id || 1
            });
        } else {
            dispatch(getDailyLogsOneThunk(dayLogId));
        }
    }, [dayLogObj, newDayLog, sessionUser, dayLogId, dispatch, newWorkoutObj, newGrubObj])


    useEffect(() => {
        if (!newDayLog && dayLogObj) {
            dispatch(getDailyLogsOneThunk(dayLogId))
        }
    }, [dispatch, dayLogId, newDayLog])


    useEffect(() => {
        const newErrors = {};
        const allKeys = ["calories", "units"];

        allKeys.forEach((key) => {
            if (!form[key]) {
                newErrors[key] = `${capitalizeFirstLetter(key)} is required`;
            } else {
                if (parseInt(form[key]) <= 0) {
                    newErrors[key] = `${capitalizeFirstLetter(key)} must be > 0`;
                }
            }
        });
        setErrors(newErrors);
    }, [form])


    const updateSetForm = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }))
    }


    const handleBack = () => navigate(-1);
    const handleReset = () => setForm(initialForm)

    const handleSubmitSave = async (e) => {
        console.log("hello")
        e.preventDefault();
        try {
            const { name, timestamp, calories, units, unitType, userId, grubId, workoutId } = form;
            const body = {
                id: dayLogId,
                timestamp,
                name: name || "no name given",
                calories: parseInt(calories),
                units: parseInt(units),
                unitType,
                userId: parseInt(userId),
                grubId: parseInt(grubId),
                workoutId: parseInt(workoutId)
            }
            console.log("___body = ", body)
            const result = newDayLog
                ? await dispatch(postDailyLogsOneThunk({ body }))
                : await dispatch(updateDailyLogsOneThunk({ body }))
            if (result) navigate(-1)
        } catch (error) {
            console.error('Error adding dayLog:', error);
        }
    }


    const handleDelete = () => {
        alert('Workout not saved to database');
        // if (!workoutId) {
        //     alert('Workout not saved to database');
        //     return;
        // }
        // setShowDeletetModal(true)
    }

    const handleModalClose = () => {
        setShowDeletetModal(false);
        navigate(-1)
    };

    return (
        <div className="mainBodyStyle">
            <div className="max_HFlex">
                {/* TOP BUTTONS */}
                <button
                    className="blue _button"
                    type="button"
                    onClick={handleBack}
                >
                    BACK
                </button>

                <div className="wokoutPageForm_hFlex">
                    <button
                        className="orange _button"
                        type="button"
                        onClick={handleReset}
                    >
                        RESET
                    </button>
                    <button
                        className={`green _button ${isEmpty(errors) ? "disabled_btn" : ""}`}
                        type="button"
                        onClick={handleSubmitSave}
                        // disabled={hasError()}
                        disabled={isEmpty(errors)}
                    >
                        SAVE
                    </button>
                </div>
            </div>

            {/* {
                dayLogObj?.Workout &&
                <WorkoutCard workout={dayLogObj?.Workout} />
            } */}

            <div className="workout_page_form_grid">
            <p>Name</p>
                <input
                    className="_input"
                    value={form.name}
                    readOnly={true}
                />


                <p>Date</p>
                <input
                    className="_input"
                    type="datetime-local"
                    name="timestamp"
                    onChange={updateSetForm}
                    value={formatDatetimeLocal(form.timestamp)}
                />



                <label style={{ display: 'inline-flex' }}>
                    {errors.calories && <span style={{ color: 'red' }}>{errors.calories}&nbsp;&nbsp;</span>} Calories:
                </label>
                <input
                    className="_input"
                    type="number"
                    name="calories"
                    placeholder="Please enter your goal weight"
                    onChange={updateSetForm}
                    value={form.calories}
                />

                <label style={{ display: 'inline-flex' }}>
                    {errors.units && <span style={{ color: 'red' }}>{errors.units}&nbsp;&nbsp;</span>} Units:
                </label>
                <input
                    className="_input"
                    type="number"
                    name="units"
                    placeholder="units"
                    onChange={updateSetForm}
                    value={form.units}
                />

                <label style={{ display: 'inline-flex' }}>
                    {errors.unitType && <span style={{ color: 'red' }}>{errors.unitType}&nbsp;&nbsp;</span>} Unit type:
                </label>
                <select
                    className="_input"
                    name="unitType"
                    onChange={updateSetForm}
                    value={form.unitType}
                >
                    <option value="hours">hours</option>
                    <option value="minutes">minutes</option>
                    <option value="seconds">seconds</option>
                    <option value="each">each</option>
                    <option value="reps">reps</option>
                </select>

            </div>

        </div >
    );
}

export default DayLogPageForm;
