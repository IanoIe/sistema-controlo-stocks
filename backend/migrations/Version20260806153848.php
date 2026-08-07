<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260806153848 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, name_category VARCHAR(225) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE product (id INT AUTO_INCREMENT NOT NULL, name_product VARCHAR(255) NOT NULL, code_product VARCHAR(255) NOT NULL, price NUMERIC(10, 2) NOT NULL, quantity INT NOT NULL, stock_min INT NOT NULL, category_id INT NOT NULL, INDEX IDX_D34A04AD12469DE2 (category_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE stock_entry (id INT AUTO_INCREMENT NOT NULL, quantity INT NOT NULL, date_stock_entry DATETIME NOT NULL, product_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_B73181814584665A (product_id), INDEX IDX_B7318181A76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE stock_exit (id INT AUTO_INCREMENT NOT NULL, quantity INT NOT NULL, date_stock_exit DATETIME NOT NULL, product_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_8D13DCCA4584665A (product_id), INDEX IDX_8D13DCCAA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, roles JSON NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE stock_entry ADD CONSTRAINT FK_B73181814584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE stock_entry ADD CONSTRAINT FK_B7318181A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE stock_exit ADD CONSTRAINT FK_8D13DCCA4584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE stock_exit ADD CONSTRAINT FK_8D13DCCAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD12469DE2');
        $this->addSql('ALTER TABLE stock_entry DROP FOREIGN KEY FK_B73181814584665A');
        $this->addSql('ALTER TABLE stock_entry DROP FOREIGN KEY FK_B7318181A76ED395');
        $this->addSql('ALTER TABLE stock_exit DROP FOREIGN KEY FK_8D13DCCA4584665A');
        $this->addSql('ALTER TABLE stock_exit DROP FOREIGN KEY FK_8D13DCCAA76ED395');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE stock_entry');
        $this->addSql('DROP TABLE stock_exit');
        $this->addSql('DROP TABLE user');
    }
}
