
// Navbar toggle (same as Home/Category)
const toggleBtn = document.querySelector(".toggle-btn");
const navItems = document.getElementById("navItems");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const homeLink = document.getElementById("homeLink");

function openMenu() {
  navItems.classList.add("show");
  overlay.classList.add("show");
}
function closeMenu() {
  navItems.classList.remove("show");
  overlay.classList.remove("show");
}
toggleBtn.addEventListener("click", openMenu);
overlay.addEventListener("click", closeMenu);
closeBtn.addEventListener("click", closeMenu);
homeLink.addEventListener("click", () => { window.location.href = "./index.html"; });

// Single meal rendering
const singleMealEl = document.getElementById("single-meal");

// Get meal ID from URL
const urlParams = new URLSearchParams(window.location.search);
const mealId = urlParams.get("id");

if (!mealId) {
  singleMealEl.innerHTML = "<p>No meal selected. Please go back and select a meal.</p>";
} else {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => displaySingleMeal(data.meals[0]));
}

function displaySingleMeal(meal) {
  // Extract ingredients and measures separately
  const ingredients = [];
  const measures = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
      ingredients.push(meal[`strIngredient${i}`]);
      measures.push(meal[`strMeasure${i}`]);
    }
  }

  // Split instructions into array for checkbox
  const instructions = meal.strInstructions.split(/\. |\.\n/).filter(instr => instr.trim() !== "");

  singleMealEl.innerHTML = `
    <h1><i class="fas fa-house"></i>${meal.strMeal}</h1>
    <h3>Meal Details</h3>
    <section class=single-detail>
    <div class="img-ing">
      <img class="single-img" src="${meal.strMealThumb}" alt="${meal.strMeal}" />

    <div class="meal-info-details"> 
    <div class="meal-info">
      <p class="strMeal">${meal.strMeal}</p>
      <p class="data"><strong>Category:</strong> ${meal.strCategory || "N/A"}</p>
      <p class="data"><strong>Area:</strong> ${meal.strArea || "N/A"}</p>
      <p class="data"><strong>Tags:</strong> ${meal.strTags ? meal.strTags.split(",").join(", ") : "N/A"}</p>
      <p class="data"><strong>Source:</strong> <a href="${meal.strSource || "#"}" target="_blank">Click Here</a></p>
    </div>
    
    <div class="ingredients">
      <h2>Ingredients</h2>
      <ul>${ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
    </div>
   </div>
   </div>

      <div class="measures">
        <h2>Measures</h2>
        <ul>${measures.map(measure => `<li>${measure}</li>`).join("")}</ul>
      </div>

    <div class="instructions">
      <h2>Instructions</h2>
      <ul>${instructions.map(instr => `<li><input type="checkbox"><label>${instr.trim()}</label></li>`).join("")}</ul>
    </div>
    </section>
  `;
}
