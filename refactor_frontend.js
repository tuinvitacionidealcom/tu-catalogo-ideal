const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/catalogos/birromi/panel/BirromiPanel.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Refactor handleSaveProduct
const saveProductOld = `    // Guardar en MySQL Backend
    try {
      const token = getToken();
      const res = await fetch(\`\${API_BASE}/?request=products\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`
        },
        body: JSON.stringify(clean)
      });
      const data = await res.json();
      if (data.status === 'ok' && data.id) {
        clean.id = data.id;
      }
    } catch (err) {
      console.warn('Error al guardar producto en MySQL:', err);
    }

    const isAdd = productModal.mode === 'add';
    if (isAdd) {
      saveProducts([...products.filter(x => x.id !== clean.id), clean]);
    } else {
      saveProducts(products.map(x => x.id === p.id ? clean : x));
    }
    closeProductModal();
    await dialog.success(isAdd ? 'Producto agregado con éxito.' : 'Producto guardado con éxito.');`;

const saveProductNew = `    const isAdd = productModal.mode === 'add';
    try {
      const token = getToken();
      const res = await fetch(\`\${API_BASE}/?request=products\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`
        },
        body: JSON.stringify(clean)
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'ok') {
        throw new Error(data.error || 'Error del servidor al guardar');
      }
      if (data.id) {
        clean.id = data.id;
      }
      if (isAdd) {
        saveProducts([...products.filter(x => x.id !== clean.id), clean]);
      } else {
        saveProducts(products.map(x => x.id === p.id ? clean : x));
      }
      closeProductModal();
      await dialog.success(isAdd ? 'Producto agregado con éxito.' : 'Producto guardado con éxito.');
    } catch (err) {
      console.warn('Error al guardar producto en MySQL:', err);
      await dialog.error('Ocurrió un error al guardar el producto. Revisá tu conexión e intentá nuevamente.');
    }`;

content = content.replace(saveProductOld, saveProductNew);


// 2. Refactor handleDelete
const deleteOld = `  const handleDelete = async (id) => {
    const confirmed = await dialog.danger('¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer.');
    if (confirmed) {
      try {
        const token = getToken();
        await fetch(\`\${API_BASE}/?request=products/\${id}\`, {
          method: 'DELETE',
          headers: { Authorization: \`Bearer \${token}\` }
        });
      } catch {}
      saveProducts(products.filter(p => p.id !== id));
      await dialog.success('Producto eliminado con éxito.');
    }
  };`;

const deleteNew = `  const handleDelete = async (id) => {
    const confirmed = await dialog.danger('¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer.');
    if (confirmed) {
      try {
        const token = getToken();
        const res = await fetch(\`\${API_BASE}/?request=products/\${id}\`, {
          method: 'DELETE',
          headers: { Authorization: \`Bearer \${token}\` }
        });
        const data = await res.json();
        if (!res.ok || data.status !== 'ok') {
          throw new Error(data.error || 'Error del servidor al eliminar');
        }
        saveProducts(products.filter(p => p.id !== id));
        await dialog.success('Producto eliminado con éxito.');
      } catch (err) {
        console.warn('Error al eliminar producto:', err);
        await dialog.error('Ocurrió un error al eliminar. Revisá tu conexión e intentá nuevamente.');
      }
    }
  };`;

content = content.replace(deleteOld, deleteNew);


// 3. Refactor Stock
const stockOld = `  // ── Stock ─────────────────────────────────────────────────────────────────────
  const nudgeStock = (id, delta) =>
    saveProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p));

  const openStockModal = (product) =>
    setStockModal({ open: true, product, input: String(product.stock || 0) });

  const saveStock = async () => {
    const val = parseInt(stockModal.input);
    if (!isNaN(val) && val >= 0) {
      saveProducts(products.map(p => p.id === stockModal.product.id ? { ...p, stock: val } : p));
      setStockModal({ open: false, product: null, input: '' });
      await dialog.success('Stock actualizado con éxito.');
    } else {
      setStockModal({ open: false, product: null, input: '' });
    }
  };`;

const stockNew = `  // ── Stock ─────────────────────────────────────────────────────────────────────
  const saveStockToDB = async (productToSave, newStock) => {
    try {
      const token = getToken();
      const clean = {
        ...productToSave,
        stock: newStock,
        catalog_id: user?.catalog_id || 1,
      };
      const res = await fetch(\`\${API_BASE}/?request=products\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`
        },
        body: JSON.stringify(clean)
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'ok') throw new Error('Server error');
      return true;
    } catch(err) {
      return false;
    }
  };

  const nudgeStock = async (id, delta) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const newStock = Math.max(0, (p.stock || 0) + delta);
    
    // Actualización local optimista
    saveProducts(products.map(x => x.id === id ? { ...x, stock: newStock } : x));
    
    // Sincronización
    const success = await saveStockToDB(p, newStock);
    if (!success) {
       // Rollback
       saveProducts(products.map(x => x.id === id ? { ...x, stock: p.stock } : x));
       await dialog.error('Error al actualizar el stock. Revisá tu conexión.');
    }
  };

  const openStockModal = (product) =>
    setStockModal({ open: true, product, input: String(product.stock || 0) });

  const saveStock = async () => {
    const val = parseInt(stockModal.input);
    if (!isNaN(val) && val >= 0) {
      const p = stockModal.product;
      const oldStock = p.stock;
      
      saveProducts(products.map(x => x.id === p.id ? { ...x, stock: val } : x));
      setStockModal({ open: false, product: null, input: '' });
      
      const success = await saveStockToDB(p, val);
      if (success) {
          await dialog.success('Stock actualizado con éxito.');
      } else {
          saveProducts(products.map(x => x.id === p.id ? { ...x, stock: oldStock } : x));
          await dialog.error('Error al actualizar el stock. Revisá tu conexión.');
      }
    } else {
      setStockModal({ open: false, product: null, input: '' });
    }
  };`;

content = content.replace(stockOld, stockNew);

fs.writeFileSync(file, content, 'utf8');
console.log('Done refactoring frontend BirromiPanel.jsx');
