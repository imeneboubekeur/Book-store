const deleteProduct = btn => {
    console.log()
    const productId = document.querySelector('.delete0').value;

    //const prodId = btn.parentNode.querySelector('[name=productId]').value;
  //const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('tr');

  fetch('/cart-delete-item'+ productId, {
    method: 'DELETE', 
    /*headers: {
      'csrf-token': csrf 
    }*/
  })
    .then(result => {
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
