const deleteProduct = btn => {
    console.log()
    //const productId = document.querySelector('.delete0').value;
const productId = btn.previousElementSibling.value;
    //const prodId = btn.parentNode.querySelector('[name=productId]').value;
  //const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('.gridd-items');
  console.log(productId)

  fetch('/delete-product/'+ productId, {
    method: 'DELETE', 
    /*headers: {
      'csrf-token': csrf 
    }*/
  })
    .then(result => {
        console.log(productElement)
      return result.json();
    })
    .then(data => {
      console.log(data);
      //document.querySelector('.delete').rem
      productElement.remove();
    })
    .catch(err => {
      console.log(err);
    });
};
