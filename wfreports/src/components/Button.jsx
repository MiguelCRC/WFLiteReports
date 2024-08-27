import React, { useEffect, useState, useRef } from "react";
import "../style/buttonStyle.css";
import icon from "../icons/reload.svg";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import moment from "moment";

export const Button = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const csvInstance = useRef();
  const API_URL = process.env.REACT_APP_API_KEY;

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
          `${API_URL}/esignature/?startDate=${props.startDate}&endDate=${props.endDate}`
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
          `${API_URL}/scanning/?startDate=${props.startDate}&endDate=${props.endDate}`
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
            `${API_URL}/timeSite/?startDate=${props.startDate}&endDate=${props.endDate}&direction=${props.direction}`
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
            `${API_URL}/avgTime/?startDate=${props.startDate}&endDate=${props.endDate}&direction=${props.direction}`
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
    } else if (props.report === "ediInfo") {
      if (props.customerId !== "1") {
        try {
          response = await fetch(
            `${API_URL}/ediTracking/?startMonth=${props.startMonth}&endMonth=${props.endMonth}&customerId=${props.customerId}`
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
          "Warning: Please ensure to select a Warehouse to generate report !",
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
        }-${
          props.startDate
            ? props.startDate
            : moment(props.startMonth).format("YYYY-MM")
        }-${
          props.endDate
            ? props.endDate
            : moment(props.endMonth).format("YYYY-MM")
        }.csv`}
        data={data ? data : []}
        ref={csvInstance}
      ></CSVLink>
    </div>
  );
};

export default Button;
