/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // Tabela 1: Clientes
    .createTable('clients', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.string('address');
      table.string('phone');
    })
    // Tabela 2: Orçamentos
    .createTable('quotes', function(table) {
      table.increments('id').primary();
      table.string('quote_number');
      table.integer('client_id').unsigned().references('id').inTable('clients');
      table.date('date');
      table.date('delivery_date');
      table.date('valid_until');
      table.decimal('total', 14, 2);
      table.timestamps(true, true);
    })
    // Tabela 3: Itens do Orçamento
    .createTable('quote_items', function(table) {
      table.increments('id').primary();
      table.integer('quote_id').unsigned().notNullable().references('id').inTable('quotes').onDelete('CASCADE'); // Deleta os itens se o orçamento for deletado
      table.string('title').notNullable();
      table.string('image_filename');
      table.decimal('width', 10, 2);
      table.decimal('height', 10, 2);
      table.string('glass');
      table.string('aluminum_color');
      table.string('hardware_color');
      table.integer('quantity');
      table.decimal('total_price', 14, 2);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // Desfaz as tabelas na ordem inversa
  return knex.schema
    .dropTableIfExists('quote_items')
    .dropTableIfExists('quotes')
    .dropTableIfExists('clients');
};