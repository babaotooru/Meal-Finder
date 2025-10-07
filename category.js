// Navbar toggle
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

// Home link → redirect to home
homeLink.addEventListener("click", () => {
  window.location.href = "./index.html";
});

// DOM Elements
const resultHeading = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const search = document.getElementById("search");
const submit = document.getElementById("submit");

// Load Navbar items
async function loadNavItems() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const data = await res.json();
  data.categories.forEach((cat) => {
    const a = document.createElement("a");
    a.href = `category.html?category=${encodeURIComponent(cat.strCategory)}`;
    a.textContent = cat.strCategory;
    navItems.appendChild(a);
  });
}
loadNavItems();

// Get category from URL
const params = new URLSearchParams(window.location.search);
const categoryName = params.get("category");

// Display meals by category
async function loadCategoryMeals(catName) {
  // Fetch category description
  const catRes = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const catData = await catRes.json();
  const catInfo = catData.categories.find((c) => c.strCategory === catName);

  resultHeading.innerHTML = `
    <div class="description">
      <h2>${catName}</h2>
      <p>${catInfo ? catInfo.strCategoryDescription : ""}</p>
    </div>
    <h3>Meals</h3>
  `;

  // Fetch meals
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`);
  const data = await res.json();
  if (data.meals) {
    mealsEl.innerHTML = data.meals
      .map(
        (meal) => `
      <div class="meal" onclick="window.location.href='singlemeal.html?id=${meal.idMeal}'">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="meal-info">
          <h3>${meal.strMeal}</h3>
        </div>
      </div>
    `
      )
      .join("");
  }
}

// Initial load
if (categoryName) {
  loadCategoryMeals(categoryName);
}

// Search on category page
submit.addEventListener("submit", (e) => {
  e.preventDefault();
  const term = search.value.trim();
  if (!term) return alert("Please enter a search term");

  // Hide categories section
  const categoriesSection = document.getElementById("categories-section");
  if (categoriesSection) categoriesSection.style.display = "none";

  // Clear everything in resultHeading (heading + description)
  resultHeading.innerHTML = "";

  // Add search heading
  resultHeading.innerHTML = `
    <h1 class="meals-heading">Meals</h1>
    <h2 class="search-term">Search Results for '${term}':</h2>
  `;

  // Clear previous meals
  const mealsContainer = document.getElementById("meals");
  mealsContainer.innerHTML = "";

  // Fetch and render search results
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    .then(res => res.json())
    .then(data => {
      if (data.meals) {
        mealsContainer.innerHTML = data.meals
          .map(meal => `
            <div class="meal" onclick="window.location.href='singlemeal.html?id=${meal.idMeal}'">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info"><h3>${meal.strMeal}</h3></div>
            </div>
          `).join("");
      } else {
        mealsContainer.innerHTML = `<p>No results found for '${term}'</p>`;
      }
    });

  // Clear input
  search.value = "";
});