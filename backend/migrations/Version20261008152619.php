<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261008152619 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE audit_log (id INT AUTO_INCREMENT NOT NULL, action VARCHAR(50) NOT NULL, entity VARCHAR(100) NOT NULL, old_data JSON DEFAULT NULL, new_data JSON DEFAULT NULL, created_at DATETIME NOT NULL, user_id INT NOT NULL, INDEX IDX_F6E1C0F5A76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE product_supplier (id INT AUTO_INCREMENT NOT NULL, supplier_code VARCHAR(100) NOT NULL, cost_price NUMERIC(10, 2) NOT NULL, is_preferred TINYINT NOT NULL, product_id INT NOT NULL, supplier_id INT NOT NULL, INDEX IDX_509A06E94584665A (product_id), INDEX IDX_509A06E92ADD6D8C (supplier_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE stock_transfer (id INT AUTO_INCREMENT NOT NULL, transfer_date DATE NOT NULL, status VARCHAR(50) NOT NULL, notes LONGTEXT DEFAULT NULL, source_warehouse_id INT NOT NULL, destination_warehouse_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_FF2F782866A3066 (source_warehouse_id), INDEX IDX_FF2F782E1AE3711 (destination_warehouse_id), INDEX IDX_FF2F782A76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE stock_transfer_item (id INT AUTO_INCREMENT NOT NULL, quantity INT NOT NULL, product_id INT NOT NULL, stock_transfer_id INT NOT NULL, INDEX IDX_A37123984584665A (product_id), INDEX IDX_A37123988CBEEE9B (stock_transfer_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE supplier (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) DEFAULT NULL, phone VARCHAR(50) DEFAULT NULL, address VARCHAR(255) DEFAULT NULL, tax_number VARCHAR(50) DEFAULT NULL, active TINYINT NOT NULL, created_at DATE NOT NULL, updated_at DATE NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE warehouse (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, active TINYINT NOT NULL, created_at DATE NOT NULL, updated_at DATE NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE warehouse_stock (id INT AUTO_INCREMENT NOT NULL, quantity INT NOT NULL, product_id INT NOT NULL, warehouse_id INT NOT NULL, INDEX IDX_CA572AAD4584665A (product_id), INDEX IDX_CA572AAD5080ECDE (warehouse_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE audit_log ADD CONSTRAINT FK_F6E1C0F5A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE product_supplier ADD CONSTRAINT FK_509A06E94584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE product_supplier ADD CONSTRAINT FK_509A06E92ADD6D8C FOREIGN KEY (supplier_id) REFERENCES supplier (id)');
        $this->addSql('ALTER TABLE stock_transfer ADD CONSTRAINT FK_FF2F782866A3066 FOREIGN KEY (source_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE stock_transfer ADD CONSTRAINT FK_FF2F782E1AE3711 FOREIGN KEY (destination_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE stock_transfer ADD CONSTRAINT FK_FF2F782A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE stock_transfer_item ADD CONSTRAINT FK_A37123984584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE stock_transfer_item ADD CONSTRAINT FK_A37123988CBEEE9B FOREIGN KEY (stock_transfer_id) REFERENCES stock_transfer (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE warehouse_stock ADD CONSTRAINT FK_CA572AAD4584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE warehouse_stock ADD CONSTRAINT FK_CA572AAD5080ECDE FOREIGN KEY (warehouse_id) REFERENCES warehouse (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE audit_log DROP FOREIGN KEY FK_F6E1C0F5A76ED395');
        $this->addSql('ALTER TABLE product_supplier DROP FOREIGN KEY FK_509A06E94584665A');
        $this->addSql('ALTER TABLE product_supplier DROP FOREIGN KEY FK_509A06E92ADD6D8C');
        $this->addSql('ALTER TABLE stock_transfer DROP FOREIGN KEY FK_FF2F782866A3066');
        $this->addSql('ALTER TABLE stock_transfer DROP FOREIGN KEY FK_FF2F782E1AE3711');
        $this->addSql('ALTER TABLE stock_transfer DROP FOREIGN KEY FK_FF2F782A76ED395');
        $this->addSql('ALTER TABLE stock_transfer_item DROP FOREIGN KEY FK_A37123984584665A');
        $this->addSql('ALTER TABLE stock_transfer_item DROP FOREIGN KEY FK_A37123988CBEEE9B');
        $this->addSql('ALTER TABLE warehouse_stock DROP FOREIGN KEY FK_CA572AAD4584665A');
        $this->addSql('ALTER TABLE warehouse_stock DROP FOREIGN KEY FK_CA572AAD5080ECDE');
        $this->addSql('DROP TABLE audit_log');
        $this->addSql('DROP TABLE product_supplier');
        $this->addSql('DROP TABLE stock_transfer');
        $this->addSql('DROP TABLE stock_transfer_item');
        $this->addSql('DROP TABLE supplier');
        $this->addSql('DROP TABLE warehouse');
        $this->addSql('DROP TABLE warehouse_stock');
    }
}
