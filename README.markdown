# What is KetoPlanner? #

KetoPlanner is a utility to (somewhat) simplify the task of diet planning. Given a few key statistics, it will estimate your [basal metabolic rate](https://en.wikipedia.org/wiki/Basal_metabolic_rate), adjust for activity level, and consider that your maintenance level (no loss, no gain).

From there, it will account for your desired rate of loss (defaults to 1-2 pounds per week), and intended meals per day (assumes three unless otherwise specified). Using this information, it will present an intake plan for the day, broken down by protein/fat/carb.

## Why these numbers? ##

The protein recommendation is a minimum to maintain your current muscle mass, the carb recommendation is a maximum to not break ketosis (YMMV), and the fat recommendation accounts for the rest of your intake for the day. 

## Why are the defaults set how they are? ##

Since I wrote KetoPlanner for personal use, the defaults reflect my most recent measurements. Feel free to change the code to match your own.

## What is a Ketogenic Diet? ##

This is outside the scope of the documentation for a simple utility, but there's a lot of great information in the **[r/keto FAQ](http://www.reddit.com/help/faqs/keto)**.

## Example Usage (Basic) ##

Given a few statistics about you, KetoPlanner will formulate an intake plan for the day.

    $ ./ketoplanner --gender 1 --age 26 --mass 131.1 --bodyfat 34.8 --activity 1 --rate 1

### Output ###
    Totals for Today

        Calories: 2638 to 2888
        Protein: 188 grams (752 calories)
        Carb: 0 to 36 grams
        Fat: 194 to 237 grams (1746 to 2133 calories)

    Meal Plan (each of 3 meals should contain...)

        Calories: 879 to 963
        Protein: 63 grams (251 calories)
        Carb: 0 to 12 grams
        Fat: 65 to 79 grams (582 to 711 calories)

## More Examples ##

If you provide your current intake figures, and the number of meals you intend to eat today, it can provide a revised plan to meet the remainder.

    ./ketoplanner -g 1 -a 26 -m 131.1 -b 34.8 -A 1 -r 1 --calories 1140 --protein 100 --fat 100 --carbs 10 --meals 2

### Output ###
    Totals for Today

        Calories: 1498 to 1748
        Protein: 88 grams (352 calories)
        Carb: 0 to 12 grams
        Fat: 22 to 55 grams (198 to 495 calories)

    Meal Plan (each of 2 meals should contain...)

        Calories: 749 to 874
        Protein: 44 grams (176 calories)
        Carb: 0 to 6 grams
        Fat: 11 to 28 grams (99 to 248 calories)

## Options ##

### -A (--activity) ###
This defines your activity level (1-5), using the [Harris Benedict Equation](https://en.wikipedia.org/wiki/Harris-Benedict_equation). If you do not wish to account for activity, it can be set to 0 (zero).

### -a (--age) ###
Your age, in years. Nothing fancy here.

### -b (--bodyfat) ###
Your bodyfat percentage, expressed in decimal notation (28.5, for example).

### -C (--carbs) ###
How many grams of carbohydrates you have consumed so far today.

### -F (--fat) ###
Much like --carbs, how many grams of fat your have consumed.

### -g (--gender) ###
Gender, 0 for female, 1 for male.

### -h (--height) ###
Your height, in centimeters (2.54cm per inch, America).

### -K (--calories) ###
How many (k)calories have you consumed.

### -M (--meals) ###
Number of meals per day.

### -m (--mass) ###
Your current mass, in kilograms.

### -P (--protein) ###
Amount of protein already consumed, in grams.

### -r (--rate) ###
Your desired rate of loss, in pounds per week. (*This is a bug. It should be kilograms*)
