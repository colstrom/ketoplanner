#!/usr/bin/env node

var config = require('optimist')
	.options('mass', {
		alias	: 'm',
		default	: 132.5	// in Kg
	})
	.options('height', {
		alias	: 'h',
		default	: 186	// in cm
	})
	.options('fat', {
		alias	: 'f',
		default	: 35.1
	})
	.options('gender', {
		alias	: 'g',
		default	: 1	// 0:F | 1:M
	})
	.options('age', {
		alias	: 'a',
		default	: 26
	})
	.options('activity', {
		alias	: 'A',
		default	: 1
	})
	.argv
;

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
function getBMR() {
	"use strict";
	switch(config.gender) {
		case 0:
			return (655 + (9.6 * config.mass) + (1.8 * config.height) - (4.7 * config.age));
		case 1:
			return (66 + (13.7 * config.mass) + (5.0 * config.height) - (6.8 * config.age));
	}
}
var maintenance = Math.round(getBMR() * harrisBenedictMultiplier[config.activity]);
var minCalories = maintenance - 1000;
var maxCalories = maintenance - 500;
var minCarbCalories = 0;
var maxCarbCalories = Math.round((maxCalories * 0.05) / caloriesPerGram.carb);
var minProteinGrams = Math.round((config.mass * 2.2) * (1 - (config.fat/100)));
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
