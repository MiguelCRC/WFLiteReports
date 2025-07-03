import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Button from "./Button";
import RadioBtn from "./RadioBtn";
import moment from "moment";
const WhCusTime = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [value, setValue] = useState("");
  const [warehouse, setWarehouse] = useState("0");

  const handleSelectionChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <h2>Customer by Warehouse Time</h2>
      <p>
        Please select the Warehouse, initial date and the end date for this
        report.
      </p>
      <div className="container text-center">
        <div className="col direction-row">
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
          <div className="col">
            <p>Select CRC Warehouse:</p>
            <select
              onChange={(warehouse) => {
                setWarehouse(warehouse.target.value);
              }}
            >
              <option value="0">Please select</option>
              <option value="1">Kenner</option>
              <option value="2">Plainfield</option>
              <option value="13">Brookings</option>
              <option value="4">Greenwood</option>
              <option value="6">Allendale</option>
              <option value="8">Twin Falls</option>
              <option value="9">Battleboro</option>
              <option value="11">Lubbock</option>
              <option value="12">Indiana</option>
              <option value="13">Garden City</option>
              <option value="15">LaPorte</option>
              <option value="18">Lancaster</option>
            </select>
          </div>
        </div>
        <div className="row justify-content-md-center button-row">
          <div className="col-md-auto">
            <Button
              report="customTime"
              warehouseId={warehouse}
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

export default WhCusTime;
