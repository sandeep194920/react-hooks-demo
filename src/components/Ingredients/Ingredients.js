import React, { useState, useCallback } from "react";
import IngredientList from "../Ingredients/IngredientList";
import IngredientForm from "./IngredientForm";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]); // using array because the ingredients will be a list of ingredients
  const [isLoading, setIsLoading] = useState(false); // used to show loading spinner
  const [error, setError] = useState();

  // fetching data from backend (We use to do this in componentDidMount).
  // I can comment the below useEffect because samething is called in Search component's useEffect which does the same and
  // we are guaranteed to get the ingredients because of Search component being called here which is connected with the
  // useEffect in Search

  // useEffect(() => {
  //   fetch("https://react-hooks-update-566c5.firebaseio.com/ingredients.json")
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       const loadedIngredients = [];
  //       for (const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount,
  //         });
  //       }
  //       setUserIngredients(loadedIngredients);
  //     });
  // }, []);

  // empty array (2nd arg of useEffect) means we have no dependencies here on which the useEffect should run and
  // hence the useEffect runs only once and thus works like CDM. Omitting the [] causes it work like CDU.

  // This comes from Search component and the filtered ingredients are set as userIngredients here
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []); // In the Search, the useEffect depends on this and when this setUserIngredients here
  // executes the useEffect in Search executes creating an infinite loop. Hence we can use
  // useCallback and specify a dependency similar to useEffect. We have no dependency here execpt setUserIngredients
  // which is given by react by default, hence no need to mention that as a dependency here.

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);

    // Let's send this data to backend when we click on Add Ingredient button. Let's use fetch (modern browser api) for this. It's similar to axios.
    // Note: By default the fetch uses GET. We need POST here to store data in backend
    fetch("https://react-hooks-update-566c5.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient), //takes js object and converts into valid json format. This is done automatically in axios
      headers: { "Content-Type": "application/json" }, // this is expected by firebase and is done automatically in axios
    })
      .then((response) => {
        setIsLoading(false);
        return response.json(); // response itself is a complex object and we are interested in the body part of it. So once we get this we can get the body as responseData. These two steps will be combined into one in axios.
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }, //name is the unique id in the firebase. This might differ from one backend to another
        ]);
      })
      .catch((error) => {
        // These two below will have only one render cycle and not two because react batches these two updates into one to avoid
        // unnecessary render cycles
        setError("Something went wrong!");
        setIsLoading(false);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);

    // delete ingredient from firebase by searching ingredient with its id. Note that we can use string interpolation (by using `)
    // in the url and this is required when we specify something related to firebase in the url like below
    fetch(
      `https://react-hooks-update-566c5.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      setIsLoading(false);

      // we dont care about the response here but when we get the response after getting deleted from the firebase, we remove it from UI as well using the code below
      setUserIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
      );
    });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
