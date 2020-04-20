import React, { useCallback, useReducer, useMemo } from "react";
import IngredientList from "../Ingredients/IngredientList";
import IngredientForm from "./IngredientForm";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

// Note that this is similar to what we did in redux but the useReducer has nothing to do with redux library.
// currentIngredients (first argument) is the one which is passed as a second argument in the useReducer function below.
// Initially we are passing []. dispatch is the one which acts as setState and when the action is dispatched the reducer
// state changes (when any of the case returns something which changes the state - currentIngredients) hence currentIngredients
// change becuase of which the component re-renders
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients; // This ingredients is an array and this when returned replaces the state - currentIngredients thus becomes the updated state and the component re-renders due to this state change
    case "ADD":
      return [...currentIngredients, action.ingredient]; // This is same as using setUserIngredients and using previous ingredients to fetch the previous state and update that as we did in addIngredientHandler
    case "DELETE":
      return currentIngredients.filter(
        (ingredient) => ingredient.id !== action.id
      );
    default:
      throw new Error(
        "This should not be reached as we are handling everything already"
      );
  }
};

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case "SEND": // sending http request in addIngredientHandler
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.error };
    case "CLEAR":
      return { ...currHttpState, error: null };
    default:
      throw new Error(
        "This should not be reached as we are handling everything already"
      );
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []); // In useReducer, the second arg [] is the currentIngredients (intital state of ingredientReducer). The dispatch is the one which causes the state to change
  const [httpstate, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  // Below line is replaced by above to use useReducer()
  // const [userIngredients, setUserIngredients] = useState([]); // using array because the ingredients will be a list of ingredients
  // These two are combined into one httpReducer
  // const [isLoading, setIsLoading] = useState(false); // used to show loading spinner
  // const [error, setError] = useState();

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
    // setUserIngredients(filteredIngredients); // code used before useReducer was introduced
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []); // In the Search, the useEffect depends on this and when this setUserIngredients here
  // executes the useEffect in Search executes creating an infinite loop. Hence we can use
  // useCallback and specify a dependency similar to useEffect. We have no dependency here execpt setUserIngredients
  // which is given by react by default, hence no need to mention that as a dependency here.

  const addIngredientHandler = useCallback((ingredient) => {
    // setIsLoading(true); // used before useReducer was used
    dispatchHttp({ type: "SEND" });

    // Let's send this data to backend when we click on Add Ingredient button. Let's use fetch (modern browser api) for this. It's similar to axios.
    // Note: By default the fetch uses GET. We need POST here to store data in backend
    fetch("https://react-hooks-update-566c5.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient), //takes js object and converts into valid json format. This is done automatically in axios
      headers: { "Content-Type": "application/json" }, // this is expected by firebase and is done automatically in axios
    })
      .then((response) => {
        // setIsLoading(false); // used before useReducer
        dispatchHttp({ type: "RESPONSE" });

        return response.json(); // response itself is a complex object and we are interested in the body part of it. So once we get this we can get the body as responseData. These two steps will be combined into one in axios.
      })
      .then((responseData) => {
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }, //name is the unique id in the firebase. This might differ from one backend to another
        // ]);
        // Above commented code used before useReducer
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient },
        });
      })
      .catch((error) => {
        // These two below will have only one render cycle and not two because react batches these two updates into one to avoid
        // unnecessary render cycles
        // setError("Something went wrong!"); // used before useReducer
        // setIsLoading(false); // used before useReducer
        dispatchHttp({ type: "ERROR", error: "Something went wrong!" }); // combining setError and setIsLoading in this line. This is the advantage of useReducer
      });
  }, []);

  const removeIngredientHandler = (ingredientId) => {
    // setIsLoading(true); //used before useReducer
    dispatchHttp({ type: "SEND" });

    // delete ingredient from firebase by searching ingredient with its id. Note that we can use string interpolation (by using `)
    // in the url and this is required when we specify something related to firebase in the url like below
    fetch(
      `https://react-hooks-update-566c5.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        // setIsLoading(false); used before useReducer
        dispatchHttp({ type: "RESPONSE" });

        // we dont care about the response here but when we get the response after getting deleted from the firebase, we remove it from UI as well using the code below
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        // );
        // Above commented code used before useReducer
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((error) =>
        dispatchHttp({ type: "ERROR", error: "Something went wrong!" })
      );
  };

  const clearError = useCallback(() => {
    // setError(null); // used before useReducer
    dispatchHttp({ type: "CLEAR" });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients]); // if userIngredients change then we need to re-render this component, else no need
  return (
    <div className="App">
      {httpstate.error && (
        <ErrorModal onClose={clearError}>{httpstate.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpstate.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
