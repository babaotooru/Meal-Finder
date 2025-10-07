
// Navbar toggle
const toggleBtn = document.querySelector(".toggle-btn");
const navItems = document.getElementById("navItems");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const homeLink = document.getElementById("homeLink");

// Toggle menu
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

// Home link → stay on index.html
homeLink.addEventListener("click", () => {
  window.location.href = "./index.html";
});

// DOM elements
const catagory_image = document.getElementById("img-catagories");
const search = document.getElementById("search");
const submit = document.getElementById("submit");
const resultHeading = document.getElementById("result-heading");

// ======================
// Load Navbar & Categories
// ======================
async function loadCategories() {
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    const data = await res.json();
    const categories = data.categories;

    // Navbar items
    categories.forEach((cat) => {
      const a = document.createElement("a");
      a.href = `category.html?category=${encodeURIComponent(cat.strCategory)}`;
      a.textContent = cat.strCategory;
      navItems.appendChild(a);
    });

    // Category cards
    catagory_image.innerHTML = categories
      .map(
        (cat) => `
      <div class="cat-card" onclick="window.location.href='category.html?category=${encodeURIComponent(
          cat.strCategory
        )}'">
        <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}" />
        <div class="cat-name">${cat.strCategory}</div>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}
loadCategories();

// ======================
// Search Meals (display results above categories)
// ======================
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

const mealsEl = document.getElementById("meals");
console.log(mealsEl);
