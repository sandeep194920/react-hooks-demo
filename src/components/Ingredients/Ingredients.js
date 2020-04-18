import React, { useState } from "react";
import IngredientList from "../Ingredients/IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]); // using array because the ingredients will be a list of ingredients

  const addIngredientHandler = (ingredient) => {
    // Let's send this data to backend when we click on Add Ingredient button. Let's use fetch (modern browser api) for this. It's similar to axios.
    // Note: By default the fetch uses GET. We need POST here to store data in backend
    fetch("https://react-hooks-update-566c5.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient), //takes js object and converts into valid json format. This is done automatically in axios
      headers: { "Content-Type": "application/json" }, // this is expected by firebase and is done automatically in axios
    })
      .then((response) => {
        return response.json(); // response itself is a complex object and we are interested in the body part of it. So once we get this we can get the body as responseData. These two steps will be combined into one in axios.
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }, //name is the unique id in the firebase. This might differ from one backend to another
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
