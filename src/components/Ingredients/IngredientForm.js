import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
  const inputState = useState({ title: "", amount: "" });

  const submitHandler = (event) => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={inputState[0].title}
              onChange={(event) => {
                const newInput = event.target.value;
                inputState[1]((prevInputState) => ({
                  title: newInput, // event is not accessible here as we use prevInputState (due to the behavior of closure in javascript) hence we declare this way using event above
                  amount: prevInputState.amount, // This is because, like setState this wont merge the amount automatically into state
                }));
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={inputState[0].amount}
              onChange={(event) => {
                const newTitle = event.target.value;
                inputState[1]((prevInputState) => ({
                  amount: newTitle, // event is not accessible here as we use prevInputState (due to the behavior of closure in javascript) hence we declare this way using event above
                  title: prevInputState.title, // This is because, like setState this wont merge the title automatically into state
                }));
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
