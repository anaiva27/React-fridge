import React, { useEffect, useContext, useState } from "react";
import API from "../utils/API";
import FridgeItem from "./FridgeItem";
import ItemContext from "./Home";
import { StoreContext } from "../utils/store";
import Moment from "./Date";

export default function Fridge() {
//   const {
//     grocery: [grocItem, setGrocItem],
//   } = React.useContext(StoreContext);

  // const {
  //   list: [growingFoodList, setGrowingFoodList],
  // } = React.useContext(StoreContext);

//   const {
//     getData: [loadData],
//   } = React.useContext(StoreContext);
  const [growingFoodList, setGrowingFoodList] = useState([]);
  const [fridgeItem, setFridgeItem] = useState([]);

  //   useEffect(() => {
  //     loadData();
  //   }, []);
  useEffect(() => {
    // console.log("****rerendering");
  }, [fridgeItem, growingFoodList]);

  // useEffect(() => {
  //   // console.log("****rerendering");
  // }, [growingFoodList]);

  useEffect(() => {
    API.userFridge()
      .then((res) => {
        let FoodRes = res.data.fridges.filter((food) => !food.tossed && !food.eaten);
        setFridgeItem(FoodRes);
        console.log("77777777777", FoodRes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function getDate(date) {
    // format date to mm-dd-yyyy
    const splitDate = date.substr(0, 10).split("-");
    return splitDate[1] + "-" + splitDate[2] + "-" + splitDate[0];
  }

  const handleEatItem = (id) => {
    const foodList = [...fridgeItem];
    setFridgeItem(foodList.filter((product) => product._id !== id));
    API.updateFridge(id, {
      eaten: true,
      eatenDate: new Date(),
    })
      .then((res) => {
        console.log("RESPONSE", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTossItem = (id) => {
    const foodList = [...fridgeItem];
    setFridgeItem(foodList.filter((product) => product._id !== id));
    API.updateFridge(id, {
      tossed: true,
      tossedDate: new Date(),
    })
      .then((res) => {
        console.log("RESPONSE", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderFood = () => {
    let FoodResult = null;
    //find a mach in the data
    if (fridgeItem.length > 0) {
    
      return fridgeItem.map((food) => {
        return (
          <FridgeItem
            key={food._id}
            message={food.product}
            expDate={getDate(food.expirationDate)}
            tossItem={() => handleTossItem(food._id)}
            eatItem={() => handleEatItem(food._id)}
          />
        );
      });
    }
    // return FoodResult;
  };

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div>
            <div className="row">
              <div className="col-sm-6">
                <h1>Fridge</h1>
              </div>
              <div>{renderFood()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
