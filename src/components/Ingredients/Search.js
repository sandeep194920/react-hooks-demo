import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef(); // This reference can be assigned to the dom element to get the current value of that particalur element. We use this in if loop of setTimeout below in useEffect

  useEffect(() => {
    // setTimeout related things are explained in notes in point number 13 in detail. Please refer that.
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        // Here the entered filter is not the updated one but the one before timer started. The latest one is inputRef got by useRef attached to the input below
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
      }
    }, 500);
    // we can return a function at the end in the useEffect (and only the function can be returned if we will and nothing else)
    // we choose to use this return inorder to clear the previous timer. Inside the below return function the previous timer is
    // cleared. If we happen to call the useEffect only once (in case of [] dependency) then the below function clears the timer
    // during unmounting of this component
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef} // ref is supported by react to get the reference to this input and hence it's value at any point in time
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
