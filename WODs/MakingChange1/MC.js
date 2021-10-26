//enter amount
var amount = 46.68

//Max dollar amount
dollars = Math.floor(amount);
leftoverD = 100*((amount - dollars).toFixed(2));

//Max quarter amount
quarters = Math.floor(leftoverD/25);
leftoverQ = leftoverD - (quarters*25);

//Max dimes amount
dimes = Math.floor(leftoverQ/10);
leftoverDm = leftoverQ - (dimes*10);

//Max nickles amount
nickles = Math.floor(leftoverDm/5);
leftoverN = leftoverDm - (nickles*5);

//pennies amount
pennies = leftoverN

console.log("Dollars:" + dollars + " Quarters:" + quarters + " Dimes:" + dimes + " Nickles:" + nickles + " Pennies:" + pennies)