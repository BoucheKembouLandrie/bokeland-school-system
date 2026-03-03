-- Check if there are multiple payments for the same client
SELECT 
    c.id as client_id,
    c.school_name,
    c.status,
    c.subscription_end_date,
    COUNT(p.id) as payment_count,
    SUM(p.days_added) as total_days_added
FROM clients c
LEFT JOIN payments p ON c.id = p.client_id
GROUP BY c.id
HAVING payment_count > 1
ORDER BY payment_count DESC;
