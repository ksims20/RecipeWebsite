// see documentation: https://spoonacular.com/food-api/docs
const apiKey = "18808d01da254044a66aee9b1fc705e1";
const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`;

async function searchForRecipes(ev) {
  ev.preventDefault();
  const term = document.getElementById("term").value;
  const url = `${baseURL}&query=${term}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  showResults(data.results);
}

// Fetches the results once the user searches for a recipe
function showResults(results) {
  const el = document.getElementById("results");
  el.innerHTML = "";
  for (const result of results) {
    el.insertAdjacentHTML(
      "beforeend",
      `
        <section>
          <img src="${result.image}" />
          <p>${result.title}</p>
          <button onclick="showRecipeData(${result.id})"> Show more </button>
        </section>
      `
    );
  }
}

async function showRecipeData(recipeId) {
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const el = document.getElementById("results");

  // Check if the response contains extendedIngredients property
  if (data.extendedIngredients) {
    const ingredientsList = data.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join("");
    
    el.innerHTML = `
      <section>
        <img src="${data.image}" />
        <h2>${data.title}</h2>
        <h3>Ingredients:</h3>
        <ul>${ingredientsList}</ul>
        <h3>Steps:</h3>
        <ol>${data.analyzedInstructions[0].steps.map(step => `<li>${step.step}</li>`).join("")}</ol>
        <button onclick="searchForRecipes(event)">Back to Results</button>
      </section>
    `;
  } else {
    // Handle the case where ingredients information is not available
    el.innerHTML = `
      <section>
        <img src="${data.image}" />
        <h2>${data.title}</h2>
        <p>Ingredients information not available.</p>
        <h3>Steps:</h3>
        <ol>${data.analyzedInstructions[0].steps.map(step => `<li>${step.step}</li>`).join("")}</ol>
        <button onclick="searchForRecipes(event)">Back to Results</button>
      </section>
    `;
  }
}