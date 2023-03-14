import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Button from "./Button";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

const Esignature = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  return (
    <div>
      <h2>E-Signature</h2>
      <p>Please select the intial date and the end date for this report.</p>
      <div className="container text-center">
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
              report="esignature"
              startDate={moment(startDate).format("YYYY-MM-DD")}
              endDate={moment(endDate).format("YYYY-MM-DD")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Esignature;
