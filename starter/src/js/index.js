import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';

import List from './models/List';
import {elements, renderLoader, clearLoader,} from './views/base';
import {parseItem} from './models/Recipe';

import Recipe from './models/Recipe';
import Likes from './models/Likes';

/*
 Global state of the app
* - Search object
* *- Current recipe object
* - Shopping list
* -Liked recipes */

const state = {};

const controlSearch = async () => {
    // 1) query from view
    const query = searchView.getInput();
    if (query) {
        // 2) new search object and add to state
        state.search = new Search(query);
        try {
            //3)Prepare Ui for rsult
            searchView.clearInput();
            searchView.clearResult();
            renderLoader(elements.searchRes);

            //4) Search for recipes
            await state.search.getResult();

            //5) render results on Ui
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch (e) {
            console.log(`Error with search`);
            clearLoader();
        }
    }
};
elements.searchForm.addEventListener('submit', e => {

    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();

        searchView.renderResult(state.search.result, goToPage);
    }
});

//Recipe controller

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //hightlight text
      if(state.search){
          searchView.highLightSelected(id);

      }
      // Create new recipe object
        state.recipe = new Recipe(id);
        try {
            //Get recipe data

            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            //Render recipe
        clearLoader();

        recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
        } catch (e) {
            console.log(`Error processing recipe`);
        }
    }
};

['hashchange', 'load'].forEach(el => window.addEventListener(el, controlRecipe));
// IMPROVE!!!!!!
state.list = new List();


console.log(state.list);
//List cpnstroller
const controlList= ()=>{
   if(!state.list){
     state.list = new List();

   }
   else{
       //listView.toggleBtnDeleteList(state.list.getNumList());
       listView.clearList();
   }
   //add each ingredient to the list

state.recipe.ingredients.forEach(el=>{
   const item =  state.list.addItem(el.count,el.unit,el.ingredient);
   listView.renderItem(item);
});
    console.log(state.list);
    listView.toggleBtnDeleteList(state.list.getNumList());

    //Toggle ADD button
};
// SHOPING LIST HANDLER
    elements.shoppingList.addEventListener('click',e=>{
   if(e.target.closest('.shopping__list')) {
       const id = e.target.closest('.shopping__item').dataset.itemid;
       //handle the delete btn
       if (e.target.closest('.shopping__delete')) {
           state.list.deleteItem(id);
           listView.deleteItem(id);
       } else if (e.target.closest('.shopping__count-value')) {
           const val = parseFloat(e.target.value);
           state.list.updateCount(id, val);
       }
   }
   else if (e.target.closest('.recipe__btn--delete')) {
           state.list.deleteList();
           listView.clearList();
       listView.toggleBtnDeleteList(state.list.getNumList());
       }
   else if(e.target.closest('.recipe__btn--new')){
const count = document.querySelector('.shopping__count--valueNew').value;
const ingredient = document.querySelector('.shopping__description--value').value;
const newListItem = [count,ingredient].join(' ');
console.log(newListItem);
const parsedItem = parseItem(newListItem);
console.log(parsedItem);

     const newItem =  state.list.addItem(parsedItem.count,`${parsedItem.unit}`,`${parsedItem.ingredient}`);
     console.log(state.list);
       listView.renderItem(newItem);
   }

});

//Like Controller


const controlLike = ()=>{
if(!state.likes)
    state.likes = new Likes();
const currentID=state.recipe.id;
//User dont like this recipe
if(!state.likes.isLiked(currentID)){
    //Add like to the state
const newLike = state.likes.addLike(currentID,state.recipe.title,state.recipe.author,state.recipe.img);
    //Toggle the like button
likeView.toggleLikeBtn(true);
    //Add like to the UI list
likeView.renderLike(newLike);
}
//user had a current recipe
else{
        //Remove like to the state
state.likes.deleteLike(currentID);
        //Toggle the like button
likeView.toggleLikeBtn(false);
        //Remove like to the UI list
  likeView.deleteLike(currentID);
}

likeView.toggleLikeMenu(state.likes.getNumLikes());
};
//Rstore liked recipes on page load
window.addEventListener('load',async ()=>{
   state.likes = new Likes();
    state.likes.readStorage();
    console.log(state.likes);
    //Toggle like menu
    likeView.toggleLikeMenu(state.likes.getNumLikes());
    //Render the existing likes
    state.likes.like.forEach(el=>likeView.renderLike(el));


    //Restore shopping LIST
    state.list = new List();
    state.list.readListData();
state.list.items.forEach(el=>listView.renderItem(el));
    listView.toggleBtnDeleteList(state.list.getNumList());


    //Restoring search result
state.search = new Search();
    renderLoader(elements.searchRes);

    //4) Search for recipes

     state.search.readSearchREsult();


    //5) render results on Ui
    clearLoader();
    searchView.renderResult(state.search.result);
});


//Handling recipe button clicks
elements.recipe.addEventListener('click',e=>{
  if(e.target.closest('.btn-decrease')){
      //decrease button is clicked
      if(state.recipe.servings>1) {
          state.recipe.updateServings('dec');
          recipeView.updateServingsIngredients(state.recipe);
      }
      }
    else if(e.target.closest('.btn-increase')){
        //decrease button is clicked

      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
    }
    //render on the UI
 else if(e.target.closest('.recipe__btn--add')){

     controlList();
  }
 else if(e.target.closest('.recipe__love')){
     //Like controller
      controlLike();
  }
    }
);

//autoComplete
