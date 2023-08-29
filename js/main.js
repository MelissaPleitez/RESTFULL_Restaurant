 
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
       const orderUpdated = order.orders.filter((update)=> update.id!==dishes.id)
       order.orders=[...orderUpdated]
    }

    cleaning_html()

    if(order.orders.length){
        showing_fullOrder()
    }else{
        showing_message()
    }

   

}

function showing_fullOrder(){

const content = document.querySelector('#resume .content')
const content_resume = document.createElement('div')
content_resume.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

const content_table = document.createElement('p')
content_table.textContent= 'Table: '
content_table.classList.add('fw-bold')

const table_span= document.createElement('span')
table_span.textContent= order.table
table_span.classList.add('fw-bold')

const content_time = document.createElement('p')
content_time.textContent= 'Time: '
content_time.classList.add('fw-bold')

const time_span= document.createElement('span')
time_span.textContent= order.time
time_span.classList.add('fw-normal')

content_table.appendChild(table_span)
content_time.appendChild(time_span)

const headingOrder= document.createElement('h3')
headingOrder.classList.add('my-4', 'text-center')
headingOrder.textContent= 'Full Order'


const {orders}= order

const group= document.createElement('ul')
group.classList.add('list-group')

orders.forEach((order)=>{

const {id,name, price, amount} = order

const list = document.createElement('li')
list.classList.add('list-group-item')


const name_content= document.createElement('h4')
name_content.classList.add('my-4');
name_content.textContent= name

const amount_content = document.createElement('p')
amount_content.classList.add('fw-bold');
amount_content.textContent= 'Amount: ';

const amount_value = document.createElement('span')
amount_value.classList.add('fw-normal')
amount_value.textContent=amount;

const price_content = document.createElement('p')
price_content.classList.add('fw-bold');
price_content.textContent= 'Price: ';

const price_value = document.createElement('span')
price_value.classList.add('fw-normal')
price_value.textContent=`$${price}`;

const subTotal_content = document.createElement('p')
subTotal_content.classList.add('fw-bold');
subTotal_content.textContent= 'SubTotal: ';

const subTotal_value = document.createElement('span')
subTotal_value.classList.add('fw-normal')
subTotal_value.textContent= getting_subtotal(price, amount);

const btnRemove= document.createElement('button')
btnRemove.classList.add('btn', 'btn-danger')
btnRemove.textContent= 'Remove'

btnRemove.onclick= function(){
    removing_order(id)
}

price_content.appendChild(price_value)
amount_content.appendChild(amount_value)
subTotal_content.appendChild(subTotal_value)

list.appendChild(name_content)
list.appendChild(amount_content)
list.appendChild(price_content)
list.appendChild(subTotal_content)
list.appendChild(btnRemove)

group.appendChild(list)




})
content_resume.appendChild(headingOrder)
content_resume.appendChild(content_table)
content_resume.appendChild(content_time)
content_resume.appendChild(group)
content.appendChild(content_resume)

form_tips()


}

function removing_order(id){
    const removing = order.orders.filter((order)=> order.id !== id)

    order.orders=[...removing]

    cleaning_html()

    if(order.orders.length){
        showing_fullOrder()
    }else{
        showing_message()
    }


    const input_reset = `#product-${id}` 
    const reset_number= document.querySelector(input_reset)
    reset_number.value= 0
    console.log(reset_number)
}

function showing_message(){
    const content = document.querySelector('#resume .content')

    const text = document.createElement('p')
    text.classList.add('text-center')
    text.textContent= 'Add the elements to the order'

    content.appendChild(text)
}

function form_tips(){
    const content = document.querySelector('#resume .content')

    const form = document.createElement('div')
    form.classList.add('col-md-6', 'form')

    const formDiv= document.createElement('div')
    formDiv.classList.add('card', 'py-2', 'px-3', 'shadow')

    const headingForm= document.createElement('h3')
    headingForm.classList.add('my-4', 'text-center')
    headingForm.textContent= 'Tips'

    //10%
    const check10= document.createElement('input')
    check10.type='radio';
    check10.value='10'
    check10.name='tip';
    check10.classList.add('form-check-input');

    check10.onclick= function(){
        getting_tip()
    } 

    const check10Label = document.createElement('label')
    check10Label.textContent='10%';
    check10Label.classList.add('form-check-label');

    const check10Div= document.createElement('div')
    check10Div.classList.add('form-check')

    check10Div.appendChild(check10)
    check10Div.appendChild(check10Label)

    //25%
    const check25= document.createElement('input')
    check25.type='radio';
    check25.value='25'
    check25.name='tip';
    check25.classList.add('form-check-input');

    check25.onclick= function(){
        getting_tip()
    } 

    const check25Label = document.createElement('label')
    check25Label.textContent='25%';
    check25Label.classList.add('form-check-label');

    const check25Div= document.createElement('div')
    check25Div.classList.add('form-check')

    check25Div.appendChild(check25)
    check25Div.appendChild(check25Label)


    //50%
    const check50= document.createElement('input')
    check50.type='radio';
    check50.value='50'
    check50.name='tip';
    check50.classList.add('form-check-input');

    check50.onclick= function(){
        getting_tip()
    } 

    const check50Label = document.createElement('label')
    check50Label.textContent='50%';
    check50Label.classList.add('form-check-label');

    const check50Div= document.createElement('div')
    check50Div.classList.add('form-check')

    check50Div.appendChild(check50)
    check50Div.appendChild(check50Label)


    
    formDiv.appendChild(headingForm)
    formDiv.appendChild(check10Div)
    formDiv.appendChild(check25Div)
    formDiv.appendChild(check50Div)
    form.appendChild(formDiv)
    content.appendChild(form)

}


function getting_tip(){
    const inputSelected= document.querySelector('[name="tip"]:checked').value
    const {orders} = order
    
    let subtotal=0;

    orders.forEach((order)=>{
    subtotal= order.price * order.amount
    
    })
    

    console.log(subtotal)
    const tip = ((subtotal * parseInt(inputSelected))/100);

    const total = tip+subtotal

    showing_tip(total, subtotal, tip)

}

function showing_tip(total, subtotal, tip){

    const final_divs= document.createElement('div')
    final_divs.classList.add('total_price');

    const subtotal_div = document.createElement('p')
    subtotal_div.classList.add('fs-3', 'fw-bold', 'mt-2');
    subtotal_div.textContent='Final Subtotal: ';

    const subtotal_span = document.createElement('span')
    subtotal_span.classList.add('fw-normal');
    subtotal_span.textContent=`$${subtotal}`;

    const total_div = document.createElement('p')
    total_div.classList.add('fs-3', 'fw-bold', 'mt-2');
    total_div.textContent='Tip: ';

    const total_span = document.createElement('span')
    total_span.classList.add('fw-normal');
    total_span.textContent=`$${tip}`;


    const tip_div = document.createElement('p')
    tip_div.classList.add('fs-3', 'fw-bold', 'mt-2');
    tip_div.textContent='Total: ';

    const tip_span = document.createElement('span')
    tip_span.classList.add('fw-normal');
    tip_span.textContent=`$${total}`;

    subtotal_div.appendChild(subtotal_span)
    total_div.appendChild(total_span)
    tip_div.appendChild(tip_span)

    const tips_div= document.querySelector('.total_price')

    if(tips_div){
        tips_div.remove()
    }


    final_divs.appendChild(subtotal_div)
    final_divs.appendChild(total_div)
    final_divs.appendChild(tip_div)

    const form= document.querySelector('.form > div')
    form.appendChild(final_divs)


}


function cleaning_html(){
    const resume = document.querySelector('#resume .content')

    while(resume.firstChild){
        resume.removeChild(resume.firstChild)
    }
}

function getting_subtotal(price, amount){
    return `$${price*amount}` 
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