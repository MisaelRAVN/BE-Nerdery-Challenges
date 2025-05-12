
/*
    Challenge 1.
    Write a SQL query that counts the number of films in each category in the Pagila database.
    - The query should return two columns: category and film_count
    - category should display the name of each category
    - film_count should show the total number of films in that category
    - Results should be grouped by category name
 */


-- your query here
SELECT
  c.name category,
  COUNT(fc.film_id) film_count
FROM
  category c
  INNER JOIN film_category fc USING(category_id)
GROUP BY
  category
ORDER BY
  category;


 /*
    Challenge 2.
    Write a SQL query that finds the top 5 customers who have spent the most money in the Pagila database.
    - The query should return three columns: first_name, last_name, and total_spent
    - total_spent should show the sum of all payments made by that customer
    - Results should be ordered by total_spent in descending order
    - The query should limit results to only the top 5 highest-spending customers
 */

 -- your query here
SELECT
  c.first_name,
  c.last_name,
  SUM(p.amount) total_spent
FROM
  customer c
  INNER JOIN payment p USING(customer_id)
GROUP BY
  c.customer_id
ORDER BY
  total_spent DESC
LIMIT 5;




/*
    Challenge 3.
    Write a SQL query that lists all film titles that have been rented in the past 10 years in the Pagila database.
    - The query should return one column: title
    - title should display the name of each film that has been rented
    - The time period for "recent" should be within the last 10 years from the current date
    - Results should only include films that have rental records in this time period
*/


-- your query here
SELECT
  f.title,
  MAX(r.rental_date)
FROM
  film f
  INNER JOIN inventory USING(film_id)
  INNER JOIN rental r USING(inventory_id)
GROUP BY
  title
HAVING
  MAX(r.rental_date) >= NOW() - INTERVAL '10 years'
ORDER BY
  title;


/*
    Challenge 4.
    Write a SQL query that lists all films that have never been rented in the Pagila database.
    - The query should return two columns: title and inventory_id
    - title should display the name of each film that has never been rented
    - inventory_id should show the inventory ID of the specific copy
*/


-- your query here
SELECT
  f.title,
  i.inventory_id
FROM
  film f
  INNER JOIN inventory i USING(film_id)
  LEFT JOIN rental r USING(inventory_id)
WHERE
  r.inventory_id IS NULL;




/*
    Challenge 5.
    Write a SQL query that lists all films that were rented more times than the average rental count per film in the Pagila database.
    - The query should return two columns: title and rental_count
    - title should display the name of each film
    - rental_count should show the total number of times the film was rented
*/
WITH film_rental_count AS (
  SELECT
    f.title,
    COUNT(r.rental_id) rental_count
  FROM
    film f
    INNER JOIN inventory i USING(film_id)
    INNER JOIN rental r USING(inventory_id)
  GROUP BY
    title
  ORDER BY
    title
)

SELECT
  title,
  rental_count
FROM
  film_rental_count
WHERE
  rental_count > (
    SELECT
      AVG(rental_count)
    FROM
      film_rental_count
  )
ORDER BY
  title;


-- your query here

/*
    Challenge 6.
    Write a SQL query that calculates rental activity for each customer.
    - The query should return the customer's first_name and last_name
    - It should also return their first rental date as first_rental
    - Their most recent rental date should be shown as last_rental
    - The difference in days between the first and last rentals should be shown as rental_span_days
    - Results should be grouped by customer and ordered by rental_span_days in descending order
*/

-- your query here
SELECT
  c.first_name,
  c.last_name,
  MIN(r.rental_date) first_rental,
  MAX(r.rental_date) last_rental,
  MAX(r.rental_date) - MIN(r.rental_date) rental_span_days
FROM
  customer c
  INNER JOIN rental r USING(customer_id)
GROUP BY
  c.customer_id
ORDER BY
  rental_span_days DESC;

/*
    Challenge 7.
    Find all customers who have not rented movies from every available genre.
    - The result should include the customer's first_name and last_name
    - Only include customers who are missing at least one genre in their rental history
*/


-- your query here
SELECT
  c.first_name,
  c.last_name
FROM
  customer c
  INNER JOIN rental USING(customer_id)
  INNER JOIN inventory USING(inventory_id)
  INNER JOIN film USING(film_id)
  INNER JOIN film_category USING(film_id)
  INNER JOIN category cat USING(category_id)
GROUP BY
  c.customer_id
HAVING
  COUNT(DISTINCT cat.category_id) < (
    SELECT
      COUNT(category_id)
    FROM
      category
  )
ORDER BY
  first_name,
  last_name;

/*
    Bonus Challenge 8 (opt)
    Find the Top 3 Most Frequently Rented Films in Each Category and Their Total Rental Revenue.
    - The result should include the film title, category name, rental count, and total revenue
    - Only the top 3 films per category should be returned
    - Results should be ordered by category and ranking within the category
*/


-- your query here

-- -- Partial progress

-- SELECT
--   f.title,
--   c.name category,
--   COUNT(r.rental_id) rental_count,
--   SUM(p.amount) total_revenue
-- FROM
--   category c
--   INNER JOIN film_category USING(category_id)
--   INNER JOIN film f USING(film_id)
--   INNER JOIN inventory USING(film_id)
--   INNER JOIN rental r USING(inventory_id)
--   INNER JOIN payment p USING(rental_id)
-- GROUP BY
--   f.title,
--   category_id,
--   c.name;
