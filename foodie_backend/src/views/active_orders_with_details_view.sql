CREATE VIEW active_orders_with_details AS
SELECT
    o.id AS order_id,
    u.name AS customer_name,
    r.name AS restaurant_name,
    m.item_name,
    oi.quantity,
    oi.order_time_price,
    o.order_status,
    o.created_at
FROM
    orders o
JOIN
    users u ON o.user_id = u.id
JOIN
    restaurants r ON o.restaurant_id = r.id
JOIN
    order_items oi ON o.id = oi.order_id
JOIN
    menus m ON oi.menu_id = m.id
WHERE
    o.order_status IN ('Pending', 'Preparing')
    AND o.is_deleted = 'N';
