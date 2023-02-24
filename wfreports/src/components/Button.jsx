import React, { useState } from "react";
import "../style/buttonStyle.css";
import icon from "../icons/reload.svg";
import { CSVLink, CSVDownload } from "react-csv";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const Button = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [data, setData] = useState([]);

  let getUsers = (event, done) => {
    if (!isLoading) {
      setIsLoading(true);
      fetch(
        `http://localhost:8000/inbounds/?startDate=${props.startDate}&endDate=${props.endDate}`
      )
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          setData(response.data);
          setIsLoading(false);
          done(true); // Proceed and get data from dataFromListOfUsersState function
        })
        .catch(() => {
          setIsLoading(false);
          done(false);
        });
    }
  };

  var dataFromListOfUsersState = () => {
    return data;
  };

  return (
    <CSVLink data={data} asyncOnClick={true} onClick={getUsers}>
      {isLoading ? "Loading csv..." : "Download me"}
    </CSVLink>
  );

  //   const handleClick = async () => {
  //     var response;
  //     var answer;
  //     setIsLoading(true);
  //     setIsFinished(false);
  //     if (props.report === "inbound") {
  //       response = await fetch(
  //         `http://localhost:8000/inbounds/?startDate=${props.startDate}&endDate=${props.endDate}`
  //       );
  //       answer = await response.json();
  //       // setData(answer.data);
  //       setData(answer.data);
  //       setIsFinished(true);
  //       setIsLoading(false);
  //       console.log(data);
  //     } else if (props.report === "scanning") {
  //       response = await fetch("http://localhost:8000/scanning").then(
  //         await delay(3000),
  //         setIsLoading(false)
  //       );
  //     }
  //   };

  //   return (
  //     <button
  //       disabled={isLoading}
  //       onClick={handleClick}
  //       className={`button ${isLoading ? "loading" : ""}`}
  //     >
  //       <img src={icon} alt="cycle_image" />
  //       <span>{isLoading ? "Downloading" : "Download"}</span>
  //       {isFinished ? (
  //         <CSVDownload
  //           filename={`inbound-${props.startDate}-${props.endDate}.csv`}
  //           data={data}
  //         />
  //       ) : (
  //         ""
  //       )}
  //     </button>
  //   );
};

export default Button;
