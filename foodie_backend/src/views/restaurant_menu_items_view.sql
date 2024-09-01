CREATE VIEW restaurant_menu_items AS
SELECT
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    m.id AS menu_id,
    m.item_name,
    m.description,
    m.price,
    m.availability
FROM
    restaurants r
JOIN
    menus m ON r.id = m.restaurant_id
WHERE
    m.is_deleted = 'N';
