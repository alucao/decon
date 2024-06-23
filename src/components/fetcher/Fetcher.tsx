import "./Fetcher.css";
import { useState, useEffect } from "react";
import { populateDb } from "../../api/data-gatherer";
import NinjaConfig from "../../ninjaConfig";

function Fetcher({ socials, refreshQueries }) {
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    try {
      console.log(page);
      const newPage = await populateDb(page);
      if (page != newPage) {
        console.log("Data fetched");
        refreshQueries();
      }
      console.log(newPage);
      setPage(newPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(
      fetchData,
      new NinjaConfig().getCfg()?.POLLING_INTERVAL ?? 10000
    );
    return () => clearInterval(intervalId);
  }, [page]);

  useEffect(() => {
    if (!socials || socials.length == 0) {
      setPage(0);
    }
  }, [socials]);

  const getStatus = () => {
    if (page > 1) {
      return <div className="fetcher-status">Synced</div>;
    }

    return (
      <div className="fetcher-status">
        Fetching blockchain data...
        <div className="fetcher-loader" />
      </div>
    );
  };

  return (
    <div className="fetcher">
      {getStatus()}
      <div className="fetcher-lastcheck">Epoch: {page}</div>
    </div>
  );
}

export default Fetcher;
