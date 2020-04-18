import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");

  useEffect(() => {
    // Here we need to get the ingredients (only those which match enteredFilter) from firebase.
    // Firebase provides a way to filter like this below,

    const queryParams =
      enteredFilter.length === 0
        ? ""
        : `?orderBy="title"&equalTo="${enteredFilter}"`; // `` is the backticks used to do string interpolation. This is the format the firebase expects hence refer firebase docs for this.
    fetch(
      "https://react-hooks-update-566c5.firebaseio.com/ingredients.json" +
        queryParams
    )
      .then((response) => response.json())
      .then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        // now that we got all the ingredients matching our search (enteredFilter), we need to send this to Ingredients component
        // and set it to userIngredients so that when it is passed into the IngredientList as props we get the one we received here
        onLoadIngredients(loadedIngredients);
        // this also should be dependency and if onLoadIngredients, which is part of props, changes then this useEffect should run
        // again. Even though onLoadIngredients is a function we need to mention that because all js functions are objects which would
        // execute later. Watch video 436. More on useEffect() for much clarity.
      });
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
            type="text"
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
