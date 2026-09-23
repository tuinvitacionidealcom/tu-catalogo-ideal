const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'backend/index.php');
let content = fs.readFileSync(file, 'utf8');

// 1. Refactor contacts GET
content = content.replace(
  /elseif \(\$method === 'GET'\) \{\s*requireAuth\(\);\s*if \(empty\(\$sub\)\) \{\s*http_response_code\(400\);\s*echo json_encode\(\["error" => "Falta catalog_id"\]\);\s*exit;\s*\}\s*\$stmt = \$db->query\(\s*"SELECT \* FROM catalog_contacts WHERE catalog_id = \? ORDER BY created_at DESC",\s*\[intval\(\$sub\)\]\s*\);/,
  `elseif ($method === 'GET') {\n                $session = requireAuth();\n\n                $stmt = $db->query(\n                    "SELECT * FROM catalog_contacts WHERE catalog_id = ? ORDER BY created_at DESC",\n                    [intval($session['catalog_id'])]\n                );`
);

// 2. Refactor visits GET
content = content.replace(
  /elseif \(\$method === 'GET'\) \{\s*requireAuth\(\);\s*if \(empty\(\$sub\)\) \{\s*http_response_code\(400\);\s*echo json_encode\(\["error" => "Falta catalog_id"\]\);\s*exit;\s*\}\s*\$cid = intval\(\$sub\);/,
  `elseif ($method === 'GET') {\n                $session = requireAuth();\n                $cid = intval($session['catalog_id']);`
);

// 3. Refactor products POST
content = content.replace(
  /\$catalog_id\s*=\s*intval\(\$input\['catalog_id'\] \?\? \$session\['catalog_id'\] \?\? 1\);/,
  `$catalog_id  = intval($session['catalog_id']);`
);

// 4. Refactor products DELETE
content = content.replace(
  /\$db->query\("DELETE FROM catalog_products WHERE id = \?", \[\$prod_id\]\);/,
  `$db->query("DELETE FROM catalog_products WHERE id = ? AND catalog_id = ?", [$prod_id, $session['catalog_id']]);`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done refactoring backend/index.php');
