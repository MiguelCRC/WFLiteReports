import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Button from "./Button";
// import Toggle from "./Toggle";
import RadioBtn from "./RadioBtn";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

const LongestTime = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  // const [toggle, setToggle] = useState(false);
  // const handleToggleChange = () => {
  //   setToggle(!toggle);
  // };
  const [value, setValue] = React.useState("");

  const handleSelectionChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <h2>Longest Time by Warehouse</h2>
      <p>
        Please select the direction, intial date and the end date for this
        report.
      </p>
      <div className="container text-center">
        <div className="col direction-row">
          {/* <Toggle toggle={toggle} handleToggleChange={handleToggleChange} /> */}
          <RadioBtn
            selection={value}
            handleSelectionChange={handleSelectionChange}
          />
        </div>
        <div className="row">
          <div className="col">
            <p>Initial Date:</p>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              style={{ display: "inline" }}
            />
          </div>
          <div className="col">
            <p>End Date:</p>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              style={{ display: "inline" }}
            />
          </div>
        </div>
        <div className="row justify-content-md-center button-row">
          <div className="col-md-auto">
            <Button
              report="longest"
              direction={value}
              startDate={moment(startDate).format("YYYY-MM-DDT00:00:00")}
              endDate={moment(endDate).format("YYYY-MM-DDT23:59:00")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongestTime;
