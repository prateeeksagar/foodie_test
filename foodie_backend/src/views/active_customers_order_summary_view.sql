CREATE VIEW active_customers_order_summary AS
SELECT
    u.id AS user_id,
    u.name AS customer_name,
    COUNT(o.id) AS total_orders,
    MAX(o.created_at) AS last_order_date
FROM
    users u
JOIN
    orders o ON u.id = o.user_id
WHERE
    o.is_deleted = 'N'
GROUP BY
    u.id, u.name
HAVING
    total_orders > 0
ORDER BY
    last_order_date DESC;
