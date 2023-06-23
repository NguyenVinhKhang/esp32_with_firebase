import realtimeDB from "./firebase";
import React, { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";
import { MaterialReactTable } from "material-react-table";

const Table = () => {
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const dbRef = ref(realtimeDB);
    get(child(dbRef, `data`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (data) {
      const dates = Object.values(data.date);
      const speeds = Object.values(data.speed);
      const times = Object.values(data.time);

      const result = dates.map((date, index) => ({
        date,
        speed: speeds[index],
        time: times[index],
      }));

      setResult(result);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      const dbRef = ref(realtimeDB);
      get(child(dbRef, `data`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setData(snapshot.val());
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, 10000); // 5 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      cellRenderer: (rowData) => (
        <div style={{ textAlign: "center" }}>{rowData.date}</div>
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
      cellRenderer: (rowData) => (
        <div style={{ textAlign: "center" }}>{rowData.time}</div>
      ),
    },
    {
      accessorKey: "speed",
      header: "Speed",
      cellRenderer: (rowData) => (
        <div style={{ textAlign: "center" }}>{rowData.speed}</div>
      ),
    },
  ];

  return (
    <div>
      {result && <MaterialReactTable columns={columns} data={result} />}
    </div>
  );
};

export default Table;
