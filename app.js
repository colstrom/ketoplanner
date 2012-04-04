#!/usr/bin/env node
var user = {
	mass		: 132.5,	// in Kg
	height		: 186,		// in cm
	fatPercent	: 35.1,
	gender		: 1,		// 0:F | 1:M
	age			: 26,
	activity	: 0			// 0-4, using the Harris Benedict Equation.
};
var caloriesPerGram = {
	fat		: 9,
	protein	: 4,
	carb	: 4,
	alcohol	: 7,
};
var harrisBenedictMultiplier = [
	1.0,	// Disable Multiplier
	1.2,	// Sedentary
	1.375,	// Lightly Active
	1.55,	// Moderately Active
	1.725,	// Very Active
	1.9		// Extremely Active
];
function getBMR(userObj) {
	"use strict";
	switch(userObj.gender) {
		case 0:
			return (655 + (9.6 * userObj.mass) + (1.8 * userObj.height) - (4.7 * userObj.age));
		case 1:
			return (66 + (13.7 * userObj.mass) + (5.0 * userObj.height) - (6.8 * userObj.age));
	}
}
var maintenance = Math.round(getBMR(user) * harrisBenedictMultiplier[user.activity]);
var minCalories = maintenance - 1000;
var maxCalories = maintenance - 500;
var minCarbCalories = 0;
var maxCarbCalories = Math.round((maxCalories * 0.05) / caloriesPerGram.carb);
var minProteinGrams = Math.round((user.mass * 2.2) * (1 - (user.fatPercent/100)));
var minProteinCalories = minProteinGrams * caloriesPerGram.protein;
var minFatCalories = ((minCalories - minProteinCalories) - maxCarbCalories);
var maxFatCalories = (maxCalories - minProteinCalories);
var minFatGrams = Math.round(minFatCalories / caloriesPerGram.fat);
var maxFatGrams = Math.round(maxFatCalories / caloriesPerGram.fat);
console.log('Diet Plan: '
	+ '\n\tCalories: ' + minCalories + ' to ' + maxCalories 
	+ '\n\tProtein: ' + minProteinGrams + ' grams (' + minProteinCalories + ' calories)' 
	+ '\n\tCarb: ' + minCarbCalories + ' to ' + maxCarbCalories + ' grams' 
	+ '\n\tFat: ' + minFatGrams + ' to ' + maxFatGrams + ' grams (' + minFatCalories + ' to ' + maxFatCalories + ' calories)'
);
