import React, { useEffect, useState, useRef } from "react";
import "../style/buttonStyle.css";
import icon from "../icons/reload.svg";
import { CSVLink, CSVDownload } from "react-csv";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const Button = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const csvInstance = useRef();

  useEffect(() => {
    if (data !== undefined) {
      csvInstance.current.link.click();
      setData(undefined);
    }
  }, [data]);

  const handleClick = async () => {
    var response;
    var answer;
    setIsLoading(true);
    if (props.report === "inbound") {
      response = await fetch(
        `http://localhost:8000/inbounds/?startDate=${props.startDate}&endDate=${props.endDate}`
      );
      answer = await response.json();
      setData(answer.data);
      setIsLoading(false);
    } else if (props.report === "scanning") {
      response = await fetch(
        `http://localhost:8000/scanning/?startDate=${props.startDate}&endDate=${props.endDate}`
      );
      answer = await response.json();
      setData(answer.data);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        disabled={isLoading}
        onClick={handleClick}
        className={`button ${isLoading ? "loading" : ""}`}
      >
        <img src={icon} alt="cycle_image" />
        <span>{isLoading ? "Downloading" : "Download"}</span>
      </button>

      <CSVLink
        filename={`${props.report}-${props.startDate}-${props.endDate}.csv`}
        data={data ? data : []}
        ref={csvInstance}
      ></CSVLink>
    </div>
  );
};

export default Button;
