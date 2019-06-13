import _ from 'lodash';


function component() {
    const element = document.createElement('div');
  
    console.log(_.map);
    element.innerHTML = "Hello web audio!";
  
    return element;
}
  
document.body.appendChild(component());