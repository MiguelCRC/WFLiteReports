import React, { useEffect, useState, useRef } from "react";
import "../style/buttonStyle.css";
import icon from "../icons/reload.svg";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";

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
    if (props.report === "esignature") {
      try {
        response = await fetch(
          `http://192.168.128.172:8081/esignature/?startDate=${props.startDate}&endDate=${props.endDate}`
        );
        answer = await response.json();
        setData(answer.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.warn(
          "Warning: Please ensure that you are connected to the internet and/or have input your data accurately. !",
          {
            position: "bottom-left",
          }
        );
      }
    } else if (props.report === "scanning") {
      try {
        response = await fetch(
          `http://192.168.128.172:8081/scanning/?startDate=${props.startDate}&endDate=${props.endDate}`
        );
        answer = await response.json();
        setData(answer.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.warn(
          "Warning: Please ensure that you are connected to the internet and/or have input your data accurately. !",
          {
            position: "bottom-left",
          }
        );
      }
    } else if (props.report === "longest") {
      if (props.direction) {
        try {
          response = await fetch(
            `http://192.168.128.172:8081/timeSite/?startDate=${props.startDate}&endDate=${props.endDate}&direction=${props.direction}`
          );
          answer = await response.json();
          setData(answer.data);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          toast.warn(
            "Warning: Please ensure that you are connected to the internet and/or have input your data accurately. !",
            {
              position: "bottom-left",
            }
          );
        }
      } else {
        toast.warn(
          "Warning: Please ensure that you are connected to the internet and/or have input your data accurately. !",
          {
            position: "bottom-left",
          }
        );
        setIsLoading(false);
      }
    } else if (props.report === "avgTime") {
      if (props.direction) {
        try {
          response = await fetch(
            `http://192.168.128.172:8081/avgTime/?startDate=${props.startDate}&endDate=${props.endDate}&direction=${props.direction}`
          );
          answer = await response.json();
          setData(answer.data);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          toast.warn(
            "Warning: Please ensure that you are connected to the internet and/or have input your data accurately. !",
            {
              position: "bottom-left",
            }
          );
        }
      } else {
        toast.warn(
          "Warning: Please ensure that you are connected to the internet and/or have input your data accurately. !",
          {
            position: "bottom-left",
          }
        );
        setIsLoading(false);
      }
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
        filename={`${props.report}${
          props.direction ? `-${props.direction}` : ""
        }-${props.startDate}-${props.endDate}.csv`}
        data={data ? data : []}
        ref={csvInstance}
      ></CSVLink>
    </div>
  );
};

export default Button;
