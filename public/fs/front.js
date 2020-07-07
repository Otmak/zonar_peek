const form = document.getElementById('main-form');
const a_input = document.getElementById('aInput');
const p_input = document.getElementById('pInput');
const the_button = document.getElementById('sub_');
const pop = document.getElementById('pop');
const span = document.createElement('span');
//const loader = document.createElement('i');
pop.setAttribute('class', 'pop')
span.setAttribute('class', 'span')
//console.log(pop.style)

document.title = 'Enter Account code and Password'
form.addEventListener('submit', (e)=>{
	validateForm(e);
	// the_button.appendChild(loader);
	// loader.setAttribute('class', 'fa fa-spinner fa-spin');

})


function validateForm(h){
	const a_value = a_input.value
	const p_value = p_input.value


	if (a_value.length === 7 && p_value !== '') {
		the_button.style.opacity = '0.8';
		the_button.textContent = 'Submitting...';
		the_button.style.cursor = 'wait';
	}else{
		h.preventDefault();
		if (p_value == '') {
			p_input.style.borderBottom = '1px solid rgb(255, 56, 35)';
		}else {
			popUp();
			a_input.style.borderBottom = '1px solid rgb(255, 56, 35)';
		}
	}
}

function popUp(){

	if ( pop.style.display == '' )
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
	    	//console.log('block')
	    }
}


// window.onload=function(){
 // if sub check validateForm
 // 	if value of input is empty
 // 		prevent reload of submittion
 // 	    set border of input to RED
// }







