#!/usr/bin/env node

var config = require('optimist')
	.options('mass', {
		alias	: 'm',
		default	: 132.5
	})
	.options('height', {
		alias	: 'h',
		default	: 186
	})
	.options('fat', {
		alias	: 'f',
		default	: 35.1
	})
	.options('gender', {
		alias	: 'g',
		default	: 1
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
	.options('meals', {
		alias	: 'M',
		default	: 3
	})
	.boolean('help')
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

function showPlan(meals) {
	console.log('\t' + 'Calories: ' + Math.round(intake.calories.minimum / meals) + ' to ' + Math.round(intake.calories.maximum / meals));
	console.log('\t' + 'Protein: ' + Math.round(intake.protein.minimum / meals) + ' grams (' + Math.round(( intake.protein.minimum * caloriesPerGram.protein ) / meals) + ' calories)' );
	console.log('\t' + 'Carb: ' + Math.round(intake.carbs.minimum / meals) + ' to ' + Math.round(intake.carbs.maximum / meals) + ' grams' );
	console.log('\t' + 'Fat: ' + Math.round(intake.fat.minimum / meals) + ' to ' + Math.round(intake.fat.maximum / meals) + ' grams (' + Math.round(( intake.fat.minimum * caloriesPerGram.fat ) / meals) + ' to ' + Math.round(( intake.fat.maximum * caloriesPerGram.fat ) / meals) + ' calories)');
};
if ( config.help ) {
	console.log('Diet Planner v2012.04.04',
		'\tby Chris Olstrom <chris@olstrom.com>\n',
		'\n\t-A | --activity  Activity level, from 1 (sedentary) to 5 (pro athlete), 0 to disable.',
		'\n\t-a | --age       Age, in years.',
		'\n\t-f | --fat       Bodyfat percentage, in decimal notation',
		'\n\t-g | --gender    Gender, 0 for female, 1 for male.',
		'\n\t-h | --height    Height, in centimeters.',
		'\n\t-M | --meals     Meals per day.',
		'\n\t-m | --mass      Mass, in kilograms.',
		'\n\t-r | --rate      Rate of loss, in pounds per week.'
	);
} else {
	var intake = new IntakeModel();
	console.log('Totals for Today\n');
	showPlan(1);
	if ( config.meals > 1 ) {
		console.log('\nMeal Plan (each of ' + config.meals + ' meals should contain...)\n');
		showPlan(config.meals);
	}
}
