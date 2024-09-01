CREATE VIEW top_restaurants_by_orders AS
SELECT
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    COUNT(o.id) AS total_orders,
    r.rating AS average_rating
FROM
    restaurants r
JOIN
    orders o ON r.id = o.restaurant_id
WHERE
    o.is_deleted = 'N'
GROUP BY
    r.id, r.name, r.rating
ORDER BY
    total_orders DESC, r.rating DESC;
