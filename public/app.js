console.log(`Fetching Data...`)

const recipeContainer = document.getElementsByClassName("recipes-container")[0];
fetch('http://localhost:3000/api/recipes')
    .then(response => response.json())
    .then(data => {
        data.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            const nameElement = document.createElement('div');
            const timeElement = document.createElement('div');
            const ingredientsElement = document.createElement('div');
            nameElement.textContent = `Name: ${recipe.name}` 
            timeElement.textContent = `Time to complete: ${recipe.time}` 
            ingredientsElement.textContent = `All you need: ${recipe.ingredients}`;
            recipeDiv.appendChild(nameElement);
            recipeDiv.appendChild(timeElement);
            recipeDiv.appendChild(ingredientsElement);
            recipeContainer.appendChild(recipeDiv)
        });
    })
    .catch(error => console.error(error));

const textInput = document.querySelector("#text-search");
const searchButton = document.querySelector("#search-button");

searchButton.addEventListener("click", () => {
    let textValue = textInput.value;
    fetch(`http://localhost:3000/api/recipes/${textValue}`)
        .then((response) => response.json())
        .then((recipe) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            const nameElement = document.createElement('div');
            const timeElement = document.createElement('div');
            const ingredientsElement = document.createElement('div');
            nameElement.textContent = `Name: ${recipe.name}` 
            timeElement.textContent = `Time to complete: ${recipe.time}` 
            ingredientsElement.textContent = `All you need: ${recipe.ingredients}`;
            recipeDiv.appendChild(nameElement);
            recipeDiv.appendChild(timeElement);
            recipeDiv.appendChild(ingredientsElement);
            recipeContainer.appendChild(recipeDiv)
        });
});