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
	.options('rate', {
		alias	: 'r',
		default	: 2
	})
	.argv
;
function getBMR() {
	"use strict";
	switch(config.gender) {
		case 0:
			return (655 + (9.6 * config.mass) + (1.8 * config.height) - (4.7 * config.age));
		case 1:
			return (66 + (13.7 * config.mass) + (5.0 * config.height) - (6.8 * config.age));
	}
}
var harrisBenedictMultiplier = [
	1.0,	// Disable Multiplier
	1.2,	// Sedentary
	1.375,	// Lightly Active
	1.55,	// Moderately Active
	1.725,	// Very Active
	1.9		// Extremely Active
];
var caloriesPerGram = {
	fat		: 9,
	protein	: 4,
	carb	: 4,
	alcohol	: 7,
};
function IntakeModel() {
	"use strict";
	this.calories = {
		maintenance	: 0,
		minimum		: 0,
		maximum		: 0
	};
	this.carbs = {
		minimum	: 0,
		maximum	: 0
	};
	this.protein = {
		minimum	: 0
	};
	this.fat = {
		minimum	: 0,
		maximum	: 0
	}
	this.init = function() {
		this.calories.maintenance	= Math.round(getBMR() * harrisBenedictMultiplier[config.activity]),
		this.calories.minimum		= this.calories.maintenance - ( 500 * config.rate ),
		this.calories.maximum		= this.calories.maintenance - ( 250 * config.rate )
		this.carbs.minimum = 0;
		this.carbs.maximum = Math.round((this.calories.maximum * 0.05) / caloriesPerGram.carb);
		this.protein.minimum = Math.round((config.mass * 2.2) * (1 - (config.fat/100)));
		this.fat.minimum = Math.round(((this.calories.minimum - (this.protein.minimum * caloriesPerGram.protein)) - (this.carbs.maximum * caloriesPerGram.carb)) / caloriesPerGram.fat);
		this.fat.maximum = Math.round((this.calories.maximum - (this.protein.minimum * caloriesPerGram.protein)) / caloriesPerGram.fat);
	};
	this.init();
}

var intake = new IntakeModel();
console.log('Diet Plan: '
	+ '\n\tCalories: ' + intake.calories.minimum + ' to ' + intake.calories.maximum
	+ '\n\tProtein: ' + intake.protein.minimum + ' grams (' + ( intake.protein.minimum * caloriesPerGram.protein ) + ' calories)' 
	+ '\n\tCarb: ' + intake.carbs.minimum + ' to ' + intake.carbs.maximum + ' grams' 
	+ '\n\tFat: ' + intake.fat.minimum + ' to ' + intake.fat.maximum + ' grams (' + ( intake.fat.minimum * caloriesPerGram.fat ) + ' to ' + ( intake.fat.maximum * caloriesPerGram.fat ) + ' calories)'
);
