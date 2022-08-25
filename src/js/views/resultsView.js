import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ResultsView extends View{
_parentElement=document.querySelector('.results');
_errorMessage="No recipe try another";
_message='';

_generateMarkup(){
console.log(this._data);
return this._data.map(this._generateMarkupPreview).join('');

    
}
_generateMarkup(){
  // console.log(this._data);
  return this._data
  .map(result=>previewView.render(result ,false))
  .join('');
  
      
  }
}

export default new ResultsView();