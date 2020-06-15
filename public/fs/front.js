const form = document.getElementById('main-form');
const a_input = document.getElementById('aInput');
const p_input = document.getElementById('pInput');
const pop = document.getElementById('pop');
const span = document.createElement('span');
pop.setAttribute('class', 'pop')
span.setAttribute('class', 'span')
//console.log(pop.style)


form.addEventListener('submit', (e)=>{
	validateForm(e);

})


function validateForm(h){
	const a_value = a_input.value
	const p_value = p_input.value


    if ( 7 > a_value.length  || a_value.length > 7 ) {
    	h.preventDefault();
    	popUp()
    	a_input.style.borderBottom = '1px solid rgb(255, 56, 35)';
    }

    if ( p_value == '' ) {
    	h.preventDefault();
    	p_input.style.borderBottom = '1px solid rgb(255, 56, 35)';
    }
}

function popUp(){

	if ( pop.style.display == '')
		{
			pop.appendChild(span)
			span.textContent = 'Please Enter Valid Account Code'

			setTimeout (()=>{
				pop.style.display = 'none';
			},3000)
	    }else{
	    	pop.style.display = 'block';
	    	setTimeout (()=>{
				pop.style.display = 'none';
			},3000)
	    	console.log('block')
	    }
}


// window.onload=function(){
 // if sub check validateForm
 // 	if value of input is empty
 // 		prevent reload of submittion
 // 	    set border of input to RED
// }







