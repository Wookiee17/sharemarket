import React, { useEffect } from "react";
import { useRouter } from "next/router";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setLatestNiftyStock, setEODNiftyStock } from "../store/common/CommonSlice";

//graphql
import { useQuery } from "@apollo/client";
import { GET_LATEST_NIFTY_STOCK } from "../gql/queries";

const Home = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.Common.theme);
  const router = useRouter();

  useQuery(GET_LATEST_NIFTY_STOCK, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      if(v.stock_prices?.length && Array.isArray(v.stock_prices)){
        dispatch(setLatestNiftyStock(v.stock_prices[0]))
      }
      if(v.stock_prices_eod?.length && Array.isArray(v.stock_prices_eod)){
        dispatch(setEODNiftyStock(v.stock_prices_eod[0]))
      }
    }
  })
  useEffect(() => {
    setTimeout(() => {
      router.push("/dashboard");
    }, 50);
  }, []);

  return (
    <div className={`LoadingScreen ${theme}`}>
      <div className="lds">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Home;
