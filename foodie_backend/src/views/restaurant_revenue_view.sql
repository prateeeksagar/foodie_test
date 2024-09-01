CREATE VIEW restaurant_revenue AS
SELECT
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    SUM(oi.quantity * oi.order_time_price) AS total_revenue
FROM
    restaurants r
JOIN
    orders o ON r.id = o.restaurant_id
JOIN
    order_items oi ON o.id = oi.order_id
WHERE
    o.is_deleted = 'N'
GROUP BY
    r.id, r.name;



