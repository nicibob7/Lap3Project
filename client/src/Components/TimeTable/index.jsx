import React, { useState, useEffect } from "react";
import { Days, Times, TableContent, InputForm } from "../export"
import axios from "axios"
import "./style.css";

const TimeTable = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = () => {
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour += 2) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 2).toString().padStart(2, "0")}:00`;
      timeSlots.push(`${startTime} - ${endTime}`);
    }
    return timeSlots;
  };
  const [year, setYear] = useState(new Date().getFullYear()) // stores current year
  const [week, setWeek] = useState((Math.ceil(Math.floor(((new Date()) - (new Date(year,0,1))) / (24*60*60*1000)/7)+1))%52) // initalize week with current week number
  const [weekDates, setWeekDates] = useState([]) // stores dates of week
  const [date, setDate] = useState("")
  const [cell, setCell] = useState({ day: "", time: "", weekNum: "" });
  const [inputActive, setInputActive] = useState(false)
  const [array, setArray] = useState([])

  async function getTimeTable() {
    try {
      axios.get("https://debugthugsapi.onrender.com/timetable")
      .then(response => {
        const data = response.data
        const arr = data.entry
        setArray(arr)
      })
    } catch (error) {
      
    }
  }

  function displayEntries() {
    return array
      .filter(e => e.weekNum == week)
  }

  // Gets the cell information when user clicks and sets active cell
  const handleClick = (day, time, weekNum) => {
    setCell({ day, time, weekNum });
    setInputActive(true)
  };

  const resolveDay = (d) => {
    switch (d.day) {
        case "Monday":
            return 0
        case "Tuesday":
            return 1
        case "Wednesday":
            return 2
        case "Thursday":
            return 3
        case "Friday":
            return 4
        case "Saturday":
            return 5
        case "Sunday":
            return 6
        default:
            return 0
    }
}
  function loopEntries() {
    try {
      return days.map((day) => {
        array.day === day
        console.log("line 69: ", day)
        timeSlots().map((time) => {
          array.time === time
          console.log("line 76: ", time)
        })
      })
    } catch (error) {
      
    }
  }

  const resolveWeek = () => {
    if (week%52 == 0){
      return 52
    }else if(week%52 < 0){
      return 52+(week%52)
    }else{
      return week%52
    }
  }
  const getWeek = () => {
    const weekDays = []
    let weekNum = week;
    let newDate;
    let dateA = (1 + (weekNum - 1) * 7)
    // console.log(weekNum,year,dateA)

    for(let i=1;i<8;i++){
      newDate = new Date(year,0,dateA+i) // change year here
      weekDays.push(`${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()}`)
    }
    // console.log(weekNum)
    
    setWeek(weekNum)
    if(weekNum == 0){
      setWeek(52)
      setYear(year-1)
    }
    if(weekNum > 52){
      setWeek(1)
      setYear(year+1)
    }
    setWeekDates(weekDays)

    setDate(`${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()}`)
  }


  useEffect(() => {
    getWeek()
    getTimeTable()
    displayEntries()
    loopEntries()
  },[week])
  // console.log(cell)
  console.log("Fetched Entries", displayEntries())

  return (
    <div id="timetable" data-testid="timetable">
      {inputActive && (
        <InputForm setInputActive={setInputActive} dates={weekDates} cell={cell}/>
      )}
      <div className="week-nav">
        <button id="left" onClick={(() => setWeek(week-1))} >{"<"}</button>
        <div className="week-year">
          <p>{year}</p>
          <p id="week-number">Week {resolveWeek()}</p>
        </div>
        <button id="right" onClick={(() => setWeek(week+1))} >{">"}</button>
      </div>
      <Days days={days} week={week} date={date} weekDates={weekDates}/>
      <div id="table">
        <Times timeSlots={timeSlots} cell={cell} />
        <TableContent days={days} cell={cell} weekNum={week} timeSlots={timeSlots} handleClick={handleClick} />
      </div>
    </div>
  );
};
export default TimeTable;
