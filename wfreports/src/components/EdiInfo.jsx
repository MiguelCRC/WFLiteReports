import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Button from "../components/Button";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

const Scanning = () => {
  const [month, setMonth] = useState(new Date());
  const [warehouse, setWarehouse] = useState("1");
  return (
    <div>
      <h2>EDI INFORMATION</h2>
      <p>Please select the month for this report.</p>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <p>Select Month:</p>
            <DatePicker
              selected={month}
              onChange={(date) => {
                setMonth(date);
              }}
              showMonthYearPicker
              todayButton="Today"
              dateFormat="MM/yyyy"
              style={{ display: "inline" }}
            />
          </div>
          <div className="col">
            <p>Select Bayer Warehouse:</p>
            <select
              onChange={(warehouse) => {
                setWarehouse(warehouse.target.value);
              }}
            >
              <option value="1">Please select</option>
              <option value="42">Brookings</option>
              <option value="37">Indianola</option>
              <option value="15">Decatur</option>
              <option value="7">Battleboro-Seed</option>
              <option value="58">Battleboro-Crop Protection</option>
              <option value="36">Lubbock-Seed</option>
              <option value="41">Lubbock-Phytogen</option>
              <option value="5">Plainfield</option>
              <option value="56">Effingham</option>
              <option value="75">Lancaster</option>
            </select>
          </div>
        </div>
        <div className="row justify-content-md-center button-row">
          <div className="col-md-auto">
            <Button
              report="ediInfo"
              startMonth={moment(month)
                .startOf("month")
                .format("YYYY-MM-DDT00:00:00")}
              endMonth={moment(month)
                .endOf("month")
                .format("YYYY-MM-DDT23:59:00")}
              customerId={warehouse}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanning;
