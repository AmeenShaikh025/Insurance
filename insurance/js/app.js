//Variables
const form = document.getElementById('request-quote');

const html = new HTMLUI();

//Event Listeners
eventListeners();

function eventListeners() {
	document.addEventListener('DOMContentLoaded', function() {
		//Create the <option> for the years
		
		html.displayYears();
	});

	//when the form is submitted

	form.addEventListener('submit', function(e) {
		e.preventDefault();

		//get the values from the formd
		const make = document.getElementById('make').value;
		const year = document.getElementById('year').value;

		//Read the radio buttons
		const level= document.querySelector('input[name="level"]:checked').value;
		
		//check that all the fields have comments
		if( make === '' || year === '' || level === '') {
			html.displayError('All the fields are mandatory');
			/*console.log('NOT GOOD');*/
			
		}
		else {
			//clear the prvious quotes	

			const prevResult = document.querySelector('#result div');
			if(prevResult != null) {
				prevResult.remove();
			}
			//console.log('Allright');
			const insurance = new Insurance(make,year,level);
			const price = insurance.calculateQuotaion(insurance);

			//prints the result from HTMLUI();
			html.showResults(price,insurance);
		}
	});
}

//Objects

//Evertythig relatedtoquotation and calculation is Insurance

function Insurance(make,year,level) {
	this.make = make;
	this.year = year;
	this.level = level;
}

//calculate the proce for the current quotation
Insurance.prototype.calculateQuotaion = function(insurance) {
	/*console.log(insurance);*/
	let price;
	const base = 2000;

	//get the make

	const make = insurance.make;

	/*
		1 = American 1.15
		2 = Asian 1.05
		3 = European 1.35

	*/

	switch(make) {
		case '1':
			price = base * 1.15;
			break;
		case '2':
			price = base * 1.05;
			break;
		case '3':
			price = base * 1.15;
			break;		 
	}

	/*console.log(price);*/

	//Get the year

	const year = insurance.year;

	//Get the year difference

	//returns thedifference between year
	const difference = this.getYearDifference(year);

	//console.log(difference);

	//Each year the cost of te insurance will drop by 3%

	price = price - (( difference * .03) * price / 100);
	//console.log(price);


	const level = insurance.level;

	price = this.calculateLevel(price,level);

	//console.log(price);
	return parseInt(price);

}

//Get the differnece netween years

	Insurance.prototype.getYearDifference = function(year) {
			return new Date().getFullYear() - year;
	}

//Add the value bsed on level of protection

Insurance.prototype.calculateLevel = function(price, level) {
	/*
		Basic insurance will increase the value by 30%
		Co,mplete Insurance willincrease the value by 50%

	*/
	if(level === 'basic') {
		price = price * 1.30;
	} else {
		price = price * 1.50;
	}

	return price;
}



//Everything related to html
function HTMLUI() {

}

//Displays the lastes 20 years

HTMLUI.prototype.displayYears = function() {
	// Max & Minimum year
	const max = new Date().getFullYear();
		min = max - 20;

	//List with latest 20 years

	const selectYears = document.getElementById('year');

	//prnt the values
	for(let i = max; i >= min; i--) {
		const option = document.createElement('option');
		option.value= i;
		option.textContent = i;
		selectYears.appendChild(option);
	}
}


// Prints an error

HTMLUI.prototype.displayError = function(message) {
     // create a div
     const div = document.createElement('div');
     div.classList = 'error';

     // insert the message
     div.innerHTML = `
          <p>${message}</p>
     `;

     form.insertBefore(div, document.querySelector('.form-group'));

     // Remove the error
     setTimeout(function() {
          document.querySelector('.error').remove();
     }, 3000);
}



//Prints the result into html

HTMLUI.prototype.showResults = function(price,insurance) {
	//Print the result

	const result = document.getElementById('result');


	//console.log(make);

	//Get Make from the object and assign a readable name
	let make = insurance.make;

	switch(make) {
		case '1':
			make = 'American';
			break;
		case '2':
			make = 'Asian';
			break;
		case '3':
			make = 'European';
			break;		 
	}

	//console.log(make);

	//create a div with result
	const div = document.createElement('div');

	//Insert the result
	div.innerHTML = `
					<p class="header">Summary</p>
					<p>Make: ${make}</p>
					<p>Year: ${insurance.year}</p>
					<p>Level: ${insurance.level}</p>
					<p class="total">Total: $ ${price}</p>
	`;


	const spinner = document.querySelector('#loading img');
	spinner.style.display = 'block';

	setTimeout(function() {
		spinner.style.display = 'none';
	},3000);

	//Insert into html
	result.appendChild(div);

}
