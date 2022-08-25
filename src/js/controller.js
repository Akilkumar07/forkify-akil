import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js'; 
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView   from './views/addRecipeView.js';


import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';


// if(module.hot){
//   module.hot.accept();
// }


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipes=async function(){
  try{
    const id=window.location.hash.slice(1);
    // console.log(id);
    
    if(!id)return;
    recipeView.renderSpinner();

  // update result view to mark selected serach result
    resultsView.update(model.getSearchResultsPage());

     //  updating the bookmarks  view
     bookmarksView.update(model.state.bookmarks);

      // loading recipe
      await model.loadRecipe(id);
      // const {recipe}=model.state;

    // showing recipe
    recipeView.render(model.state.recipe);
  
   
  }
  catch(err){
  recipeView.renderError();
  console.error(err);
  }
};

controlSearchResults=async function(){
  try{
    resultsView.renderSpinner();

    //get search query 

    const query=searchView.getQuery();
    if(!query) return;

    // load search results
  await model.loadSearchResults(query);
  // render results
  console.log(model.state.search.results);
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage());
 
// Render pagination buttons
    paginationView.render(model.state.search)
  }catch(err){
    console.log(err);
  }
};
const controlPagination=function(goToPage){
  resultsView.render(model.getSearchResultsPage(goToPage));
 
  // Render pagination buttons
      paginationView.render(model.state.search);
};

  const controlServings=function(newServings){
// update the recipe servings (in state)

    model.updateServings(newServings);
    // update the recipe view
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
    
  };

  const controlAddbookmark=function(){
    // Add/delete the bookmark
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    console.log(model.state.recipe);
    // Update the recipeView
    recipeView.update(model.state.recipe);
    // render the bookmark
    bookmarksView.render(model.state.bookmarks);
  };

  const controlBookmarks=function(){
    bookmarksView.render(model.state.bookmarks)
  };

  const controlAddRecipe= async function(newRecipe){
    try{
      addRecipeView.renderSpinner();
      // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // success message
    addRecipeView.renderMessage();
    // render the bookmarks view
    bookmarksView.render(model.state.bookmarks);
    // change ID in the URL
    window.history.pushState(null,'',`#(${model.state.recipe.id})`);
    // close from window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC * 1000);
  
  }catch(err){
    console.log('errrrrr',err);
    addRecipeView.renderError(err.message);
  }
};

const init=function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddbookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
 
};
init();