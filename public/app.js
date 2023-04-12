console.log(`Fetching Data...`)

const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const recipeForm = document.getElementById('recipe-form');

// event listeners 
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailContent.parentElement.classList.remove('showRecipe');
});

// meal list that matches
function getMealList(){
    let searchInputText = document.getElementById('search-input').value.trim();
    console.log(searchInputText)

    const mealsElement = document.createElement('div');
    const recipesElement = document.createElement('div');

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputText}`)
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div> 
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                mealList.classList.add('notFound')
            }
            mealsElement.innerHTML = html;
        })

    fetch(`http://localhost:3000/api/images`)
        .then(response => response.json())
        .then(data => {
            //console.log(data[0].name)
            let html = "";
            if (data) {
                data.forEach(recipe => {
                    html += `
                        <div class="meal-item" data-id="${recipe.id}">
                            <div class="meal-img">
                                <img src="${recipe.image_link}" alt="Picture Not Found">
                            </div>
                            <div class="meal-name">
                                <h3>${recipe.name}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                recipesElement.classList.remove('notFound');
            } else {
                recipesElement.classList.add('notFound')
            }
            recipesElement.innerHTML = html;
        })

    mealList.innerHTML = '';
    mealList.appendChild(mealsElement);
    mealList.appendChild(recipesElement);
}


// get recipe 
function getMealRecipe(e) {
    e.preventDefault();
    //console.log(e)
    if (e.target.classList.contains('recipe-btn')) {
        //console.log(e.target)
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModel(data.meals));

        let imageItem = e.target.parentElement.parentElement;
        fetch(`http://localhost:3000/api/images/${imageItem.dataset.id}`)
        .then(response => response.json())
        .then(recipe => mealImageModel([recipe])); // wrap the recipe object in an array

        // console.log(imageItem.dataset.id)
    }
}

// create model

function mealImageModel(recipe) {
    try {
        // console.log(recipe);
        recipe = recipe[0];
        let html = `
            <h2 class="recipe-title">${recipe.name}</h2>
            <div class="recipe-meal-img">
                <img src="${recipe.image_link}" alt="Picture Not Found">
            </div>
            <div class="recipe-instructions">
                <h3>Instructions:</h3>
                <p>Recipe Coming Soon</p>
            </div>
        `;
        mealDetailContent.innerHTML = html;
        mealDetailContent.parentElement.classList.add('showRecipe');
    } catch (error) {
        console.log(error);
        return; // stop code execution
    }
}

function mealRecipeModel(meal) {
    try {
        // console.log(meal);
        meal = meal[0];
        let html = `
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <p class="recipe-category">${meal.strCategory}</p>
            <div class="recipe-instructions">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>
            <div class="recipe-meal-img">
                <img src="${meal.strMealThumb}" alt="">
            </div>
            <div class="recipe-link">
                <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
            </div>
        `;
        mealDetailContent.innerHTML = html
        mealDetailContent.parentElement.classList.add('showRecipe')
    } catch (error) {
        console.log(error);
        return; // stop code execution
    }
}


// this isn't working. Code wants to run into mealRecipeModel after running mealImageModel. Have to consdier try catch 
   
// function mealRecipeModel(meal) {
    //     console.log(meal);
    //     meal = meal[0];
    //     let html = `
    //         <h2 class="recipe-title">${meal.strMeal}</h2>
    //         <p class="recipe-category">${meal.strCategory}</p>
    //         <div class="recipe-instructions">
    //             <h3>Instructions:</h3>
    //             <p>${meal.strInstructions}</p>
    //             </div>
    //             <div class="recipe-meal-img">
    //                 <img src="${meal.strMealThumb}" alt="">
    //             </div>
    //             <div class="recipe-link">
    //                 <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    //             </div>
    //     `;
    //     mealDetailContent.innerHTML = html
    //     mealDetailContent.parentElement.classList.add('showRecipe')
    // } 
    
    
    // function mealImageModel(recipe) {
    //     console.log(recipe);
    //     recipe = recipe[0];
    //     let html = `
    //       <h2 class="recipe-title">${recipe.name}</h2>
    //       <div class="recipe-meal-img">
    //         <img src="${recipe.image_link}" alt="Picture Not Found">
    //       </div>
    //     `;
    //     mealDetailContent.innerHTML = html;
    //     mealDetailContent.parentElement.classList.add('showRecipe');
    //   }
    