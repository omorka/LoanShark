//global variables to for final display
let finalLoanAmount = 0;
let finalInterest = 0;
let finalCost = 0;

//get values from html
function getValues()
{
    let loanAmount = document.getElementById("loanAmount").value;
    let payments = document.getElementById("payments").value;
    let interestRate = document.getElementById("interestRate").value;

    //turn values into integers
    loanAmount = parseInt(loanAmount);
    payments = parseInt(payments);
    interestRate = parseInt(interestRate);

    //validation check
    if (Number.isInteger && Number.isInteger(payments) && Number.isInteger(interestRate) &&
    loanAmount > 0 && payments > 0 && interestRate > 0)
    {
        //get the loan data
        let loanData = loanCalculator(loanAmount, payments, interestRate);

        //assign the global values the proper data from the loan calculation
        finalLoanAmount = parseFloat(loanAmount);
        finalInterest = parseFloat(loanData[loanData.length-1].totalInterest);
        finalCost = finalLoanAmount + finalInterest;

        //display the data
        displayData(loanData);
    }
    else
    {
        alert("Please enter valid numbers!");
    }
}

//calculate loan
function loanCalculator(loanAmount, payments, interestRate)
{
    let loanData = []; //the array to be passed back
    let remainingBalance = loanAmount; //local variable for keeping track of the balance during the loop
    let totalInterest = 0; //local varialbe for keeping track of the total interest during the loop

    //loop from 1 to the amount of payments
    for (let i = 1; i <= payments; i++)
    {
        //create an object to hold each value
        let returnObj = {};

        //calculate the month, monthly payment, principal payment, interest, totalinterest and remaining balance
        returnObj.month = i;
        returnObj.payment = ((loanAmount * (interestRate/1200)) / (1 - 
        (Math.pow((1 + (interestRate/1200)), -payments))));
        returnObj.interestPayment = (remainingBalance * ((interestRate/1200)));
        totalInterest += returnObj.interestPayment;
        returnObj.totalInterest = totalInterest;
        returnObj.principalPayment = (returnObj.payment - returnObj.interestPayment);
        remainingBalance = (remainingBalance - returnObj.principalPayment);
        returnObj.remainingBalance = remainingBalance;
        
        //change all numbers to 2 decimal places to look like currency
        returnObj.payment = returnObj.payment.toFixed(2);
        returnObj.interestPayment = returnObj.interestPayment.toFixed(2);
        returnObj.totalInterest = returnObj.totalInterest.toFixed(2);
        returnObj.principalPayment = returnObj.principalPayment.toFixed(2);
        returnObj.remainingBalance = returnObj.remainingBalance.toFixed(2);
        loanData.push(returnObj); //push object to return array
    }

    return loanData;
}

//display data
function displayData(loanData)
{
    //get the tbody from html document
    let tableBody = document.getElementById("loanData");

    //get the template
    let templateRow = document.getElementById("loanTemplate");

    //clear table rows
    tableBody.innerHTML = "";

    //loop over fbData and increment by the index by 5 after every iteration
    for (let i = 0; i < loanData.length; i++)
    {
        //import template content
        let tableRow = document.importNode(templateRow.content, true);

        //get all tds in the template element
        let rowCols = tableRow.querySelectorAll("td");
        
        //add text to the table data
        rowCols[0].textContent = loanData[i].month;
        rowCols[1].textContent = loanData[i].payment;
        rowCols[2].textContent = loanData[i].principalPayment;
        rowCols[3].textContent = loanData[i].interestPayment;
        rowCols[4].textContent = loanData[i].totalInterest;
        rowCols[5].textContent = loanData[i].remainingBalance;

        //add the table data to the table body
        tableBody.appendChild(tableRow);
    }

    //convert global data into strings that look like currency
    let loanString = "";
    //check if final loan amount has decimals or not so it can be printed properly
    if (Number.isInteger(finalLoanAmount))
    {
        loanString = finalLoanAmount.toLocaleString("en-US") + ".00";
    }
    else
    {
        loanString = finalLoanAmount.toLocaleString("en-US");
    }
    let interestString = finalInterest.toLocaleString("en-US");
    let costString = finalCost.toLocaleString("en-US");

    //post the strings to the proper elements
    document.getElementById("monthlyPayments").innerHTML = "$" + loanData[loanData.length-1].payment;
    document.getElementById("totalPrincipal").innerHTML = "$" + loanString;
    document.getElementById("totalInterest").innerHTML = "$" + interestString;
    document.getElementById("totalCost").innerHTML = "$" + costString;
}