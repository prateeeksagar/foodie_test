CREATE VIEW customer_order_history AS
SELECT
    u.id AS user_id,
    u.name AS customer_name,
    o.id AS order_id,
    r.name AS restaurant_name,
    o.total_price,
    o.order_status,
    o.created_at
FROM
    users u
JOIN
    orders o ON u.id = o.user_id
JOIN
    restaurants r ON o.restaurant_id = r.id
WHERE
    o.is_deleted = 'N'
ORDER BY
    o.created_at DESC;
