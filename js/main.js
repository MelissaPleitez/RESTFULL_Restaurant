 
 let order={
    table: '',
    time: '',
    orders: []
 }

 let categories={
    1:'Food',
    2:'Drink',
    3:'Dessert'
 }

 const save_client= document.querySelector('#save_client')

 save_client.addEventListener('click', verifying_inputs)


 function verifying_inputs(){

    const table = document.querySelector('#table').value
    const time = document.querySelector('#time').value

    const inputs= [table, time].some((input)=> input==='')

    // console.log(inputs)

    if(inputs){
        alerts('Empty inputs', "#9d263a")
        return
    
    }

        alerts('Saved!',"#94C631")
  
        order= {...order, table, time}

        // console.log(order)
       
        const modalElement= document.querySelector('#exampleModal')
        const modal= bootstrap.Modal.getInstance(modalElement)

        modal.hide()

        order_details()
        calling_order()

 }

 function order_details(){
    const containers= document.querySelectorAll('.d-none')
    containers.forEach(details=> details.classList.remove('d-none'))
 }


function calling_order(){

const URL= "http://localhost:3000/dishes"

fetch(URL)
    .then(response => response.json())
    .then(result => showing_dishes(result))
    .catch(error => console.error(error))

}

function showing_dishes(dishes){
const dishes_container=document.querySelector('#dishes .result')

dishes.forEach((dish)=>{

    const row = document.createElement('div')
    row.classList.add('row', 'py-3', 'border-top')

    const name= document.createElement('div')
    name.classList.add('col-md-4')
    name.textContent= dish.name

    const price= document.createElement('div')
    price.classList.add('col-md-3', 'fw-bold')
    price.textContent= dish.price

    const category= document.createElement('div')
    category.classList.add('col-md-3')
    category.textContent= categories[dish.category] 

    const number_input= document.createElement('input')
    number_input.type= 'number'
    number_input.value=0
    number_input.min= 0
    number_input.id= `product-${dish.id}`
    number_input.classList.add('form-control')
    
    number_input.onchange= function(){
        const amount= parseInt(number_input.value) 
        select_amount({...dish, amount})
        
    }

    const input_container= document.createElement('div')
    input_container.classList.add('col-md-2')
    input_container.appendChild(number_input)

    row.appendChild(name)
    row.appendChild(price)
    row.appendChild(category)
    row.appendChild(input_container)
    dishes_container.appendChild(row) 

})

}


function select_amount(dishes){

    let {orders}= order
    
    if(dishes.amount > 0){
      const verify=  order.orders.some((order)=> order.id === dishes.id)
        console.log(verify)

        if(!verify){
            order.orders=[...orders, dishes]
        }else{

            const newOrder= orders.map((order)=>{
                if(order.id === dishes.id){
                    order.amount = dishes.amount
                }

                return order
            })
            order.orders=[...newOrder]
        } 
       
    }else{
        console.log('No')
    }

    console.log(order.orders)

}


 function alerts(message, bg){

    Toastify({
        text:`${message} ` ,
        className: "info",
        duration: 3000, 
        style: {
          background: bg,
        }
      }).showToast()

 }