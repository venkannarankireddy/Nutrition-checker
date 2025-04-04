const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = 'oPz8dbmL4Q8gwbNxavfOQXgnBkkOHQNx98CN1P1Y';
const API_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

router.get('/getinfo', async (req, res) => {
    try {
        const foodName = req.query.name;
        if (!foodName) {
            return res.status(400).json({ error: 'Please provide a food name.' });
        }

        const response = await axios.get(API_URL, {
            params: { query: foodName, api_key: API_KEY },
        });

        const foods = response.data.foods;
        if (!foods || foods.length === 0) {
            return res.status(404).json({ error: 'Food not found.' });
        }

        const food = foods[0];
        const nutrients = {};
        food.foodNutrients.forEach((nutrient) => {
            if (
                [
                    'Energy',
                    'Protein',
                    'Total lipid (fat)',
                    'Carbohydrate, by difference',
                    'Total Sugars',
                    'Fiber, total dietary',
                ].includes(nutrient.nutrientName)
            ) {
                nutrients[nutrient.nutrientName] = `${nutrient.value} ${nutrient.unitName}`;
            }
        });

        const result = {
            name: food.description,
            brand: food.brandOwner || 'Generic',
            category: food.foodCategory || 'Unknown',
            serving_size: `${food.servingSize} ${food.servingSizeUnit || 'g'}`,
            nutrients,
        };

        res.json(result);
    } catch (error) {
        console.error('Error fetching nutrition data:', error.message);
        res.status(500).json({ error: 'Error fetching nutrition data. Please try again.' });
    }
});

module.exports = router;
