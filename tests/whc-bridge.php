<?php
declare(strict_types=1);
require __DIR__ . '/../integrations/whc/contact.php';
function check(bool $condition): void { if (!$condition) throw new RuntimeException('Bridge assertion failed'); }
check(bridgeReceipt(['status'=>'accepted','reference'=>'RFQ-123','acceptedAt'=>'2026-10-12T00:00:00.000Z']));
check(!bridgeReceipt(['status'=>'sent','reference'=>'RFQ-123','acceptedAt'=>'2026-10-12T00:00:00Z']));
check(!bridgeReceipt(['status'=>'accepted','reference'=>'<private>','acceptedAt'=>'bad']));
$db = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
for ($i=0; $i<5; $i++) check(bridgeRateLimit($db, 'hashed-client', 1000));
check(!bridgeRateLimit($db, 'hashed-client', 1000));
check(bridgeRateLimit($db, 'another-client', 1000));
check(bridgeRateLimit($db, 'hashed-client', 1601));
echo "PHP receipt and rate-limit checks passed\n";
