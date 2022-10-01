import { useState, useEffect, useCallback } from 'react';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://react-http-377bb-default-rtdb.europe-west1.firebasedatabase.app/meals.json'
      );
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      const loadedMeals = [];
      for (const key in data) {
        loadedMeals.push({
          id: key,
          name: data[key].name,
          description: data[key].description,
          price: data[key].price,
        });
      }
      setMeals(loadedMeals);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  let content = <p>Found no meals.</p>;

  if (meals.length > 0) {
    content = meals.map((meal) => (
      <MealItem
        id={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
        key={meal.id}
      />
    ));
  }

  if (error) {
    content = (
      <section className={classes.MealsError}>
        <p>{error}</p>
      </section>
    );
  }

  if (isLoading) {
    content = (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{content}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
